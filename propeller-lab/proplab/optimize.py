"""Multi-objective blade design search (NSGA-II).

Objectives (both minimised) at the hover thrust the aircraft actually needs:
    1. A-weighted sound level, energy-averaged over listeners below the rotor
    2. electrical power
Constraints: blades must not crowd each other, the prop must reach hover, must deliver the required peak thrust
at full throttle on the given motor, and must not exceed the motor's current
limit.  Geometry bounds keep blades in the range of mouldable hobby props;
there is no structural or aeroelastic model.
"""
from dataclasses import dataclass, field, asdict
from multiprocessing import Pool
import numpy as np
from .atmosphere import Air
from .geometry import parametric_blade, INCH
from .motor import Motor, MOTORS, hover_point, throttle_point
from .noise import noise_report, default_observers
from .tonal import ArmInteraction


@dataclass
class Mission:
    motor: Motor = MOTORS["2207-1950kv-6S"]
    hover_thrust: float = 1.6          # N per rotor (650 g quad)
    max_thrust: float = 12.0           # N per rotor required at full throttle
    diameter_in: tuple = (5.0, 5.0)    # allowed diameter range, inches
    blades: tuple = (2, 6)
    n_rotors: int = 4
    arm: ArmInteraction = field(default_factory=ArmInteraction)   # None = isolated rotor
    observer_distance: float = 1.5
    allow_uneven_spacing: bool = True
    max_local_solidity: float = 0.7    # B * chord / circumference, anywhere
    air: Air = field(default_factory=Air)


#        name          low    high
VARS = [("blades",       0.0,  1.0),
        ("diameter",     0.0,  1.0),
        ("chord_root",   0.13, 0.32),   # c/R at r/R = 0.15
        ("chord_045",    0.10, 0.40),
        ("chord_075",    0.07, 0.36),
        ("chord_tip",    0.04, 0.22),
        ("twist_tip",    1.0,  22.0),   # pitch angle at the tip, deg
        ("dtwist_075",   0.0,  10.0),   # added pitch going inboard (keeps twist
        ("dtwist_045",   0.0,  12.0),   #   monotonic, as on real blades)
        ("dtwist_root",  0.0,  12.0),
        ("sweep_tip",    0.0,  0.30),   # aft tip offset / R
        ("sweep_start",  0.35, 0.85),
        ("camber",       0.02, 0.06),
        ("spacing_skew", 0.0,  30.0)]   # deg, even blade counts only
LO = np.array([v[1] for v in VARS])
HI = np.array([v[2] for v in VARS])


def decode(x, mission):
    p = dict(zip([v[0] for v in VARS], LO + np.clip(x, 0, 1) * (HI - LO)))
    b0, b1 = mission.blades
    B = int(min(b0 + np.floor(p["blades"] * (b1 - b0 + 1)), b1))
    d0, d1 = mission.diameter_in
    skew = p["spacing_skew"] if (mission.allow_uneven_spacing and B % 2 == 0 and B > 2) else 0.0
    if skew < 2.0:
        skew = 0.0
    return dict(R=(d0 + p["diameter"] * (d1 - d0)) * INCH / 2, B=B,
                chord_ctrl=[p["chord_root"], p["chord_045"], p["chord_075"], p["chord_tip"]],
                twist_ctrl_deg=np.cumsum([p["twist_tip"], p["dtwist_075"], p["dtwist_045"],
                                          p["dtwist_root"]])[::-1].tolist(),
                sweep_tip=p["sweep_tip"], sweep_start=p["sweep_start"],
                camber=p["camber"], spacing_skew_deg=skew)


def evaluate_blade(blade, mission, detail=False):
    """Objectives, constraint violation and a metrics dict for one blade."""
    m = mission
    bad = lambda v: ((1e3, 1e4), v, {})
    hov = hover_point(m.motor, blade, m.hover_thrust, air=m.air)
    if hov is None:
        return bad(10.0)
    full = throttle_point(m.motor, blade, 1.0, air=m.air)
    obs = default_observers(m.observer_distance, (0, 20, 45, 70))
    rep = noise_report(blade, hov["sol"], obs, n_rotors=m.n_rotors, arm=m.arm,
                       n_chord=5 if detail else 3)
    # blades must not crowd each other: BEMT loses validity (and the hub
    # cannot be moulded) once neighbouring blades nearly overlap
    crowd = np.max(blade.B * blade.chord / (2 * np.pi * blade.r))
    viol = (max(0, crowd / m.max_local_solidity - 1)
            + max(0, 1 - full["thrust"] / m.max_thrust)
            + max(0, full["current"] / m.motor.I_max - 1)
            + max(0, hov["throttle"] - 0.75))
    metrics = dict(
        dBA=rep["dBA"], dBA_tonal=rep["dBA_tonal"], dBA_broadband=rep["dBA_broadband"],
        hover_power=hov["elec_power"], hover_rpm=hov["rpm"], hover_g_per_W=hov["g_per_W"],
        hover_tip_mach=hov["tip_mach"], bpf=rep["bpf"],
        max_thrust=full["thrust"], max_current=full["current"], max_rpm=full["rpm"],
        solidity=blade.solidity)
    if detail:
        metrics.update(report=rep, hover=hov, full=full)
    return (rep["dBA"], hov["elec_power"]), viol, metrics


_MISSION = None


def _init(mission):
    global _MISSION
    _MISSION = mission


def _eval(x):
    try:
        blade = parametric_blade(**decode(x, _MISSION))
        return evaluate_blade(blade, _MISSION)
    except Exception:                                   # noqa: BLE001 - reject the design
        return (1e3, 1e4), 100.0, {}


# ---------------------------------------------------------------- NSGA-II --
def _dominates(fa, va, fb, vb):
    if va != vb and (va > 0 or vb > 0):
        return va < vb
    return np.all(fa <= fb) and np.any(fa < fb)


def _sort(F, V):
    n = len(F)
    S, cnt, rank = [[] for _ in range(n)], np.zeros(n, int), np.zeros(n, int)
    for i in range(n):
        for j in range(i + 1, n):
            if _dominates(F[i], V[i], F[j], V[j]):
                S[i].append(j); cnt[j] += 1
            elif _dominates(F[j], V[j], F[i], V[i]):
                S[j].append(i); cnt[i] += 1
    fronts, cur = [], [i for i in range(n) if cnt[i] == 0]
    while cur:
        fronts.append(cur)
        nxt = []
        for i in cur:
            for j in S[i]:
                cnt[j] -= 1
                if cnt[j] == 0:
                    rank[j] = len(fronts); nxt.append(j)
        cur = nxt
    return fronts, rank


def _crowding(F, front):
    d = np.zeros(len(front))
    for k in range(F.shape[1]):
        o = np.argsort(F[front, k])
        f = F[front, k][o]
        d[o[0]] = d[o[-1]] = np.inf
        if f[-1] > f[0]:
            d[o[1:-1]] += (f[2:] - f[:-2]) / (f[-1] - f[0])
    return d


def _offspring(X, rank, crowd, rng, eta_c=15, eta_m=20):
    n, nv = X.shape
    def pick():
        a, b = rng.integers(n, size=2)
        return a if (rank[a], -crowd[a]) < (rank[b], -crowd[b]) else b
    kids = []
    while len(kids) < n:
        p1, p2 = X[pick()].copy(), X[pick()].copy()
        if rng.random() < 0.9:
            u = rng.random(nv)
            beta = np.where(u <= 0.5, (2 * u) ** (1 / (eta_c + 1)),
                            (1 / (2 * (1 - u))) ** (1 / (eta_c + 1)))
            swap = rng.random(nv) < 0.5
            c1 = 0.5 * ((1 + beta) * p1 + (1 - beta) * p2)
            c2 = 0.5 * ((1 - beta) * p1 + (1 + beta) * p2)
            p1, p2 = np.where(swap, c1, p1), np.where(swap, c2, p2)
        for c in (p1, p2):
            mut = rng.random(nv) < 1.5 / nv
            u = rng.random(nv)
            delta = np.where(u < 0.5, (2 * u) ** (1 / (eta_m + 1)) - 1,
                             1 - (2 * (1 - u)) ** (1 / (eta_m + 1)))
            kids.append(np.clip(c + mut * delta, 0, 1))
    return np.array(kids[:n])


def optimise(mission=None, pop=80, generations=50, seed=0, workers=4, seeds=(), log=print):
    """Run NSGA-II.  Returns the feasible Pareto set as a list of dicts sorted
    from quietest to most efficient, plus the per-generation history."""
    mission = mission or Mission()
    rng = np.random.default_rng(seed)
    X = rng.random((pop, len(VARS)))
    for i, s in enumerate(seeds):
        X[i] = s
    history = []
    with Pool(workers, initializer=_init, initargs=(mission,)) as pool:
        def run(X):
            out = pool.map(_eval, list(X), chunksize=2)
            return (np.array([o[0] for o in out]), np.array([o[1] for o in out]),
                    [o[2] for o in out])
        F, V, Mx = run(X)
        for g in range(generations + 1):
            fronts, rank = _sort(F, V)
            crowd = np.zeros(len(X))
            for fr in fronts:
                crowd[fr] = _crowding(F, fr)
            if len(X) > pop:                               # environmental selection
                keep = []
                for fr in fronts:
                    if len(keep) + len(fr) <= pop:
                        keep += fr
                    else:
                        o = np.argsort(-crowd[fr])
                        keep += [fr[i] for i in o[:pop - len(keep)]]
                        break
                X, F, V = X[keep], F[keep], V[keep]
                Mx = [Mx[i] for i in keep]
                rank, crowd = rank[keep], crowd[keep]
            feas = V == 0
            if feas.any():
                history.append(dict(gen=g, n_feasible=int(feas.sum()),
                                    min_dBA=float(F[feas, 0].min()),
                                    min_power=float(F[feas, 1].min())))
                log(f"gen {g:3d}  feasible {feas.sum():3d}  quietest {F[feas,0].min():5.1f} dBA"
                    f"  most efficient {F[feas,1].min():5.1f} W")
            else:
                log(f"gen {g:3d}  no feasible design yet (best violation {V.min():.3f})")
            if g == generations:
                break
            K = _offspring(X, rank, crowd, rng)
            Fk, Vk, Mk = run(K)
            X, F = np.vstack([X, K]), np.vstack([F, Fk])
            V, Mx = np.concatenate([V, Vk]), Mx + Mk
    fronts, _ = _sort(F, V)
    best = [i for i in fronts[0] if V[i] == 0]
    best.sort(key=lambda i: F[i, 0])
    pareto = [dict(x=X[i].tolist(), design=decode(X[i], mission), **Mx[i]) for i in best]
    return pareto, history

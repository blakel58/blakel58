"""Toroidal (closed-loop) blades: geometry, operating points on the
vortex-lattice solver, and the design search.

A loop blade is two arms joined at the tip.  The leading arm leaves the hub
ahead in azimuth and (for positive gap) higher; the quarter-chord line runs
out to the tip radius, turns back and returns to the hub on the trailing arm.
"""
import numpy as np
from scipy.interpolate import PchipInterpolator
from .vlm import Ribbon, VlmRotor, ribbon_from_blade
from .noise import noise_report, default_observers
from .geometry import INCH, parametric_blade
from .optimize import Mission, nsga2, _init
from . import optimize as _opt

U_CTRL = np.pi * np.array([0.0, 0.22, 0.42, 0.58, 0.78, 1.0])


def loop_blade(R, B, dpsi_deg, gap, square, chord_ctrl, pitch_ctrl_deg, camber=0.04,
               tc_root=0.12, tc_tip=0.08, n=28, name="loop"):
    """dpsi_deg   azimuth between the two roots of one loop
    gap        axial offset between the roots, m (+ = leading arm higher)
    square     1 = pointed loop, smaller = squarer loop that stays near the tip radius longer
    chord_ctrl      c/R at leading root, leading mid, tip, trailing mid, trailing root
    pitch_ctrl_deg  pitch at leading root, mid, tip, then trailing tip, mid, root
    """
    r_hub = max(0.15 * R, 0.006)
    u = np.linspace(0, np.pi, 801)
    r = r_hub + (R - r_hub) * np.sin(u) ** square
    psi = 0.5 * np.radians(dpsi_deg) * np.cos(u)
    X = np.stack([r * np.cos(psi), r * np.sin(psi), 0.5 * gap * np.cos(u)], 1)
    s = np.concatenate([[0], np.cumsum(np.linalg.norm(np.diff(X, axis=0), axis=1))])
    un = np.interp(np.linspace(0, s[-1], n + 1), s, u)             # equal arc length
    P = np.stack([np.interp(un, u, X[:, k]) for k in range(3)], 1)
    um = 0.5 * (un[1:] + un[:-1])
    w = np.tanh(4 * np.cos(um)) / np.tanh(4)       # panel frame flips across the tip
    chord = R * PchipInterpolator(np.pi * np.array([0, 0.25, 0.5, 0.75, 1.0]), chord_ctrl)(um)
    pitch = np.radians(PchipInterpolator(U_CTRL, pitch_ctrl_deg)(um)) * w
    rm = np.hypot(*(0.5 * (P[1:] + P[:-1]))[:, :2].T)
    tc = np.interp(rm / R, [0.15, 1], [tc_root, tc_tip])
    return Ribbon(R, r_hub, B, P, chord, pitch, camber * w, tc, name=name, closed_tip=True)


# ------------------------------------------------------- operating points --
def _pack(motor, rotor, s, V):
    I = s.torque / motor.kt + motor.I0
    p_el = V * I
    return dict(rpm=s.rpm, thrust=s.thrust, torque=s.torque, shaft_power=s.power, current=I,
                volts=V, throttle=V / motor.V_batt, elec_power=p_el,
                g_per_W=s.thrust / 9.80665 * 1000 / p_el if p_el > 0 else 0.0,
                tip_mach=s.omega * rotor.rb.R / s.air.c, sol=s)


def _update_wake(rotor, s):
    vi = np.sqrt(max(s.thrust, 1e-6) / (2 * rotor.air.rho * np.pi * rotor.rb.R ** 2))
    new = float(np.clip(vi / (s.omega * rotor.rb.R), 0.01, 0.25))
    moved = abs(new - rotor.lam)
    rotor.lam = 0.5 * (rotor.lam + new) if moved > 0.004 else rotor.lam
    return moved > 0.004


def vlm_hover_point(motor, rotor, thrust, rpm0=10000.0):
    """RPM holding `thrust` (wake iterated to match); None if out of reach."""
    rpm, lim = rpm0, 0.8 * rotor.air.c / rotor.rb.R * 30 / np.pi
    for _ in range(6):
        for _ in range(8):
            s = rotor.solve(rpm)
            if s.thrust <= 0 or s.torque <= 0:
                return None
            if abs(s.thrust / thrust - 1) < 0.003:
                break
            rpm = min(rpm * np.sqrt(thrust / s.thrust), 1.5 * lim)
        if rpm > lim:
            return None
        if not _update_wake(rotor, s):
            break
    I = s.torque / motor.kt + motor.I0
    return _pack(motor, rotor, s, I * (motor.R + motor.R_sys) + rpm / motor.kv)


def vlm_throttle_point(motor, rotor, throttle=1.0, rpm0=25000.0):
    """Equilibrium of motor torque and rotor torque at a throttle setting."""
    V, Rt, rpm = throttle * motor.V_batt, motor.R + motor.R_sys, rpm0
    for _ in range(6):
        for _ in range(8):
            s = rotor.solve(rpm)
            if s.torque <= 0:
                return None
            kq = s.torque / rpm ** 2            # torque ~ rpm^2: solve the quadratic
            a, b, c = kq, motor.kt / (Rt * motor.kv), -motor.kt * (V / Rt - motor.I0)
            new = (-b + np.sqrt(b * b - 4 * a * c)) / (2 * a)
            done = abs(new / rpm - 1) < 0.002
            rpm = new
            if done:
                break
        if not _update_wake(rotor, s):
            break
    return _pack(motor, rotor, rotor.solve(rpm), V)


def evaluate_ribbon(rb, mission, detail=False, max_local_solidity=None):
    """Same objectives and constraints as optimize.evaluate_blade, on the
    vortex-lattice solver, for a loop or a conventional ribbon."""
    m = mission
    rotor = VlmRotor(rb, m.air, revs=6)
    hov = vlm_hover_point(m.motor, rotor, m.hover_thrust)
    if hov is None:
        return (1e3, 1e4), 10.0, {}
    lam_h = rotor.lam
    full = vlm_throttle_point(m.motor, rotor)
    if full is None:
        return (1e3, 1e4), 10.0, {}
    rotor.lam = lam_h
    obs = default_observers(m.observer_distance, (0, 20, 45, 70))
    rep = noise_report(rb, hov["sol"], obs, n_rotors=m.n_rotors, arm=m.arm,
                       n_chord=5 if detail else 3)
    g = rb.frames()
    roots = 2 if rb.closed_tip else 1
    crowd = max(np.max(rb.B * rb.chord / (2 * np.pi * g["r"])),
                roots * rb.B * max(rb.chord[0], rb.chord[-1]) / (2 * np.pi * rb.r_hub) if roots == 2 else 0)
    viol = (max(0, crowd / (max_local_solidity or m.max_local_solidity) - 1)
            + max(0, 1 - full["thrust"] / m.max_thrust)
            + max(0, full["current"] / m.motor.I_max - 1)
            + max(0, hov["throttle"] - 0.75)
            + (0.0 if hov["sol"].converged else 0.5))
    metrics = dict(
        dBA=rep["dBA"], dBA_tonal=rep["dBA_tonal"], dBA_broadband=rep["dBA_broadband"],
        hover_power=hov["elec_power"], hover_rpm=hov["rpm"], hover_g_per_W=hov["g_per_W"],
        hover_tip_mach=hov["tip_mach"], bpf=rep["bpf"], max_thrust=full["thrust"],
        max_current=full["current"], max_rpm=full["rpm"], solidity=rb.solidity)
    if detail:
        metrics.update(report=rep, hover=hov, full=full)
    return (rep["dBA"], hov["elec_power"]), viol, metrics


# ----------------------------------------------------------- design search --
LOOP_VARS = [("blades", 0.0, 1.0), ("diameter", 0.0, 1.0),
             ("dpsi_frac", 0.15, 0.65),     # root separation / blade spacing
             ("gap", 0.05, 0.28),           # |axial offset| / R
             ("gap_sign", 0.0, 1.0),        # < 0.5: leading arm lower
             ("square", 0.45, 1.0),
             ("chord_root1", 0.09, 0.24), ("chord_mid1", 0.08, 0.36), ("chord_tip", 0.05, 0.25),
             ("chord_mid2", 0.08, 0.36), ("chord_root2", 0.09, 0.24),
             ("pitch_tip1", 0.0, 20.0), ("dpitch_mid1", 0.0, 12.0), ("dpitch_root1", 0.0, 12.0),
             ("pitch_tip2", 0.0, 20.0), ("dpitch_mid2", 0.0, 12.0), ("dpitch_root2", 0.0, 12.0),
             ("camber", 0.02, 0.06)]
_LO = np.array([v[1] for v in LOOP_VARS])
_HI = np.array([v[2] for v in LOOP_VARS])


def decode_loop(x, mission, blades=(2, 4)):
    p = dict(zip([v[0] for v in LOOP_VARS], _LO + np.clip(x, 0, 1) * (_HI - _LO)))
    b0, b1 = blades
    B = int(min(b0 + np.floor(p["blades"] * (b1 - b0 + 1)), b1))
    d0, d1 = mission.diameter_in
    R = (d0 + p["diameter"] * (d1 - d0)) * INCH / 2
    t1, t2 = p["pitch_tip1"], p["pitch_tip2"]
    m1, m2 = t1 + p["dpitch_mid1"], t2 + p["dpitch_mid2"]
    return dict(R=R, B=B, dpsi_deg=p["dpsi_frac"] * 360 / B,
                gap=(1 if p["gap_sign"] >= 0.5 else -1) * p["gap"] * R, square=p["square"],
                chord_ctrl=[p["chord_root1"], p["chord_mid1"], p["chord_tip"], p["chord_mid2"],
                            p["chord_root2"]],
                pitch_ctrl_deg=[m1 + p["dpitch_root1"], m1, t1, t2, m2, m2 + p["dpitch_root2"]],
                camber=p["camber"])


def _eval_loop(x):
    try:
        return evaluate_ribbon(loop_blade(**decode_loop(x, _opt._MISSION)), _opt._MISSION)
    except Exception:                                   # noqa: BLE001 - reject the design
        return (1e3, 1e4), 100.0, {}


def optimise_loops(mission=None, pop=64, generations=40, seed=0, workers=4, log=print):
    mission = mission or Mission()
    best, history = nsga2(_eval_loop, len(LOOP_VARS), mission, pop, generations, seed, workers, log=log)
    return [dict(x=x.tolist(), design=decode_loop(x, mission), **m) for x, m in best], history

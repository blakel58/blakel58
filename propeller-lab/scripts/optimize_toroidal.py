#!/usr/bin/env python3
"""Search toroidal (loop) blades and compare with conventional blades on the
same vortex-lattice solver.

    python scripts/optimize_toroidal.py --conventional results/5in_6S --out results/5in_6S_toroidal

--conventional points at a finished optimize_quiet.py run; its Pareto designs
are re-evaluated with the vortex-lattice solver so both families are judged
by identical physics.
"""
import argparse, json, sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import numpy as np
from multiprocessing import Pool
from proplab import MOTORS, standard_prop, plots
from proplab.geometry import parametric_blade
from proplab.optimize import Mission
from proplab.tonal import ArmInteraction
from proplab.vlm import ribbon_from_blade
from proplab.loop import optimise_loops, loop_blade, evaluate_ribbon
from proplab.render import gallery

ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument("--conventional", default="results/5in_6S")
ap.add_argument("--pop", type=int, default=64)
ap.add_argument("--gens", type=int, default=40)
ap.add_argument("--seed", type=int, default=0)
ap.add_argument("--workers", type=int, default=os.cpu_count())
ap.add_argument("--out", default="results/5in_6S_toroidal")
a = ap.parse_args()

conv = json.load(open(a.conventional + "_pareto.json"))
c, g = conv["args"], 9.80665e-3
mission = Mission(motor=MOTORS[c["motor"]], hover_thrust=c["hover_g"] * g, max_thrust=c["max_g"] * g,
                  diameter_in=tuple(c["diameter"]),
                  arm=None if c["isolated"] else ArmInteraction(depth=c["arm_depth"]))


def _conv(design):
    return evaluate_ribbon(ribbon_from_blade(parametric_blade(**design)), mission)


def pick3(P):
    F = np.array([[p["dBA"], p["hover_power"]] for p in P])
    n = (F - F.min(0)) / np.maximum(np.ptp(F, 0), 1e-9)
    return [P[0], P[int(np.argmin(np.hypot(*n.T)))], P[-1]]


if __name__ == "__main__":
    loops, history = optimise_loops(mission, a.pop, a.gens, a.seed, a.workers)
    if not loops:
        sys.exit("No feasible toroidal design found.")
    with Pool(a.workers) as pool:
        res = pool.map(_conv, [p["design"] for p in conv["pareto"]])
    cpts = [dict(design=p["design"], feasible=v == 0, **m)
            for p, (f, v, m) in zip(conv["pareto"], res) if m]
    cpts.sort(key=lambda p: p["dBA"])
    dia = f"{c['diameter'][1]:g}"
    gen = standard_prop(f"{dia}x4", 3)
    _, _, gm = evaluate_ribbon(ribbon_from_blade(gen), mission, detail=True)

    entries, labels = [], ["quietest", "balanced", "most efficient"]
    cap = lambda rb, m: [f"{rb.B} {'loops' if rb.closed_tip else 'blades'}, {m['dBA']:.1f} dBA in hover",
                         f"{m['hover_power']:.1f} W per motor, {m['hover_rpm']:.0f} rpm",
                         f"peak {m['max_thrust']/g:.0f} g at {m['max_current']:.0f} A"]
    print("\nToroidal picks (vortex-lattice solver; noise for all rotors at 1.5 m):")
    sheet = []
    for lb, p in zip(labels, pick3(loops)):
        rb = loop_blade(**p["design"])
        _, _, m = evaluate_ribbon(rb, mission, detail=True)
        d = p["design"]
        print(f"  {lb:>14}: {d['B']} loops  {m['dBA']:5.1f} dBA (tonal {m['dBA_tonal']:.1f}, broadband "
              f"{m['dBA_broadband']:.1f})  {m['hover_power']:5.1f} W  {m['hover_rpm']:6.0f} rpm  "
              f"max {m['max_thrust']/g:5.0f} g @ {m['max_current']:4.1f} A")
        print(f"{'':>16}  root spread {d['dpsi_deg']:.0f} deg  gap {d['gap']*1e3:+.1f} mm  squareness {d['square']:.2f}"
              f"  chord/R {np.round(d['chord_ctrl'], 2).tolist()}  pitch {np.round(d['pitch_ctrl_deg'], 1).tolist()}")
        entries.append((f"toroidal, {lb}", loop_blade(**d, n=120), cap(rb, m)))
        sheet.append((f"toroidal, {lb}", m))
    feas = [p for p in cpts if p["feasible"]] or cpts
    print("Conventional optimised blades, same solver:")
    for lb, p in zip(labels, pick3(feas)):
        print(f"  {lb:>14}: {p['design']['B']} blades  {p['dBA']:5.1f} dBA  {p['hover_power']:5.1f} W  "
              f"max {p['max_thrust']/g:5.0f} g @ {p['max_current']:4.1f} A")
    best = pick3(feas)[1]
    brb = ribbon_from_blade(parametric_blade(**best["design"]))
    entries.append(("conventional, balanced", parametric_blade(**best["design"]), cap(brb, best)))
    print(f"  generic {gen.name}: {gm['dBA']:.1f} dBA  {gm['hover_power']:.1f} W")

    ttl = f"{mission.motor.name}, {dia} in, hover {c['hover_g']:.0f} g, peak ≥ {c['max_g']:.0f} g per motor"
    os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True)
    num = lambda m: {k: v for k, v in m.items() if isinstance(v, (int, float, list, dict, str, bool))
                     and k not in ("report", "hover", "full")}
    with open(a.out + ".json", "w") as fh:
        json.dump(dict(args=vars(a), history=history, toroidal=[num(p) for p in loops],
                       conventional=[num(p) for p in cpts]), fh, indent=1, default=float)
    plots.family_plot(a.out + "_pareto.png",
                      [("toroidal (loop) blades, optimised", loops),
                       ("conventional blades, optimised", feas)],
                      [(f"generic {gen.name}", gm)],
                      "Toroidal vs conventional, same solver and same thrust requirement\n" + ttl)
    gallery(a.out + "_render.png", entries, ttl)
    print(f"\nwrote {a.out}.json, {a.out}_pareto.png, {a.out}_render.png")

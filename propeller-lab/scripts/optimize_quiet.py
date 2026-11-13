#!/usr/bin/env python3
"""Search for the quietest blade that still does the job.

    python scripts/optimize_quiet.py --pop 64 --gens 40 --out results/5in

Writes <out>_pareto.json, <out>_pareto.png and <out>_designs.png.
"""
import argparse, json, sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import numpy as np
from proplab import MOTORS, standard_prop
from proplab.geometry import parametric_blade
from proplab.optimize import Mission, optimise, evaluate_blade
from proplab.tonal import ArmInteraction
from proplab import plots

ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument("--motor", default="2207-1950kv-6S", choices=MOTORS)
ap.add_argument("--hover-g", type=float, default=163, help="hover thrust per motor, grams")
ap.add_argument("--max-g", type=float, default=1220, help="required full-throttle thrust per motor, grams")
ap.add_argument("--diameter", type=float, nargs=2, default=[5.0, 5.0], metavar=("MIN", "MAX"))
ap.add_argument("--blades", type=int, nargs=2, default=[2, 6], metavar=("MIN", "MAX"))
ap.add_argument("--isolated", action="store_true", help="ignore frame-arm interaction")
ap.add_argument("--arm-depth", type=float, default=0.05)
ap.add_argument("--pop", type=int, default=64)
ap.add_argument("--gens", type=int, default=40)
ap.add_argument("--seed", type=int, default=0)
ap.add_argument("--workers", type=int, default=os.cpu_count())
ap.add_argument("--out", default="results/run")
a = ap.parse_args()

g = 9.80665e-3
mission = Mission(motor=MOTORS[a.motor], hover_thrust=a.hover_g * g, max_thrust=a.max_g * g,
                  diameter_in=tuple(a.diameter), blades=tuple(a.blades),
                  arm=None if a.isolated else ArmInteraction(depth=a.arm_depth))
pareto, history = optimise(mission, a.pop, a.gens, a.seed, a.workers)
if not pareto:
    sys.exit("No feasible design found: relax --max-g or allow a larger --diameter.")

# pick three representatives: quietest, most efficient, and the knee between them
F = np.array([[p["dBA"], p["hover_power"]] for p in pareto])
n = (F - F.min(0)) / np.maximum(np.ptp(F, 0), 1e-9)
picks = [("quietest", pareto[0]), ("balanced", pareto[int(np.argmin(np.hypot(*n.T)))]),
         ("most efficient", pareto[-1])]

d = f"{a.diameter[1]:g}"
base = []
for nm, B in [(f"{d}x4", 2), (f"{d}x4", 3), (f"{d}x4.3", 3), (f"{d}x3", 4), (f"{d}x4", 4)]:
    bl = standard_prop(nm, B)
    f, v, m = evaluate_blade(bl, mission, detail=True)
    if m:
        base.append((bl.name, bl, m, v == 0))

sheet = []
print("\nRepresentative designs (noise for all rotors at 1.5 m, power per motor):")
for label, p in picks:
    bl = parametric_blade(**p["design"], name=label)
    _, _, m = evaluate_blade(bl, mission, detail=True)
    sheet.append((label, bl, m))
    dz = p["design"]
    print(f"  {label:>14}: {dz['B']} blades  {m['dBA']:5.1f} dBA (tonal {m['dBA_tonal']:.1f}, broadband "
          f"{m['dBA_broadband']:.1f})  {m['hover_power']:5.1f} W  {m['hover_rpm']:6.0f} rpm  "
          f"max {m['max_thrust']/g:5.0f} g @ {m['max_current']:4.1f} A")
    print(f"{'':>16}  chord/R {np.round(dz['chord_ctrl'], 3).tolist()}  pitch deg {np.round(dz['twist_ctrl_deg'], 1).tolist()}"
          f"  tip sweep {dz['sweep_tip']:.2f}R  camber {dz['camber']:.3f}  skew {dz['spacing_skew_deg']:.0f} deg")
print("Generic baselines:")
for nm, bl, m, ok in base:
    print(f"  {nm:>14}: {m['dBA']:5.1f} dBA  {m['hover_power']:5.1f} W  max {m['max_thrust']/g:5.0f} g @ "
          f"{m['max_current']:4.1f} A  {'ok' if ok else 'fails peak thrust or current limit'}")

os.makedirs(os.path.dirname(a.out) or ".", exist_ok=True)
with open(a.out + "_pareto.json", "w") as fh:
    json.dump(dict(args=vars(a), history=history, pareto=pareto,
                   baselines=[dict(name=nm, feasible=ok, **{k: v for k, v in m.items()
                                                           if isinstance(v, (int, float))})
                              for nm, _, m, ok in base]), fh, indent=1, default=float)
ttl = f"{mission.motor.name}, {a.diameter[1]:g} in, hover {a.hover_g:.0f} g, peak ≥ {a.max_g:.0f} g per motor"
plots.pareto_plot(a.out + "_pareto.png", pareto, [(nm, m, ok) for nm, _, m, ok in base], picks,
                  "Quiet vs efficient: every point is a blade that meets the thrust requirement\n" + ttl)
ref = next((b for b in base if b[0].endswith("x4x3")), base[0])
plots.design_sheet(a.out + "_designs.png", sheet + [(f"generic {ref[0]}", ref[1], ref[2])], ttl)
print(f"\nwrote {a.out}_pareto.json, {a.out}_pareto.png, {a.out}_designs.png")

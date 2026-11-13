#!/usr/bin/env python3
"""Re-draw the figures for a finished optimisation without re-running it.

    python scripts/render_results.py results/5in_6S
"""
import json, sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
import numpy as np
from proplab import MOTORS, standard_prop, plots
from proplab.geometry import parametric_blade
from proplab.optimize import Mission, evaluate_blade
from proplab.tonal import ArmInteraction
from proplab.render import gallery

out = sys.argv[1]
d = json.load(open(out + "_pareto.json"))
a, pareto, g = d["args"], d["pareto"], 9.80665e-3
mission = Mission(motor=MOTORS[a["motor"]], hover_thrust=a["hover_g"] * g, max_thrust=a["max_g"] * g,
                  diameter_in=tuple(a["diameter"]), blades=tuple(a["blades"]),
                  arm=None if a["isolated"] else ArmInteraction(depth=a["arm_depth"]))
F = np.array([[p["dBA"], p["hover_power"]] for p in pareto])
n = (F - F.min(0)) / np.maximum(np.ptp(F, 0), 1e-9)
picks = [("quietest", pareto[0]), ("balanced", pareto[int(np.argmin(np.hypot(*n.T)))]),
         ("most efficient", pareto[-1])]
sheet = []
for label, p in picks:
    bl = parametric_blade(**p["design"], name=label)
    sheet.append((label, bl, evaluate_blade(bl, mission, detail=True)[2]))
dia = f"{a['diameter'][1]:g}"
base = []
for nm, B in [(f"{dia}x4", 2), (f"{dia}x4", 3), (f"{dia}x4.3", 3), (f"{dia}x3", 4), (f"{dia}x4", 4)]:
    bl = standard_prop(nm, B)
    _, v, m = evaluate_blade(bl, mission, detail=True)
    base.append((bl.name, bl, m, v == 0))
ref = next(b for b in base if b[0].endswith("x4x3"))
ttl = f"{mission.motor.name}, {dia} in, hover {a['hover_g']:.0f} g, peak ≥ {a['max_g']:.0f} g per motor"
cap = lambda bl, m: [f"{bl.B} blades, {m['dBA']:.1f} dBA in hover",
                     f"{m['hover_power']:.1f} W per motor, {m['hover_rpm']:.0f} rpm",
                     f"peak {m['max_thrust']/g:.0f} g at {m['max_current']:.0f} A"]
plots.pareto_plot(out + "_pareto.png", pareto, [(nm, m, ok) for nm, _, m, ok in base], picks,
                  "Quiet vs efficient: every point is a blade that meets the thrust requirement\n" + ttl)
plots.design_sheet(out + "_designs.png", sheet + [(f"generic {ref[0]}", ref[1], ref[2])], ttl)
gallery(out + "_render.png", [(lb, bl, cap(bl, m)) for lb, bl, m in sheet]
        + [(f"generic {ref[0]}", ref[1], cap(ref[1], ref[2]))], ttl)
print("wrote", out + "_render.png")

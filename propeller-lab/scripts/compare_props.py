#!/usr/bin/env python3
"""Which off-the-shelf prop suits a motor?  Compares generic props on one motor.

    python scripts/compare_props.py --motor 2207-1950kv-6S --hover-g 163 \
        5040x2 5040x3 5043x3 5146x3 5040x4 4530x3
(name is DDPP or DxP, 'xN' sets the blade count; diameter and pitch in inches)
"""
import argparse, sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from proplab import MOTORS, standard_prop, hover_point, throttle_point, noise_report
from proplab.tonal import ArmInteraction

ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
ap.add_argument("props", nargs="*", default=["5040x2", "5040x3", "5043x3", "5146x3", "5040x4", "4530x3"])
ap.add_argument("--motor", default="2207-1950kv-6S", choices=MOTORS)
ap.add_argument("--hover-g", type=float, default=163, help="hover thrust per motor, grams")
ap.add_argument("--rotors", type=int, default=4)
ap.add_argument("--isolated", action="store_true", help="no frame-arm interaction tones")
a = ap.parse_args()

motor = MOTORS[a.motor]
arm = None if a.isolated else ArmInteraction()
print(f"{motor.name}; hover {a.hover_g:.0f} g per motor; noise for {a.rotors} rotors at 1.5 m\n")
print(f"{'prop':>10} | {'hover rpm':>9} {'W':>6} {'g/W':>5} {'dBA':>5} {'tonal':>5} {'broad':>5} |"
      f" {'max g':>6} {'A':>5} {'rpm':>6} {'tip M':>5}")
for name in a.props:
    base, _, b = name.partition("x") if name[:4].isdigit() and len(name.split("x")[0]) == 4 else (name, "", "")
    blade = standard_prop(base, int(b) if b else None)
    h = hover_point(motor, blade, a.hover_g * 9.80665e-3)
    f = throttle_point(motor, blade, 1.0)
    if h is None:
        print(f"{blade.name:>10} | cannot reach hover thrust"); continue
    n = noise_report(blade, h["sol"], n_rotors=a.rotors, arm=arm)
    flag = "  over current limit" if f["current"] > motor.I_max else ""
    print(f"{blade.name:>10} | {h['rpm']:9.0f} {h['elec_power']:6.1f} {h['g_per_W']:5.2f} {n['dBA']:5.1f} "
          f"{n['dBA_tonal']:5.1f} {n['dBA_broadband']:5.1f} | {f['thrust']/9.80665e-3:6.0f} "
          f"{f['current']:5.1f} {f['rpm']:6.0f} {f['tip_mach']:5.2f}{flag}")

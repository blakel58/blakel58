# propeller-lab

Physics simulation of small drone propellers: thrust, power, motor matching and
noise, plus an optimiser that searches blade shapes for the quietest design that
still meets a thrust requirement.

```bash
pip install -r requirements.txt
python -m pytest tests                      # physics checks
python scripts/compare_props.py             # which stock prop suits a motor
python scripts/optimize_quiet.py --pop 80 --gens 60 --out results/5in_6S
python scripts/render_results.py results/5in_6S          # redraw figures only
python scripts/optimize_toroidal.py --conventional results/5in_6S --out results/5in_6S_toroidal
```

## Prop naming

A "5040" prop is **5.0 inch diameter x 4.0 inch pitch**. Pitch is how far the
prop would advance in one turn if it screwed through the air without slipping.
It is a distance, not an angle; the blade angle it implies varies along the
blade (`atan(pitch / (2 pi r))`, steep at the root, shallow at the tip).
`51433` means 5.1 in x 4.3 in, 3 blades.

## What is modelled

| Part | Method | File |
|---|---|---|
| Blade aerodynamics | Blade-element momentum theory, 30 strips, Prandtl tip/hub loss, hover and axial flight | `proplab/bemt.py` |
| Section forces | Parametric low-Reynolds polar (Re 2e4 to 2e5): camber, Re-dependent stall and drag, Viterna post-stall, compressibility, rotational stall delay. Tabulated polars can be plugged in | `proplab/airfoil.py` |
| Motor | Kv / resistance / no-load current, with battery and ESC sag; solves the RPM where motor torque meets prop torque | `proplab/motor.py` |
| Tonal noise | Farassat Formulation 1A (loading) and compact-volume thickness noise from chordwise-distributed moving sources, exact in near and far field; sweep, wide chords and uneven blade spacing act through true phase | `proplab/tonal.py` |
| Installed tones | Optional lift dip each time a blade crosses a frame arm, which is what produces the long train of blade-pass harmonics on a real quad | `proplab/tonal.py` |
| Broadband noise | Brooks-Pope-Marcolini airfoil self-noise per strip: turbulent trailing edge, separation, laminar vortex shedding, tip vortex; 1/3-octave bands | `proplab/broadband.py` |
| Ratings | A-weighted level averaged over listeners at and below the rotor plane | `proplab/noise.py` |
| Loop / toroidal blades | Vortex-lattice solver for a blade following any 3D path, with a prescribed contracting helical wake and the same section polar; a loop is two arms joined at the tip, so circulation is carried round the tip instead of being shed as a tip vortex | `proplab/vlm.py`, `proplab/loop.py` |
| Design search | NSGA-II over blade count, chord and pitch distributions, tip sweep, camber and blade spacing; objectives are hover dBA and hover power, constrained by peak thrust and motor current | `proplab/optimize.py` |

## How far to trust it

Checked: the tonal solver reproduces Gutin's closed-form result for a rotating
point force to within 2% (thrust and torque terms separately); hover never beats
ideal momentum power; thrust scales with RPM squared; trailing-edge noise scales
near the fifth power of speed. Static thrust and power coefficients land in the
range commonly published for 5 inch and 9-10 inch hobby props.

Not checked: nothing here has been compared against measured data for a specific
real propeller, because the measurement databases were not reachable when this
was written. Treat absolute numbers as roughly +/-15% on thrust and power and
+/-5 dB on noise. Differences between designs are more reliable than absolute
levels.

Known gaps, in order of importance:

1. **Airfoil polars.** The section model is a generic surrogate. Real moulded
   sections at Re ~5e4 vary a lot; this is the main limit on accuracy.
2. **Broadband model range.** BPM is fitted to NACA 0012 data. Its transition
   to separation noise happens at a fixed angle, and much of the optimiser's
   gain comes from keeping sections below it. The direction (lightly loaded
   blades are quieter) is well established; the size of the gain is uncertain.
3. **Arm interaction depth** is an assumed input (5% lift dip), not predicted.
   Rotor-rotor interaction, motor and ESC noise, and turbulence ingestion are
   not modelled.
4. **No structural or aeroelastic model.** Geometry bounds keep blades within
   the range of commercial props, but thin swept tips flex and flutter in ways
   that are not captured.
5. **Toroidal (loop) props** use the vortex-lattice solver, which is
   mid-fidelity: the wake shape is prescribed, not computed, so wake roll-up
   and blade-vortex interaction are not resolved. Where the loop turns at the
   tip the band runs almost along the flow and strip aerodynamics are crude.
   Broadband noise for loops uses the same BPM strip model with no tip-vortex
   term. On conventional props the two solvers agree on thrust within a few
   percent; the vortex-lattice power is about 10% lower. Only compare loops
   with conventional blades evaluated on the same solver
   (`optimize_toroidal.py` does this).
6. Forward flight is axial only (climb), not edgewise.

The sensible next step is to print or mould one or two of the optimiser's picks
and measure them on a thrust stand with a calibrated microphone, then tune the
polar and broadband constants against that.

## Use as a library

```python
from proplab import standard_prop, MOTORS, hover_point, throttle_point, noise_report
from proplab.tonal import ArmInteraction

blade = standard_prop("5143", blades=3)
motor = MOTORS["2207-1950kv-6S"]            # or Motor("mine", kv, R, I0, I_max, V_batt)
hover = hover_point(motor, blade, thrust=1.6)        # N per rotor
full = throttle_point(motor, blade, throttle=1.0)
noise = noise_report(blade, hover["sol"], n_rotors=4, arm=ArmInteraction())
print(hover["elec_power"], full["thrust"], noise["dBA"])
```

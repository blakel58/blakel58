"""Blade geometry: radial strips with chord, twist, sweep, thickness, camber."""
from dataclasses import dataclass, field
import re
import numpy as np
from scipy.interpolate import PchipInterpolator

INCH = 0.0254


@dataclass
class Blade:
    R: float                      # tip radius, m
    r_hub: float                  # root cut-out radius, m
    B: int                        # number of blades
    r: np.ndarray                 # strip mid radii, m
    dr: np.ndarray                # strip widths, m
    chord: np.ndarray             # m
    twist: np.ndarray             # geometric pitch angle, rad
    sweep: np.ndarray             # mid-chord offset aft of the pitch axis, m
    tc: np.ndarray                # thickness / chord
    camber: np.ndarray            # max camber / chord
    azimuths: np.ndarray = None   # blade angular positions, rad
    name: str = ""
    airfoil: object = field(default=None, repr=False)

    def __post_init__(self):
        if self.azimuths is None:
            self.azimuths = 2 * np.pi * np.arange(self.B) / self.B

    @property
    def diameter(self):
        return 2 * self.R

    @property
    def solidity(self):
        return self.B * np.sum(self.chord * self.dr) / (np.pi * self.R ** 2)


def stations(R, r_hub, n=30):
    edges = np.linspace(r_hub, R, n + 1)
    return 0.5 * (edges[1:] + edges[:-1]), np.diff(edges)


def parse_prop_name(name):
    """'5040' -> (5.0, 4.0, None); '51433' -> (5.1, 4.3, 3); '5x4.3x3' -> (5, 4.3, 3).

    Hobby notation is diameter x pitch in INCHES.  Pitch is the distance the
    prop would advance in one turn if it screwed through the air without slip;
    it is not an angle.
    """
    s = name.lower().strip()
    if "x" in s:
        p = s.split("x")
        return float(p[0]), float(p[1]), (int(p[2]) if len(p) > 2 else None)
    if re.fullmatch(r"\d{4}", s):
        return int(s[:2]) / 10, int(s[2:]) / 10, None
    if re.fullmatch(r"\d{5}", s):
        return int(s[:2]) / 10, int(s[2:4]) / 10, int(s[4])
    raise ValueError(f"cannot parse prop name {name!r}")


def standard_prop(name, blades=None, n=30, max_twist_deg=32.0, chord_scale=1.0):
    """A generic hobby prop: near-constant pitch with root wash-out and a
    typical FPV planform.  Stands in for commercial props whose exact geometry
    is not published."""
    d_in, p_in, b = parse_prop_name(name)
    B = blades or b or 2
    R = d_in * INCH / 2
    r_hub = max(0.15 * R, 0.006)
    r, dr = stations(R, r_hub, n)
    x = r / R
    twist = np.minimum(np.arctan(p_in * INCH / (2 * np.pi * r)),
                       np.radians(max_twist_deg))
    chord = chord_scale * R * PchipInterpolator(
        [0.15, 0.35, 0.6, 0.85, 1.0], [0.17, 0.25, 0.22, 0.16, 0.08])(x)
    return Blade(R=R, r_hub=r_hub, B=B, r=r, dr=dr, chord=chord, twist=twist,
                 sweep=np.zeros(n), tc=np.interp(x, [0.15, 1], [0.12, 0.07]),
                 camber=np.full(n, 0.04), name=f"{d_in:g}x{p_in:g}x{B}")


def parametric_blade(R, B, chord_ctrl, twist_ctrl_deg, sweep_tip=0.0,
                     sweep_start=0.6, camber=0.04, tc_root=0.12, tc_tip=0.07,
                     spacing_skew_deg=0.0, n=30, name="param"):
    """Blade from a handful of control points (what the optimiser varies).

    chord_ctrl      c/R at x = r/R = 0.15, 0.45, 0.75, 1.0
    twist_ctrl_deg  pitch angle at the same stations
    sweep_tip       aft mid-chord offset at the tip as a fraction of R,
                    growing quadratically from sweep_start
    spacing_skew_deg  for even blade counts, alternate blades are rotated by
                    this much (opposite blades stay opposite, so it balances)
    """
    r_hub = max(0.15 * R, 0.006)
    r, dr = stations(R, r_hub, n)
    x = r / R
    xc = [0.15, 0.45, 0.75, 1.0]
    chord = R * PchipInterpolator(xc, chord_ctrl)(x)
    twist = np.radians(PchipInterpolator(xc, twist_ctrl_deg)(x))
    s = np.clip((x - sweep_start) / (1 - sweep_start), 0, None) ** 2
    az = 2 * np.pi * np.arange(B) / B
    if B % 2 == 0 and B > 2 and spacing_skew_deg:
        # odd-numbered blades shift together; both sub-rotors stay balanced
        az = az + np.radians(spacing_skew_deg) * (np.arange(B) % 2)
    return Blade(R=R, r_hub=r_hub, B=B, r=r, dr=dr, chord=chord, twist=twist,
                 sweep=sweep_tip * R * s, tc=np.interp(x, [0.15, 1], [tc_root, tc_tip]),
                 camber=np.full(n, camber), azimuths=az, name=name)

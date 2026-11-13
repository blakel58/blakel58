"""Parametric low-Reynolds-number section polar.

Small drone props run at chord Reynolds numbers of roughly 2e4-1.5e5, where
laminar separation dominates and textbook high-Re polars are wrong.  This is a
compact surrogate (lift slope, camber shift, Re-dependent stall and drag,
Viterna post-stall) so that designs can be varied continuously.  It is the
largest single source of error in the model: swap in measured or XFOIL polars
through `TabulatedAirfoil` when you have them for a real section.
"""
import numpy as np

CD_MAX = 1.3  # flat-plate-like drag coefficient at 90 deg


CD0_REF = 0.017   # minimum drag at Re = 1e5, t/c = 0.10 (moulded hobby sections)
K_LIFT = 0.020    # lift-dependent profile drag factor at Re = 1e5


def _attached_cd(cl, Re, tc, camber):
    ref = 1e5 / Re
    cd0 = CD0_REF * np.where(Re < 1e5, ref ** 0.5, ref ** 0.2)
    ft = (1 + 2 * tc + 60 * tc ** 4) / 1.206          # normalised at t/c = 0.10
    k = K_LIFT * ref ** 0.3 + 0.005
    return cd0 * ft + k * (cl - 7.0 * camber) ** 2


def polar(alpha, Re, mach, tc, camber, c_over_r=None):
    """Return (cl, cd). alpha in rad; arrays broadcast."""
    alpha, Re, mach, tc, camber = np.broadcast_arrays(
        *[np.asarray(v, float) for v in (alpha, Re, mach, tc, camber)])
    Re = np.clip(Re, 5e3, 5e6)
    beta = np.sqrt(1 - np.minimum(mach, 0.75) ** 2)
    a0 = 5.7 / beta                                   # below 2*pi at low Re
    ae = np.clip(alpha + 1.8 * camber, -np.pi / 2, np.pi / 2)  # from zero lift
    ref = (Re / 1e5) ** 0.12
    clmax = np.clip((0.95 + 5 * camber) * ref, 0.5, 1.7)
    clmin = -np.clip((0.95 - 4 * camber) * ref, 0.3, 1.7)

    cl_lin = a0 * ae
    cl = cl_lin.copy()
    cd = _attached_cd(np.clip(cl_lin, clmin, clmax), Re, tc, camber)

    for sign, cls in ((1.0, clmax), (-1.0, clmin)):
        a_s = np.abs(cls) / a0
        m = sign * ae > a_s
        if not m.any():
            continue
        a = np.abs(ae)
        cds = _attached_cd(cls, Re, tc, camber)
        sa, ca = np.sin(a_s), np.cos(a_s)
        A2 = (np.abs(cls) - CD_MAX * sa * ca) * sa / ca ** 2
        B2 = (cds - CD_MAX * sa ** 2) / ca
        s, c_ = np.sin(a), np.cos(a)
        with np.errstate(divide="ignore", invalid="ignore"):
            cl_v = sign * (CD_MAX / 2 * np.sin(2 * a) + A2 * c_ ** 2 / s)
            cd_v = CD_MAX * s ** 2 + B2 * c_
        cl = np.where(m, cl_v, cl)
        cd = np.where(m, cd_v, cd)

    if c_over_r is not None:
        # Snel rotational stall delay: inboard sections keep more lift.
        pot = a0 * np.clip(ae, 0, np.radians(30))
        gain = np.minimum(3.0 * np.asarray(c_over_r) ** 2, 1.0)
        cl = np.where((ae > 0) & (pot > cl), cl + gain * (pot - cl), cl)
    cd = cd + 2.0 * np.maximum(mach - 0.6, 0) ** 2     # transonic drag rise
    return cl, np.maximum(cd, 1e-4)


class TabulatedAirfoil:
    """Drop-in replacement for `polar` built from a (alpha, Re) table."""

    def __init__(self, alpha_deg, Re, cl, cd):
        from scipy.interpolate import RegularGridInterpolator
        pts = (np.radians(alpha_deg), np.log10(Re))
        kw = dict(bounds_error=False, fill_value=None)
        self._cl = RegularGridInterpolator(pts, np.asarray(cl), **kw)
        self._cd = RegularGridInterpolator(pts, np.asarray(cd), **kw)

    def __call__(self, alpha, Re, mach, tc, camber, c_over_r=None):
        alpha, Re = np.broadcast_arrays(alpha, Re)
        q = np.stack([alpha, np.log10(Re)], -1)
        return self._cl(q), np.maximum(self._cd(q), 1e-4)

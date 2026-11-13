"""Blade-element momentum theory for hover and axial flight.

Each annulus is solved for its inflow angle phi from a single residual that
stays well-behaved at zero flight speed.  With induced velocities u (axial)
and v (swirl), W the local speed and kn, kt = sigma' * c{n,t} / (4 F):

    blade element = momentum   ->   u = W kn / sin(phi),  v = W kt / sin(phi)
    geometry                   ->   V = W sin(phi) - u,   Omega r = W cos(phi) + v
    eliminate W                ->   V (sin cos + kt) - Omega r (sin^2 - kn) = 0

F is the Prandtl tip and hub loss factor.  Section forces come from the
low-Re polar with Prandtl-Glauert compressibility and rotational stall delay.
"""
from dataclasses import dataclass
import numpy as np
from scipy.optimize import brentq
from .airfoil import polar
from .atmosphere import Air


@dataclass
class BemtResult:
    rpm: float
    v_inf: float
    thrust: float          # N
    torque: float          # N m
    power: float           # W (shaft)
    phi: np.ndarray
    alpha: np.ndarray      # rad
    W: np.ndarray          # local relative speed, m/s
    Re: np.ndarray
    mach: np.ndarray
    cl: np.ndarray
    cd: np.ndarray
    dT: np.ndarray         # thrust per blade per strip, N
    dFt: np.ndarray        # in-plane (torque) force per blade per strip, N
    converged: np.ndarray
    air: Air

    @property
    def omega(self):
        return self.rpm * np.pi / 30

    def coefficients(self, D):
        n = self.rpm / 60
        rho = self.air.rho
        return (self.thrust / (rho * n ** 2 * D ** 4),
                self.power / (rho * n ** 3 * D ** 5))

    def figure_of_merit(self, R):
        ideal = self.thrust ** 1.5 / np.sqrt(2 * self.air.rho * np.pi * R ** 2)
        return ideal / self.power if self.power > 0 else 0.0


def solve_bemt(blade, rpm, v_inf=0.0, air=Air()):
    om = rpm * np.pi / 30
    r, c, th, B = blade.r, blade.chord, blade.twist, blade.B
    foil = blade.airfoil or polar
    Vt = om * r
    W0 = np.hypot(v_inf, Vt)
    Re = air.rho * W0 * c / air.mu
    mach = W0 / air.c
    sig = B * c / (2 * np.pi * r)

    def section(phi):
        cl, cd = foil(th - phi, Re, mach, blade.tc, blade.camber, c / r)
        s, co = np.sin(phi), np.cos(phi)
        cn, ct = cl * co - cd * s, cl * s + cd * co
        ft = B / 2 * (blade.R - r) / (r * s)
        fh = B / 2 * (r - blade.r_hub) / (blade.r_hub * s)
        F = (2 / np.pi) ** 2 * np.arccos(np.exp(-ft)) * np.arccos(np.exp(-fh))
        F = np.maximum(F, 1e-4)
        return cl, cd, cn, ct, sig * cn / (4 * F), sig * ct / (4 * F)

    def resid(phi):
        *_, kn, kt = section(phi)
        s, co = np.sin(phi), np.cos(phi)
        return v_inf * (s * co + kt) - Vt * (s * s - kn)

    grid = np.linspace(1e-3, np.pi / 2 - 1e-3, 48)
    Rg = np.array([resid(np.full_like(r, p)) for p in grid])     # (n_phi, n_r)
    cross = (Rg[:-1] > 0) & (Rg[1:] <= 0)
    ok = cross.any(0)
    i0 = np.argmax(cross, 0)
    lo, hi = grid[i0], grid[i0 + 1]
    for _ in range(22):
        mid = 0.5 * (lo + hi)
        pos = resid(mid) > 0
        lo, hi = np.where(pos, mid, lo), np.where(pos, hi, mid)
    phi = np.where(ok, 0.5 * (lo + hi), grid[np.argmin(np.abs(Rg), 0)])

    cl, cd, cn, ct, kn, kt = section(phi)
    W = Vt / (np.cos(phi) + kt / np.sin(phi))
    q = 0.5 * air.rho * W ** 2 * c * blade.dr
    dT, dFt = q * cn, q * ct
    dT, dFt = np.where(ok, dT, 0.0), np.where(ok, dFt, 0.0)
    T = B * dT.sum()
    Q = B * (dFt * r).sum()
    return BemtResult(rpm, v_inf, T, Q, Q * om, phi, th - phi, W,
                      air.rho * W * c / air.mu, W / air.c, cl, cd, dT, dFt, ok, air)


def max_rpm(blade, air=Air(), tip_mach=0.8):
    return tip_mach * air.c / blade.R * 30 / np.pi


def trim_rpm_for_thrust(blade, thrust, v_inf=0.0, air=Air()):
    """RPM at which the prop makes `thrust`; None if it cannot below tip Mach 0.8."""
    hi = max_rpm(blade, air)
    f = lambda rpm: solve_bemt(blade, rpm, v_inf, air).thrust - thrust
    if f(hi) < 0:
        return None
    return brentq(f, 300.0, hi, xtol=0.5)

"""Vortex-lattice rotor solver for blades of any shape, including closed loops.

Blade-element theory needs a blade with a free tip.  A toroidal (loop) blade
has none, so here the blade is a ribbon following an arbitrary 3D quarter-chord
line.  Each panel carries a horseshoe vortex: a bound segment on the
quarter-chord line plus two trailing filaments that leave the trailing edge and
follow a prescribed contracting helical wake.  Flow tangency is enforced at
three-quarter chord (Weissinger), and the section polar is coupled in by a
decambering iteration so lift slope, stall and Reynolds number effects match
the blade-element model.

Wake: inner filaments descend at v_i at the disc speeding up to 2 v_i
(momentum theory), filaments at the slipstream edge at half that, and the
wake contracts by continuity; v_i is iterated against the computed thrust.  This is a mid-fidelity model: good for loading distribution and
induced power of non-planar blades, not for wake roll-up or blade-vortex
interaction detail.
"""
from dataclasses import dataclass, field
import numpy as np
from .airfoil import polar
from .atmosphere import Air


@dataclass
class Ribbon:
    R: float
    r_hub: float
    B: int
    P: np.ndarray            # (N+1, 3) quarter-chord nodes of one blade, m
    chord: np.ndarray        # (N,) panel chord, m
    pitch: np.ndarray        # (N,) pitch in the panel's own frame, rad
    camber: np.ndarray       # (N,) camber in the panel's own frame
    tc: np.ndarray           # (N,)
    azimuths: np.ndarray = None
    name: str = ""
    closed_tip: bool = False
    airfoil: object = field(default=None, repr=False)

    def __post_init__(self):
        if self.azimuths is None:
            self.azimuths = 2 * np.pi * np.arange(self.B) / self.B

    def frames(self):
        """Per-panel geometry: midpoint, span vector, chord direction, normal."""
        dl = np.diff(self.P, axis=0)
        mid = 0.5 * (self.P[1:] + self.P[:-1])
        l = dl / np.linalg.norm(dl, axis=1)[:, None]
        v = np.stack([mid[:, 1], -mid[:, 0], 0 * mid[:, 0]], 1)     # onset flow / Omega
        a = v - np.sum(v * l, 1)[:, None] * l
        a /= np.linalg.norm(a, axis=1)[:, None]                     # aft, normal to span
        up = np.cross(a, l)
        c, s = np.cos(self.pitch)[:, None], np.sin(self.pitch)[:, None]
        return dict(mid=mid, dl=dl, l=l, a=a, up=up, tcv=c * a - s * up, n=c * up + s * a,
                    len=np.linalg.norm(dl, axis=1), r=np.hypot(mid[:, 0], mid[:, 1]))

    @property
    def solidity(self):
        return self.B * np.sum(self.chord * self.frames()["len"]) / (np.pi * self.R ** 2)


def ribbon_from_blade(blade):
    """Conventional blade (free tip) as a ribbon, for cross-checking with BEMT."""
    edges = np.concatenate([[blade.r[0] - blade.dr[0] / 2], blade.r + blade.dr / 2])
    f = lambda v: np.interp(edges, blade.r, v)
    c, th, sw = f(blade.chord), f(blade.twist), f(blade.sweep)
    P = np.stack([edges, -sw + 0.25 * c * np.cos(th), 0.25 * c * np.sin(th)], 1)
    return Ribbon(blade.R, blade.r_hub, blade.B, P, blade.chord.copy(), blade.twist.copy(),
                  blade.camber.copy(), blade.tc.copy(), blade.azimuths.copy(), blade.name,
                  airfoil=blade.airfoil)


def _segments(Pts, A, Bp, rc):
    """Velocity at Pts (p,3) per unit circulation of segments A->Bp (s,3): (p,s,3)."""
    r1 = Pts[:, None, :] - A[None]
    r2 = Pts[:, None, :] - Bp[None]
    cr = np.cross(r1, r2)
    n1, n2 = np.linalg.norm(r1, axis=2), np.linalg.norm(r2, axis=2)
    r0 = np.sum((Bp - A) ** 2, 1)[None]
    den = n1 * n2 * (n1 * n2 + np.sum(r1 * r2, 2)) + rc ** 2 * r0 + 1e-18
    return cr * ((n1 + n2) / den / (4 * np.pi))[..., None]


@dataclass
class VlmResult:
    rpm: float
    lam: float
    thrust: float
    torque: float
    power: float
    gamma: np.ndarray
    alpha: np.ndarray        # effective angle of attack in panel frame, rad
    W: np.ndarray            # speed normal to the span, m/s
    Re: np.ndarray
    cl: np.ndarray
    cd: np.ndarray
    F: np.ndarray            # (N,3) force on one blade's panels, N
    converged: bool
    air: Air

    @property
    def omega(self):
        return self.rpm * np.pi / 30

    def figure_of_merit(self, R):
        ideal = self.thrust ** 1.5 / np.sqrt(2 * self.air.rho * np.pi * R ** 2)
        return ideal / self.power if self.power > 0 else 0.0


class VlmRotor:
    def __init__(self, ribbon, air=Air(), revs=8, core=0.03):
        self.rb, self.air, self.revs, self.core = ribbon, air, revs, core
        self.fr = ribbon.frames()
        g, rb = self.fr, ribbon
        self.cp = g["mid"] + 0.5 * rb.chord[:, None] * g["tcv"]
        # trailing-edge points under each node (average of neighbouring panels)
        ext = lambda v: np.concatenate([v[:1], 0.5 * (v[1:] + v[:-1]), v[-1:]])
        self.te = rb.P + 0.75 * ext(rb.chord)[:, None] * ext(g["tcv"])
        self._aic = {}
        self.lam = 0.07

    def _wake(self, lam):
        phi = np.concatenate([np.linspace(0, 2 * np.pi, 25),
                              np.linspace(2 * np.pi, 2 * np.pi * self.revs, 12 * (self.revs - 1) + 1)[1:]])
        x0 = self.te
        r, p0 = np.hypot(x0[:, 0], x0[:, 1])[:, None], np.arctan2(x0[:, 1], x0[:, 0])[:, None]
        k = 1 / np.sqrt(2 - np.exp(-phi / np.pi))[None]
        # The slipstream edge is a vortex sheet with flow inside and still air
        # outside, so it travels at half the inner speed: outer filaments
        # descend at 0.5 v_i -> v_i, inner ones at v_i -> 2 v_i.
        edge = np.clip((r / self.rb.R - 0.75) / 0.25, 0, 1) ** 2
        z = x0[:, 2:3] - (1 - 0.5 * edge) * lam * self.rb.R \
            * (2 * phi - np.pi * (1 - np.exp(-phi / np.pi)))[None]
        return np.stack([r * k * np.cos(p0 - phi), r * k * np.sin(p0 - phi), z], -1)   # (K, M, 3)

    def aic(self, lam):
        key = round(lam, 4)
        if key in self._aic:
            return self._aic[key]
        rb, g = self.rb, self.fr
        N = len(rb.chord)
        pts = np.vstack([self.cp, g["mid"]])
        path = np.concatenate([rb.P[:, None, :], self._wake(lam)], 1)       # node -> TE -> helix
        K, M1 = path.shape[:2]
        rc = self.core * rb.R
        H = np.zeros((len(pts), N, 3))
        for psi in rb.azimuths:
            c, s = np.cos(psi), np.sin(psi)
            Rz = np.array([[c, -s, 0], [s, c, 0], [0, 0, 1]])
            pr = path @ Rz.T
            G = _segments(pts, pr[:, :-1].reshape(-1, 3), pr[:, 1:].reshape(-1, 3), rc)
            G = G.reshape(len(pts), K, M1 - 1, 3).sum(2)                     # per filament
            Pb = rb.P @ Rz.T
            H += _segments(pts, Pb[:-1], Pb[1:], 0.25 * rc) + G[:, 1:] - G[:, :-1]
        out = (H[:N], H[N:])
        if len(self._aic) > 6:
            self._aic.clear()
        self._aic[key] = out
        return out

    def solve(self, rpm, lam=None, iters=60):
        rb, g, air = self.rb, self.fr, self.air
        lam = self.lam if lam is None else lam
        Vcp, Vbm = self.aic(lam)
        om = rpm * np.pi / 30
        onset = lambda x: om * np.stack([x[:, 1], -x[:, 0], 0 * x[:, 0]], 1)
        Ucp, Ubm = onset(self.cp), onset(g["mid"])
        foil = rb.airfoil or polar
        delta = -1.8 * rb.camber
        ok = False
        for it in range(iters):
            nd = np.cos(delta)[:, None] * g["n"] - np.sin(delta)[:, None] * g["tcv"]
            A = np.einsum("ijk,ik->ij", Vcp, nd)
            gam = np.linalg.solve(A, -np.sum(Ucp * nd, 1))
            V = Ubm + np.einsum("ijk,j->ik", Vbm, gam)
            Vn = V - np.sum(V * g["l"], 1)[:, None] * g["l"]
            W = np.linalg.norm(Vn, axis=1)
            ae = gam / (np.pi * rb.chord * W) + delta
            Re, mach = air.rho * W * rb.chord / air.mu, W / air.c
            cl, cd = foil(ae, Re, mach, rb.tc, rb.camber, rb.chord / g["r"])
            new = ae - cl / (2 * np.pi)
            if np.max(np.abs(new - delta)) < 2e-4:
                ok = True
                break
            delta = delta + 0.4 * (new - delta)
        # Profile drag: skin friction acts with the full local speed; the
        # lift-dependent/form part only with the flow normal to the span
        # (simple sweep theory), which matters where a loop runs along the flow.
        Vmag = np.linalg.norm(V, axis=1)
        _, cd0 = foil(-1.8 * rb.camber, Re, mach, rb.tc, rb.camber)
        cd0 = np.minimum(cd0, cd)
        area = 0.5 * air.rho * rb.chord * g["len"]
        F = air.rho * gam[:, None] * np.cross(V, g["dl"]) \
            + (area * cd0 * Vmag)[:, None] * V + (area * (cd - cd0) * W)[:, None] * Vn
        T = rb.B * F[:, 2].sum()
        Q = -rb.B * np.sum(g["mid"][:, 0] * F[:, 1] - g["mid"][:, 1] * F[:, 0])
        return VlmResult(rpm, lam, T, Q, Q * om, gam, ae, W, Re, cl, cd, F, ok, air)

    def converge(self, rpm, tol=0.003, max_it=8):
        """Iterate the wake descent rate against the computed thrust."""
        for _ in range(max_it):
            s = self.solve(rpm, self.lam)
            vi = np.sqrt(max(s.thrust, 1e-6) / (2 * self.air.rho * np.pi * self.rb.R ** 2))
            new = float(np.clip(vi / (s.omega * self.rb.R), 0.01, 0.25))
            if abs(new - self.lam) < tol:
                break
            self.lam = 0.5 * (self.lam + new)
        return s

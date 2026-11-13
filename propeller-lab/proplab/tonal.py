"""Rotational (tonal) noise: steady loading + thickness, in the time domain.

Every blade strip is split chordwise into compact sources that travel on
circles.  Loading uses Farassat's Formulation 1A for a moving point force;
thickness uses the equivalent compact-volume form

    p_T(x, t) = rho d^2/dt^2 [ dVol / (4 pi r (1 - M_r)) ]_ret .

Fourier coefficients at shaft harmonics n are taken directly in source time
(dt = (1 - M_r) dtau), so no retarded-time root finding or interpolation is
needed and the result is exact for near and far field.  Because chordwise
and swept sources carry their true positions, sweep and wide chords cancel
tone energy through phase, as they do physically.  Blades are summed with
their actual azimuths, so uneven spacing is handled too.
"""
from dataclasses import dataclass
import numpy as np

P_REF = 2e-5


def _chordwise(n_chord):
    """Panel centres (fraction of chord from LE) with loading/thickness weights."""
    e = 0.5 * (1 - np.cos(np.linspace(0, np.pi, n_chord + 1)))
    sc = 0.5 * (e[1:] + e[:-1])
    G = lambda s: np.sqrt(s * (1 - s)) + np.arcsin(np.sqrt(s))   # flat-plate dCp
    wl = np.diff(G(e)) / (np.pi / 2)
    yt = lambda s: (0.2969 * np.sqrt(s) - 0.126 * s - 0.3516 * s ** 2
                    + 0.2843 * s ** 3 - 0.1015 * s ** 4)
    ss = np.linspace(0, 1, 2001)
    cum = np.concatenate([[0], np.cumsum(0.5 * (yt(ss[1:]) + yt(ss[:-1])) * np.diff(ss))])
    wt = np.diff(np.interp(e, ss, cum)) / cum[-1]
    return sc, wl, wt


def blade_sources(blade, sol, n_chord=5):
    """Flatten strips x chord panels into point sources."""
    sc, wl, wt = _chordwise(n_chord)
    xi = (sc[None, :] - 0.5) * blade.chord[:, None]               # aft of mid-chord
    lag = blade.sweep[:, None] + xi * np.cos(blade.twist)[:, None]
    r = np.repeat(blade.r[:, None], n_chord, 1)
    area = 0.685 * blade.tc * blade.chord ** 2                    # NACA 4-digit
    return dict(
        r=r.ravel(), psi0=(-lag / r).ravel(),
        z=(-xi * np.sin(blade.twist)[:, None]).ravel(),
        fz=(sol.dT[:, None] * wl).ravel(),                        # thrust share
        ft=(sol.dFt[:, None] * wl).ravel(),                       # in-plane share
        vol=((area * blade.dr)[:, None] * wt).ravel())


@dataclass(frozen=True)
class ArmInteraction:
    """Installed-rotor unsteady loading: each blade briefly loses a fraction
    `depth` of its lift as it sweeps over a frame arm of width `width` (m)
    lying along azimuth `azimuth` (rad).  The deficit is Gaussian in arc
    length.  `depth` is an assumed input (a few percent is typical of arms
    0.2-0.5 chord below the disc), not something this model predicts."""
    depth: float = 0.05
    width: float = 0.014
    azimuth: float = 0.0
    r_max: float = 1.0          # arm spans from the hub out to r_max * R


def single_blade_harmonics(src, omega, obs, orders, air, n_t=None, arm=None, R=None):
    """Complex pressure coefficients P_n (loading, thickness) of ONE blade at
    observer `obs` (3-vector, rotor at origin, thrust along +z) for the shaft
    orders `orders`.  p(t) = sum_n P_n exp(-i n Omega t)."""
    orders = np.asarray(orders)
    n_t = n_t or int(max(128, 6 * orders.max()))
    if arm is not None:
        n_t = max(n_t, 512)
    c0 = air.c
    tau = np.arange(n_t) * 2 * np.pi / omega / n_t
    psi = omega * tau[None, :] + src["psi0"][:, None]
    r_s = src["r"][:, None]
    cs, sn = np.cos(psi), np.sin(psi)
    dx, dy, dz = obs[0] - r_s * cs, obs[1] - r_s * sn, obs[2] - src["z"][:, None]
    d = np.sqrt(dx * dx + dy * dy + dz * dz)
    hx, hy, hz = dx / d, dy / d, dz / d
    e_psi_r = -sn * hx + cs * hy            # e_psi . rhat
    e_rad_r = cs * hx + sn * hy             # e_r . rhat
    Mt = omega * r_s / c0
    Mr = Mt * e_psi_r
    Mdot_r = -(omega ** 2 * r_s / c0) * e_rad_r
    fz, ft = src["fz"][:, None], src["ft"][:, None]
    # force exerted on the air = -(force on blade)
    Fr = -fz * hz + ft * e_psi_r
    Fdot_r = -ft * omega * e_rad_r
    if arm is not None:
        dpsi = (psi - arm.azimuth + np.pi) % (2 * np.pi) - np.pi
        sig = 0.5 * arm.width / r_s                     # angular half-width
        dip = arm.depth * np.exp(-0.5 * (dpsi / sig) ** 2) * (r_s <= arm.r_max * R)
        g, gdot = 1 - dip, dip * dpsi / sig ** 2 * omega
        Fdot_r = Fdot_r * g + Fr * gdot
        Fr, ft = Fr * g, ft * g
    FM = ft * Mt
    k = 1 - Mr
    pL = (Fdot_r / (c0 * d * k ** 2) + (Fr - FM) / (d ** 2 * k ** 2)
          + Fr * (d * Mdot_r + c0 * Mr - c0 * Mt ** 2) / (c0 * d ** 2 * k ** 3)) / (4 * np.pi)
    gT = src["vol"][:, None] / (4 * np.pi * d)
    t_obs = tau[None, :] + d / c0
    PL = np.empty(len(orders), complex)
    PT = np.empty(len(orders), complex)
    step = int(orders[1] - orders[0]) if len(orders) > 1 else 0
    E = np.exp(1j * omega * orders[0] * t_obs)
    Estep = np.exp(1j * omega * step * t_obs)
    wL = pL * k
    for i, n in enumerate(orders):
        if i:
            E = E * Estep
        PL[i] = np.sum(wL * E) / n_t
        PT[i] = -air.rho * (n * omega) ** 2 * np.sum(gT * E) / n_t
    return PL, PT


def tonal_noise(blade, sol, observers, air, n_harm=10, n_chord=5, arm=None):
    """Tones at each observer.  Returns (freqs [Hz], p_rms^2 [n_obs, n_tones],
    parts) where parts holds the loading-only and thickness-only p_rms^2."""
    B = blade.B
    equal = np.allclose(np.diff(np.sort(blade.azimuths % (2 * np.pi))), 2 * np.pi / B, atol=1e-6) \
        if B > 1 else True
    orders = np.arange(1, n_harm + 1) * B if equal else np.arange(1, n_harm * B + 1)
    S = np.exp(-1j * orders[:, None] * blade.azimuths[None, :]).sum(1)
    src = blade_sources(blade, sol, n_chord)
    om = sol.omega
    tot, load, thick = [], [], []
    for x in np.atleast_2d(observers):
        PL, PT = single_blade_harmonics(src, om, x, orders, air, arm=arm, R=blade.R)
        tot.append(2 * np.abs((PL + PT) * S) ** 2)
        load.append(2 * np.abs(PL * S) ** 2)
        thick.append(2 * np.abs(PT * S) ** 2)
    return orders * om / (2 * np.pi), np.array(tot), dict(loading=np.array(load),
                                                         thickness=np.array(thick))

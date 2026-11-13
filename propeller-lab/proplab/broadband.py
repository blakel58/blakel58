"""Broadband airfoil self-noise, Brooks-Pope-Marcolini (NASA RP-1218, 1989).

Implemented per blade strip in 1/3-octave bands:
  * turbulent boundary layer / trailing edge noise (pressure + suction side)
  * separation / stall noise
  * laminar boundary layer vortex shedding (the low-Re "whistle" hump)
  * tip vortex formation noise
Trailing-edge bluntness noise is not included.  BPM is a semi-empirical fit
to NACA 0012 data (chord Re 5e4-3e6); angles are measured from zero lift.
Each strip is treated quasi-steadily and its directivity is averaged around
the azimuth.
"""
import numpy as np

P_REF = 2e-5
THIRD_OCT = 1000.0 * 2.0 ** (np.arange(-13, 14) / 3.0)      # ~50 Hz .. 20 kHz


def _A(a, Rc):
    a = np.abs(a)
    def amin(a):
        return np.where(a < 0.204, np.sqrt(np.maximum(67.552 - 886.788 * a ** 2, 0)) - 8.219,
               np.where(a <= 0.244, -32.665 * a + 3.981,
                        -142.795 * a ** 3 + 103.656 * a ** 2 - 57.757 * a + 6.006))
    def amax(a):
        return np.where(a < 0.13, np.sqrt(np.maximum(67.552 - 886.788 * a ** 2, 0)) - 8.219,
               np.where(a <= 0.321, -15.901 * a + 1.098,
                        -4.669 * a ** 3 + 3.491 * a ** 2 - 16.699 * a + 1.149))
    a0 = np.where(Rc < 9.52e4, 0.57,
         np.where(Rc <= 8.57e5, -9.57e-13 * (Rc - 8.57e5) ** 2 + 1.13, 1.13))
    AR = (-20 - amin(a0)) / (amax(a0) - amin(a0))
    return amin(a) + AR * (amax(a) - amin(a))


def _B(b, Rc):
    b = np.abs(b)
    def bmin(b):
        return np.where(b < 0.13, np.sqrt(np.maximum(16.888 - 886.788 * b ** 2, 0)) - 4.109,
               np.where(b <= 0.145, -83.607 * b + 8.138,
                        -817.810 * b ** 3 + 355.210 * b ** 2 - 135.024 * b + 10.619))
    def bmax(b):
        return np.where(b < 0.10, np.sqrt(np.maximum(16.888 - 886.788 * b ** 2, 0)) - 4.109,
               np.where(b <= 0.187, -31.330 * b + 1.854,
                        -80.541 * b ** 3 + 44.174 * b ** 2 - 39.381 * b + 2.344))
    b0 = np.where(Rc < 9.52e4, 0.30,
         np.where(Rc <= 8.57e5, -4.48e-13 * (Rc - 8.57e5) ** 2 + 0.56, 0.56))
    BR = (-20 - bmin(b0)) / (bmax(b0) - bmin(b0))
    return bmin(b) + BR * (bmax(b) - bmin(b))


def _boundary_layer(c, Rc, a, tripped):
    """Displacement thicknesses (pressure, suction) and pressure-side BL thickness."""
    lr = np.log10(Rc)
    if tripped:
        d0 = c * 10 ** (1.892 - 0.9045 * lr + 0.0596 * lr ** 2)
        ds0 = c * np.where(Rc > 0.3e6, 10 ** (3.411 - 1.5397 * lr + 0.1059 * lr ** 2),
                           0.0601 * Rc ** -0.114)
        dss = ds0 * np.where(a <= 5, 10 ** (0.0679 * a),
                    np.where(a <= 12.5, 0.381 * 10 ** (0.1516 * a), 14.296 * 10 ** (0.0258 * a)))
    else:
        d0 = c * 10 ** (1.6569 - 0.9045 * lr + 0.0596 * lr ** 2)
        ds0 = c * 10 ** (3.0187 - 1.5397 * lr + 0.1059 * lr ** 2)
        dss = ds0 * np.where(a <= 7.5, 10 ** (0.0679 * a),
                    np.where(a <= 12.5, 0.0162 * 10 ** (0.3066 * a), 52.42 * 10 ** (0.0258 * a)))
    dsp = ds0 * 10 ** (-0.0432 * a + 0.00113 * a ** 2)
    dp = d0 * 10 ** (-0.04175 * a + 0.00106 * a ** 2)
    return dsp, dss, dp


def strip_self_noise(f, c, L, U, alpha_deg, air, tripped=False, lbl=True):
    """Mean-square pressure * r_e^2 / Dh per strip and band (shape [n_strip, n_f]),
    i.e. to be multiplied by directivity Dh / r_e^2.  Returns dict of mechanisms."""
    c, L, U, a = (np.asarray(v, float)[:, None] for v in (c, L, U, alpha_deg))
    a = np.clip(np.abs(a), 0, 25)
    f = np.asarray(f)[None, :]
    M = U / air.c
    Rc = np.maximum(U * c / air.nu, 1e4)
    dsp, dss, dp = _boundary_layer(c, Rc, a, tripped)
    lin = lambda spl: 10 ** (spl / 10)

    # --- turbulent boundary layer trailing edge + separation ---
    St1 = 0.02 * M ** -0.6
    St2 = St1 * np.where(a < 1.33, 1.0,
                np.where(a <= 12.5, 10 ** (0.0054 * (a - 1.33) ** 2), 4.72))
    St1b = 0.5 * (St1 + St2)
    K1 = np.where(Rc < 2.47e5, -4.31 * np.log10(Rc) + 156.3,
         np.where(Rc <= 8e5, -9.0 * np.log10(Rc) + 181.6, 128.5))
    Rdp = U * dsp / air.nu
    dK1 = np.where(Rdp <= 5000, a * (1.43 * np.log10(Rdp) - 5.29), 0.0)
    gam, gam0 = 27.094 * M + 3.31, 23.43 * M + 4.651
    bet, bet0 = 72.65 * M + 10.74, -34.19 * M - 13.82
    K2 = K1 + np.where(a < gam0 - gam, -1000.0,
              np.where(a > gam0 + gam, -12.0,
                       np.sqrt(np.maximum(bet ** 2 - (bet / gam) ** 2 * (a - gam0) ** 2, 0)) + bet0))
    scale_p = 10 * np.log10(dsp * M ** 5 * L)
    scale_s = 10 * np.log10(dss * M ** 5 * L)
    Stp, Sts = f * dsp / U, f * dss / U
    stalled = a > np.minimum(gam0, 12.5)
    spl_p = scale_p + _A(np.log10(Stp / St1), Rc) + K1 - 3 + dK1
    spl_s = scale_s + _A(np.log10(Sts / St1b), Rc) + K1 - 3
    spl_a = scale_s + np.where(stalled, _A(np.log10(Sts / St2), 3 * Rc),
                               _B(np.log10(Sts / St2), Rc)) + K2
    tbl = np.where(stalled, 0.0, lin(spl_p) + lin(spl_s))
    sep = lin(spl_a)

    # --- laminar boundary layer vortex shedding ---
    out = dict(tbl_te=tbl, separation=sep)
    if lbl and not tripped:
        Stp1 = np.where(Rc <= 1.3e5, 0.18, np.where(Rc <= 4e5, 0.001756 * Rc ** 0.3931, 0.28))
        e = (f * dp / U) / (Stp1 * 10 ** (-0.04 * a))
        le = np.log10(e)
        G1 = np.where(e <= 0.5974, 39.8 * le - 11.12,
             np.where(e <= 0.8545, 98.409 * le + 2.0,
             np.where(e <= 1.17, -5.076 + np.sqrt(np.maximum(2.484 - 506.25 * le ** 2, 0)),
             np.where(e <= 1.674, -98.409 * le + 2.0, -39.8 * le - 11.12))))
        R0 = np.where(a <= 3, 10 ** (0.215 * a + 4.978), 10 ** (0.120 * a + 5.263))
        dd = Rc / R0
        ld = np.log10(dd)
        G2 = np.where(dd <= 0.3237, 77.852 * ld + 15.328,
             np.where(dd <= 0.5689, 65.188 * ld + 9.125,
             np.where(dd <= 1.7579, -114.052 * ld ** 2,
             np.where(dd <= 3.0889, -65.188 * ld + 9.125, -77.852 * ld + 15.328))))
        G3 = 171.04 - 3.03 * a
        out["lbl_vs"] = lin(10 * np.log10(dp * M ** 5 * L) + G1 + G2 + G3)
    return {k: v * P_REF ** 2 for k, v in out.items()}


def tip_noise(f, c_tip, U_tip, alpha_tip_deg, air):
    """Round-tip vortex formation noise for one blade (times Dh / r_e^2)."""
    a = np.clip(abs(alpha_tip_deg), 0, 20)
    M = U_tip / air.c
    ell = max(0.008 * a * c_tip, 1e-6)
    Mmax = M * (1 + 0.036 * a)
    St = f * ell / (Mmax * air.c)
    spl = 10 * np.log10(M ** 2 * Mmax ** 3 * ell ** 2) - 30.5 * (np.log10(St) + 0.3) ** 2 + 126
    return 10 ** (spl / 10) * P_REF ** 2


def _directivity(blade, sol, obs, n_az=16):
    """Azimuth-averaged high-frequency directivity Dh / r_e^2 per strip."""
    psi = 2 * np.pi * (np.arange(n_az) + 0.5) / n_az
    r = blade.r[:, None]
    th = blade.twist[:, None]
    cs, sn = np.cos(psi)[None, :], np.sin(psi)[None, :]
    d = np.stack([obs[0] - r * cs, obs[1] - r * sn, obs[2] + 0 * r * cs], -1)
    re = np.linalg.norm(d, axis=-1)
    e_psi = np.stack([-sn + 0 * r, cs + 0 * r, 0 * r * cs], -1)
    e_rad = np.stack([cs + 0 * r, sn + 0 * r, 0 * r * cs], -1)
    ez = np.array([0, 0, 1.0])
    xe = -np.cos(th)[..., None] * e_psi - np.sin(th)[..., None] * ez   # LE -> TE
    ze = np.cross(xe, e_rad)
    dx, dy, dzz = (np.sum(d * v, -1) for v in (xe, e_rad, ze))
    cosT = dx / re
    sin2P = dzz ** 2 / np.maximum(dy ** 2 + dzz ** 2, 1e-12)
    M = (sol.W / sol.air.c)[:, None]
    Dh = (1 - cosT) * sin2P / ((1 + M * cosT) * (1 + 0.2 * M * cosT) ** 2)
    return np.mean(Dh / re ** 2, axis=1)


def broadband_noise(blade, sol, observers, air, freqs=THIRD_OCT, tripped=False, lbl=True):
    """1/3-octave mean-square pressure [n_obs, n_f] plus per-mechanism split."""
    a_eff = np.degrees(sol.alpha + 1.8 * blade.camber)
    parts = strip_self_noise(freqs, blade.chord, blade.dr, sol.W, a_eff, air, tripped, lbl)
    tip = tip_noise(freqs, blade.chord[-1], sol.W[-1], a_eff[-1], air)
    total, split = [], {k: [] for k in list(parts) + ["tip"]}
    for x in np.atleast_2d(observers):
        w = blade.B * _directivity(blade, sol, x)
        for k, v in parts.items():
            split[k].append((v * w[:, None]).sum(0))
        split["tip"].append(tip * w[-1])
        total.append(sum(split[k][-1] for k in split))
    return np.array(total), {k: np.array(v) for k, v in split.items()}

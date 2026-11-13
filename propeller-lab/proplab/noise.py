"""Combine tones and broadband into spectra and single-number ratings."""
import numpy as np
from .tonal import tonal_noise, ArmInteraction
from .broadband import broadband_noise, THIRD_OCT

P_REF = 2e-5


def a_weight(f):
    f = np.asarray(f, float)
    f2 = f ** 2
    ra = (12194.0 ** 2 * f2 ** 2) / ((f2 + 20.6 ** 2) * np.sqrt((f2 + 107.7 ** 2) * (f2 + 737.9 ** 2))
                                     * (f2 + 12194.0 ** 2))
    return 20 * np.log10(np.maximum(ra, 1e-30)) + 2.0


def db(p2):
    return 10 * np.log10(np.maximum(p2, 1e-30) / P_REF ** 2)


def default_observers(distance=1.5, below_deg=(0, 15, 30, 45, 60, 75)):
    """Listeners on an arc at/below the rotor plane (thrust points up, +z)."""
    e = np.radians(below_deg)
    return distance * np.stack([np.cos(e), 0 * e, -np.sin(e)], -1)


def noise_report(blade, sol, observers=None, air=None, n_harm=None, tripped=False,
                 lbl=True, n_rotors=1, arm=None, n_chord=5):
    """Spectra and ratings.  Levels are energy-averaged over the observers and
    scaled incoherently by n_rotors (+6 dB for a quad)."""
    air = air or sol.air
    obs = default_observers() if observers is None else np.atleast_2d(observers)
    if n_harm is None:   # steady tones die off fast; arm pulses need many harmonics
        bpf = sol.rpm / 60 * blade.B
        n_harm = 8 if arm is None else int(np.clip(12000 / bpf, 8, 40))
    ft, pt, tparts = tonal_noise(blade, sol, obs, air, n_harm, n_chord, arm)
    pb, bparts = broadband_noise(blade, sol, obs, air, tripped=tripped, lbl=lbl)
    pt, pb = pt * n_rotors, pb * n_rotors
    keep = ft <= 20000
    wt, wb = 10 ** (a_weight(ft) / 10), 10 ** (a_weight(THIRD_OCT) / 10)
    tone_a = (pt * wt * keep).sum(1)
    bb_a = (pb * wb).sum(1)
    mean = lambda v: float(db(np.mean(v)))
    return dict(
        dBA=mean(tone_a + bb_a), dBA_tonal=mean(tone_a), dBA_broadband=mean(bb_a),
        OASPL=mean((pt * keep).sum(1) + pb.sum(1)),
        dBA_per_observer=db(tone_a + bb_a),
        tone_freqs=ft, tone_spl=db(pt.mean(0)),
        tone_loading_spl=db(tparts["loading"].mean(0) * n_rotors),
        tone_thickness_spl=db(tparts["thickness"].mean(0) * n_rotors),
        band_freqs=THIRD_OCT, band_spl=db(pb.mean(0)),
        band_parts={k: db(v.mean(0) * n_rotors) for k, v in bparts.items()},
        bpf=sol.rpm / 60 * blade.B)

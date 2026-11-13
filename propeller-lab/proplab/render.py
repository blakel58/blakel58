"""3D renders of a whole propeller built from the blade definition."""
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.colors import LightSource, to_rgb
from scipy.interpolate import PchipInterpolator
from .plots import SERIES, INK, INK2, SURF


def blade_surface(blade, n_span=60, n_chord=40):
    """Closed section loops (x, y, z) in metres for one blade at azimuth 0.
    x is along the span, y is the direction of rotation, z is thrust."""
    r = np.linspace(blade.r_hub * 0.8, blade.R, n_span)
    f = lambda v: PchipInterpolator(blade.r, v, extrapolate=True)(r)
    chord, twist, sweep, tc, m = (f(v) for v in (blade.chord, blade.twist, blade.sweep,
                                                  blade.tc, blade.camber))
    x_tip = (r - blade.r[-1]) / (blade.R - blade.r[-1])            # round the tip off
    chord = chord * np.where(x_tip > 0, np.sqrt(np.clip(1 - 0.85 * x_tip ** 2, 0.05, 1)), 1)
    s = 0.5 * (1 - np.cos(np.linspace(0, np.pi, n_chord)))
    yt = 5 * (0.2969 * np.sqrt(s) - 0.126 * s - 0.3516 * s ** 2 + 0.2843 * s ** 3 - 0.1036 * s ** 4)
    p = 0.4
    yc = np.where(s < p, (2 * p * s - s ** 2) / p ** 2, ((1 - 2 * p) + 2 * p * s - s ** 2) / (1 - p) ** 2)
    S = np.concatenate([s, s[::-1]])                                 # upper then lower
    T = np.concatenate([yt, -yt[::-1]])
    C = np.concatenate([yc, yc[::-1]])
    xi = (S[None, :] - 0.5) * chord[:, None]                         # aft of mid-chord
    eta = (m[:, None] * C[None, :] + tc[:, None] * T[None, :]) * chord[:, None]
    ct, st = np.cos(twist)[:, None], np.sin(twist)[:, None]
    aft = sweep[:, None] + xi * ct + eta * st
    z = -xi * st + eta * ct
    return np.repeat(r[:, None], len(S), 1), -aft, z


def _section(n_chord):
    s = 0.5 * (1 - np.cos(np.linspace(0, np.pi, n_chord)))
    yt = 5 * (0.2969 * np.sqrt(s) - 0.126 * s - 0.3516 * s ** 2 + 0.2843 * s ** 3 - 0.1036 * s ** 4)
    p = 0.4
    yc = np.where(s < p, (2 * p * s - s ** 2) / p ** 2, ((1 - 2 * p) + 2 * p * s - s ** 2) / (1 - p) ** 2)
    return (np.concatenate([s, s[::-1]]), np.concatenate([yt, -yt[::-1]]),
            np.concatenate([yc, yc[::-1]]))


def ribbon_surface(rb, n_chord=30):
    """Section loops along a ribbon blade (any 3D path, e.g. a toroidal loop)."""
    g = rb.frames()
    S, T, C = _section(n_chord)
    xi = (S[None, :] - 0.25) * rb.chord[:, None]
    eta = (rb.camber[:, None] * C[None, :] + rb.tc[:, None] * T[None, :]) * rb.chord[:, None]
    X = g["mid"][:, None, :] + xi[..., None] * g["tcv"][:, None, :] + eta[..., None] * g["n"][:, None, :]
    return X[..., 0], X[..., 1], X[..., 2]


def draw_prop(ax, blade, color, elev=90, azim=-90, zoom=1.55):
    ls = LightSource(azdeg=315, altdeg=50)
    rgb = np.array(to_rgb(color))
    X, Y, Z = ribbon_surface(blade) if hasattr(blade, "P") else blade_surface(blade)
    for psi in blade.azimuths:
        c, s = np.cos(psi), np.sin(psi)
        ax.plot_surface((X * c - Y * s) * 1e3, (X * s + Y * c) * 1e3, Z * 1e3, color=rgb,
                        lightsource=ls, shade=True, linewidth=0, antialiased=True,
                        rstride=1, cstride=1)
    th = np.linspace(0, 2 * np.pi, 60)
    rh, h = blade.r_hub * 1.25 * 1e3, 3.5
    zz = np.array([-h, h])[:, None]
    ax.plot_surface(rh * np.cos(th)[None, :] + 0 * zz, rh * np.sin(th)[None, :] + 0 * zz,
                    zz + 0 * th[None, :], color="#8a8983", lightsource=ls, linewidth=0)
    rr = np.linspace(0, rh, 2)[:, None]
    ax.plot_surface(rr * np.cos(th)[None, :], rr * np.sin(th)[None, :], h + 0 * rr * th[None, :],
                    color="#8a8983", lightsource=ls, linewidth=0)
    L = blade.R * 1e3 * 1.02
    ax.set_xlim(-L, L); ax.set_ylim(-L, L); ax.set_zlim(-L * 0.55, L * 0.55)
    ax.set_box_aspect((1, 1, 0.55 if elev < 80 else 1.0), zoom=zoom)
    ax.view_init(elev=elev, azim=azim)
    ax.set_axis_off()


def gallery(path, entries, title):
    """entries: list of (label, blade, lines-of-caption)."""
    n = len(entries)
    fig = plt.figure(figsize=(4.4 * n, 9.4))
    for i, (label, blade, caption) in enumerate(entries):
        c = SERIES[i]
        a1 = fig.add_subplot(2, n, i + 1, projection="3d", computed_zorder=True)
        draw_prop(a1, blade, c, elev=90, azim=-90, zoom=0.9)
        fig.text((i + 0.5) / n, 0.875, label, ha="center", fontsize=14, fontweight="bold")
        a2 = fig.add_subplot(2, n, n + i + 1, projection="3d")
        draw_prop(a2, blade, c, elev=32, azim=-60)
        a2.text2D(0.5, 0.08, "\n".join(caption), transform=a2.transAxes, ha="center",
                  va="top", fontsize=10, color=INK2, linespacing=1.5)
    fig.suptitle(title, x=0.02, ha="left", fontweight="bold", fontsize=14)
    fig.text(0.02, 0.935, "Top row: seen from above (spins counter-clockwise). Bottom row: perspective.",
             color=INK2, fontsize=10)
    fig.subplots_adjust(left=0, right=1, top=0.88, bottom=0.1, wspace=0.0, hspace=-0.2)
    fig.savefig(path, dpi=150)
    plt.close(fig)

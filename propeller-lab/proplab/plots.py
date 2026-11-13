"""Static figures (matplotlib).  One measure per axis, fixed series colours."""
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

SERIES = ["#2a78d6", "#eb6834", "#1baf7a", "#eda100", "#e87ba4", "#008300", "#6250d6"]
INK, INK2, GRID, SURF = "#0b0b0b", "#52514e", "#e4e3df", "#fcfcfb"
plt.rcParams.update({
    "figure.facecolor": SURF, "axes.facecolor": SURF, "savefig.facecolor": SURF,
    "axes.edgecolor": GRID, "axes.labelcolor": INK2, "text.color": INK,
    "xtick.color": INK2, "ytick.color": INK2, "axes.grid": True, "grid.color": GRID,
    "grid.linewidth": 0.8, "axes.spines.top": False, "axes.spines.right": False,
    "font.size": 10, "axes.titlesize": 11, "axes.titleweight": "bold",
    "axes.titlelocation": "left", "legend.frameon": False, "lines.linewidth": 2})


def planform(ax, blade, color, label=None):
    """Top view of one blade: leading and trailing edge vs radius (mm)."""
    r = blade.r * 1e3
    half = 0.5 * blade.chord * np.cos(blade.twist) * 1e3
    mid = -blade.sweep * 1e3
    ax.fill_between(r, mid - half, mid + half, color=color, alpha=0.25, lw=0)
    ax.plot(r, mid + half, color=color, label=label)
    ax.plot(r, mid - half, color=color)
    ax.set_aspect("equal")
    ax.set_xlabel("radius (mm)")
    ax.set_ylabel("chordwise (mm), rotation is up")


def design_sheet(path, entries, title):
    """entries: list of (label, blade, metrics-with-report)."""
    fig, ax = plt.subplots(2, 2, figsize=(12, 8.5))
    for i, (label, blade, m) in enumerate(entries):
        c = SERIES[i]
        planform(ax[0, 0], blade, c, f"{label} ({blade.B} blades)")
        ax[0, 1].plot(blade.r / blade.R, np.degrees(blade.twist), color=c, label=label)
        rep = m["report"]
        ax[1, 0].plot(rep["band_freqs"], rep["band_spl"], color=c, label=label)
        ok = rep["tone_freqs"] <= 20000
        ax[1, 1].plot(rep["tone_freqs"][ok], rep["tone_spl"][ok], color=c, marker="o",
                      ms=4, lw=1, label=label)
    ax[0, 0].set_title("Blade planform (one blade, top view)")
    ax[0, 1].set_title("Pitch angle along the blade")
    ax[0, 1].set_xlabel("r / R"); ax[0, 1].set_ylabel("pitch angle (deg)")
    ax[1, 0].set_title("Broadband noise in hover, 1/3-octave bands")
    ax[1, 1].set_title("Tones in hover (blade-pass harmonics)")
    for a in ax[1]:
        a.set_xscale("log"); a.set_xlabel("frequency (Hz)"); a.set_ylabel("SPL (dB re 20 µPa)")
    for a in ax[1]:
        a.set_ylim(bottom=max(0, a.get_ylim()[0]))
    for a in ax.ravel():
        a.legend(fontsize=8)
    fig.suptitle(title, x=0.01, ha="left", fontweight="bold")
    fig.tight_layout()
    fig.savefig(path, dpi=160)
    plt.close(fig)


def pareto_plot(path, pareto, baselines, picks, title):
    """Noise vs hover power: Pareto front, coloured by blade count, plus baselines."""
    fig, ax = plt.subplots(figsize=(9, 6))
    counts = sorted({p["design"]["B"] for p in pareto})
    for B in counts:
        pts = [p for p in pareto if p["design"]["B"] == B]
        ax.scatter([p["hover_power"] for p in pts], [p["dBA"] for p in pts], s=42,
                   color=SERIES[(B - 2) % len(SERIES)], edgecolor=SURF, lw=1,
                   label=f"optimised, {B} blades", zorder=3)
    for name, m, ok in baselines:
        ax.scatter(m["hover_power"], m["dBA"], marker="s" if ok else "x", s=60, color=INK2, zorder=4)
        ax.annotate(name + ("" if ok else " ✕"),
                    (m["hover_power"], m["dBA"]), xytext=(6, 5),
                    textcoords="offset points", fontsize=8, color=INK2)
    for label, p in picks:
        ax.annotate(label, (p["hover_power"], p["dBA"]), xytext=(10, -14),
                    textcoords="offset points", fontsize=9, color=INK,
                    arrowprops=dict(arrowstyle="-", color=INK2, lw=0.8))
    ax.scatter([], [], marker="s", color=INK2, label="generic stock shapes (✕ = over current limit or short on thrust)")
    ax.set_xlabel("hover electrical power per motor (W)")
    ax.set_ylabel("hover noise, all rotors (dBA)")
    ax.set_title(title)
    ax.legend(fontsize=8)
    fig.tight_layout()
    fig.savefig(path, dpi=160)
    plt.close(fig)

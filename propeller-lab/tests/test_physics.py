import numpy as np
from scipy.special import jv
from proplab import Air, standard_prop, solve_bemt, MOTORS, hover_point, throttle_point
from proplab.tonal import single_blade_harmonics
from proplab.noise import a_weight, noise_report
from proplab.broadband import strip_self_noise, THIRD_OCT

AIR = Air()


def _ring(fz, ft, r=0.05):
    z = np.zeros(1)
    return dict(r=np.array([r]), psi0=z, z=z, fz=np.array([fz]), ft=np.array([ft]), vol=z)


def test_tonal_matches_gutin_far_field():
    """Point force on a ring vs Gutin's closed form (thrust-only and torque-only)."""
    B, om, r, d = 2, 1500.0, 0.06, 50.0
    M = om * r / AIR.c
    for th in np.radians([30, 60, 90, 120]):
        obs = d * np.array([np.sin(th), 0, np.cos(th)])
        for m in (1, 2, 3):
            n = m * B
            k = n * om / (2 * np.sqrt(2) * np.pi * AIR.c * d) * jv(n, n * M * np.sin(th))
            PL, _ = single_blade_harmonics(_ring(1.0, 0.0, r), om, obs, [n], AIR, n_t=256)
            ref = abs(k * 1.0 * np.cos(th))
            if ref > 1e-12:
                assert abs(np.sqrt(2) * abs(PL[0]) - ref) / ref < 0.02
            PL, _ = single_blade_harmonics(_ring(0.0, 1.0, r), om, obs, [n], AIR, n_t=256)
            ref = abs(k * AIR.c / (om * r))          # Q c / (Omega r^2) with Q = ft r
            assert abs(np.sqrt(2) * abs(PL[0]) - ref) / ref < 0.02


def test_hover_obeys_momentum_theory():
    for name, B in [("5040", 2), ("5040", 3), ("7x4", 2)]:
        b = standard_prop(name, B)
        s = solve_bemt(b, 15000)
        assert s.converged.all() and s.thrust > 0
        assert 0.3 < s.figure_of_merit(b.R) < 0.85      # never beats the ideal


def test_thrust_scales_with_rpm_squared():
    b = standard_prop("5040", 3)
    t1, t2 = solve_bemt(b, 10000).thrust, solve_bemt(b, 20000).thrust
    assert 3.6 < t2 / t1 < 4.6


def test_motor_equilibrium_balances_torque():
    m, b = MOTORS["2207-1950kv-6S"], standard_prop("5040", 3)
    p = throttle_point(m, b, 0.6)
    assert abs(m.torque(p["volts"], p["rpm"]) - p["torque"]) < 1e-3 * p["torque"] + 1e-6
    h = hover_point(m, b, 1.6)
    assert abs(h["thrust"] - 1.6) < 0.01 and 0 < h["motor_eff"] < 1


def test_a_weighting():
    assert abs(a_weight(1000.0)) < 0.05
    assert abs(a_weight(100.0) + 19.1) < 0.3


def test_bpm_velocity_scaling_and_noise_trend():
    lv = lambda U: 10 * np.log10(sum(v.sum() for v in strip_self_noise(
        THIRD_OCT, [0.02], [0.01], [U], [4.0], AIR, tripped=True).values()))
    slope = (lv(80) - lv(40)) / np.log10(2) / 10     # ~U^5 for trailing-edge noise
    assert 3.5 < slope < 6.0
    b = standard_prop("5040", 3)
    quiet = noise_report(b, solve_bemt(b, 8000))["dBA"]
    loud = noise_report(b, solve_bemt(b, 16000))["dBA"]
    assert loud > quiet + 8

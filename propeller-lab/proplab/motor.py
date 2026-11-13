"""Three-constant brushless motor model (Kv, winding resistance, no-load current)
plus battery/ESC, matched against the propeller's torque curve.

`R_sys` lumps ESC, wiring and battery sag.  With four motors pulling on one
pack the sag each motor sees is roughly four times the pack resistance, which
is why loaded full-throttle RPM sits well below Kv * V."""
from dataclasses import dataclass
import numpy as np
from scipy.optimize import brentq
from .bemt import solve_bemt, trim_rpm_for_thrust, max_rpm
from .atmosphere import Air


@dataclass(frozen=True)
class Motor:
    name: str
    kv: float            # rpm per volt
    R: float             # winding resistance, ohm (phase-to-phase equivalent)
    I0: float            # no-load current, A
    I_max: float         # continuous/burst current limit, A
    V_batt: float        # nominal pack voltage under load, V
    R_sys: float = 0.09  # ESC + wiring + this motor's share of battery sag, ohm

    @property
    def kt(self):        # N m per A
        return 30 / (np.pi * self.kv)

    def current(self, V, rpm):
        return (V - rpm / self.kv) / (self.R + self.R_sys)

    def torque(self, V, rpm):
        return self.kt * (self.current(V, rpm) - self.I0)


MOTORS = {
    # Representative values; replace with your motor's datasheet numbers.
    "2207-1950kv-6S": Motor("2207 1950KV on 6S", 1950, 0.065, 1.2, 45, 24.0),
    "2306-2450kv-4S": Motor("2306 2450KV on 4S", 2450, 0.050, 1.6, 42, 16.0),
    "2004-1700kv-6S": Motor("2004 1700KV on 6S", 1700, 0.160, 0.5, 18, 24.0),
    "1404-3800kv-4S": Motor("1404 3800KV on 4S", 3800, 0.120, 0.6, 16, 16.0),
}


def _point(motor, blade, sol, V):
    I = sol.torque / motor.kt + motor.I0
    p_el = V * I
    return dict(rpm=sol.rpm, thrust=sol.thrust, torque=sol.torque,
                shaft_power=sol.power, current=I, volts=V,
                throttle=V / motor.V_batt, elec_power=p_el,
                motor_eff=sol.power / p_el if p_el > 0 else 0.0,
                g_per_W=sol.thrust / 9.80665 * 1000 / p_el if p_el > 0 else 0.0,
                tip_mach=sol.omega * blade.R / sol.air.c, sol=sol)


def throttle_point(motor, blade, throttle=1.0, v_inf=0.0, air=Air()):
    """Equilibrium where motor torque equals prop torque at a given throttle."""
    V = throttle * motor.V_batt
    f = lambda rpm: motor.torque(V, rpm) - solve_bemt(blade, rpm, v_inf, air).torque
    hi = min(V * motor.kv, max_rpm(blade, air, 0.95))
    rpm = hi if f(hi) > 0 else brentq(f, 200.0, hi, xtol=0.5)
    return _point(motor, blade, solve_bemt(blade, rpm, v_inf, air), V)


def hover_point(motor, blade, thrust, v_inf=0.0, air=Air()):
    """Operating point holding a required thrust; None if out of reach."""
    rpm = trim_rpm_for_thrust(blade, thrust, v_inf, air)
    if rpm is None:
        return None
    sol = solve_bemt(blade, rpm, v_inf, air)
    I = sol.torque / motor.kt + motor.I0
    V = I * (motor.R + motor.R_sys) + rpm / motor.kv
    return _point(motor, blade, sol, V)

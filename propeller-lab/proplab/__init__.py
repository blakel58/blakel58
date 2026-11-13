"""proplab: small-drone propeller performance + noise simulation and optimisation."""
from .atmosphere import Air
from .geometry import Blade, standard_prop, parse_prop_name
from .bemt import solve_bemt, trim_rpm_for_thrust
from .motor import Motor, MOTORS, hover_point, throttle_point
from .noise import noise_report, default_observers

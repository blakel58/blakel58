from dataclasses import dataclass


@dataclass(frozen=True)
class Air:
    """Sea-level ISA by default."""
    rho: float = 1.225        # kg/m^3
    mu: float = 1.81e-5       # Pa s
    c: float = 340.3          # speed of sound, m/s

    @property
    def nu(self):
        return self.mu / self.rho

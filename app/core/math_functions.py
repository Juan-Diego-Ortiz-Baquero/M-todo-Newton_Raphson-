"""
Mathematical functions for the Newton-Raphson solver.

Defines f(x) = x^5 - 3x^4 + 10x - 8 and its first and second derivatives,
along with static metadata used by the API info endpoint.
"""

# ---------------------------------------------------------------------------
# Function and derivatives
# ---------------------------------------------------------------------------

def f(x):
    """f(x) = x^5 - 3x^4 + 10x - 8"""
    return x**5 - 3*x**4 + 10*x - 8


def df(x):
    """f'(x) = 5x^4 - 12x^3 + 10"""
    return 5*x**4 - 12*x**3 + 10


def d2f(x):
    """f''(x) = 20x^3 - 36x^2"""
    return 20*x**3 - 36*x**2


# ---------------------------------------------------------------------------
# Static metadata (used by /api/funcion/info)
# ---------------------------------------------------------------------------

FUNCTION_METADATA = {
    'funcion':           'f(x) = x⁵ - 3x⁴ + 10x - 8',
    'derivada':          "f'(x) = 5x⁴ - 12x³ + 10",
    'segunda_derivada':  "f''(x) = 20x³ - 36x²",
    'formula_newton':    "x_{n+1} = x_n - f(x_n) / f'(x_n)",
    'raices_aproximadas': [
        {'valor': 0.8, 'descripcion': 'Raíz real principal'},
        {'valor': 2.9, 'descripcion': 'Segunda raíz real'},
    ],
}

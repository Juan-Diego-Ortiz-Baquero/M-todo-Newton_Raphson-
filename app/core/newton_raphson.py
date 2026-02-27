"""
Newton-Raphson numerical method implementation.

Separates the computation of a single iteration from the top-level solver loop
to keep each function focused on a single responsibility.
"""

from .math_functions import f, df

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------

DEFAULT_TOLERANCE = 1e-15
DEFAULT_MAX_ITERATIONS = 100
_ZERO_THRESHOLD = 1e-15   # Guard against division by near-zero derivative


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _compute_iteration(x_current, iteration_number):
    """
    Evaluates one Newton-Raphson step.

    Returns:
        dict with iteration data, or None if the derivative is zero
        (which would cause division by zero).
    """
    fx  = f(x_current)
    dfx = df(x_current)

    if abs(dfx) < _ZERO_THRESHOLD:
        return None

    x_next = x_current - fx / dfx

    abs_error = abs(x_next - x_current)
    pct_error = (
        (abs_error / abs(x_next)) * 100
        if abs(x_next) > _ZERO_THRESHOLD
        else 0.0
    )

    return {
        'iteracion':      iteration_number,
        'xi':             round(x_current, 15),
        'fx':             round(fx, 15),
        'dfx':            round(dfx, 15),
        'xi_siguiente':   round(x_next, 15),
        'error_absoluto': abs_error,
        'error_porcentual': pct_error,
    }


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def solve(x0, tolerance=DEFAULT_TOLERANCE, max_iterations=DEFAULT_MAX_ITERATIONS):
    """
    Runs the Newton-Raphson method starting from *x0*.

    Args:
        x0:             Initial guess.
        tolerance:      Convergence criterion — stops when |x_{n+1} - x_n| < tolerance.
        max_iterations: Safety cap on the number of iterations.

    Returns:
        dict with keys:
            convergio          – bool, whether convergence was achieved
            raiz               – float, root approximation
            total_iteraciones  – int
            iteraciones        – list of per-iteration dicts
            valor_inicial      – float, the supplied x0
            tolerancia         – float, the supplied tolerance
    """
    iterations = []
    x_current  = x0
    converged  = False
    root       = None

    for i in range(max_iterations):
        record = _compute_iteration(x_current, i + 1)

        if record is None:
            break

        iterations.append(record)

        if record['error_absoluto'] < tolerance:
            converged = True
            root = record['xi_siguiente']
            break

        x_current = record['xi_siguiente']

    if root is None and iterations:
        root = iterations[-1]['xi_siguiente']

    return {
        'convergio':         converged,
        'raiz':              root,
        'total_iteraciones': len(iterations),
        'iteraciones':       iterations,
        'valor_inicial':     x0,
        'tolerancia':        tolerance,
    }

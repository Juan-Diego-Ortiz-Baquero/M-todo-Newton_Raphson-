"""
Service layer for generating chart data sent to the frontend.

Keeps data-shaping logic out of the route handlers and core algorithm.
"""

import numpy as np
from ..core.math_functions import f


def get_function_plot_data(x_min: float = -3.0, x_max: float = 3.0, num_points: int = 500) -> dict:
    """
    Generates x/y arrays for plotting f(x) over [x_min, x_max].

    Returns:
        {'x': list[float], 'y': list[float]}
    """
    x_values = np.linspace(x_min, x_max, num_points)
    y_values  = [f(x) for x in x_values]
    return {'x': x_values.tolist(), 'y': y_values}


def get_convergence_plot_data(iterations: list) -> dict:
    """
    Extracts per-iteration xi and error values for the convergence chart.

    Args:
        iterations: List of iteration dicts produced by newton_raphson.solve().

    Returns:
        dict with lists: iteraciones, xi, xi_siguiente, errores.
    """
    if not iterations:
        return {'iteraciones': [], 'xi': [], 'xi_siguiente': [], 'errores': []}

    return {
        'iteraciones':  [it['iteracion']    for it in iterations],
        'xi':           [it['xi']           for it in iterations],
        'xi_siguiente': [it['xi_siguiente'] for it in iterations],
        'errores':      [it['error_absoluto'] for it in iterations],
    }

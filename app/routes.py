"""
HTTP routes and REST API endpoints for the Newton-Raphson application.

All business logic is delegated to the core and services layers; routes are
responsible only for request parsing, response building, and error handling.
"""

from flask import Blueprint, render_template, jsonify, request

from .core import math_functions, newton_raphson
from .services import chart_service

main_bp = Blueprint('main', __name__)


# ---------------------------------------------------------------------------
# Page route
# ---------------------------------------------------------------------------

@main_bp.route('/')
def index():
    """Serves the single-page application shell."""
    return render_template('index.html')


# ---------------------------------------------------------------------------
# API routes
# ---------------------------------------------------------------------------

@main_bp.route('/api/calcular', methods=['POST'])
def calcular():
    """
    Executes the Newton-Raphson method and returns results with chart data.

    Request body (JSON):
        x0         – float, required  — initial guess
        tolerancia – float, optional  — convergence tolerance (default: 1e-15)

    Response (JSON):
        success              – bool
        resultado            – solver output dict
        grafica_funcion      – {x, y} arrays for the function plot
        grafica_convergencia – per-iteration convergence data
    """
    try:
        data = request.get_json()

        if not data or 'x0' not in data:
            return jsonify({'success': False, 'error': 'Se requiere el valor inicial x0'}), 400

        x0        = float(data['x0'])
        tolerance = float(data.get('tolerancia', newton_raphson.DEFAULT_TOLERANCE))

        result             = newton_raphson.solve(x0, tolerance)
        function_chart     = chart_service.get_function_plot_data()
        convergence_chart  = chart_service.get_convergence_plot_data(result['iteraciones'])

        return jsonify({
            'success':             True,
            'resultado':           result,
            'grafica_funcion':     function_chart,
            'grafica_convergencia': convergence_chart,
        })

    except ValueError as exc:
        return jsonify({'success': False, 'error': f'Valor numérico inválido: {exc}'}), 400
    except Exception as exc:
        return jsonify({'success': False, 'error': f'Error interno: {exc}'}), 500


@main_bp.route('/api/funcion/info', methods=['GET'])
def funcion_info():
    """Returns static metadata about the mathematical function being solved."""
    return jsonify(math_functions.FUNCTION_METADATA)


@main_bp.route('/api/verificar', methods=['POST'])
def verificar():
    """
    Evaluates f(x) and f'(x) at a given point.

    Request body (JSON):
        x – float, the evaluation point (default: 0)
    """
    try:
        data = request.get_json()
        x    = float(data.get('x', 0))

        return jsonify({
            'success': True,
            'x':       x,
            'f(x)':    math_functions.f(x),
            "f'(x)":   math_functions.df(x),
        })

    except Exception as exc:
        return jsonify({'success': False, 'error': str(exc)}), 400

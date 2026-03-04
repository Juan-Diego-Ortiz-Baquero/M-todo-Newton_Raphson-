"""
Backend Flask para el Método de Newton-Raphson
Aplicación interactiva para resolver f(x) = x^5 - 3x^4 + 10x - 8 = 0
"""

from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import numpy as np
import math

app = Flask(__name__)
CORS(app)

# ============================================================================
# DEFINICIÓN DE LA FUNCIÓN Y SU DERIVADA
# ============================================================================

def f(x):
    """
    Función: f(x) = x^5 - 3x^4 + 10x - 8
    """
    return x**5 - 3*x**4 + 10*x - 8


def df(x):
    """
    Derivada: f'(x) = 5x^4 - 12x^3 + 10
    """
    return 5*x**4 - 12*x**3 + 10


def d2f(x):
    """
    Segunda derivada: f''(x) = 20x^3 - 36x^2
    """
    return 20*x**3 - 36*x**2


# ============================================================================
# MÉTODO DE NEWTON-RAPHSON
# ============================================================================

def newton_raphson(x0, tolerancia=1e-15, max_iteraciones=100):
    """
    Implementación del método de Newton-Raphson
    
    Args:
        x0: Valor inicial
        tolerancia: Tolerancia para convergencia (default: 1e-15)
        max_iteraciones: Máximo de iteraciones (default: 100)
    
    Returns:
        dict: Resultados completos del método
    """
    iteraciones = []
    x_actual = x0
    convergio = False
    raiz = None
    
    for i in range(max_iteraciones):
        # Calcular valores
        fx = f(x_actual)
        dfx = df(x_actual)
        
        # Verificar división por cero
        if abs(dfx) < 1e-15:
            break
        
        # Calcular siguiente iteración
        x_siguiente = x_actual - fx / dfx
        
        # Calcular errores
        error_absoluto = abs(x_siguiente - x_actual)
        if abs(x_siguiente) > 1e-15:
            error_porcentual = (error_absoluto / abs(x_siguiente)) * 100
        else:
            error_porcentual = 0
        
        # Guardar iteración
        iteracion = {
            'iteracion': i + 1,
            'xi': round(x_actual, 15),
            'fx': round(fx, 15),
            'dfx': round(dfx, 15),
            'xi_siguiente': round(x_siguiente, 15),
            'error_absoluto': error_absoluto,
            'error_porcentual': error_porcentual
        }
        iteraciones.append(iteracion)
        
        # Verificar convergencia
        if error_absoluto < tolerancia:
            convergio = True
            raiz = x_siguiente
            break
        
        x_actual = x_siguiente
    
    # Si no convergió, usar el último valor
    if raiz is None and iteraciones:
        raiz = iteraciones[-1]['xi_siguiente']
    
    return {
        'convergio': convergio,
        'raiz': raiz,
        'total_iteraciones': len(iteraciones),
        'iteraciones': iteraciones,
        'valor_inicial': x0,
        'tolerancia': tolerancia
    }


# ============================================================================
# GENERAR DATOS PARA GRÁFICA
# ============================================================================

def generar_datos_grafica(x_min=-3, x_max=3, puntos=500):
    """
    Genera puntos para graficar la función
    """
    x_vals = np.linspace(x_min, x_max, puntos)
    y_vals = [f(x) for x in x_vals]
    
    return {
        'x': x_vals.tolist(),
        'y': y_vals
    }


def generar_datos_convergencia(iteraciones):
    """
    Genera datos para la gráfica de convergencia
    """
    if not iteraciones:
        return {'iteraciones': [], 'xi': [], 'errores': []}
    
    return {
        'iteraciones': [it['iteracion'] for it in iteraciones],
        'xi': [it['xi'] for it in iteraciones],
        'xi_siguiente': [it['xi_siguiente'] for it in iteraciones],
        'errores': [it['error_absoluto'] for it in iteraciones]
    }


# ============================================================================
# RUTAS DE LA API
# ============================================================================

@app.route('/')
def index():
    """Página principal"""
    return render_template('index.html')


@app.route('/api/calcular', methods=['POST'])
def calcular():
    """
    API endpoint para calcular Newton-Raphson
    
    Body JSON:
        - x0: valor inicial (float)
        - tolerancia: opcional (float, default: 1e-15)
    
    Returns:
        JSON con resultados completos
    """
    try:
        data = request.get_json()
        
        if not data or 'x0' not in data:
            return jsonify({
                'success': False,
                'error': 'Se requiere el valor inicial x0'
            }), 400
        
        x0 = float(data['x0'])
        tolerancia = float(data.get('tolerancia', 1e-15))
        
        # Ejecutar método
        resultado = newton_raphson(x0, tolerancia)
        
        # Generar datos para gráficas
        datos_funcion = generar_datos_grafica()
        datos_convergencia = generar_datos_convergencia(resultado['iteraciones'])
        
        return jsonify({
            'success': True,
            'resultado': resultado,
            'grafica_funcion': datos_funcion,
            'grafica_convergencia': datos_convergencia
        })
        
    except ValueError as e:
        return jsonify({
            'success': False,
            'error': f'Valor numérico inválido: {str(e)}'
        }), 400
    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Error interno: {str(e)}'
        }), 500


@app.route('/api/funcion/info', methods=['GET'])
def info_funcion():
    """
    Retorna información sobre la función
    """
    return jsonify({
        'funcion': 'f(x) = x⁵ - 3x⁴ + 10x - 8',
        'derivada': "f'(x) = 5x⁴ - 12x³ + 10",
        'segunda_derivada': "f''(x) = 20x³ - 36x²",
        'formula_newton': 'x_{n+1} = x_n - f(x_n) / f\'(x_n)',
        'raices_aproximadas': [
            {'valor': 0.8, 'descripcion': 'Raíz real principal'},
            {'valor': 2.9, 'descripcion': 'Segunda raíz real'}
        ]
    })


@app.route('/api/verificar', methods=['POST'])
def verificar():
    """
    Verifica un valor en la función
    """
    try:
        data = request.get_json()
        x = float(data.get('x', 0))
        
        return jsonify({
            'success': True,
            'x': x,
            'f(x)': f(x),
            "f'(x)": df(x)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400


# ============================================================================
# MAIN
# ============================================================================

if __name__ == '__main__':
    print("=" * 60)
    print(" Servidor Newton-Raphson iniciado")
    print("=" * 60)
    print(" URL: http://localhost:5000")
    print(" API Endpoints:")
    print("   POST /api/calcular - Calcular Newton-Raphson")
    print("   GET  /api/funcion/info - Info de la función")
    print("   POST /api/verificar - Verificar valor")
    print("=" * 60)
    app.run(debug=True, host='0.0.0.0', port=5000)

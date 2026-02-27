"""
Application entry point.

Exposes `app` at module level so Gunicorn can reference it as `run:app`,
and runs the development server when executed directly.
"""

import os
from app import create_app

app = create_app()

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print("=" * 60)
    print("Newton-Raphson — Servidor iniciado")
    print("=" * 60)
    print(f"  URL : http://localhost:{port}")
    print("  API :")
    print("    POST /api/calcular      — Ejecutar Newton-Raphson")
    print("    GET  /api/funcion/info  — Información de la función")
    print("    POST /api/verificar     — Evaluar f(x) en un punto")
    print("=" * 60)
    app.run(debug=True, host='0.0.0.0', port=port)

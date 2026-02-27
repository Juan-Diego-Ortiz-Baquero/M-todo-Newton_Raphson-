"""
Newton-Raphson App — Flask application factory.
"""

import os
from flask import Flask
from flask_cors import CORS
from .config import Config


def create_app(config_class=Config):
    """Creates and configures the Flask application."""
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    app = Flask(
        __name__,
        template_folder=os.path.join(base_dir, 'templates'),
        static_folder=os.path.join(base_dir, 'static'),
    )
    app.config.from_object(config_class)
    CORS(app)

    from .routes import main_bp
    app.register_blueprint(main_bp)

    return app

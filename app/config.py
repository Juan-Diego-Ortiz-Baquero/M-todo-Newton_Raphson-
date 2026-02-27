"""
Application configuration classes.
"""


class Config:
    """Base configuration."""
    DEBUG = False
    TESTING = False


class DevelopmentConfig(Config):
    """Development configuration with debug mode enabled."""
    DEBUG = True


class ProductionConfig(Config):
    """Production configuration."""
    DEBUG = False

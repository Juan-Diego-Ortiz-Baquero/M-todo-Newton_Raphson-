# 🔢 Newton-Raphson Interactivo

Aplicación web moderna e interactiva para resolver la ecuación **f(x) = x⁵ - 3x⁴ + 10x - 8 = 0** utilizando el método de Newton-Raphson.

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0-green.svg)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.0-cyan.svg)

## ✨ Características

- 🎯 **Cálculo interactivo** con valor inicial personalizable
- 📊 **Visualización gráfica** de la función y convergencia
- 📋 **Tabla detallada** de iteraciones paso a paso
- 🎨 **Diseño moderno** con glassmorphism y gradientes
- 🎬 **Animaciones fluidas** con GSAP
- 📐 **Fórmulas matemáticas** renderizadas con KaTeX
- 📱 **Responsive** para todos los dispositivos

## 🛠️ Stack Tecnológico

### Backend
- **Python 3.8+**
- **Flask** - Framework web ligero
- **Flask-CORS** - Soporte CORS
- **NumPy** - Cálculos numéricos
- **Gunicorn** - Servidor WSGI

### Frontend
- **HTML5** + **TailwindCSS** - Estilos modernos
- **Alpine.js** - Reactividad ligera
- **GSAP** - Animaciones avanzadas
- **Chart.js** - Gráficas interactivas
- **KaTeX** - Renderizado de fórmulas matemáticas
- **Bootstrap Icons** - Iconografía

## 🚀 Instalación y Ejecución

### 1. Clonar o descargar el proyecto

```bash
cd newton-raphson-app
```

### 2. Crear entorno virtual (opcional pero recomendado)

```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate  # Windows
```

### 3. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 4. Ejecutar la aplicación

```bash
python backend.py
```

La aplicación estará disponible en: **http://localhost:5000**

## 📖 Uso

1. **Ingresa un valor inicial** (x₀) en el campo de entrada
   - Valores sugeridos: 0.5, 0.8, 1, 2, 2.9, 3
   
2. **Ajusta la tolerancia** (opcional, default: 1e-15)

3. **Haz clic en "Calcular"** para ejecutar el método

4. **Observa los resultados:**
   - Raíz encontrada
   - Número de iteraciones
   - Error final
   - Gráfica de la función
   - Gráfica de convergencia
   - Tabla detallada de iteraciones

5. **Explora el panel teórico** para ver las fórmulas

## 🔬 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Página principal |
| POST | `/api/calcular` | Ejecutar Newton-Raphson |
| GET | `/api/funcion/info` | Información de la función |
| POST | `/api/verificar` | Verificar valor en la función |

### Ejemplo de uso de la API

```bash
curl -X POST http://localhost:5000/api/calcular \
  -H "Content-Type: application/json" \
  -d '{"x0": 0.5, "tolerancia": 1e-15}'
```

## 📁 Estructura del Proyecto

```
newton-raphson-app/
├── backend.py              # Servidor Flask y lógica del método
├── requirements.txt        # Dependencias Python
├── Procfile               # Configuración para despliegue
├── README.md              # Este archivo
├── templates/
│   └── index.html         # Template principal
└── static/
    ├── css/
    │   └── style.css      # Estilos personalizados
    └── js/
        └── app.js         # Lógica frontend (Alpine.js)
```

## 🎨 Capturas de Pantalla

La aplicación incluye:
- **Panel de control** intuitivo con inputs y botones
- **Tarjetas de resultados** con animaciones
- **Gráfica de la función** f(x) con la raíz marcada
- **Gráfica de convergencia** mostrando la evolución de xᵢ
- **Tabla detallada** con todas las iteraciones
- **Panel teórico** con fórmulas matemáticas

## 🧮 El Método de Newton-Raphson

El método utiliza la fórmula iterativa:

```
x_{n+1} = x_n - f(x_n) / f'(x_n)
```

Para nuestra función:
- **f(x) = x⁵ - 3x⁴ + 10x - 8**
- **f'(x) = 5x⁴ - 12x³ + 10**

El algoritmo iterará hasta que el error absoluto sea menor que la tolerancia especificada (default: 10⁻¹⁵).

## 📚 Referencias

- [Método de Newton-Raphson - Wikipedia](https://es.wikipedia.org/wiki/M%C3%A9todo_de_Newton)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Alpine.js Documentation](https://alpinejs.dev/)
- [TailwindCSS Documentation](https://tailwindcss.com/)

## 👨‍💻 Autor

Desarrollado como proyecto educativo para la enseñanza de métodos numéricos.

## 📄 Licencia

MIT License - Libre para uso educativo y personal.

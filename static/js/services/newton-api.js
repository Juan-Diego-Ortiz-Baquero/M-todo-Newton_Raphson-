/**
 * API service layer — centralises all fetch calls to the Flask backend.
 *
 * Functions return the parsed JSON response directly so callers only need to
 * handle application-level errors (data.success === false).
 */
window.NewtonAPI = (() => {
    /**
     * Fetches static metadata about the mathematical function.
     * @returns {Promise<object>}
     */
    async function fetchFunctionInfo() {
        const response = await fetch('/api/funcion/info');
        return response.json();
    }

    /**
     * Sends x0 and tolerance to the backend and returns the full
     * Newton-Raphson result including chart data.
     *
     * @param {number} x0        - Initial guess
     * @param {number} tolerance - Convergence tolerance
     * @returns {Promise<object>}
     */
    async function calculateNewtonRaphson(x0, tolerance) {
        const response = await fetch('/api/calcular', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({ x0, tolerancia: tolerance }),
        });
        return response.json();
    }

    return { fetchFunctionInfo, calculateNewtonRaphson };
})();

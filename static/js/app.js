/**
 * Newton-Raphson App — Alpine.js main component (application coordinator).
 *
 * Responsibilities:
 *   - Owns all reactive UI state (inputs, loading flag, results, error).
 *   - Coordinates the calculation lifecycle: API call → chart render → animation.
 *   - Delegates every non-trivial concern to the specialist modules below.
 *
 * Dependencies (must be loaded before Alpine initialises):
 *   - NewtonFormatters   (utils/formatters.js)
 *   - NewtonAPI          (services/newton-api.js)
 *   - initParticles      (ui/particles.js)
 *   - NewtonAnimations   (ui/animations.js)
 *   - renderMathFormulas (ui/math-formulas.js)
 *   - NewtonCharts       (charts/chart-builder.js)  ← also sets Chart.defaults
 */

// ---------------------------------------------------------------------------
// Alpine.js component definition
// ---------------------------------------------------------------------------
document.addEventListener('alpine:init', () => {
    Alpine.data('newtonApp', () => ({
        // ── State ───────────────────────────────────────────────────────────
        x0:         '',
        tolerancia: 1e-15,
        loading:    false,
        resultado:  null,
        error:      null,
        showTheory: false,

        // Private chart references (prefixed with _ to signal internal use)
        _chartFuncion:        null,
        _chartConvergencia:   null,
        _chartFunctionGlobal: null,

        // ── Lifecycle ───────────────────────────────────────────────────────

        initApp() {
            initParticles();
            NewtonAnimations.initPageAnimations();
            renderMathFormulas();
            NewtonAPI.fetchFunctionInfo().catch(err => console.error('Info load failed:', err));
        },

        // ── Calculation ─────────────────────────────────────────────────────

        async calcular() {
            if (!this.x0 && this.x0 !== 0) {
                this.error = 'Por favor ingresa un valor inicial x₀';
                return;
            }

            this.loading   = true;
            this.error     = null;
            this.resultado = null;
            this._destroyCharts();

            try {
                const data = await NewtonAPI.calculateNewtonRaphson(
                    parseFloat(this.x0),
                    parseFloat(this.tolerancia) || 1e-15
                );

                if (!data.success) {
                    this.error = data.error || 'Error en el cálculo';
                    return;
                }

                this.resultado = data.resultado;

                this.$nextTick(() => {
                    const ctxFn     = document.getElementById('chartFuncion');
                    const ctxConv   = document.getElementById('chartConvergencia');
                    const ctxGlobal = document.getElementById('chartFunctionGlobal');

                    if (ctxFn)     this._chartFuncion        = NewtonCharts.buildFunctionChart(ctxFn, data.grafica_funcion, this.resultado.raiz);
                    if (ctxConv)   this._chartConvergencia   = NewtonCharts.buildConvergenceChart(ctxConv, data.grafica_convergencia);
                    // Build the global chart purely client-side — no extra API call needed
                    if (ctxGlobal) this._chartFunctionGlobal = NewtonCharts.buildGlobalFunctionChart(ctxGlobal, this.resultado.raiz);

                    NewtonAnimations.animateResults();
                });

            } catch (err) {
                this.error = 'Error de conexión: ' + err.message;
            } finally {
                this.loading = false;
            }
        },

        // ── Theory panel ─────────────────────────────────────────────────────

        toggleTheory() {
            this.showTheory = !this.showTheory;
            if (this.showTheory) setTimeout(renderMathFormulas, 100);
        },

        // ── Reset ─────────────────────────────────────────────────────────────

        reset() {
            this.x0         = '';
            this.tolerancia = 1e-15;
            this.resultado  = null;
            this.error      = null;
            this.showTheory = false;
            this._destroyCharts();
            NewtonAnimations.pulseControlPanel();
        },

        // ── Private helpers ──────────────────────────────────────────────────

        _destroyCharts() {
            if (this._chartFuncion)        { this._chartFuncion.destroy();        this._chartFuncion        = null; }
            if (this._chartConvergencia)   { this._chartConvergencia.destroy();   this._chartConvergencia   = null; }
            if (this._chartFunctionGlobal) { this._chartFunctionGlobal.destroy(); this._chartFunctionGlobal = null; }
        },

        // ── Format delegates (keep Alpine template bindings working) ──────────

        formatNumber(num, decimals = 6) {
            return NewtonFormatters.formatNumber(num, decimals);
        },

        formatoCientifico(num) {
            return NewtonFormatters.formatScientific(num);
        },
    }));
});


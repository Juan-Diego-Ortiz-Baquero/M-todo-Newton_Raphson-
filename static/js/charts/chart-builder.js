/**
 * Chart.js factory functions â€” builds the function plot, convergence chart,
 * and the full-range global function view.
 *
 * Also applies global Chart.js defaults so every chart inherits the
 * dark-theme base configuration automatically.
 *
 * All three builders return a Chart instance that the Alpine component stores
 * so it can destroy the chart cleanly before creating a new one.
 */

// â”€â”€ Global Chart.js dark-theme defaults â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
Chart.defaults.color       = 'rgba(255, 255, 255, 0.70)';
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.07)';
Chart.defaults.font.family = 'Inter, -apple-system, sans-serif';
Chart.defaults.font.size   = 12;

window.NewtonCharts = (() => {

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Shared design tokens â€” match the CSS custom properties in style.css
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    const THEME = {
        grid:          'rgba(255, 255, 255, 0.055)',
        tick:          'rgba(255, 255, 255, 0.45)',
        legend:        'rgba(255, 255, 255, 0.68)',
        tooltipBg:     'rgba(6, 11, 20, 0.96)',
        tooltipBorder: 'rgba(255, 255, 255, 0.10)',

        // Palette (mirrors CSS --c-* tokens)
        primary:  'rgba(14,  165, 233, 1)',
        primaryA: 'rgba(14,  165, 233, 0.12)',
        accent:   'rgba(139, 92,  246, 1)',
        accentA:  'rgba(139, 92,  246, 0.12)',
        emerald:  'rgba(16,  185, 129, 1)',
        emeraldA: 'rgba(16,  185, 129, 0.10)',
        amber:    'rgba(245, 158, 11,  1)',
        white30:  'rgba(255, 255, 255, 0.28)',
    };

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // Helpers
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    /**
     * Creates a vertical linear gradient fill for a chart dataset.
     * Falls back to a solid colour string if the canvas context is unavailable.
     *
     * @param {CanvasRenderingContext2D} ctx       - 2D canvas context
     * @param {string}                  colorTop   - CSS colour at the top (y=0)
     * @param {string}                  colorBottom- CSS colour at the bottom
     * @param {number}                  [height=300]
     * @returns {CanvasGradient|string}
     */
    function _verticalGradient(ctx, colorTop, colorBottom, height = 300) {
        try {
            const gradient = ctx.createLinearGradient(0, 0, 0, height);
            gradient.addColorStop(0, colorTop);
            gradient.addColorStop(1, colorBottom);
            return gradient;
        } catch {
            return colorTop;
        }
    }

    /** Returns a reusable dark-theme scale configuration object. */
    function _scaleOptions(title = null, titleColor = null, tickExtra = {}) {
        return {
            grid:  { color: THEME.grid, drawBorder: false },
            ticks: { color: THEME.tick, padding: 6, ...tickExtra },
            ...(title ? { title: { display: true, text: title, color: titleColor, font: { size: 11, weight: '500' } } } : {}),
        };
    }

    /** Returns a reusable dark-theme tooltip configuration object. */
    function _tooltipOptions(extraCallbacks = {}) {
        return {
            backgroundColor: THEME.tooltipBg,
            titleColor:      'rgba(255, 255, 255, 0.92)',
            bodyColor:       'rgba(255, 255, 255, 0.68)',
            borderColor:     THEME.tooltipBorder,
            borderWidth:     1,
            padding:         12,
            cornerRadius:    8,
            displayColors:   true,
            boxWidth:        10,
            boxHeight:       10,
            callbacks:       extraCallbacks,
        };
    }

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // 1. Zoom / detail function chart (backend-supplied range)
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    /**
     * Builds the zoomed f(x) line chart around the root using backend data.
     *
     * @param {HTMLCanvasElement} ctx      - Canvas element
     * @param {object}            plotData - { x: number[], y: number[] }
     * @param {number|null}       rootX    - x-coordinate of the found root
     * @returns {Chart}
     */
    function buildFunctionChart(ctx, plotData, rootX) {
        const canvasCtx = ctx.getContext('2d');
        const fillGrad  = _verticalGradient(
            canvasCtx,
            'rgba(14, 165, 233, 0.22)',
            'rgba(14, 165, 233, 0.00)',
            320
        );

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: plotData.x.map(x => x.toFixed(3)),
                datasets: [
                    {
                        label:            'f(x)',
                        data:             plotData.y,
                        borderColor:      THEME.primary,
                        backgroundColor:  fillGrad,
                        borderWidth:      2,
                        fill:             true,
                        tension:          0.38,
                        pointRadius:      0,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: THEME.primary,
                    },
                    {
                        label:           'y = 0',
                        data:            plotData.x.map(() => 0),
                        borderColor:     THEME.white30,
                        borderWidth:     1,
                        borderDash:      [5, 4],
                        pointRadius:     0,
                        fill:            false,
                        tension:         0,
                    },
                ],
            },
            options: {
                responsive:          true,
                maintainAspectRatio: false,
                interaction:         { intersect: false, mode: 'index' },
                plugins: {
                    legend: {
                        labels: {
                            color: THEME.legend,
                            font: { family: 'Inter' },
                            filter: item => item.text !== 'y = 0',
                        },
                    },
                    tooltip: _tooltipOptions({
                        label: ctx => `f(${parseFloat(ctx.label).toFixed(4)}) = ${ctx.parsed.y.toFixed(8)}`,
                    }),
                },
                scales: {
                    x: _scaleOptions('x', 'rgba(255,255,255,0.45)', { maxTicksLimit: 8 }),
                    y: _scaleOptions('f(x)', 'rgba(255,255,255,0.45)'),
                },
                animation: { duration: 1200, easing: 'easeInOutQuart' },
            },
        });

        // Overlay root marker
        if (rootX !== undefined && rootX !== null) {
            const fx = Math.pow(rootX, 5) - 3 * Math.pow(rootX, 4) + 10 * rootX - 8;
            chart.data.datasets.push({
                label:            'RaÃ­z x* = ' + rootX.toFixed(6),
                data:             plotData.x.map(x => Math.abs(x - rootX) < 0.06 ? fx : null),
                borderColor:      THEME.emerald,
                backgroundColor:  THEME.emerald,
                pointRadius:      9,
                pointHoverRadius: 12,
                pointStyle:       'circle',
                showLine:         false,
            });
            chart.update();
        }

        return chart;
    }

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // 2. Convergence chart (xáµ¢ vs logâ‚â‚€ error, dual axis)
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    /**
     * Builds the dual-axis convergence chart.
     *
     * Left axis  â†’ xáµ¢ value per iteration (violet line)
     * Right axis â†’ logâ‚â‚€(error) per iteration (emerald dashed line)
     *
     * @param {HTMLCanvasElement} ctx      - Canvas element
     * @param {object}            convData - { iteraciones, xi, errores }
     * @returns {Chart}
     */
    function buildConvergenceChart(ctx, convData) {
        const canvasCtx  = ctx.getContext('2d');
        const accentFill = _verticalGradient(canvasCtx, 'rgba(139,92,246,0.22)', 'rgba(139,92,246,0.00)', 320);

        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: convData.iteraciones.map(i => 'n=' + i),
                datasets: [
                    {
                        label:                'xáµ¢',
                        data:                 convData.xi,
                        borderColor:          THEME.accent,
                        backgroundColor:      accentFill,
                        borderWidth:          2,
                        fill:                 true,
                        tension:              0.3,
                        pointRadius:          4,
                        pointHoverRadius:     7,
                        pointBackgroundColor: THEME.accent,
                        pointBorderColor:     'rgba(139,92,246,0.3)',
                        pointBorderWidth:     3,
                    },
                    {
                        label:           'logâ‚â‚€(error)',
                        data:            convData.errores.map(e => e > 0 ? Math.log10(e) : null),
                        borderColor:     THEME.emerald,
                        backgroundColor: 'transparent',
                        borderWidth:     2,
                        borderDash:      [5, 4],
                        fill:            false,
                        tension:         0.3,
                        pointRadius:     3,
                        pointHoverRadius: 6,
                        pointBackgroundColor: THEME.emerald,
                        yAxisID:         'y1',
                    },
                ],
            },
            options: {
                responsive:          true,
                maintainAspectRatio: false,
                interaction:         { intersect: false, mode: 'index' },
                plugins: {
                    legend:  { labels: { color: THEME.legend, font: { family: 'Inter' } } },
                    tooltip: _tooltipOptions(),
                },
                scales: {
                    x:  _scaleOptions(null, null, { maxTicksLimit: 10 }),
                    y: {
                        position: 'left',
                        ..._scaleOptions('xáµ¢', 'rgba(139,92,246,0.75)'),
                    },
                    y1: {
                        position: 'right',
                        grid:     { drawOnChartArea: false, drawBorder: false },
                        ticks:    { color: 'rgba(16,185,129,0.75)', padding: 6 },
                        title:    { display: true, text: 'logâ‚â‚€(Îµ)', color: 'rgba(16,185,129,0.75)', font: { size: 11, weight: '500' } },
                    },
                },
                animation: { duration: 1200, easing: 'easeInOutQuart' },
            },
        });
    }

    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
    // 3. Global function chart (client-side, wide range)
    // â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

    /**
     * Builds a full-range f(x) chart so the user can see the global behaviour
     * of the function â€” all real roots, extrema, and growth at the bounds.
     *
     * Data is computed client-side over x âˆˆ [âˆ’3, 5] with 300 points;
     * no extra API call needed.
     *
     * Y-values are clamped to Â±80 to keep the root region readable.
     *
     * @param {HTMLCanvasElement} ctx   - Canvas element
     * @param {number|null}       rootX - x-coordinate of the found root
     * @returns {Chart}
     */
    function buildGlobalFunctionChart(ctx, rootX) {
        const STEPS = 300;
        const X_MIN = -3;
        const X_MAX =  5;
        const step  = (X_MAX - X_MIN) / STEPS;

        const xValues  = Array.from({ length: STEPS + 1 }, (_, i) => X_MIN + i * step);
        const yRaw     = xValues.map(x => Math.pow(x,5) - 3*Math.pow(x,4) + 10*x - 8);
        const Y_CLAMP  = 80;
        const yClamped = yRaw.map(y => Math.max(-Y_CLAMP, Math.min(Y_CLAMP, y)));

        const canvasCtx = ctx.getContext('2d');

        // Two-stop fill: positive region tinted blue, negative transparent
        const fillGrad = _verticalGradient(
            canvasCtx,
            'rgba(14, 165, 233, 0.18)',
            'rgba(14, 165, 233, 0.00)',
            300
        );

        const chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: xValues.map(x => x.toFixed(2)),
                datasets: [
                    {
                        label:            'f(x) = xâµ âˆ’ 3xâ´ + 10x âˆ’ 8',
                        data:             yClamped,
                        borderColor:      THEME.primary,
                        backgroundColor:  fillGrad,
                        borderWidth:      2,
                        fill:             true,
                        tension:          0.28,
                        pointRadius:      0,
                        pointHoverRadius: 4,
                    },
                    {
                        label:       'y = 0',
                        data:        xValues.map(() => 0),
                        borderColor: THEME.white30,
                        borderWidth: 1,
                        borderDash:  [6, 4],
                        pointRadius: 0,
                        fill:        false,
                        tension:     0,
                    },
                ],
            },
            options: {
                responsive:          true,
                maintainAspectRatio: false,
                interaction:         { intersect: false, mode: 'index' },
                plugins: {
                    legend: {
                        labels: {
                            color: THEME.legend,
                            font: { family: 'Inter' },
                            filter: item => item.text !== 'y = 0',
                        },
                    },
                    tooltip: _tooltipOptions({
                        label: ctx => {
                            if (ctx.dataset.label === 'y = 0') return null;
                            const rawY = yRaw[ctx.dataIndex];
                            return `f(${xValues[ctx.dataIndex].toFixed(3)}) = ${rawY.toFixed(5)}`;
                        },
                    }),
                },
                scales: {
                    x: _scaleOptions('x', 'rgba(255,255,255,0.45)', { maxTicksLimit: 9 }),
                    y: _scaleOptions('f(x)', 'rgba(255,255,255,0.45)'),
                },
                animation: { duration: 1100, easing: 'easeInOutQuart' },
            },
        });

        // Overlay root marker
        if (rootX !== undefined && rootX !== null) {
            const fx = Math.pow(rootX,5) - 3*Math.pow(rootX,4) + 10*rootX - 8;
            const TOL = step * 1.3;
            chart.data.datasets.push({
                label:            'RaÃ­z x* = ' + rootX.toFixed(6),
                data:             xValues.map(x => Math.abs(x - rootX) < TOL ? fx : null),
                borderColor:      THEME.emerald,
                backgroundColor:  THEME.emerald,
                pointRadius:      10,
                pointHoverRadius: 13,
                pointStyle:       'circle',
                showLine:         false,
            });
            chart.update();
        }

        return chart;
    }

    return { buildFunctionChart, buildConvergenceChart, buildGlobalFunctionChart };
})();


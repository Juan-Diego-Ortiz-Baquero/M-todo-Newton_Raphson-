/**
 * KaTeX math formula rendering.
 *
 * Iterates over a map of element IDs → LaTeX strings and renders each one.
 * Calling this function multiple times is safe: KaTeX replaces the element's
 * content on every call.
 */
window.renderMathFormulas = function renderMathFormulas() {
    const FORMULAS = {
        'formula-newton':   { latex: 'x_{n+1} = x_n - \\dfrac{f(x_n)}{f\'(x_n)}',                              display: true  },
        'formula-funcion':  { latex: 'f(x) = x^5 - 3x^4 + 10x - 8',                                             display: false },
        'formula-derivada': { latex: "f'(x) = 5x^4 - 12x^3 + 10",                                               display: false },
        'formula-error':    { latex: 'E_p = \\dfrac{|x_{n+1} - x_n|}{|x_{n+1}|} \\times 100\\%',                display: false },
        'equation-display': { latex: 'f(x) = x^5 - 3x^4 + 10x - 8 = 0',                                         display: false },
    };

    Object.entries(FORMULAS).forEach(([id, { latex, display }]) => {
        const el = document.getElementById(id);
        if (el) {
            katex.render(latex, el, { throwOnError: false, displayMode: display });
        }
    });
};

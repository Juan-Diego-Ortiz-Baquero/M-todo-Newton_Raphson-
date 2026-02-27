/**
 * Number formatting utilities.
 *
 * Exposed as window.NewtonFormatters so any script loaded after this one
 * can use formatNumber() and formatScientific() without import statements.
 */
window.NewtonFormatters = (() => {
    /**
     * Formats a number to a fixed number of decimal places, falling back to
     * exponential notation for very small or very large values.
     */
    function formatNumber(num, decimals = 6) {
        if (num === undefined || num === null) return '-';
        const n = parseFloat(num);
        if (Math.abs(n) < 1e-10 || Math.abs(n) > 1e6) return n.toExponential(4);
        return n.toFixed(decimals).replace(/\.?0+$/, '');
    }

    /**
     * Formats a number in scientific notation when magnitude is extreme,
     * otherwise uses fixed-point with trailing zero removal.
     */
    function formatScientific(num) {
        if (num === undefined || num === null) return '-';
        const n = parseFloat(num);
        if (n === 0) return '0';
        if (Math.abs(n) < 0.001 || Math.abs(n) > 10000) return n.toExponential(4);
        return n.toFixed(6).replace(/\.?0+$/, '');
    }

    return { formatNumber, formatScientific };
})();

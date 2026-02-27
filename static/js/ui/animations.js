/**
 * GSAP animation sequences.
 *
 * Three exported functions cover: initial page load, result reveal after
 * calculation, and a brief pulse effect on the control panel after reset.
 */
window.NewtonAnimations = (() => {
    /**
     * Entrance animations triggered once on page load.
     * Requires GSAP and ScrollTrigger to be loaded beforehand.
     */
    function initPageAnimations() {
        gsap.registerPlugin(ScrollTrigger);

        gsap.from('.glass-nav',     { y: -100, opacity: 0, duration: 0.8, ease: 'power3.out' });
        gsap.from('.hero-section',  { y: 50,   opacity: 0, duration: 1,   delay: 0.3, ease: 'power3.out' });
        gsap.from('.control-panel', { y: 40,   opacity: 0, duration: 0.8, delay: 0.5, ease: 'power3.out' });
    }

    /**
     * Staggers result cards, charts, and table rows into view after a
     * successful calculation.
     *
     * Sequence:
     *   0.0 s  — results header fades up
     *   0.1 s  — section pills slide in
     *   0.2 s  — metric cards stagger in
     *   0.5 s  — global chart section scales up
     *   0.7 s  — detail chart canvases scale up
     *   0.9 s  — table rows slide in from left
     */
    function animateResults() {
        gsap.from('.results-header', {
            y: -16, opacity: 0, duration: 0.5, ease: 'power3.out',
        });
        gsap.from('.section-pill', {
            x: -12, opacity: 0, duration: 0.4, stagger: 0.08, delay: 0.1, ease: 'power2.out',
        });
        gsap.from('.result-card', {
            y: 28, opacity: 0, duration: 0.55, stagger: 0.1, delay: 0.2, ease: 'back.out(1.5)',
        });
        gsap.from('.chart-global-section', {
            y: 24, opacity: 0, duration: 0.7, delay: 0.45, ease: 'power3.out',
        });
        gsap.from('.glass-card canvas', {
            scale: 0.92, opacity: 0, duration: 0.75, delay: 0.65, ease: 'power2.out',
        });
        gsap.from('.table-row', {
            x: -24, opacity: 0, duration: 0.35, stagger: 0.04, delay: 0.9, ease: 'power2.out',
        });
    }

    /**
     * Short scale pulse on the control panel to give feedback after a reset.
     */
    function pulseControlPanel() {
        gsap.to('.control-panel', {
            scale: 1.02, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.inOut',
        });
    }

    return { initPageAnimations, animateResults, pulseControlPanel };
})();

/**
 * Background floating particle system.
 *
 * Creates DOM elements styled by the `.particle` CSS class and appends them
 * to the `#particles` container.
 */
window.initParticles = function initParticles() {
    const container = document.getElementById('particles');
    if (!container) return;

    const PARTICLE_COUNT = 30;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left              = Math.random() * 100 + '%';
        particle.style.top               = Math.random() * 100 + '%';
        particle.style.animationDelay    = Math.random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        container.appendChild(particle);
    }
};

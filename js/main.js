/* Tahoma Rocketry Club - Main JS */

document.addEventListener('DOMContentLoaded', () => {
    initGalaxyBackground();
    initScrollAnimations();
    initMobileNav();
    initCounters();
});

/* -------------------------------------------------------------------------- */
/*                               Galaxy Background                            */
/* -------------------------------------------------------------------------- */
function initGalaxyBackground() {
    const canvas = document.getElementById('galaxy-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];

    // Configuration
    const STAR_COUNT = 150;
    const STAR_SPEED = 0.05;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initStars();
    }

    function initStars() {
        stars = [];
        for (let i = 0; i < STAR_COUNT; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.5,
                opacity: Math.random(),
                speed: (Math.random() * 0.5 + 0.1) * STAR_SPEED
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw Gradient Background (Deep Space)
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#020a1a');
        gradient.addColorStop(1, '#051837');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Draw Stars
        ctx.fillStyle = 'white';
        stars.forEach(star => {
            ctx.globalAlpha = star.opacity;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();

            // Move Star
            star.y -= star.speed;
            if (star.y < 0) {
                star.y = height;
                star.x = Math.random() * width;
            }
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();
}

/* -------------------------------------------------------------------------- */
/*                             Scroll Animations                              */
/* -------------------------------------------------------------------------- */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up').forEach(el => {
        observer.observe(el);
    });
}

/* -------------------------------------------------------------------------- */
function initCounters() {
    const counters = document.querySelectorAll('.stat-value');
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const targetValue = parseInt(counter.innerText.replace(/[^0-9]/g, '')); // Extract number

                if (!isNaN(targetValue) && targetValue > 0) {
                    animateCounter(counter, targetValue);
                }

                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(el, target) {
    let current = 0;
    const duration = 2000; // 2 seconds
    const stepTime = Math.abs(Math.floor(duration / target));
    const timer = setInterval(() => {
        current += 1;
        // Preserve original text structure if needed, here we just assume it's a number or contains one
        // For simplicity in this demo, we'll just set the number. 
        // If the original was "5 Days", we might want to keep " Days".
        // Let's try to preserve non-numeric suffix if present.
        const originalText = el.innerText;
        const suffix = originalText.replace(/[0-9]/g, '');

        el.innerText = current + suffix;

        if (current >= target) {
            clearInterval(timer);
            el.innerText = target + suffix; // Ensure exact end value
        }
    }, Math.max(stepTime, 20)); // Min 20ms step
}

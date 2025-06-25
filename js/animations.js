// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 1000,
    once: true,
    offset: 100,
    easing: 'ease-out-cubic'
});

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Scroll Progress Bar
const progressBar = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight - windowHeight;
    const scrolled = window.scrollY;
    const progress = scrolled / documentHeight;
    
    gsap.to(progressBar, {
        scaleX: progress,
        duration: 0.1,
        ease: 'none'
    });
});

// Hero Section Animations
// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        document.querySelector('.loading-screen').classList.add('loaded');
    }, 2000);
});

document.addEventListener('DOMContentLoaded', function() {
    // Typing Animation Function
    function startTypingAnimation() {
        const typingElements = document.querySelectorAll('.typing-text');
        
        typingElements.forEach((element, index) => {
            const text = element.getAttribute('data-text');
            element.textContent = ''; // Clear initial content
            
            setTimeout(() => {
                element.classList.add('typing');
                element.textContent = text;
                
                // Remove cursor after typing completes
                setTimeout(() => {
                    element.classList.add('typing-complete');
                }, 1000 + (index * 150)); // Faster completion
                
            }, 500 + (index * 1200)); // Faster delay between lines
        });
    }
    
    // Start typing after loading screen
    setTimeout(() => {
        startTypingAnimation();
    }, 2200);
    
    gsap.from('.hero-description', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.7,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-cta', {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.9,
        ease: 'power3.out'
    });
    
    // Parallax effect for hero background
    gsap.to('.hero-bg', {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: true
        }
    });
    
    // Navigation hide/show on scroll
    let lastScrollY = window.scrollY;
    const nav = document.querySelector('.nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
            gsap.to(nav, { y: -100, duration: 0.3 });
        } else {
            gsap.to(nav, { y: 0, duration: 0.3 });
        }
        lastScrollY = window.scrollY;
    });
    
    // Section title animations
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            opacity: 0,
            y: 30,
            duration: 1,
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                once: true
            }
        });
    });
    
    // Service cards stagger animation
    ScrollTrigger.batch('.service-card', {
        onEnter: elements => {
            gsap.from(elements, {
                opacity: 0,
                y: 50,
                stagger: 0.15,
                duration: 1,
                ease: 'power3.out'
            });
        },
        once: true
    });
    
    // Mission text animation
    gsap.from('.mission-line', {
        opacity: 0,
        scale: 0.8,
        stagger: 0.3,
        duration: 1.5,
        ease: 'power3.out',
        scrollTrigger: {
            trigger: '.mission-text',
            start: 'top 70%',
            once: true
        }
    });
    
    // Value items animation
    gsap.set('.value-item', { opacity: 0, x: -30 });
    
    ScrollTrigger.batch('.value-item', {
        onEnter: elements => {
            gsap.to(elements, {
                opacity: 1,
                x: 0,
                stagger: 0.2,
                duration: 1,
                ease: 'power3.out'
            });
        },
        once: true
    });
    
    
    // Smooth scroll to sections
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                // Calculate target position with offset for fixed header
                const targetPosition = target.offsetTop - 80;
                
                // Use native smooth scroll as fallback if GSAP ScrollTo fails
                if (typeof gsap !== 'undefined' && gsap.to) {
                    gsap.to(window, {
                        duration: 0.3,
                        scrollTo: {
                            y: targetPosition,
                            autoKill: false
                        },
                        ease: 'power2.out'
                    });
                } else {
                    // Fallback to native smooth scroll
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// Cursor effect
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

const cursorDot = document.createElement('div');
cursorDot.className = 'cursor-dot';
cursor.appendChild(cursorDot);

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

gsap.ticker.add(() => {
    cursorX += (mouseX - cursorX) * 0.1;
    cursorY += (mouseY - cursorY) * 0.1;
    gsap.set(cursor, {
        x: cursorX,
        y: cursorY
    });
});

// Hover effect for links and buttons
document.querySelectorAll('a, button, .service-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 1.5, duration: 0.3 });
        gsap.to(cursorDot, { scale: 0, duration: 0.3 });
    });
    
    el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, duration: 0.3 });
        gsap.to(cursorDot, { scale: 1, duration: 0.3 });
    });
});
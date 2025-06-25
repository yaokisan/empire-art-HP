// Mobile Menu Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerMenu = document.querySelector('.hamburger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    // Toggle mobile menu
    hamburgerMenu.addEventListener('click', function() {
        hamburgerMenu.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (mobileMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile menu when clicking on a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburgerMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!hamburgerMenu.contains(event.target) && !mobileMenu.contains(event.target)) {
            hamburgerMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close mobile menu on window resize if desktop size
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            hamburgerMenu.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});
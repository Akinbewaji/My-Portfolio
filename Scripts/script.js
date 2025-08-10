// DOM Elements
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
const loader = document.querySelector('.loader-wrapper');

// Show loading animation on page load
document.addEventListener('DOMContentLoaded', () => {
    // Hide loader after page is fully loaded
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 1000);
});

// Toggle mobile navbar
menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
}

// Enhanced form validation with better user feedback
function submitForm(event) {
    event.preventDefault();
    
    const form = document.getElementById('contactForm');
    const fullName = document.getElementById('fullName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const subject = document.getElementById('subject');
    const message = document.getElementById('message');
    const messageStatus = document.getElementById('messageStatus');
    
    // Reset previous error indicators
    resetFormErrors();
    
    // Validation checks with specific error messages
    let isValid = true;
    
    // Check for empty fields
    const fields = [
        { elem: fullName, name: 'Name' },
        { elem: email, name: 'Email' },
        { elem: phone, name: 'Phone' },
        { elem: subject, name: 'Subject' },
        { elem: message, name: 'Message' }
    ];
    
    // Check each field
    fields.forEach(field => {
        if (!field.elem.value.trim()) {
            showFieldError(field.elem, `${field.name} is required`);
            isValid = false;
        }
    });
    
    // Email format validation
    if (email.value && !validateEmail(email.value)) {
        showFieldError(email, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone number validation
    if (phone.value && !validatePhone(phone.value)) {
        showFieldError(phone, 'Please enter a valid phone number');
        isValid = false;
    }
    
    // If any validation failed, show general error
    if (!isValid) {
        messageStatus.textContent = 'Please correct the errors above';
        messageStatus.className = 'message-status error';
        messageStatus.style.display = 'block';
        return false;
    }
    
    // Show sending indicator
    messageStatus.textContent = 'Sending message...';
    messageStatus.className = 'message-status sending';
    messageStatus.style.display = 'block';
    
    // Simulate sending data to a server
    setTimeout(() => {
        // Success message
        messageStatus.textContent = 'Message sent successfully!';
        messageStatus.className = 'message-status success';
        
        // Reset form
        form.reset();
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            messageStatus.style.display = 'none';
        }, 5000);
    }, 1500);
    
    return false;
}

// Helper functions for form validation
function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
    // Allow various phone formats with optional country codes
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return re.test(String(phone));
}

function showFieldError(field, message) {
    // Add error class to the field
    field.classList.add('error-input');
    
    // Create and append error message
    const errorMsg = document.createElement('div');
    errorMsg.className = 'field-error';
    errorMsg.textContent = message;
    
    const parent = field.parentNode;
    parent.appendChild(errorMsg);
    
    // Add event listener to clear error on input
    field.addEventListener('input', function() {
        field.classList.remove('error-input');
        const error = parent.querySelector('.field-error');
        if (error) {
            parent.removeChild(error);
        }
    }, { once: true });
}

function resetFormErrors() {
    // Remove all error messages and classes
    document.querySelectorAll('.field-error').forEach(el => el.remove());
    document.querySelectorAll('.error-input').forEach(el => el.classList.remove('error-input'));
    document.getElementById('messageStatus').style.display = 'none';
}

// Enhanced scroll handling with improved performance
let sections = document.querySelectorAll('section');
let navlinks = document.querySelectorAll('header nav a');
let header = document.querySelector('header');
let footer = document.querySelector('footer');
let lastScrollTop = 0;
let scrollTimeout;

// Throttled scroll handler for better performance
window.addEventListener('scroll', () => {
    if (!scrollTimeout) {
        scrollTimeout = setTimeout(() => {
            handleScroll();
            scrollTimeout = null;
        }, 20);
    }
});

// Function to close mobile menu when clicking a link
navlinks.forEach(link => {
    link.addEventListener('click', () => {
        menuIcon.classList.remove('bx-x');
        navbar.classList.remove('active');
    });
});

// Handle scroll events with performance optimizations
function handleScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    
    // Sticky header with reveal/hide on scroll direction
    if (scrollTop > 100) {
        header.classList.add('sticky');
        
        // Show/hide header based on scroll direction for better mobile UX
        if (scrollTop > lastScrollTop + 50) {
            // Scrolling down
            header.classList.add('header-hidden');
        } else if (scrollTop < lastScrollTop - 20) {
            // Scrolling up
            header.classList.remove('header-hidden');
        }
    } else {
        header.classList.remove('sticky');
        header.classList.remove('header-hidden');
    }
    lastScrollTop = scrollTop;
    
    // Active section detection and animation
    sections.forEach(sec => {
        const offset = sec.offsetTop - 150;
        const height = sec.offsetHeight;
        const id = sec.getAttribute('id');
        
        if (scrollTop >= offset && scrollTop < offset + height) {
            // Active navbar highlighting
            navlinks.forEach(link => link.classList.remove('active'));
            document.querySelector(`header nav a[href*=${id}]`)?.classList.add('active');
            
            // Add animation class
            if (!sec.classList.contains('show-animate')) {
                sec.classList.add('show-animate');
                
                // Add stagger animation to elements with data-stagger
                const staggerElements = sec.querySelectorAll('[data-stagger]');
                staggerElements.forEach((el, index) => {
                    el.style.animationDelay = `${0.1 * index}s`;
                });
            }
        } else {
            // Remove animation class for sections not in view
            sec.classList.remove('show-animate');
        }
    });
    
    // Footer animation
    const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
    footer.classList.toggle('show-animate', isAtBottom);
    
    // Close mobile menu on scroll
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
}

// Initial call to set correct active states
handleScroll();

// Add smooth scrolling to anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Smooth scroll to target
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Update URL without page refresh
            history.pushState(null, null, targetId);
        }
    });
});


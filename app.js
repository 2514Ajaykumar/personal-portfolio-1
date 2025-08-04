// Portfolio JavaScript Functionality

document.addEventListener('DOMContentLoaded', function() {
    // Navigation Elements
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbar = document.getElementById('navbar');

    // Mobile Navigation Toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Improved smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const targetId = this.getAttribute('href');
            console.log('Clicking link with target:', targetId); // Debug log
            
            if (targetId && targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                console.log('Target section found:', targetSection); // Debug log
                
                if (targetSection) {
                    // Calculate offset with navbar height
                    const navbarHeight = navbar ? navbar.offsetHeight : 70;
                    const offsetTop = targetSection.offsetTop - navbarHeight;
                    
                    console.log('Scrolling to position:', offsetTop); // Debug log
                    
                    // Use multiple methods for better compatibility
                    if ('scrollBehavior' in document.documentElement.style) {
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    } else {
                        // Fallback for older browsers
                        const start = window.pageYOffset;
                        const distance = offsetTop - start;
                        const duration = 800;
                        let startTime = null;

                        function animation(currentTime) {
                            if (startTime === null) startTime = currentTime;
                            const timeElapsed = currentTime - startTime;
                            const run = ease(timeElapsed, start, distance, duration);
                            window.scrollTo(0, run);
                            if (timeElapsed < duration) requestAnimationFrame(animation);
                        }

                        function ease(t, b, c, d) {
                            t /= d / 2;
                            if (t < 1) return c / 2 * t * t + b;
                            t--;
                            return -c / 2 * (t * (t - 2) - 1) + b;
                        }

                        requestAnimationFrame(animation);
                    }

                    // Update active nav link immediately
                    updateActiveNavLink(targetId.substring(1));
                }
            }
        });
    });

    // Update active navigation link
    function updateActiveNavLink(activeId = null) {
        if (activeId) {
            // Direct update when clicking nav link
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + activeId) {
                    link.classList.add('active');
                }
            });
        } else {
            // Update based on scroll position
            const sections = document.querySelectorAll('section[id]');
            const scrollPos = window.scrollY + 100; // Offset for better detection

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');

                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    // Remove active class from all links
                    navLinks.forEach(link => link.classList.remove('active'));
                    
                    // Add active class to current section link
                    const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                }
            });
        }
    }

    // Navbar background on scroll
    function updateNavbarBackground() {
        if (!navbar) return;
        
        if (window.scrollY > 50) {
            navbar.style.backgroundColor = 'rgba(19, 52, 59, 0.98)';
            navbar.style.backdropFilter = 'blur(15px)';
        } else {
            navbar.style.backgroundColor = 'rgba(19, 52, 59, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
        }
    }

    // Throttled scroll event handler
    let scrollTimer = null;
    window.addEventListener('scroll', function() {
        if (scrollTimer !== null) {
            clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(function() {
            updateActiveNavLink();
            updateNavbarBackground();
            animateSkillBars();
        }, 10);
    });

    // Skill bars animation
    let skillBarsAnimated = false;

    function animateSkillBars() {
        const skillsSection = document.getElementById('skills');
        if (!skillsSection) return;
        
        const skillBars = document.querySelectorAll('.skill-progress');
        
        if (!skillBarsAnimated && isElementInViewport(skillsSection)) {
            skillBars.forEach((bar, index) => {
                setTimeout(() => {
                    const width = bar.getAttribute('data-width');
                    bar.style.width = width + '%';
                }, index * 100); // Stagger the animations
            });
            skillBarsAnimated = true;
        }
    }

    // Check if element is in viewport
    function isElementInViewport(element) {
        if (!element) return false;
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const name = formData.get('name')?.trim() || '';
            const email = formData.get('email')?.trim() || '';
            const subject = formData.get('subject')?.trim() || '';
            const message = formData.get('message')?.trim() || '';

            // Validate form
            if (!validateForm(name, email, subject, message)) {
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                // Reset form
                contactForm.reset();
                
                // Show success message
                showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Form validation
    function validateForm(name, email, subject, message) {
        // Clear previous error states
        clearFormErrors();

        let isValid = true;
        const errors = [];

        // Name validation
        if (name.length < 2) {
            errors.push({ field: 'name', message: 'Name must be at least 2 characters long' });
            isValid = false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.push({ field: 'email', message: 'Please enter a valid email address' });
            isValid = false;
        }

        // Subject validation
        if (subject.length < 5) {
            errors.push({ field: 'subject', message: 'Subject must be at least 5 characters long' });
            isValid = false;
        }

        // Message validation
        if (message.length < 10) {
            errors.push({ field: 'message', message: 'Message must be at least 10 characters long' });
            isValid = false;
        }

        // Display errors
        if (!isValid) {
            errors.forEach(error => {
                showFieldError(error.field, error.message);
            });
            showNotification('Please correct the errors below', 'error');
        }

        return isValid;
    }

    // Show field error
    function showFieldError(fieldName, message) {
        const field = document.getElementById(fieldName);
        if (!field) return;
        
        const formGroup = field.closest('.form-group');
        if (!formGroup) return;
        
        // Add error class
        field.classList.add('error');
        
        // Create error message element
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: var(--color-error);
            font-size: var(--font-size-sm);
            margin-top: var(--space-4);
            font-weight: var(--font-weight-medium);
        `;
        
        formGroup.appendChild(errorElement);
    }

    // Clear form errors
    function clearFormErrors() {
        const errorFields = document.querySelectorAll('.form-control.error');
        const errorMessages = document.querySelectorAll('.field-error');
        
        errorFields.forEach(field => field.classList.remove('error'));
        errorMessages.forEach(message => message.remove());
    }

    // Show notification
    function showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" aria-label="Close notification">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: var(--color-surface);
            color: var(--color-text);
            padding: var(--space-16);
            border-radius: var(--radius-lg);
            border: 2px solid var(--color-${type === 'success' ? 'success' : type === 'error' ? 'error' : 'info'});
            box-shadow: var(--shadow-lg);
            z-index: 1001;
            transform: translateX(100%);
            transition: transform var(--duration-normal) var(--ease-standard);
            max-width: 400px;
            min-width: 300px;
        `;

        // Add notification content styles
        const notificationContent = notification.querySelector('.notification-content');
        notificationContent.style.cssText = `
            display: flex;
            align-items: center;
            gap: var(--space-12);
        `;

        const icon = notification.querySelector('.notification-content > i');
        icon.style.color = `var(--color-${type === 'success' ? 'success' : type === 'error' ? 'error' : 'info'})`;

        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.style.cssText = `
            background: none;
            border: none;
            color: var(--color-text-secondary);
            cursor: pointer;
            padding: var(--space-4);
            margin-left: auto;
            border-radius: var(--radius-sm);
            transition: color var(--duration-fast) var(--ease-standard);
        `;
        
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }

    // Get notification icon
    function getNotificationIcon(type) {
        switch (type) {
            case 'success': return 'check-circle';
            case 'error': return 'exclamation-circle';
            case 'warning': return 'exclamation-triangle';
            default: return 'info-circle';
        }
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animations
    const animateElements = document.querySelectorAll('.project-card, .skill-category, .contact-item, .experience-item, .education-item');
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .project-card,
        .skill-category,
        .contact-item,
        .experience-item,
        .education-item {
            opacity: 0;
            transform: translateY(30px);
            transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }

        .form-control.error {
            border-color: var(--color-error);
            box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.1);
        }

        .form-control:focus {
            border-color: var(--color-primary);
            box-shadow: 0 0 0 3px var(--color-focus-ring);
            outline: none;
        }

        /* Stagger animation delays */
        .project-card:nth-child(1) { transition-delay: 0.1s; }
        .project-card:nth-child(2) { transition-delay: 0.2s; }
        .project-card:nth-child(3) { transition-delay: 0.3s; }

        .skill-category:nth-child(1) { transition-delay: 0.1s; }
        .skill-category:nth-child(2) { transition-delay: 0.2s; }
        .skill-category:nth-child(3) { transition-delay: 0.3s; }
        .skill-category:nth-child(4) { transition-delay: 0.4s; }

        .contact-item:nth-child(1) { transition-delay: 0.1s; }
        .contact-item:nth-child(2) { transition-delay: 0.2s; }
        .contact-item:nth-child(3) { transition-delay: 0.3s; }
        .contact-item:nth-child(4) { transition-delay: 0.4s; }

        .notification-close:hover {
            color: var(--color-text) !important;
            background-color: var(--color-secondary);
        }
    `;
    document.head.appendChild(style);

    // Handle resize events
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Close mobile menu on resize if open
            if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
                if (hamburger) hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }, 250);
    });

    // Keyboard accessibility
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && navMenu && navMenu.classList.contains('active')) {
            if (hamburger) hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Initialize on load
    updateActiveNavLink();
    updateNavbarBackground();

    // Add smooth reveal for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.style.opacity = '0';
        heroSection.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            heroSection.style.transition = 'all 1s cubic-bezier(0.16, 1, 0.3, 1)';
            heroSection.style.opacity = '1';
            heroSection.style.transform = 'translateY(0)';
        }, 300);
    }

    // Ensure external links open in new tabs
    const externalLinks = document.querySelectorAll('a[href^="http"], a[href^="mailto:"], a[target="_blank"]');
    externalLinks.forEach(link => {
        if (!link.hasAttribute('target')) {
            link.setAttribute('target', '_blank');
        }
        if (link.getAttribute('target') === '_blank') {
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });

    // Loading optimization for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
        });
        
        img.style.opacity = '0';
        img.style.transform = 'scale(0.95)';
        img.style.transition = 'all 0.3s ease';
    });

    // Add click handlers for project links to ensure they work
    const projectLinks = document.querySelectorAll('.project-link');
    projectLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') {
                e.preventDefault();
                showNotification('This is a demo link. In a real portfolio, this would link to the actual project.', 'info');
            }
        });
    });

    console.log('Portfolio website loaded successfully!');
});
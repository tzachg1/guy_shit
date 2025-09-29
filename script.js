
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

document.addEventListener('DOMContentLoaded', function() {
    try {
        if (typeof emailjs !== 'undefined') {
            emailjs.init("O8DVp1sHREaQBWcrX");
        } else {
            console.warn('EmailJS not loaded - contact form will not work');
        }
        
        safeInitialize('Navigation', initializeNavigation);
        safeInitialize('Animations', initializeAnimations);
        safeInitialize('Counters', initializeCounters);
        safeInitialize('Circle Chart', initializeCircleChart);
        safeInitialize('Form', initializeForm);
        safeInitialize('Custom Select', initializeCustomSelect);
        safeInitialize('Scroll Effects', initializeScrollEffects);
        safeInitialize('Parallax', initializeParallax);
        safeInitialize('Mobile Optimizations', initializeMobileOptimizations);
        safeInitialize('Accessibility Menu', initializeAccessibilityMenu);
        
        updateNavigationAccessibility();
        
    } catch (error) {
        console.error('Critical error during initialization:', error);
        initializeBasicFunctionality();
    }
});

function safeInitialize(moduleName, initFunction) {
    try {
        initFunction();
    } catch (error) {
        console.error(`Error initializing ${moduleName}:`, error);
    }
}

function initializeBasicFunctionality() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
}

function updateNavigationAccessibility() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isExpanded = navMenu.classList.contains('active');
            navToggle.setAttribute('aria-expanded', isExpanded.toString());
        });
    }
}

function initializeNavigation() {
    const body = document.body;
    
    function toggleMenu() {
        const isActive = navMenu.classList.contains('active');
        
        if (isActive) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            body.style.overflow = '';
        } else {
            navMenu.classList.add('active');
            navToggle.classList.add('active');
            body.style.overflow = 'hidden'; 
        }
    }
    
    function closeMenu() {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        body.style.overflow = '';
    }

    navToggle.addEventListener('click', toggleMenu);

    function initializeDrawerMenu() {
        if (window.innerWidth <= 768 && !document.querySelector('.nav-header')) {
            const header = document.createElement('div');
            header.className = 'nav-header';
            header.innerHTML = `
                <img src="logo.png" alt="G.A Strategy Logo" class="nav-header-logo">
                <span class="nav-header-text">G.A Strategy</span>
            `;
            navMenu.insertBefore(header, navMenu.firstChild);
        }
        
        if (window.innerWidth > 768) {
            const existingHeader = document.querySelector('.nav-header');
            if (existingHeader) {
                existingHeader.remove();
            }
        }
    }
    
    initializeDrawerMenu();

    window.addEventListener('resize', () => {
        initializeDrawerMenu();
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            closeMenu();
        }
    });

    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
    });

    const sections = document.querySelectorAll('section[id], header[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    });
}

function initializeAnimations() {
    const animatedElements = document.querySelectorAll('.service-card, .contact-card, .section-header');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                if (entry.target.classList.contains('service-card')) {
                    const cards = document.querySelectorAll('.service-card');
                    const index = Array.from(cards).indexOf(entry.target);
                    entry.target.style.transitionDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.8s ease-out';
        observer.observe(element);
    });
}

function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.5 });

    if (counters.length > 0) {
        counterObserver.observe(counters[0].parentElement.parentElement);
    }

    function animateCounters() {
        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                counter.textContent = Math.floor(current);
            }, 16);
        });
    }
}

function initializeCircleChart() {
    const circleElement = document.querySelector('.circle[data-percentage]');
    const percentageElement = document.querySelector('.percentage');
    if (!circleElement || !percentageElement) return;
    
    let hasAnimated = false;
    
    const circleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                setTimeout(() => {
                    circleElement.classList.add('animate');
                    animatePercentageText(percentageElement, 95, 2000);
                }, 400);
            }
        });
    }, { threshold: 0.5 });
    
    circleObserver.observe(circleElement);
}

function animatePercentageText(element, targetPercentage, duration) {
    let currentPercentage = 0;
    const increment = targetPercentage / (duration / 16); 
    
    const updatePercentage = () => {
        currentPercentage += increment;
        if (currentPercentage >= targetPercentage) {
            currentPercentage = targetPercentage;
            element.textContent = `${Math.round(currentPercentage)}%`;
            return;
        }
        element.textContent = `${Math.round(currentPercentage)}%`;
        setTimeout(updatePercentage, 16);
    };
    
    updatePercentage();
}

function initializeCustomSelect() {
    const customSelects = document.querySelectorAll('.custom-select');
    
    customSelects.forEach(select => {
        const trigger = select.querySelector('.select-trigger');
        const options = select.querySelector('.select-options');
        const optionElements = select.querySelectorAll('.select-option');
        const hiddenInput = select.parentElement.querySelector('input[type="hidden"]');
        const label = select.parentElement.querySelector('.custom-select-label');
        const selectText = trigger.querySelector('.select-text');
        
        trigger.addEventListener('click', () => {
            customSelects.forEach(otherSelect => {
                if (otherSelect !== select) {
                    otherSelect.classList.remove('open');
                }
            });
            
            select.classList.toggle('open');
        });
        
        optionElements.forEach(option => {
            option.addEventListener('click', () => {
                const value = option.dataset.value;
                const text = option.textContent;
                
                hiddenInput.value = value;
                
                selectText.textContent = text;
                
                optionElements.forEach(opt => opt.classList.remove('selected'));
                option.classList.add('selected');
                
                select.classList.add('has-value');
                if (label) {
                    select.parentElement.classList.add('focused');
                }
                
                select.classList.remove('open');
                
                hiddenInput.dispatchEvent(new Event('change'));
            });
        });
        
        trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                trigger.click();
            } else if (e.key === 'Escape') {
                select.classList.remove('open');
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!select.contains(e.target)) {
                select.classList.remove('open');
            }
        });
    });
}

function initializeForm() {
    if (!contactForm) return;

    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    
    formInputs.forEach(input => {
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value) {
                input.parentElement.classList.remove('focused');
            }
        });
        
        input.addEventListener('input', () => {
            if (input.value) {
                input.parentElement.classList.add('focused');
            } else {
                input.parentElement.classList.remove('focused');
            }
        });
        
        if (input.value) {
            input.parentElement.classList.add('focused');
        }
    });

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<span>שולח...</span><i class="fas fa-spinner fa-spin"></i>';
        submitButton.disabled = true;
        submitButton.classList.add('loading');
        
        try {
            await sendFormEmail();
            
            submitButton.innerHTML = '<span>ההודעה נשלחה!</span><i class="fas fa-check"></i>';
            submitButton.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            contactForm.reset();
            formInputs.forEach(input => {
                input.parentElement.classList.remove('focused');
            });
            
            showNotification('תודה! ההודעה שלכם נשלחה בהצלחה.', 'success');
            
        } catch (error) {
            submitButton.innerHTML = '<span>שליחה נכשלה</span><i class="fas fa-exclamation-triangle"></i>';
            submitButton.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            
            showNotification('מצטערים, הייתה שגיאה בשליחת ההודעה. אנא נסו שוב.', 'error');
        }
        
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            submitButton.classList.remove('loading');
            submitButton.style.background = '';
        }, 3000);
    });
}

async function sendFormEmail() {
    if (typeof emailjs === 'undefined') {
        throw new Error('EmailJS service not available');
    }
    
    const formData = new FormData(contactForm);
    
    const sanitizedData = {
        name: sanitizeInput(formData.get('name')),
        email: sanitizeInput(formData.get('email')),
        phone: sanitizeInput(formData.get('phone')) || 'לא צוין',
        service: sanitizeInput(formData.get('service')),
        message: sanitizeInput(formData.get('message'))
    };
    
    if (!sanitizedData.name || !sanitizedData.email || !sanitizedData.message) {
        throw new Error('נא למלא את כל השדות הנדרשים');
    }
    
    if (!isValidEmail(sanitizedData.email)) {
        throw new Error('כתובת האימייל אינה תקינה');
    }
    
    const templateParams = {
        from_name: sanitizedData.name,
        from_email: sanitizedData.email,
        phone: sanitizedData.phone,
        service: getServiceText(sanitizedData.service),
        message: sanitizedData.message,
        to_email: 'Guy990490@gmail.com',
        timestamp: new Date().toISOString()
    };
    
    const serviceID = 'service_zqoqf17';
    const templateID = 'template_b7tf1ai';
    
    try {
        const response = await emailjs.send(serviceID, templateID, templateParams);
        
        trackEvent('form_submission_success', {
            service: sanitizedData.service,
            timestamp: templateParams.timestamp
        });
        
        return response;
    } catch (error) {
        trackEvent('form_submission_error', {
            error: error.message,
            service: sanitizedData.service,
            timestamp: templateParams.timestamp
        });
        throw error;
    }
}

function sanitizeInput(input) {
    if (!input || typeof input !== 'string') return '';
    
    return input
        .trim()
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function getServiceText(value) {
    const serviceMap = {
        'business-development': 'פיתוח עסקי',
        'strategy-development': 'גיבוש אסטרטגיה',
        'sales-systems': 'מערכי מכירה',
        'management-coaching': 'ליווי מנהלים',
        'market-analysis': 'ניתוח שוק',
        'startup-consulting': 'ליווי יזמים'
    };
    return serviceMap[value] || value;
}

function initializeMobileOptimizations() {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            if (window.innerWidth < 768) {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                }
            }
        });
        
        input.addEventListener('blur', () => {
            if (window.innerWidth < 768) {
                const viewport = document.querySelector('meta[name="viewport"]');
                if (viewport) {
                    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
                }
            }
        });
    });

    const touchElements = document.querySelectorAll('.btn, .service-card, .contact-card, .social-link');
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        }, { passive: true });
    });


    let touchStartX = 0;
    let touchEndX = 0;

    document.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        if (window.innerWidth < 768) {
            const navMenu = document.querySelector('.nav-menu');
            const navToggle = document.querySelector('.nav-toggle');
            const body = document.body;
            
            if (navMenu && navToggle) {
                if (touchStartX - touchEndX > 100 && !navMenu.classList.contains('active')) {
                    navMenu.classList.add('active');
                    navToggle.classList.add('active');
                    body.style.overflow = 'hidden';
                }

                if (touchEndX - touchStartX > 100 && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    body.style.overflow = '';
                }
            }
        }
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-icon">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        </div>
        <div class="notification-content">
            <div class="notification-title">${type === 'success' ? 'הצלחה!' : type === 'error' ? 'שגיאה' : 'הודעה'}</div>
            <div class="notification-message">${message}</div>
        </div>
        <div class="notification-progress"></div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.95), rgba(5, 150, 105, 0.95))' : 
                     type === 'error' ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.95), rgba(220, 38, 38, 0.95))' : 
                     'linear-gradient(135deg, rgba(0, 212, 255, 0.95), rgba(0, 153, 204, 0.95))'};
        color: white;
        padding: 1.25rem 1.5rem;
        border-radius: 16px;
        backdrop-filter: blur(20px);
        border: 1px solid ${type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 
                            type === 'error' ? 'rgba(239, 68, 68, 0.3)' : 
                            'rgba(0, 212, 255, 0.3)'};
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
        z-index: 10000;
        display: flex;
        align-items: flex-start;
        gap: 1rem;
        max-width: 420px;
        min-width: 350px;
        transform: translateX(120%) scale(0.8);
        opacity: 0;
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        font-family: 'Inter', sans-serif;
        overflow: hidden;
    `;
    
    const icon = notification.querySelector('.notification-icon');
    icon.style.cssText = `
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        flex-shrink: 0;
        margin-top: 2px;
    `;
    
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        flex: 1;
        direction: rtl;
        text-align: right;
    `;
    
    const title = notification.querySelector('.notification-title');
    title.style.cssText = `
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 4px;
        color: rgba(255, 255, 255, 0.95);
    `;
    
    const messageEl = notification.querySelector('.notification-message');
    messageEl.style.cssText = `
        font-size: 14px;
        line-height: 1.4;
        color: rgba(255, 255, 255, 0.85);
    `;
    
    
    const progress = notification.querySelector('.notification-progress');
    progress.style.cssText = `
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: rgba(255, 255, 255, 0.3);
        width: 100%;
        transform-origin: left;
        animation: notificationProgress 5s linear forwards;
    `;
    
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes notificationProgress {
                from { transform: scaleX(1); }
                to { transform: scaleX(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0) scale(1)';
        notification.style.opacity = '1';
    }, 100);
    
    
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(120%) scale(0.8)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 400);
        }
    }, 5000);
}

function initializeScrollEffects() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    const scrollProgress = document.createElement('div');
    scrollProgress.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--accent-cyan), var(--accent-blue));
        z-index: 10001;
        transition: width 0.1s ease-out;
    `;
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        scrollProgress.style.width = `${scrolled}%`;
    });
}

function initializeParallax() {
    const shapes = document.querySelectorAll('.shape');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const rate = scrolled * -0.5;
        
        shapes.forEach((shape, index) => {
            const speed = 0.5 + (index * 0.1);
            shape.style.transform = `translateY(${rate * speed}px) rotate(${scrolled * 0.1}deg)`;
        });
    });
}

function initializeCursorEffects() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, var(--accent-cyan), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 10000;
        mix-blend-mode: difference;
        transition: transform 0.1s ease-out;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
    });

    const interactiveElements = document.querySelectorAll('a, button, .service-card, .contact-card');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
        });
        
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
        });
    });
}

function optimizePerformance() {
    const images = document.querySelectorAll('img');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    let scrollTimeout;
    const originalScrollHandler = window.onscroll;
    
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = requestAnimationFrame(() => {
            if (originalScrollHandler) {
                originalScrollHandler();
            }
        });
    });
}

if (window.innerWidth > 768) {
    initializeCursorEffects();
}

optimizePerformance();

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    }
});

function preloadResources() {
    const criticalResources = [
    ];
    
    criticalResources.forEach(resource => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = resource;
        document.head.appendChild(link);
    });
}

preloadResources();

if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });
            
            console.log('Service Worker registered successfully:', registration);
            
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('New service worker found, installing...');
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        showUpdateNotification();
                    }
                });
            });
            
            navigator.serviceWorker.addEventListener('message', event => {
                console.log('Message from service worker:', event.data);
                
                if (event.data.type === 'FORM_SYNC_SUCCESS') {
                    showNotification('הטופס נשלח בהצלחה לאחר חזרה לחיבור', 'success');
                }
            });
            
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    });
}

function showUpdateNotification() {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
        <div class="update-content">
            <span>גרסה חדשה זמינה</span>
            <button onclick="updateServiceWorker()" class="update-btn">עדכן</button>
            <button onclick="dismissUpdate()" class="dismiss-btn">×</button>
        </div>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, var(--accent-cyan), var(--accent-blue));
        color: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10001;
        font-family: var(--font-family);
    `;
    
    document.body.appendChild(notification);
}

function updateServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
            if (registration && registration.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
            }
        });
    }
}

function dismissUpdate() {
    const notification = document.querySelector('.update-notification');
    if (notification) {
        notification.remove();
    }
}

window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
});

function trackEvent(eventName, eventData = {}) {
    const timestamp = new Date().toISOString();
    const sessionId = getOrCreateSessionId();
    const userId = getOrCreateUserId();
    
    const eventPayload = {
        event: eventName,
        timestamp,
        sessionId,
        userId,
        url: window.location.href,
        userAgent: navigator.userAgent,
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight
        },
        ...eventData
    };
    
    console.log('Event tracked:', eventName, eventPayload);
    
    storeEventLocally(eventPayload);
    
    sendToAnalytics(eventPayload);
    
    if (isCriticalEvent(eventName)) {
        sendEventImmediately(eventPayload);
    }
}

function getOrCreateSessionId() {
    let sessionId = sessionStorage.getItem('ga_session_id');
    if (!sessionId) {
        sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        sessionStorage.setItem('ga_session_id', sessionId);
    }
    return sessionId;
}

function getOrCreateUserId() {
    let userId = localStorage.getItem('ga_user_id');
    if (!userId) {
        userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('ga_user_id', userId);
    }
    return userId;
}

function storeEventLocally(eventPayload) {
    try {
        const events = JSON.parse(localStorage.getItem('ga_pending_events') || '[]');
        events.push(eventPayload);
        
        if (events.length > 100) {
            events.splice(0, events.length - 100);
        }
        
        localStorage.setItem('ga_pending_events', JSON.stringify(events));
    } catch (error) {
        console.error('Error storing event locally:', error);
    }
}

async function sendToAnalytics(eventPayload) {
    try {
        
        if (window.gtag) {
            window.gtag('event', eventPayload.event, {
                event_category: eventPayload.category || 'engagement',
                event_label: eventPayload.label,
                value: eventPayload.value,
                custom_parameters: eventPayload
            });
        }
        
        /*
        await fetch('/api/analytics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventPayload)
        });
        */
        
    } catch (error) {
        console.error('Error sending to analytics:', error);
    }
}

function isCriticalEvent(eventName) {
    const criticalEvents = [
        'form_submission_success',
        'form_submission_error',
        'page_error',
        'performance_issue'
    ];
    return criticalEvents.includes(eventName);
}

async function sendEventImmediately(eventPayload) {
    try {
        if (navigator.sendBeacon) {
            const blob = new Blob([JSON.stringify(eventPayload)], {
                type: 'application/json'
            });
            navigator.sendBeacon('/api/analytics/critical', blob);
        }
    } catch (error) {
        console.error('Error sending critical event:', error);
    }
}

function sendPendingEvents() {
    try {
        const events = JSON.parse(localStorage.getItem('ga_pending_events') || '[]');
        if (events.length === 0) return;
        
        events.forEach(event => {
            sendToAnalytics(event);
        });
        
        localStorage.removeItem('ga_pending_events');
        console.log(`Sent ${events.length} pending events`);
        
    } catch (error) {
        console.error('Error sending pending events:', error);
    }
}

window.addEventListener('online', () => {
    console.log('Connection restored, sending pending events...');
    sendPendingEvents();
    trackEvent('connection_restored');
});

window.addEventListener('offline', () => {
    console.log('Connection lost, events will be queued');
    trackEvent('connection_lost');
});

function monitorPerformance() {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            if (perfData) {
                trackEvent('page_performance', {
                    loadTime: perfData.loadEventEnd - perfData.loadEventStart,
                    domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                    firstPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-paint')?.startTime,
                    firstContentfulPaint: performance.getEntriesByType('paint').find(entry => entry.name === 'first-contentful-paint')?.startTime
                });
            }
        }, 1000);
    });
    
    if ('web-vitals' in window) {
    }
}

monitorPerformance();

function initializeAccessibilityMenu() {
    const accessibilityToggle = document.getElementById('accessibility-toggle');
    const accessibilityMenu = document.getElementById('accessibility-menu');
    const accessibilityClose = document.getElementById('accessibility-close');
    const readingGuideLine = document.getElementById('reading-guide-line');
    
    if (!accessibilityToggle || !accessibilityMenu) return;
    
    loadAccessibilityPreferences();
    
    initializeDraggableAccessibilityButton(accessibilityToggle);
    
    accessibilityToggle.addEventListener('click', () => {
        const isOpen = accessibilityMenu.classList.contains('active');
        if (isOpen) {
            closeAccessibilityMenu();
        } else {
            openAccessibilityMenu();
        }
    });
    
    accessibilityClose?.addEventListener('click', closeAccessibilityMenu);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && accessibilityMenu.classList.contains('active')) {
            closeAccessibilityMenu();
        }
    });
    
    document.addEventListener('click', (e) => {
        if (!accessibilityMenu.contains(e.target) && !accessibilityToggle.contains(e.target)) {
            closeAccessibilityMenu();
        }
    });
    
    document.getElementById('font-decrease')?.addEventListener('click', () => {
        adjustFontSize('decrease');
    });
    
    document.getElementById('font-reset')?.addEventListener('click', () => {
        adjustFontSize('reset');
    });
    
    document.getElementById('font-increase')?.addEventListener('click', () => {
        adjustFontSize('increase');
    });
    
    document.getElementById('contrast-normal')?.addEventListener('click', () => {
        setContrast('normal');
    });
    
    document.getElementById('contrast-high')?.addEventListener('click', () => {
        setContrast('high');
    });
    
    document.getElementById('contrast-invert')?.addEventListener('click', () => {
        setContrast('invert');
    });
    
    document.getElementById('keyboard-nav')?.addEventListener('click', () => {
        toggleKeyboardNavigation();
    });
    
    document.getElementById('links-highlight')?.addEventListener('click', () => {
        toggleLinksHighlight();
    });
    
    document.getElementById('reading-guide')?.addEventListener('click', () => {
        toggleReadingGuide();
    });
    
    document.getElementById('animations-on')?.addEventListener('click', () => {
        setAnimations(true);
    });
    
    document.getElementById('animations-off')?.addEventListener('click', () => {
        setAnimations(false);
    });
    
    document.getElementById('reset-all')?.addEventListener('click', () => {
        resetAllAccessibilitySettings();
    });
    
    if (readingGuideLine) {
        document.addEventListener('mousemove', (e) => {
            if (readingGuideLine.classList.contains('active')) {
                readingGuideLine.style.top = e.clientY + 'px';
            }
        });
    }
}

function openAccessibilityMenu() {
    const accessibilityMenu = document.getElementById('accessibility-menu');
    const accessibilityToggle = document.getElementById('accessibility-toggle');
    
    accessibilityMenu.classList.add('active');
    accessibilityMenu.setAttribute('aria-hidden', 'false');
    accessibilityToggle.setAttribute('aria-expanded', 'true');
    
    const firstButton = accessibilityMenu.querySelector('.accessibility-btn');
    if (firstButton) {
        setTimeout(() => firstButton.focus(), 100);
    }
    
    trackEvent('accessibility_menu_opened');
}

function closeAccessibilityMenu() {
    const accessibilityMenu = document.getElementById('accessibility-menu');
    const accessibilityToggle = document.getElementById('accessibility-toggle');
    
    accessibilityMenu.classList.remove('active');
    accessibilityMenu.setAttribute('aria-hidden', 'true');
    accessibilityToggle.setAttribute('aria-expanded', 'false');
    
    trackEvent('accessibility_menu_closed');
}

function adjustFontSize(action) {
    const body = document.body;
    const fontSizeClasses = ['font-large', 'font-larger', 'font-largest'];
    
    const currentState = {
        isLarge: body.classList.contains('font-large'),
        isLarger: body.classList.contains('font-larger'),
        isLargest: body.classList.contains('font-largest')
    };
    
    fontSizeClasses.forEach(cls => body.classList.remove(cls));
    
    let newSize = 'normal';
    
    switch (action) {
        case 'increase':
            if (currentState.isLargest) {
                body.classList.add('font-largest');
                newSize = 'largest';
            } else if (currentState.isLarger) {
                body.classList.add('font-largest');
                newSize = 'largest';
            } else if (currentState.isLarge) {
                body.classList.add('font-larger');
                newSize = 'larger';
            } else {
                body.classList.add('font-large');
                newSize = 'large';
            }
            break;
            
        case 'decrease':
            if (currentState.isLarge) {
                newSize = 'normal';
            } else if (currentState.isLarger) {
                body.classList.add('font-large');
                newSize = 'large';
            } else if (currentState.isLargest) {
                body.classList.add('font-larger');
                newSize = 'larger';
            } else {
                newSize = 'normal';
            }
            break;
            
        case 'reset':
            newSize = 'normal';
            break;
    }
    
    updateAccessibilityButtonStates();
    saveAccessibilityPreference('fontSize', newSize);
    trackEvent('accessibility_font_size_changed', { size: newSize });
}

function setContrast(mode) {
    const body = document.body;
    
    body.classList.remove('high-contrast', 'invert-colors');
    
    switch (mode) {
        case 'high':
            body.classList.add('high-contrast');
            break;
        case 'invert':
            body.classList.add('invert-colors');
            break;
        case 'normal':
        default:
            break;
    }
    
    updateAccessibilityButtonStates();
    saveAccessibilityPreference('contrast', mode);
    trackEvent('accessibility_contrast_changed', { mode });
}

function toggleKeyboardNavigation() {
    const body = document.body;
    const isActive = body.classList.toggle('keyboard-navigation');
    
    updateAccessibilityButtonStates();
    saveAccessibilityPreference('keyboardNavigation', isActive);
    trackEvent('accessibility_keyboard_navigation_toggled', { active: isActive });
}

function toggleLinksHighlight() {
    const body = document.body;
    const isActive = body.classList.toggle('links-highlight');
    
    updateAccessibilityButtonStates();
    saveAccessibilityPreference('linksHighlight', isActive);
    trackEvent('accessibility_links_highlight_toggled', { active: isActive });
}

function toggleReadingGuide() {
    const readingGuideLine = document.getElementById('reading-guide-line');
    const isActive = readingGuideLine.classList.toggle('active');
    
    updateAccessibilityButtonStates();
    saveAccessibilityPreference('readingGuide', isActive);
    trackEvent('accessibility_reading_guide_toggled', { active: isActive });
}

function setAnimations(enabled) {
    const body = document.body;
    
    if (enabled) {
        body.classList.remove('no-animations');
    } else {
        body.classList.add('no-animations');
    }
    
    updateAccessibilityButtonStates();
    saveAccessibilityPreference('animations', enabled);
    trackEvent('accessibility_animations_toggled', { enabled });
}

function updateAccessibilityButtonStates() {
    const body = document.body;
    
    document.querySelectorAll('#font-decrease, #font-reset, #font-increase').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (body.classList.contains('font-largest')) {
        document.getElementById('font-increase')?.classList.add('active');
    } else if (body.classList.contains('font-larger')) {
        document.getElementById('font-increase')?.classList.add('active');
    } else if (body.classList.contains('font-large')) {
        document.getElementById('font-increase')?.classList.add('active');
    } else {
        document.getElementById('font-reset')?.classList.add('active');
    }
    
    document.querySelectorAll('#contrast-normal, #contrast-high, #contrast-invert').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (body.classList.contains('high-contrast')) {
        document.getElementById('contrast-high')?.classList.add('active');
    } else if (body.classList.contains('invert-colors')) {
        document.getElementById('contrast-invert')?.classList.add('active');
    } else {
        document.getElementById('contrast-normal')?.classList.add('active');
    }
    
    document.getElementById('keyboard-nav')?.classList.toggle('active', body.classList.contains('keyboard-navigation'));
    document.getElementById('links-highlight')?.classList.toggle('active', body.classList.contains('links-highlight'));
    document.getElementById('reading-guide')?.classList.toggle('active', document.getElementById('reading-guide-line')?.classList.contains('active'));
    
    document.getElementById('animations-on')?.classList.toggle('active', !body.classList.contains('no-animations'));
    document.getElementById('animations-off')?.classList.toggle('active', body.classList.contains('no-animations'));
}

function saveAccessibilityPreference(key, value) {
    try {
        const preferences = JSON.parse(localStorage.getItem('accessibility_preferences') || '{}');
        preferences[key] = value;
        localStorage.setItem('accessibility_preferences', JSON.stringify(preferences));
    } catch (error) {
        console.error('Error saving accessibility preference:', error);
    }
}

function loadAccessibilityPreferences() {
    try {
        const preferences = JSON.parse(localStorage.getItem('accessibility_preferences') || '{}');
        
        if (preferences.fontSize && preferences.fontSize !== 'normal') {
            const fontSizeMap = {
                'large': 'font-large',
                'larger': 'font-larger',
                'largest': 'font-largest'
            };
            if (fontSizeMap[preferences.fontSize]) {
                document.body.classList.add(fontSizeMap[preferences.fontSize]);
            }
        }
        
        if (preferences.contrast && preferences.contrast !== 'normal') {
            setContrast(preferences.contrast);
        }
        
        if (preferences.keyboardNavigation) {
            document.body.classList.add('keyboard-navigation');
        }
        
        if (preferences.linksHighlight) {
            document.body.classList.add('links-highlight');
        }
        
        if (preferences.readingGuide) {
            document.getElementById('reading-guide-line')?.classList.add('active');
        }
        
        if (preferences.animations === false) {
            document.body.classList.add('no-animations');
        }
        
        setTimeout(updateAccessibilityButtonStates, 100);
        
    } catch (error) {
        console.error('Error loading accessibility preferences:', error);
    }
}

function resetAllAccessibilitySettings() {
    const body = document.body;
    const readingGuideLine = document.getElementById('reading-guide-line');
    
    const accessibilityClasses = [
        'font-large', 'font-larger', 'font-largest',
        'high-contrast', 'invert-colors',
        'keyboard-navigation', 'links-highlight', 'no-animations'
    ];
    
    accessibilityClasses.forEach(cls => body.classList.remove(cls));
    
    readingGuideLine?.classList.remove('active');
    
    localStorage.removeItem('accessibility_preferences');
    
    updateAccessibilityButtonStates();
    
    trackEvent('accessibility_settings_reset');
    
    showNotification('הגדרות הנגישות אופסו בהצלחה', 'success');
}

function initializeDraggableAccessibilityButton(button) {
    if (!button) return;
    
    let isDragging = false;
    let startX, startY, startLeft, startTop;
    let clickTimeout;
    
    const savedPosition = JSON.parse(localStorage.getItem('accessibility_button_position') || '{}');
    if (savedPosition.left && savedPosition.top) {
        button.style.left = savedPosition.left;
        button.style.top = savedPosition.top;
        button.style.transform = 'none';
    }
    
    button.addEventListener('mousedown', handleStart);
    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleEnd);
    
    button.addEventListener('touchstart', handleStart, { passive: false });
    document.addEventListener('touchmove', handleMove, { passive: false });
    document.addEventListener('touchend', handleEnd);
    
    function handleStart(e) {
        e.preventDefault();
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        startX = clientX;
        startY = clientY;
        
        const rect = button.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        
        clickTimeout = setTimeout(() => {
            isDragging = true;
            button.classList.add('dragging');
            document.body.style.userSelect = 'none';
        }, 150);
    }
    
    function handleMove(e) {
        if (!isDragging) return;
        
        e.preventDefault();
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;
        
        let newLeft = startLeft + deltaX;
        let newTop = startTop + deltaY;
        
        const buttonSize = 60;
        const margin = 10;
        
        newLeft = Math.max(margin, Math.min(window.innerWidth - buttonSize - margin, newLeft));
        newTop = Math.max(margin, Math.min(window.innerHeight - buttonSize - margin, newTop));
        
        button.style.left = newLeft + 'px';
        button.style.top = newTop + 'px';
        button.style.transform = 'none';
    }
    
    function handleEnd(e) {
        clearTimeout(clickTimeout);
        
        if (isDragging) {
            isDragging = false;
            button.classList.remove('dragging');
            document.body.style.userSelect = '';
            
            const position = {
                left: button.style.left,
                top: button.style.top
            };
            localStorage.setItem('accessibility_button_position', JSON.stringify(position));
            
            e.preventDefault();
            e.stopPropagation();
            
            trackEvent('accessibility_button_moved', position);
        }
    }
    
    button.addEventListener('contextmenu', (e) => {
        if (isDragging) {
            e.preventDefault();
        }
    });
}

document.addEventListener('click', (e) => {
    if (e.target.matches('.btn-primary')) {
        trackEvent('cta_click', { button_text: e.target.textContent.trim() });
    }
    
    if (e.target.matches('.nav-link')) {
        trackEvent('navigation_click', { section: e.target.getAttribute('href') });
    }
    
    if (e.target.matches('.service-card')) {
        trackEvent('service_card_click', { service: e.target.querySelector('.service-title').textContent });
    }
});

if (contactForm) {
    contactForm.addEventListener('submit', () => {
        trackEvent('form_submission', { form_type: 'contact' });
    });
}

let maxScrollDepth = 0;
window.addEventListener('scroll', () => {
    const scrollDepth = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
    if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        if (maxScrollDepth % 25 === 0) {
            trackEvent('scroll_depth', { depth: maxScrollDepth });
        }
    }
});

const pageLoadTime = Date.now();
window.addEventListener('beforeunload', () => {
    const timeOnPage = Math.round((Date.now() - pageLoadTime) / 1000);
    trackEvent('time_on_page', { seconds: timeOnPage });
});

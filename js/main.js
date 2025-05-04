/**
 * Eli Podcast Productions - Main JavaScript
 * Handles all interactive elements and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Remove loading screen after page loads
    setTimeout(() => {
        const loadingScreen = document.querySelector('.loading-screen');
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 400);
    }, 800);

    // Initialize all components
    initHeader();
    initCustomCursor();
    initHeroWaveAnimation();
    initServicesScroll();
    initPortfolioFilters();
    initPortfolioAudio();
    initTestimonialSlider();
    initScrollAnimations();
});

/**
 * Header scroll effect
 */
function initHeader() {
    const header = document.querySelector('.site-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNav = document.createElement('div');
    mobileNav.classList.add('mobile-navigation');
    mobileNav.innerHTML = document.querySelector('.main-navigation').innerHTML;
    document.body.appendChild(mobileNav);

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mobileNav.classList.toggle('active');
        document.body.classList.toggle('menu-open');

        if (menuToggle.classList.contains('active')) {
            menuToggle.querySelector('span:first-child').style.transform = 'translateY(9px) rotate(45deg)';
            menuToggle.querySelector('span:nth-child(2)').style.opacity = '0';
            menuToggle.querySelector('span:last-child').style.transform = 'translateY(-9px) rotate(-45deg)';
        } else {
            menuToggle.querySelector('span:first-child').style.transform = 'none';
            menuToggle.querySelector('span:nth-child(2)').style.opacity = '1';
            menuToggle.querySelector('span:last-child').style.transform = 'none';
        }
    });
}

/**
 * Custom cursor effects
 */
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorTrail = document.querySelector('.cursor-trail');
    
    if (!isTouchDevice()) {
        document.addEventListener('mousemove', (e) => {
            // Position the cursor elements
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            
            // The trail follows with a slight delay
            setTimeout(() => {
                cursorTrail.style.left = `${e.clientX}px`;
                cursorTrail.style.top = `${e.clientY}px`;
            }, 100);
        });

        // Change cursor style on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, [data-cursor-interactive]');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorTrail.style.transform = 'translate(-50%, -50%) scale(1.5)';
                cursorTrail.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--gold');
            });
            
            element.addEventListener('mouseleave', () => {
                cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
                cursorTrail.style.transform = 'translate(-50%, -50%) scale(0.8)';
                cursorTrail.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--gold');
            });
        });
    } else {
        // Hide custom cursor on touch devices
        cursor.style.display = 'none';
    }
}

/**
 * Hero section sound wave animation
 */
function initHeroWaveAnimation() {
    const waveAnimation = document.querySelector('.sound-wave-animation.interactive');
    
    if (waveAnimation) {
        // Create dynamic sound wave animation
        let waveHTML = '';
        const bars = 32;
        
        for (let i = 0; i < bars; i++) {
            const height = Math.floor(Math.random() * 30) + 10;
            waveHTML += `<div class="wave-bar" style="height:${height}px;animation-delay:${i * 0.05}s"></div>`;
        }
        
        waveAnimation.innerHTML = waveHTML;
        
        // Make it react to cursor or random animation when mouse is not over it
        if (!isTouchDevice()) {
            waveAnimation.addEventListener('mousemove', (e) => {
                const rect = waveAnimation.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const waveBars = waveAnimation.querySelectorAll('.wave-bar');
                
                waveBars.forEach((bar, index) => {
                    const barCenter = (index / waveBars.length) * rect.width;
                    const distance = Math.abs(x - barCenter);
                    const maxHeight = 50;
                    const minHeight = 5;
                    
                    // Calculate height based on distance from cursor
                    const height = maxHeight - (distance / (rect.width / 4) * (maxHeight - minHeight));
                    bar.style.height = `${Math.max(minHeight, Math.min(maxHeight, height))}px`;
                });
            });
            
            waveAnimation.addEventListener('mouseleave', () => {
                // Return to random animation
                const waveBars = waveAnimation.querySelectorAll('.wave-bar');
                
                waveBars.forEach(bar => {
                    bar.style.height = '';
                });
            });
        }
    }
}

/**
 * Horizontal services scroll functionality
 */
function initServicesScroll() {
    const scrollContainer = document.querySelector('.services-cards');
    const leftButton = document.querySelector('.scroll-left');
    const rightButton = document.querySelector('.scroll-right');
    const scrollDots = document.querySelector('.scroll-dots');
    
    if (scrollContainer && leftButton && rightButton) {
        // Create dots based on how many "screens" of content there are
        const containerWidth = scrollContainer.clientWidth;
        const scrollWidth = scrollContainer.scrollWidth;
        const screens = Math.ceil(scrollWidth / containerWidth);
        
        // Generate dots
        let dotsHTML = '';
        for (let i = 0; i < screens; i++) {
            dotsHTML += `<button class="scroll-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Page ${i + 1}"></button>`;
        }
        scrollDots.innerHTML = dotsHTML;
        
        // Handle dot clicks
        const dots = scrollDots.querySelectorAll('.scroll-dot');
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = parseInt(dot.dataset.index);
                scrollToPosition(index);
                updateActiveDot(index);
            });
        });
        
        // Handle button clicks
        leftButton.addEventListener('click', () => {
            const activeDot = scrollDots.querySelector('.scroll-dot.active');
            const activeIndex = parseInt(activeDot.dataset.index);
            const newIndex = Math.max(0, activeIndex - 1);
            
            scrollToPosition(newIndex);
            updateActiveDot(newIndex);
        });
        
        rightButton.addEventListener('click', () => {
            const activeDot = scrollDots.querySelector('.scroll-dot.active');
            const activeIndex = parseInt(activeDot.dataset.index);
            const newIndex = Math.min(screens - 1, activeIndex + 1);
            
            scrollToPosition(newIndex);
            updateActiveDot(newIndex);
        });
        
        // Handle scroll events
        scrollContainer.addEventListener('scroll', () => {
            const scrollPosition = scrollContainer.scrollLeft;
            const scrollIndex = Math.round(scrollPosition / containerWidth);
            
            updateActiveDot(scrollIndex);
        });
        
        // Scroll to position helper
        function scrollToPosition(index) {
            const position = index * containerWidth;
            scrollContainer.scrollTo({
                left: position,
                behavior: 'smooth'
            });
        }
        
        // Update active dot helper
        function updateActiveDot(index) {
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');
            
            // Update button states
            leftButton.style.opacity = index === 0 ? '0.5' : '1';
            rightButton.style.opacity = index === screens - 1 ? '0.5' : '1';
        }
        
        // Initial button states
        leftButton.style.opacity = '0.5';
    }
}

/**
 * Portfolio filters functionality
 */
function initPortfolioFilters() {
    const filterButtons = document.querySelectorAll('.filter-button');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    if (filterButtons.length && portfolioItems.length) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Update active button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                
                const filter = button.dataset.filter;
                
                // Filter items
                if (filter === 'all') {
                    portfolioItems.forEach(item => {
                        item.style.display = 'block';
                        // Trigger re-animation
                        item.style.animation = 'none';
                        setTimeout(() => {
                            item.style.animation = '';
                        }, 10);
                    });
                } else {
                    portfolioItems.forEach(item => {
                        if (item.dataset.category === filter) {
                            item.style.display = 'block';
                            // Trigger re-animation
                            item.style.animation = 'none';
                            setTimeout(() => {
                                item.style.animation = '';
                            }, 10);
                        } else {
                            item.style.display = 'none';
                        }
                    });
                }
            });
        });
    }
}

/**
 * Portfolio audio player functionality
 */
function initPortfolioAudio() {
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    let currentAudio = null;
    let currentPlayButton = null;
    
    portfolioItems.forEach(item => {
        const playButton = item.querySelector('.play-button');
        const waveform = item.querySelector('.waveform-visualization');
        
        if (playButton && waveform) {
            const audioSrc = waveform.dataset.audio;
            
            if (audioSrc) {
                const audio = new Audio(audioSrc);
                
                playButton.addEventListener('click', () => {
                    // Stop any currently playing audio
                    if (currentAudio && currentAudio !== audio) {
                        currentAudio.pause();
                        currentAudio.currentTime = 0;
                        resetPlayButton(currentPlayButton);
                    }
                    
                    if (audio.paused) {
                        audio.play();
                        playButton.classList.add('playing');
                        playButton.innerHTML = '';
                        
                        // Create pause icon
                        const pauseIcon = document.createElement('span');
                        pauseIcon.classList.add('pause-icon');
                        playButton.appendChild(pauseIcon);
                        
                        // Animate waveform
                        waveform.classList.add('playing');
                        
                        currentAudio = audio;
                        currentPlayButton = playButton;
                    } else {
                        audio.pause();
                        resetPlayButton(playButton);
                    }
                });
                
                // Reset when audio ends
                audio.addEventListener('ended', () => {
                    resetPlayButton(playButton);
                });
            }
        }
    });
    
    function resetPlayButton(button) {
        if (button) {
            button.classList.remove('playing');
            button.innerHTML = '';
            const waveform = button.closest('.portfolio-overlay').querySelector('.waveform-visualization');
            if (waveform) {
                waveform.classList.remove('playing');
            }
        }
    }
}

/**
 * Testimonial slider functionality
 */
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    let currentSlide = 0;
    let interval;
    
    if (slides.length && dots.length) {
        // Set up automatic rotation
        startAutoRotation();
        
        // Handle dot clicks
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const slideIndex = parseInt(dot.dataset.slide);
                goToSlide(slideIndex);
                resetAutoRotation();
            });
        });
        
        // Auto-rotation functions
        function startAutoRotation() {
            interval = setInterval(() => {
                const nextSlide = (currentSlide + 1) % slides.length;
                goToSlide(nextSlide);
            }, 5000);
        }
        
        function resetAutoRotation() {
            clearInterval(interval);
            startAutoRotation();
        }
        
        // Go to specific slide
        function goToSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            
            currentSlide = index;
        }
    }
}

/**
 * Scroll-triggered animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-animation]');
    
    if ('IntersectionObserver' in window && animatedElements.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animation = element.dataset.animation;
                    const delay = element.dataset.delay || 0;
                    
                    setTimeout(() => {
                        element.style.animation = `${animation} 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards`;
                    }, delay * 1000);
                    
                    observer.unobserve(element);
                }
            });
        }, {
            threshold: 0.1
        });
        
        animatedElements.forEach(element => {
            element.style.opacity = '0';
            observer.observe(element);
        });
    }
}

/**
 * Utility function to detect touch devices
 */
function isTouchDevice() {
    return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
}

/**
 * Add CSS styles for elements created in JS
 */
(function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Mobile Navigation */
        .mobile-navigation {
            position: fixed;
            top: 0;
            right: -100%;
            width: 80%;
            max-width: 300px;
            height: 100vh;
            background-color: var(--navy);
            z-index: 99;
            padding: 80px 30px 30px;
            transition: right 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
            box-shadow: -5px 0 20px rgba(0, 0, 0, 0.2);
        }
        
        .mobile-navigation.active {
            right: 0;
        }
        
        .mobile-navigation ul {
            flex-direction: column;
        }
        
        .mobile-navigation li {
            margin: 0 0 20px;
        }
        
        .mobile-navigation a {
            display: block;
            padding: 10px 0;
        }
        
        body.menu-open::after {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.6);
            z-index: 98;
        }
        
        /* Sound Wave Animation */
        .sound-wave-animation.interactive {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 3px;
        }
        
        .wave-bar {
            width: 3px;
            background-color: var(--gold);
            border-radius: 2px;
            animation: waveAnimation 1s infinite alternate ease-in-out;
        }
        
        @keyframes waveAnimation {
            0% {
                height: 10px;
            }
            100% {
                height: 30px;
            }
        }
        
        /* Waveform visualization */
        .waveform-visualization.playing {
            animation: waveformAnimation 2s infinite linear;
        }
        
        @keyframes waveformAnimation {
            0% {
                background-position: 0% center;
            }
            100% {
                background-position: 100% center;
            }
        }
        
        /* Pause icon */
        .pause-icon {
            position: relative;
            width: 20px;
            height: 20px;
        }
        
        .pause-icon::before,
        .pause-icon::after {
            content: '';
            position: absolute;
            width: 6px;
            height: 20px;
            background-color: var(--navy);
            border-radius: 2px;
        }
        
        .pause-icon::before {
            left: 4px;
        }
        
        .pause-icon::after {
            right: 4px;
        }
    `;
    
    document.head.appendChild(style);
})();
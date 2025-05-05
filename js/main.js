// ========================================
// MAIN JAVASCRIPT - ELI PODCAST PRODUCTIONS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components when DOM is fully loaded
    initHeaderScroll();
    initSoundWaveAnimation();
    initTestimonialSlider();
    initAudioSamples();
    initParallaxBackground();
    initServiceCardScroll();
    
    // Hide loading screen after everything is loaded
    window.addEventListener('load', function() {
        hideLoadingScreen();
    });
});

// ---- LOADING SCREEN ----
function hideLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 400);
    }
}

// ---- HEADER SCROLL EFFECT ----
function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    const scrollThreshold = 100;
    
    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Initial check in case page is loaded scrolled down
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
}

// ---- SOUND WAVE ANIMATION ----
function initSoundWaveAnimation() {
    const soundWaveContainer = document.querySelector('.sound-wave-animation');
    if (!soundWaveContainer) return;
    
    // Create canvas for sound wave
    const canvas = document.createElement('canvas');
    canvas.width = soundWaveContainer.offsetWidth;
    canvas.height = soundWaveContainer.offsetHeight;
    soundWaveContainer.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const waveColor = '#e6b54c'; // Gold color
    
    let animationFrameId;
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;
    
    // Wave properties
    const waveCount = 3;
    const waves = [];
    
    // Initialize waves
    for (let i = 0; i < waveCount; i++) {
        waves.push({
            frequency: 0.005 + (i * 0.002),
            amplitude: 15 + (i * 5),
            speed: 0.05 + (i * 0.01),
            phase: 0
        });
    }
    
    // Handle mouse movement
    soundWaveContainer.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
    });
    
    function drawWave() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw each wave
        waves.forEach((wave, index) => {
            ctx.beginPath();
            
            // Update phase for animation
            wave.phase += wave.speed;
            
            // Calculate wave path
            for (let x = 0; x < canvas.width; x++) {
                // Calculate distance from mouse for reactive effect
                const distanceFromMouse = Math.abs(x - mouseX) / (canvas.width / 2);
                const mouseInfluence = Math.max(0, 1 - distanceFromMouse);
                
                // Calculate y position with mouse influence
                const baseAmplitude = wave.amplitude * (1 + mouseInfluence * 0.5);
                const y = canvas.height / 2 + 
                          Math.sin(x * wave.frequency + wave.phase) * 
                          baseAmplitude;
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            // Style and draw the wave
            ctx.strokeStyle = waveColor;
            ctx.lineWidth = 2 - (index * 0.5);
            ctx.stroke();
            
            // Add slight transparency
            ctx.globalAlpha = 0.7 - (index * 0.2);
        });
        
        // Reset alpha
        ctx.globalAlpha = 1;
        
        // Continue animation loop
        animationFrameId = requestAnimationFrame(drawWave);
    }
    
    // Start animation
    drawWave();
    
    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = soundWaveContainer.offsetWidth;
        canvas.height = soundWaveContainer.offsetHeight;
    });
    
    // Cleanup function
    return () => {
        cancelAnimationFrame(animationFrameId);
    };
}

// ---- TESTIMONIAL SLIDER ----
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dot');
    let currentSlide = 0;
    let slideInterval;
    
    // Skip if no slides
    if (!slides.length) return;
    
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Deactivate all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show current slide and activate current dot
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        
        // Update current slide index
        currentSlide = index;
    }
    
    // Initialize dots click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetInterval();
        });
    });
    
    function nextSlide() {
        let next = currentSlide + 1;
        if (next >= slides.length) {
            next = 0;
        }
        showSlide(next);
    }
    
    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Start automatic sliding
    resetInterval();
    
    // Pause on hover
    const sliderContainer = document.querySelector('.testimonials-slider');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        
        sliderContainer.addEventListener('mouseleave', resetInterval);
    }
}

// ---- AUDIO SAMPLES AND WAVEFORM VISUALIZATION ----
function initAudioSamples() {
    const audioButtons = document.querySelectorAll('.audio-play-button');
    let currentAudio = null;
    let currentWaveform = null;
    
    audioButtons.forEach(button => {
        const waveformEl = button.parentElement.querySelector('.waveform-visualization');
        const audioSrc = waveformEl.getAttribute('data-audio');
        
        if (!audioSrc) return;
        
        // Create audio element
        const audio = new Audio(audioSrc);
        audio.preload = 'metadata';
        
        // Create waveform visualization
        const waveform = createWaveform(waveformEl, audio);
        
        // Set up play button
        button.addEventListener('click', () => {
            if (currentAudio && currentAudio !== audio) {
                // Stop any currently playing audio
                currentAudio.pause();
                currentAudio.currentTime = 0;
                currentWaveform.pause();
                
                // Reset play button
                const currentButton = document.querySelector('.audio-play-button.playing');
                if (currentButton) {
                    currentButton.classList.remove('playing');
                    currentButton.innerHTML = '';
                    
                    // Restore play triangle
                    const playTriangle = document.createElement('span');
                    playTriangle.classList.add('play-icon');
                    currentButton.appendChild(playTriangle);
                }
            }
            
            if (audio.paused) {
                // Play this audio
                audio.play();
                waveform.play();
                button.classList.add('playing');
                
                // Change button to pause icon
                button.innerHTML = '';
                const pauseIcon = document.createElement('span');
                pauseIcon.classList.add('pause-icon');
                button.appendChild(pauseIcon);
                
                // Update current audio reference
                currentAudio = audio;
                currentWaveform = waveform;
            } else {
                // Pause this audio
                audio.pause();
                waveform.pause();
                button.classList.remove('playing');
                
                // Change button back to play icon
                button.innerHTML = '';
                const playTriangle = document.createElement('span');
                playTriangle.classList.add('play-icon');
                button.appendChild(playTriangle);
                
                currentAudio = null;
                currentWaveform = null;
            }
        });
        
        // Handle audio ended
        audio.addEventListener('ended', () => {
            button.classList.remove('playing');
            
            // Change button back to play icon
            button.innerHTML = '';
            const playTriangle = document.createElement('span');
            playTriangle.classList.add('play-icon');
            button.appendChild(playTriangle);
            
            currentAudio = null;
            currentWaveform = null;
        });
    });
}

function createWaveform(container, audio) {
    // Create canvas for waveform
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const waveColor = '#e6b54c'; // Gold color
    
    // Simulated waveform data - would be generated from actual audio analysis in production
    const sampleCount = 30;
    const samples = [];
    
    // Generate random samples for visualization
    for (let i = 0; i < sampleCount; i++) {
        samples.push(Math.random() * 0.8 + 0.2); // Values between 0.2 and 1.0
    }
    
    let animationFrameId;
    let isPlaying = false;
    let currentPosition = 0;
    
    function drawWaveform() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const barWidth = canvas.width / sampleCount;
        const barMaxHeight = canvas.height;
        
        // Draw each frequency bar
        for (let i = 0; i < sampleCount; i++) {
            const x = i * barWidth;
            
            // Determine if this bar is "active" based on current position
            const progress = audio.currentTime / audio.duration;
            const isActive = i / sampleCount <= progress;
            
            // Calculate height with slight randomization when playing
            let amplitude = samples[i];
            if (isPlaying && isActive) {
                // Add subtle animation to active bars
                amplitude *= 0.9 + Math.sin(Date.now() * 0.01 + i) * 0.1;
            }
            
            const height = amplitude * barMaxHeight;
            const y = (canvas.height - height) / 2;
            
            // Draw bar
            ctx.fillStyle = isActive ? waveColor : 'rgba(255,255,255,0.5)';
            ctx.fillRect(x, y, barWidth - 2, height);
        }
        
        if (isPlaying) {
            animationFrameId = requestAnimationFrame(drawWaveform);
        }
    }
    
    // Initial draw
    drawWaveform();
    
    return {
        play: function() {
            isPlaying = true;
            drawWaveform();
        },
        pause: function() {
            isPlaying = false;
            cancelAnimationFrame(animationFrameId);
        }
    };
}

// ---- PARALLAX BACKGROUND EFFECT ----
function initParallaxBackground() {
    const parallaxContainer = document.querySelector('.parallax-background');
    if (!parallaxContainer) return;
    
    // Create canvas for parallax background
    const canvas = document.createElement('canvas');
    canvas.width = parallaxContainer.offsetWidth;
    canvas.height = parallaxContainer.offsetHeight;
    parallaxContainer.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    // Create sound wave background
    const waveCount = 5;
    const waves = [];
    
    // Initialize waves with different properties
    for (let i = 0; i < waveCount; i++) {
        waves.push({
            frequency: 0.002 + (i * 0.001),
            amplitude: 20 + (i * 10),
            speed: 0.02 + (i * 0.005),
            phase: 0,
            color: `rgba(230, 181, 76, ${0.1 - (i * 0.015)})` // Gold with decreasing opacity
        });
    }
    
    let animationFrameId;
    let scrollOffset = 0;
    
    // Update scroll offset on window scroll
    window.addEventListener('scroll', () => {
        const rect = parallaxContainer.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
            scrollOffset = rect.top / window.innerHeight;
        }
    });
    
    function drawParallax() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw each wave
        waves.forEach((wave, index) => {
            ctx.beginPath();
            
            // Update phase for animation
            wave.phase += wave.speed;
            
            // Calculate parallax effect based on scroll
            const parallaxAmount = index * 20 * scrollOffset;
            
            // Calculate wave path
            for (let x = 0; x < canvas.width; x += 5) {
                const y = (canvas.height / 2) + 
                          parallaxAmount +
                          Math.sin(x * wave.frequency + wave.phase) * 
                          wave.amplitude;
                
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            // Style and draw the wave
            ctx.strokeStyle = wave.color;
            ctx.lineWidth = 3;
            ctx.stroke();
        });
        
        // Continue animation loop
        animationFrameId = requestAnimationFrame(drawParallax);
    }
    
    // Start animation
    drawParallax();
    
    // Handle resize
    window.addEventListener('resize', () => {
        canvas.width = parallaxContainer.offsetWidth;
        canvas.height = parallaxContainer.offsetHeight;
    });
    
    // Cleanup function
    return () => {
        cancelAnimationFrame(animationFrameId);
    };
}

// ---- SERVICE CARD SCROLL INTERACTION ----
function initServiceCardScroll() {
    const serviceContainer = document.querySelector('.services-scroll-container');
    if (!serviceContainer) return;
    
    let isDown = false;
    let startX;
    let scrollLeft;
    
    // Mouse events
    serviceContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        serviceContainer.classList.add('active');
        startX = e.pageX - serviceContainer.offsetLeft;
        scrollLeft = serviceContainer.scrollLeft;
    });
    
    serviceContainer.addEventListener('mouseleave', () => {
        isDown = false;
        serviceContainer.classList.remove('active');
    });
    
    serviceContainer.addEventListener('mouseup', () => {
        isDown = false;
        serviceContainer.classList.remove('active');
    });
    
    serviceContainer.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - serviceContainer.offsetLeft;
        const walk = (x - startX) * 2; // Speed of scroll
        serviceContainer.scrollLeft = scrollLeft - walk;
    });
    
    // Touch events for mobile
    serviceContainer.addEventListener('touchstart', (e) => {
        startX = e.touches[0].pageX - serviceContainer.offsetLeft;
        scrollLeft = serviceContainer.scrollLeft;
    });
    
    serviceContainer.addEventListener('touchmove', (e) => {
        if (e.touches.length !== 1) return;
        const x = e.touches[0].pageX - serviceContainer.offsetLeft;
        const walk = (x - startX) * 2;
        serviceContainer.scrollLeft = scrollLeft - walk;
    });
}

// ---- SCROLL REVEAL ANIMATIONS ----
function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal');
    
    function checkReveal() {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;
        
        revealElements.forEach(element => {
            const revealTop = element.getBoundingClientRect().top;
            
            if (revealTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    }
    
    // Initial check
    checkReveal();
    
    // Check on scroll
    window.addEventListener('scroll', checkReveal);
}

// ---- MOBILE MENU TOGGLE ----
function initMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (!menuButton || !mobileMenu) return;
    
    menuButton.addEventListener('click', () => {
        menuButton.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open'); // Prevent scrolling when menu is open
    });
    
    // Close menu when clicking links
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuButton.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.classList.remove('menu-open');
        });
    });
}

// Add mobile menu HTML to the page programmatically
function addMobileMenu() {
    // Check if we're on mobile viewport
    if (window.innerWidth > 768) return;
    
    const header = document.querySelector('.site-header');
    if (!header) return;
    
    // Create mobile menu button if it doesn't exist
    if (!document.querySelector('.mobile-menu-toggle')) {
        const menuButton = document.createElement('button');
        menuButton.classList.add('mobile-menu-toggle');
        menuButton.setAttribute('aria-label', 'Toggle mobile menu');
        menuButton.innerHTML = `
            <span class="menu-bar"></span>
            <span class="menu-bar"></span>
            <span class="menu-bar"></span>
        `;
        
        // Get the navigation items
        const mainNav = document.querySelector('.main-navigation');
        const navItems = mainNav ? mainNav.innerHTML : '';
        
        // Create mobile menu
        const mobileMenu = document.createElement('div');
        mobileMenu.classList.add('mobile-menu');
        mobileMenu.innerHTML = navItems;
        
        // Add to header
        header.querySelector('.header-container').appendChild(menuButton);
        header.appendChild(mobileMenu);
        
        // Initialize mobile menu functionality
        initMobileMenu();
    }
}

// Initialize everything that needs the DOM to be ready
window.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initSoundWaveAnimation();
    initTestimonialSlider();
    initAudioSamples();
    initParallaxBackground();
    initServiceCardScroll();
    initScrollReveal();
    
    // Add and initialize mobile menu
    addMobileMenu();
    
    // Hide loading screen when everything is fully loaded
    window.addEventListener('load', hideLoadingScreen);
    
    // Handle resize events
    window.addEventListener('resize', () => {
        // Check if we need to add mobile menu
        addMobileMenu();
    });
});
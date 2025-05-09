// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('container').appendChild(renderer.domElement);

// Add subtle ambient light
const ambientLight = new THREE.AmbientLight(0x332244, 0.5);
scene.add(ambientLight);

// Add directional light for better shape definition
const directionalLight = new THREE.DirectionalLight(0xff88cc, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Add fog for depth
scene.fog = new THREE.FogExp2(0x000020, 0.01);

// Create a better heart shape
const heartShape = new THREE.Shape();
// Heart shape coordinates - improved to look more heart-like
heartShape.moveTo(0, 0);
heartShape.bezierCurveTo(0, -1.5, -2, -3, -4, -1.5);
heartShape.bezierCurveTo(-6.5, 0.5, -6.5, 4, -4, 7);
heartShape.bezierCurveTo(-2, 9, 0, 10, 0, 12);
heartShape.bezierCurveTo(0, 10, 2, 9, 4, 7);
heartShape.bezierCurveTo(6.5, 4, 6.5, 0.5, 4, -1.5);
heartShape.bezierCurveTo(2, -3, 0, -1.5, 0, 0);

// Create extruded heart geometry for better 3D look
const extrudeSettings = {
    depth: 0.5,
    bevelEnabled: true,
    bevelSegments: 2,
    bevelSize: 0.1,
    bevelThickness: 0.1
};
const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
geometry.scale(0.08, 0.08, 0.08);
geometry.rotateX(Math.PI); // Correct orientation

// Create a gradient background that fills the entire screen
const gradientTexture = new THREE.CanvasTexture(createGradientCanvas());
// Make the background geometry much larger to ensure it covers the entire screen regardless of camera position
const backgroundGeometry = new THREE.PlaneGeometry(500, 500);
const backgroundMaterial = new THREE.MeshBasicMaterial({
    map: gradientTexture,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide // Visible from both sides
});
const background = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
// Position it far back to ensure it's behind everything
background.position.z = -200;
scene.add(background);

// Function to create gradient canvas with improved colors
function createGradientCanvas() {
    const canvas = document.createElement('canvas');
    // Higher resolution for better quality
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext('2d');
    
    // Create larger gradient to ensure it fills the plane
    const gradient = context.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 1.5
    );
    
    // Enhanced colors with more vibrant hues
    gradient.addColorStop(0, 'rgba(106, 13, 173, 1)');    // Rich purple center
    gradient.addColorStop(0.3, 'rgba(85, 10, 135, 1)');   // Deep purple
    gradient.addColorStop(0.6, 'rgba(40, 5, 80, 0.9)');   // Mid transition
    gradient.addColorStop(0.8, 'rgba(20, 0, 40, 0.8)');   // Darker edge
    gradient.addColorStop(1, 'rgba(5, 0, 20, 0.7)');      // Almost black edge
    
    // Fill with gradient
    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add a subtle noise texture for more visual interest
    addNoiseToCanvas(context, canvas.width, canvas.height, 0.03);
    
    return canvas;
}

// Function to add subtle noise to the gradient
function addNoiseToCanvas(context, width, height, intensity) {
    const imageData = context.getImageData(0, 0, width, height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        // Apply very subtle noise to each pixel
        const noise = (Math.random() - 0.5) * intensity * 255;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));       // R
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise)); // G
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise)); // B
    }
    
    context.putImageData(imageData, 0, 0);
}

const hearts = [];

// Create floating hearts with improved materials
for (let i = 0; i < 70; i++) {
    // Use different materials for variety
    let material;
    
    if (Math.random() > 0.7) {
        // Shiny metallic hearts
        material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(`hsl(${Math.random() * 60 + 330}, 100%, 70%)`),
            metalness: 0.7,
            roughness: 0.2,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: Math.random() * 0.5 + 0.5
        });
    } else {
        // Regular hearts with different colors
        material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(`hsl(${Math.random() * 60 + 330}, 100%, 70%)`),
            emissive: new THREE.Color(`hsl(${Math.random() * 60 + 330}, 80%, 30%)`),
            specular: new THREE.Color(0xffffff),
            shininess: 50,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: Math.random() * 0.5 + 0.5
        });
    }
    
    const heart = new THREE.Mesh(geometry, material);
    
    // Improved distribution for position
    const radius = Math.random() * 35 + 5;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    heart.position.x = radius * Math.sin(phi) * Math.cos(theta);
    heart.position.y = radius * Math.sin(phi) * Math.sin(theta);
    heart.position.z = radius * Math.cos(phi) - 10;
    
    // Random rotation
    heart.rotation.x = Math.random() * Math.PI;
    heart.rotation.y = Math.random() * Math.PI;
    heart.rotation.z = Math.random() * Math.PI;
    
    // Random scale with more variation
    const scale = Math.random() * 1.2 + 0.5;
    heart.scale.set(scale, scale, scale);
    
    // Improved movement data
    heart.userData = {
        speedX: Math.random() * 0.02 - 0.01,
        speedY: Math.random() * 0.02 + 0.005,
        speedZ: Math.random() * 0.02 - 0.01,
        rotationX: Math.random() * 0.02 - 0.01,
        rotationY: Math.random() * 0.02 - 0.01,
        rotationZ: Math.random() * 0.01 - 0.005,
        pulseSpeed: Math.random() * 0.005 + 0.002,
        pulseIntensity: Math.random() * 0.1 + 0.05,
        originalScale: scale,
        pulseFactor: 0
    };
    
    scene.add(heart);
    hearts.push(heart);
}

// Create better stars background - different sizes and colors
const starsGeometry = new THREE.BufferGeometry();
const starsVertices = [];
const starsSizes = [];
const starsColors = [];

for (let i = 0; i < 3000; i++) {
    // Distribute stars in a sphere
    const radius = Math.random() * 500 + 200;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi) - 100;
    
    starsVertices.push(x, y, z);
    
    // Vary star sizes
    starsSizes.push(Math.random() * 2 + 0.5);
    
    // Vary star colors slightly
    const color = new THREE.Color();
    if (Math.random() > 0.8) {
        // Some colored stars
        color.setHSL(Math.random(), 0.5, 0.7);
    } else {
        // Most stars white with slight blue/yellow tint
        color.setHSL(Math.random() * 0.2 + 0.5, 0.2, 0.9);
    }
    
    starsColors.push(color.r, color.g, color.b);
}

starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
starsGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starsSizes, 1));
starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starsColors, 3));

// Use shader material for stars for better rendering
const starsMaterial = new THREE.PointsMaterial({
    size: 0.5,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
});

const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// Set camera position
camera.position.z = 15;

// Sample memory photos (replace with actual paths to photos)
const memories = [
    { path: 'images/photo1.jpg', rotation: '-5deg' },
    { path: 'images/photo2.jpg', rotation: '3deg' },
    { path: 'images/photo3.jpg', rotation: '-2deg' },
    { path: 'images/photo4.jpg', rotation: '4deg' },
    { path: 'images/photo5.jpg', rotation: '-3deg' },
    { path: 'images/photo6.jpg', rotation: '2deg' }
];

// Add memory photos to the page with lazy loading
const memoriesContainer = document.querySelector('.memories-container');
memories.forEach(memory => {
    const memoryElement = document.createElement('div');
    memoryElement.classList.add('memory');
    memoryElement.style.setProperty('--rotation', memory.rotation);
    
    // Add loading animation while image loads
    memoryElement.innerHTML = `
        <div class="memory-loading"></div>
    `;
    
    // Load image in background
    const img = new Image();
    img.onload = () => {
        memoryElement.style.backgroundImage = `url(${memory.path})`;
        memoryElement.querySelector('.memory-loading').remove();
        
        // Add a reveal animation after load
        memoryElement.classList.add('loaded');
    };
    img.onerror = () => {
        // Handle missing images gracefully
        memoryElement.style.backgroundImage = 'linear-gradient(45deg, #ff4081, #7c4dff)';
        memoryElement.innerHTML = '<div class="memory-error">❤️</div>';
    };
    img.src = memory.path;
    
    memoriesContainer.appendChild(memoryElement);
    
    // Add click event for larger view
    memoryElement.addEventListener('click', () => {
        const fullView = document.createElement('div');
        fullView.classList.add('full-view');
        fullView.style.backgroundImage = memoryElement.style.backgroundImage;
        fullView.addEventListener('click', () => {
            fullView.classList.add('closing');
            setTimeout(() => fullView.remove(), 300);
        });
        document.body.appendChild(fullView);
    });
});

// Add scroll listening for parallax effects
let scrollY = window.scrollY;
let ticking = false;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Parallax effect for content
            const title = document.querySelector('.title');
            if (title) {
                title.style.transform = `translateY(${scrollY * 0.2}px) scale(${1 - scrollY * 0.0005})`;
            }
            
            // Move camera slightly based on scroll
            if (camera && camera.position) {
                camera.position.y = -scrollY * 0.01;
                camera.lookAt(0, camera.position.y, 0);
            }
            
            ticking = false;
        });
        ticking = true;
    }
});

// Animation loop with improved effects
function animate() {
    requestAnimationFrame(animate);
    
    // Time-based animation
    const time = Date.now() * 0.001;
    
    // Animate hearts with improved movement
    hearts.forEach(heart => {
        // Standard movement
        heart.position.x += heart.userData.speedX;
        heart.position.y += heart.userData.speedY;
        heart.position.z += heart.userData.speedZ;
        
        // Add slight oscillation to movement
        heart.position.x += Math.sin(time * 0.5 + heart.position.y) * 0.01;
        heart.position.y += Math.cos(time * 0.7 + heart.position.x) * 0.01;
        
        // Rotation
        heart.rotation.x += heart.userData.rotationX;
        heart.rotation.y += heart.userData.rotationY;
        heart.rotation.z += heart.userData.rotationZ;
        
        // Pulsing effect
        heart.userData.pulseFactor = Math.sin(time * heart.userData.pulseSpeed) * heart.userData.pulseIntensity;
        const newScale = heart.userData.originalScale * (1 + heart.userData.pulseFactor);
        heart.scale.set(newScale, newScale, newScale);
        
        // Reset position if heart moves too far away
        if (heart.position.y > 30) {
            heart.position.y = -30;
        }
        if (heart.position.x > 30 || heart.position.x < -30) {
            heart.position.x *= -0.8;
        }
        if (heart.position.z > 30 || heart.position.z < -30) {
            heart.position.z *= -0.8;
        }
    });
    
    // Rotate stars with dynamic effect
    stars.rotation.y += 0.0001;
    stars.rotation.x = Math.sin(time * 0.05) * 0.03;
    
    // Make background slowly shift colors
    if (background && background.material && background.material.map) {
        background.material.map.needsUpdate = true;
        
        // Subtle rotation of background
        background.rotation.z = Math.sin(time * 0.1) * 0.03;
    }
    
    renderer.render(scene, camera);
}

// Handle window resize with performance optimization
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

let resizeTimeout;
window.addEventListener('resize', () => {
    // Debounce resize event
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(onWindowResize, 100);
});

// Add additional styles for full-screen photo view and animations
const style = document.createElement('style');
style.textContent = `
    .memory-loading {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(45deg, #3a1c71, #d76d77, #ffaf7b);
        background-size: 200% 200%;
        animation: gradient 2s ease infinite;
    }
    
    .memory-loading::after {
        content: '❤️';
        font-size: 30px;
        animation: pulse 1s ease-in-out infinite;
    }
    
    .memory-error {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
    }
    
    .memory.loaded {
        animation: fadeIn 0.5s ease-out forwards;
    }
    
    .full-view {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        background-color: rgba(0, 0, 0, 0.9);
        z-index: 1000;
        opacity: 0;
        animation: fadeIn 0.3s forwards;
        cursor: pointer;
    }
    
    .full-view.closing {
        animation: fadeOut 0.3s forwards;
    }
    
    @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(style);

// Handle music toggle
const musicToggle = document.querySelector('.music-toggle');
const backgroundMusic = document.getElementById('background-music');

if (musicToggle && backgroundMusic) {
    musicToggle.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.volume = 0.5;
            backgroundMusic.play()
                .then(() => {
                    musicToggle.classList.add('playing');
                })
                .catch(err => {
                    console.log('Audio playback prevented by browser:', err);
                    // Create a visual cue to show music needs user interaction
                    musicToggle.classList.add('needs-interaction');
                    musicToggle.querySelector('.music-icon').textContent = '🔇';
                });
        } else {
            backgroundMusic.pause();
            musicToggle.classList.remove('playing');
            musicToggle.querySelector('.music-icon').textContent = '🎵';
        }
    });
}

// Add confetti effect when page loads
function createConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.body.appendChild(confettiContainer);
    
    const colors = ['#ff4081', '#7c4dff', '#ff9e80', '#64ffda', '#ffeb3b'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDelay = Math.random() * 5 + 's';
        confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
        
        confettiContainer.appendChild(confetti);
    }
    
    // Add confetti styles
    const confettiStyle = document.createElement('style');
    confettiStyle.textContent = `
        .confetti-container {
            position: fixed;
            top: -20px;
            left: 0;
            width: 100%;
            height: 100vh;
            overflow: hidden;
            z-index: 2;
            pointer-events: none;
        }
        
        .confetti {
            position: absolute;
            width: 10px;
            height: 10px;
            opacity: 0.7;
            border-radius: 15%;
            transform: rotate(45deg);
            animation: fall linear forwards;
        }
        
        @keyframes fall {
            0% {
                top: -20px;
                transform: rotate(0) translateX(0);
            }
            100% {
                top: 100vh;
                transform: rotate(360deg) translateX(calc(5vw - 2.5vw * Math.random()));
            }
        }
    `;
    document.head.appendChild(confettiStyle);
}

// Handle cake click to trigger confetti and cake animation
const cake = document.querySelector('.cake');
const flame = document.querySelector('.flame');
const cakeText = document.querySelector('.cake-text');
let cakeClicked = false;

if (cake) {
    cake.addEventListener('click', () => {
        if (!cakeClicked) {
            // First click - blow out candle
            if (flame) {
                flame.style.opacity = '0';
                flame.style.boxShadow = 'none';
                
                // Change cake text to "Yay!"
                if (cakeText) {
                    cakeText.textContent = "Yay!";
                    cakeText.style.background = "rgba(124, 77, 255, 0.8)";
                }
                
                // Add smoke effect
                const smoke = document.createElement('div');
                smoke.classList.add('smoke');
                cake.appendChild(smoke);
                
                // Add smoke animation styles
                const smokeStyle = document.createElement('style');
                smokeStyle.textContent = `
                    .smoke {
                        position: absolute;
                        width: 5px;
                        height: 10px;
                        background: rgba(200, 200, 200, 0.6);
                        border-radius: 50%;
                        top: -50px;
                        left: 50%;
                        transform: translateX(-50%);
                        z-index: 12;
                        animation: smokeUp 3s ease-out forwards;
                    }
                    @keyframes smokeUp {
                        0% {
                            opacity: 1;
                            width: 5px;
                            height: 10px;
                        }
                        25% { 
                            opacity: 0.8;
                            width: 8px;
                            height: 12px;
                        }
                        50% {
                            opacity: 0.6;
                            width: 10px;
                            height: 14px;
                            transform: translateX(-50%) translateY(-20px) scale(1.5);
                        }
                        100% {
                            opacity: 0;
                            width: 15px;
                            height: 20px;
                            transform: translateX(-50%) translateY(-40px) scale(2);
                        }
                    }
                `;
                document.head.appendChild(smokeStyle);
                
                // Make cake pulse
                cake.style.animation = 'pulse 0.5s ease-in-out';
                
                setTimeout(() => {
                    // Reset cake animation
                    cake.style.animation = 'float 4s ease-in-out infinite';
                    
                    // Create confetti
                    createConfetti();
                    
                    // Play birthday tune if music is not playing
                    if (backgroundMusic && backgroundMusic.paused) {
                        backgroundMusic.play().catch(e => console.log('Could not autoplay audio'));
                        if (musicToggle) musicToggle.classList.add('playing');
                    }
                    
                    // Update cake text again
                    if (cakeText) {
                        cakeText.textContent = "Happy Birthday!";
                        cakeText.style.background = "rgba(255, 158, 128, 0.8)";
                        cakeText.style.animation = "pulse 2s infinite";
                    }
                }, 1000);
                
                cakeClicked = true;
            }
        } else {
            // Additional clicks - just create more confetti
            createConfetti();
            
            // Fun messages on additional clicks
            if (cakeText) {
                const messages = [
                    "More confetti!",
                    "Woohoo!",
                    "Keep clicking!",
                    "Party time!",
                    "It's your day!",
                    "Make a wish!",
                    "Love you!",
                    "Celebrate!",
                    "Hooray!"
                ];
                
                cakeText.textContent = messages[Math.floor(Math.random() * messages.length)];
                
                // Random background colors
                const hue = Math.floor(Math.random() * 360);
                cakeText.style.background = `hsla(${hue}, 80%, 60%, 0.8)`;
            }
        }
    });
}

// Create a helper to check if device can handle advanced effects
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
if (isMobile) {
    // Reduce effects for mobile
    scene.fog.density = 0.005;
    renderer.setPixelRatio(1);
    
    // Reduce number of hearts and stars
    hearts.forEach((heart, index) => {
        if (index % 2 === 0) heart.visible = false;
    });
}

// Add fade-in effect to sections when scrolling
const sections = document.querySelectorAll('section');
if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    sections.forEach(section => {
        section.classList.add('fade-section');
        observer.observe(section);
    });
    
    // Add fade-in section styles
    const sectionStyle = document.createElement('style');
    sectionStyle.textContent = `
        .fade-section {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.8s ease, transform 0.8s ease;
        }
        
        .fade-section.visible {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(sectionStyle);
}

// Start animation
animate();
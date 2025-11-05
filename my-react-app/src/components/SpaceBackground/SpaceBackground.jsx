import React, { useEffect, useRef } from 'react';
import './SpaceBackground.css';

const SpaceBackground = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle system
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Reset particle if it goes off screen
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    // Planet class
    class Planet {
      constructor() {
        this.reset();
      }

      reset() {
        this.size = Math.random() * 40 + 20;
        this.x = -this.size - Math.random() * 100;
        this.y = Math.random() * canvas.height;
        this.speedX = Math.random() * 0.3 + 0.1;
        this.speedY = Math.random() * 0.2 - 0.1;
        this.color = this.getRandomPlanetColor();
        this.glow = Math.random() * 10 + 5;
        this.rotation = 0;
        this.rotationSpeed = Math.random() * 0.02 - 0.01;
      }

      getRandomPlanetColor() {
        const colors = [
          '#4A6572', '#344955', '#F9AA33', '#232F34',
          '#5D8CA8', '#7A9EB1', '#8B4513', '#2F4F4F',
          '#696969', '#8B7355', '#2E8B57', '#4682B4'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.rotation += this.rotationSpeed;

        // Reset planet if it goes off screen
        if (this.x > canvas.width + this.size) {
          this.reset();
          this.x = -this.size;
        }
      }

      draw() {
        ctx.save();
        
        // Planet glow
        const gradient = ctx.createRadialGradient(
          this.x, this.y, this.size,
          this.x, this.y, this.size + this.glow
        );
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size + this.glow, 0, Math.PI * 2);
        ctx.fill();

        // Planet body
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Planet details (craters/features)
        ctx.fillStyle = this.adjustColor(this.color, -20);
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2 + this.rotation;
          const craterX = this.x + Math.cos(angle) * (this.size * 0.6);
          const craterY = this.y + Math.sin(angle) * (this.size * 0.6);
          const craterSize = this.size * 0.1;
          
          ctx.beginPath();
          ctx.arc(craterX, craterY, craterSize, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.restore();
      }

      adjustColor(color, amount) {
        let usePound = false;
        if (color[0] === "#") {
          color = color.slice(1);
          usePound = true;
        }
        const num = parseInt(color, 16);
        let r = (num >> 16) + amount;
        if (r > 255) r = 255;
        else if (r < 0) r = 0;
        let b = ((num >> 8) & 0x00FF) + amount;
        if (b > 255) b = 255;
        else if (b < 0) b = 0;
        let g = (num & 0x0000FF) + amount;
        if (g > 255) g = 255;
        else if (g < 0) g = 0;
        return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
      }
    }

    // Create particles and planets
    const particles = Array.from({ length: 200 }, () => new Particle());
    const planets = Array.from({ length: 3 }, () => new Planet());

    // Animation loop
    const animate = () => {
      ctx.fillStyle = '#0a0a1a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw stars (background)
      for (let i = 0; i < 50; i++) {
        const x = (i * canvas.width / 50 + Date.now() * 0.0001) % canvas.width;
        const y = Math.sin(i) * canvas.height / 4 + canvas.height / 2;
        const size = Math.sin(Date.now() * 0.001 + i) * 1 + 1;
        
        ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.sin(Date.now() * 0.001 + i) * 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update and draw particles
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Update and draw planets
      planets.forEach(planet => {
        planet.update();
        planet.draw();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="space-background">
      <canvas 
        ref={canvasRef} 
        className="space-canvas"
      />
      <div className="space-overlay"></div>
    </div>
  );
};

export default SpaceBackground;
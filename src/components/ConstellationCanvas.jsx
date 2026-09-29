import React, { useEffect, useRef } from 'react';

const ConstellationCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = [];
    const properties = {
      bgColor: 'transparent',
      particleColor: 'rgba(124, 58, 237, 0.35)',
      particleRadius: 2,
      particleCount: 35,
      particleMaxVelocity: 0.3,
      lineLength: 120,
      particleLife: 6,
    };

    // Keep track of mouse position
    let mouse = { x: null, y: null };
    
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.velocityX = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
        this.velocityY = Math.random() * (properties.particleMaxVelocity * 2) - properties.particleMaxVelocity;
      }
      
      position() {
        // Bounce off walls
        if(this.x + this.velocityX > width && this.velocityX > 0 || this.x + this.velocityX < 0 && this.velocityX < 0) {
            this.velocityX *= -1;
        }
        if(this.y + this.velocityY > height && this.velocityY > 0 || this.y + this.velocityY < 0 && this.velocityY < 0) {
            this.velocityY *= -1;
        }
        this.x += this.velocityX;
        this.y += this.velocityY;
      }
      
      reDraw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, properties.particleRadius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fillStyle = properties.particleColor;
        ctx.fill();
      }
    }

    for(let i = 0 ; i < properties.particleCount ; i++){
      particles.push(new Particle());
    }

    const drawLines = () => {
      let x1, y1, x2, y2, length, opacity;
      for(let i = 0; i < particles.length; i++) {
        for(let j = i + 1; j < particles.length; j++) {
          x1 = particles[i].x;
          y1 = particles[i].y;
          x2 = particles[j].x;
          y2 = particles[j].y;
          length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
          if(length < properties.lineLength) {
            opacity = 1 - length / properties.lineLength;
            ctx.lineWidth = '0.5';
            ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`; // Cyan lines
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.closePath();
            ctx.stroke();
          }
        }
        
        // Connect to mouse
        if (mouse.x != null && mouse.y != null) {
            let dMouse = Math.sqrt(Math.pow(particles[i].x - mouse.x, 2) + Math.pow(particles[i].y - mouse.y, 2));
            if (dMouse < properties.lineLength * 1.5) {
                opacity = 1 - dMouse / (properties.lineLength * 1.5);
                ctx.lineWidth = '1';
                ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`; // Violet to mouse
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.closePath();
                ctx.stroke();
            }
        }
      }
    }

    let animationFrameId;
    const loop = () => {
      ctx.clearRect(0, 0, width, height);
      for(let i = 0; i < particles.length; i++) {
        particles[i].position();
        particles[i].reDraw();
      }
      drawLines();
      animationFrameId = requestAnimationFrame(loop);
    }
    
    loop();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    />
  );
};

export default ConstellationCanvas;

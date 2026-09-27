import React, { useEffect, useRef } from 'react';

const SwarmCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = [];
    const numParticles = 150;
    
    let mouse = { x: width / 2, y: height / 2 };
    
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 2 + 1,
        color: Math.random() > 0.5 ? 'rgba(124, 58, 237, 0.8)' : 'rgba(6, 182, 212, 0.8)',
        angle: Math.random() * Math.PI * 2,
        orbitRadius: Math.random() * 100 + 20,
        speed: Math.random() * 0.05 + 0.01
      });
    }

    let animationFrameId;

    const draw = () => {
      // Trail effect
      ctx.fillStyle = 'rgba(10, 10, 15, 0.15)';
      ctx.fillRect(0, 0, width, height);

      for (let i = 0; i < numParticles; i++) {
        let p = particles[i];
        
        // Calculate target position based on mouse and orbit
        const targetX = mouse.x + Math.cos(p.angle) * p.orbitRadius;
        const targetY = mouse.y + Math.sin(p.angle) * p.orbitRadius;
        
        // Move towards target smoothly
        p.vx += (targetX - p.x) * 0.01;
        p.vy += (targetY - p.y) * 0.01;
        
        // Add friction
        p.vx *= 0.92;
        p.vy *= 0.92;
        
        p.x += p.vx;
        p.y += p.vy;
        
        p.angle += p.speed;
        
        // Draw glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0; // reset
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

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
        pointerEvents: 'none',
        background: 'transparent'
      }}
    />
  );
};

export default SwarmCanvas;

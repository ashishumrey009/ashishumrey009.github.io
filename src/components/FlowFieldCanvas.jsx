import React, { useEffect, useRef } from 'react';

const FlowFieldCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const particles = [];
    const numParticles = 1000;
    
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        speed: Math.random() * 2 + 0.5,
        color: Math.random() > 0.5 ? '#7C3AED' : '#06B6D4' // Violet and Cyan
      });
    }

    let time = 0;
    let animationFrameId;

    const draw = () => {
      // Very faint clear to leave long curling trails
      ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
      ctx.fillRect(0, 0, width, height);

      time += 0.005;

      for (let i = 0; i < numParticles; i++) {
        let p = particles[i];
        
        // Pseudo-random math function to create a curling flow field
        // scale determines how tight the curls are
        const scale = 0.003;
        const angle = Math.sin(p.x * scale + time) * Math.cos(p.y * scale + time) * Math.PI * 4;
        
        // Set velocity based on flow field angle
        p.vx = Math.cos(angle) * p.speed;
        p.vy = Math.sin(angle) * p.speed;
        
        p.x += p.vx;
        p.y += p.vy;
        
        // Wrap around screen
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        
        // Draw particle
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
        ctx.fill();
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
        background: '#0a0a0f'
      }}
    />
  );
};

export default FlowFieldCanvas;

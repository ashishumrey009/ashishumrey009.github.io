import React, { useEffect, useRef } from 'react';

const WaveCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const dotRadius = 1.5;
    const spacing = 40;
    
    let time = 0;
    
    let mouse = { x: width / 2, y: height / 2 };
    
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    let animationFrameId;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      const rows = Math.floor(height / spacing) + 2;
      const cols = Math.floor(width / spacing) + 2;
      
      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          
          const px = x * spacing;
          const py = y * spacing;
          
          // Math magic for the wave
          const dx = px - mouse.x;
          const dy = py - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          const waveHeight = Math.sin((x * 0.3) + time) * Math.cos((y * 0.3) + time) * 20;
          const ripple = Math.sin(dist * 0.02 - time * 2) * 15;
          
          const finalY = py + waveHeight + ripple;
          
          // Color mixing based on coordinates and time
          const r = 124; // Violet base
          const g = 58;
          const b = 237;
          
          const r2 = 6;  // Cyan base
          const g2 = 182;
          const b2 = 212;
          
          const mix = (Math.sin(x * 0.1 + time) + 1) / 2; // 0 to 1
          
          const cr = Math.floor(r * mix + r2 * (1 - mix));
          const cg = Math.floor(g * mix + g2 * (1 - mix));
          const cb = Math.floor(b * mix + b2 * (1 - mix));
          
          const size = dotRadius + Math.max(0, (waveHeight + ripple) * 0.1);

          ctx.beginPath();
          ctx.arc(px, finalY, size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${cr}, ${cg}, ${cb}, 0.7)`;
          ctx.fill();
        }
      }
      
      time += 0.03;
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

export default WaveCanvas;

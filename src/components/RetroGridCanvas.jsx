import React, { useEffect, useRef } from 'react';

const RetroGridCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    let time = 0;
    let animationFrameId;

    const draw = () => {
      // Clear with dark bg
      ctx.fillStyle = '#0a0a0f';
      ctx.fillRect(0, 0, width, height);

      // We will draw a perspective grid
      const cy = height * 0.4; // Horizon line
      const speed = 2; // Speed of movement
      
      time += speed;
      
      // Add a cool sun/glow at the horizon
      const sunGradient = ctx.createRadialGradient(width / 2, cy, 0, width / 2, cy, 300);
      sunGradient.addColorStop(0, 'rgba(124, 58, 237, 0.4)');
      sunGradient.addColorStop(1, 'rgba(10, 10, 15, 0)');
      ctx.fillStyle = sunGradient;
      ctx.fillRect(0, 0, width, height);

      // Draw horizontal lines (moving towards camera)
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)'; // Cyan
      ctx.lineWidth = 1;
      
      const numHorizontals = 30;
      for (let i = 0; i < numHorizontals; i++) {
        // Perspective math: z goes from far to near
        // We use modulo to make lines loop
        let z = ((i * 20) - (time % 20) + 1);
        if (z < 1) z = 1; // Prevent division by zero
        
        let y = cy + (height * 10) / z;
        
        // Don't draw lines above horizon
        if (y > cy) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          // Fade lines near horizon
          const alpha = Math.min(1, Math.max(0, (y - cy) / (height - cy) * 1.5));
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.stroke();
        }
      }

      // Draw vertical lines (radiating from center horizon)
      const numVerticals = 30;
      const spacing = width / 10; // Spacing at the bottom of the screen
      const cx = width / 2;
      
      for (let i = -numVerticals; i <= numVerticals; i++) {
        const xBottom = cx + i * spacing;
        const xTop = cx + (i * spacing * 0.1); // Converge at horizon
        
        ctx.beginPath();
        ctx.moveTo(xTop, cy);
        ctx.lineTo(xBottom, height);
        
        // Gradient stroke for vertical lines to fade at horizon
        const grad = ctx.createLinearGradient(0, cy, 0, height);
        grad.addColorStop(0, 'rgba(124, 58, 237, 0)');
        grad.addColorStop(0.2, 'rgba(124, 58, 237, 0.2)');
        grad.addColorStop(1, 'rgba(124, 58, 237, 0.8)'); // Violet
        
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      // Draw horizon line
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#06B6D4';
      ctx.strokeStyle = '#06B6D4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
      ctx.stroke();
      ctx.shadowBlur = 0; // reset

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
        pointerEvents: 'none'
      }}
    />
  );
};

export default RetroGridCanvas;

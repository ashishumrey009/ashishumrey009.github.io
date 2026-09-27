import React, { useEffect, useRef } from 'react';

const HexagonCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const hexRadius = 30;
    const hexHeight = hexRadius * Math.sqrt(3);
    const hexWidth = hexRadius * 2;
    
    // Grid spacing
    const xOffset = hexWidth * 0.75;
    const yOffset = hexHeight;

    let mouse = { x: -1000, y: -1000 };
    
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const drawHexagon = (x, y, opacity, isCyan) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle_deg = 60 * i;
        const angle_rad = Math.PI / 180 * angle_deg;
        const hx = x + hexRadius * Math.cos(angle_rad);
        const hy = y + hexRadius * Math.sin(angle_rad);
        if (i === 0) {
          ctx.moveTo(hx, hy);
        } else {
          ctx.lineTo(hx, hy);
        }
      }
      ctx.closePath();
      
      const color = isCyan ? `rgba(6, 182, 212, ${opacity})` : `rgba(124, 58, 237, ${opacity})`;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      
      // Inner fill for stronger glows
      if (opacity > 0.3) {
          ctx.fillStyle = isCyan ? `rgba(6, 182, 212, ${opacity * 0.2})` : `rgba(124, 58, 237, ${opacity * 0.2})`;
          ctx.fill();
      }
    };

    let animationFrameId;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      const cols = Math.ceil(width / xOffset) + 1;
      const rows = Math.ceil(height / yOffset) + 1;
      
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          
          let x = col * xOffset;
          let y = row * yOffset;
          
          // Offset odd columns down by half a hex height
          if (col % 2 !== 0) {
            y += yOffset / 2;
          }
          
          // Calculate distance to mouse
          const dx = x - mouse.x;
          const dy = y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          const maxDist = 250;
          let opacity = 0.05; // Base faint visibility
          
          if (dist < maxDist) {
             // Glow gets stronger as mouse gets closer
             opacity = 0.05 + (1 - (dist / maxDist)) * 0.8;
          }
          
          // Checkerboard pattern for colors
          const isCyan = (row + col) % 2 === 0;
          
          drawHexagon(x, y, opacity, isCyan);
        }
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
        pointerEvents: 'none',
        background: 'transparent'
      }}
    />
  );
};

export default HexagonCanvas;

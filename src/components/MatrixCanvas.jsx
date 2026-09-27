import React, { useEffect, useRef } from 'react';

const MatrixCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=';
    const matrix = letters.split('');
    const fontSize = 16;
    let columns = width / fontSize;
    const drops = [];
    for(let x = 0; x < columns; x++) {
      drops[x] = Math.random() * height; // random start height
    }
    
    const draw = () => {
      // Dark background with slight opacity to create the fading trail effect
      ctx.fillStyle = 'rgba(10, 10, 15, 0.05)';
      ctx.fillRect(0, 0, width, height);
      
      ctx.font = fontSize + 'px monospace';
      
      for(let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        
        // Randomly mix violet and cyan for your specific theme
        if(Math.random() > 0.8) {
             ctx.fillStyle = '#06B6D4'; // Cyan
        } else {
             ctx.fillStyle = '#7C3AED'; // Violet
        }

        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // Reset drop to top randomly to create staggered raining effect
        if(drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };
    
    const interval = setInterval(draw, 33); // ~30fps
    
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = width / fontSize;
      const oldDropsLength = drops.length;
      if (columns > oldDropsLength) {
          for(let x = oldDropsLength; x < columns; x++) {
            drops[x] = 1;
          }
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      clearInterval(interval);
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
        opacity: 0.6,
        pointerEvents: 'none'
      }}
    />
  );
};

export default MatrixCanvas;

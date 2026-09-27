import React, { useEffect, useRef } from 'react';

const StarfieldCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const numStars = 800;
    const stars = [];
    const speed = 2; // Warp speed multiplier

    // Initialize stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * width - width / 2,
        y: Math.random() * height - height / 2,
        z: Math.random() * width,
        pz: Math.random() * width,
      });
    }

    let animationFrameId;

    const draw = () => {
      // Dark transparent background for trails
      ctx.fillStyle = 'rgba(10, 10, 15, 0.4)';
      ctx.fillRect(0, 0, width, height);

      // Center the origin
      const cx = width / 2;
      const cy = height / 2;

      for (let i = 0; i < numStars; i++) {
        let star = stars[i];

        // Move star closer
        star.z = star.z - speed;

        // Reset if it passes the camera
        if (star.z < 1) {
          star.x = Math.random() * width - width / 2;
          star.y = Math.random() * height - height / 2;
          star.z = width;
          star.pz = width; // Previous z
        }

        // Project 3D coordinates to 2D
        const px = cx + (star.x / star.z) * width;
        const py = cy + (star.y / star.z) * width;

        // Draw star trail
        const ppx = cx + (star.x / star.pz) * width;
        const ppy = cy + (star.y / star.pz) * width;
        
        star.pz = star.z;

        // Map depth to size and opacity
        const size = (1 - star.z / width) * 3;
        const opacity = 1 - star.z / width;

        // Randomly color some stars Violet and some Cyan
        if (i % 3 === 0) {
           ctx.fillStyle = `rgba(6, 182, 212, ${opacity})`; // Cyan
           ctx.strokeStyle = `rgba(6, 182, 212, ${opacity})`;
        } else {
           ctx.fillStyle = `rgba(124, 58, 237, ${opacity})`; // Violet
           ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
        }

        ctx.beginPath();
        ctx.arc(px, py, size, 0, Math.PI * 2);
        ctx.fill();

        // Trail line
        ctx.beginPath();
        ctx.moveTo(ppx, ppy);
        ctx.lineTo(px, py);
        ctx.lineWidth = size;
        ctx.stroke();
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

export default StarfieldCanvas;

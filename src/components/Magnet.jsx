// Magnet — adapted from react-bits (reactbits.dev/components/magnet)
// Wraps children in a magnetic hover effect that pulls the element toward the cursor
import { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

const Magnet = ({
  children,
  padding = 60,
  disabled = false,
  magnetStrength = 0.4,
  style = {},
  className = '',
}) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouseMove = (e) => {
    if (disabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;
    x.set(distX * magnetStrength);
    y.set(distY * magnetStrength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ display: 'inline-flex', x: springX, y: springY, ...style }}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
};

export default Magnet;

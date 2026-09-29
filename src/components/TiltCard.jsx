// TiltCard — adapted from react-bits (reactbits.dev/components/tilted-card)
// Wraps children in a 3D perspective tilt effect on mouse move
import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

const TiltCard = ({
  children,
  tiltMaxAngle = 5,
  scale = 1.01,
  style = {},
  className = '',
}) => {
  const ref = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-1, 1], [tiltMaxAngle, -tiltMaxAngle]), {
    stiffness: 120, damping: 25,
  });
  const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-tiltMaxAngle, tiltMaxAngle]), {
    stiffness: 120, damping: 25,
  });

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 2 - 1;
    const y = (e.clientY - rect.top) / rect.height * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        ...style,
      }}
      whileHover={{ scale }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default TiltCard;

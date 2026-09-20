// BlurText — adapted from react-bits (reactbits.dev/text-animations/blur-text)
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

const BlurText = ({
  text = '',
  delay = 150,
  className = '',
  animateBy = 'words',
  direction = 'top',
  threshold = 0.1,
  rootMargin = '0px',
  stepDuration = 0.38,
  onAnimationComplete,
}) => {
  const elements = animateBy === 'words' ? text.split(' ') : text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  const fromY = direction === 'top' ? -24 : 24;

  return (
    <span ref={ref} className={className} style={{ display: 'inline' }}>
      {elements.map((el, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: 'blur(12px)', y: fromY }}
          animate={inView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
          transition={{
            duration: stepDuration,
            delay: i * (delay / 1000),
            ease: [0.215, 0.61, 0.355, 1],
          }}
          onAnimationComplete={
            i === elements.length - 1 && onAnimationComplete
              ? onAnimationComplete
              : undefined
          }
          style={{ display: 'inline-block', willChange: 'transform, opacity, filter' }}
        >
          {el}{animateBy === 'words' ? '\u00a0' : ''}
        </motion.span>
      ))}
    </span>
  );
};

export default BlurText;

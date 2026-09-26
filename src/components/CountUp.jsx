// CountUp — adapted from react-bits (reactbits.dev/text-animations/count-up)
import { useInView, useMotionValue, useSpring } from 'motion/react';
import { useEffect, useRef } from 'react';

const CountUp = ({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 1.8,
  className = '',
  startWhen = true,
  suffix = '',
  decimals = 0,
  onEnd,
}) => {
  const ref = useRef(null);
  const motionValue = useMotionValue(direction === 'down' ? to : from);

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);

  const springValue = useSpring(motionValue, { damping, stiffness });
  const isInView = useInView(ref, { once: true, margin: '0px' });

  useEffect(() => {
    if (!isInView || !startWhen) return;
    const timer = setTimeout(() => {
      motionValue.set(direction === 'down' ? from : to);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [isInView, startWhen, motionValue, delay, direction, from, to]);

  useEffect(() => {
    return springValue.on('change', (v) => {
      if (ref.current) {
        let numericValue = direction === 'down' ? Math.ceil(v) : Math.floor(v);
        if (decimals > 0) {
           numericValue = v;
        }
        const formatted = numericValue.toFixed(decimals);
        ref.current.textContent = formatted + suffix;
      }
    });
  }, [springValue, direction, suffix, decimals]);

  useEffect(() => {
    return springValue.on('animationComplete', () => {
      if (onEnd) onEnd();
    });
  }, [springValue, onEnd]);

  return (
    <span ref={ref} className={className}>
      {from}{suffix}
    </span>
  );
};

export default CountUp;

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  format?: (val: number) => string;
  duration?: number; // in seconds
  className?: string;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  format = (val) => Math.floor(val).toLocaleString(),
  duration = 1.5,
  className = ""
}) => {
  const [mounted, setMounted] = useState(false);
  const spring = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  const display = useTransform(spring, (current) => format(current));

  useEffect(() => {
    setMounted(true);
    spring.set(value);
  }, [value, spring]);

  return (
    <motion.span className={className}>
      {mounted ? display : format(0)}
    </motion.span>
  );
};

export default React.memo(AnimatedCounter);

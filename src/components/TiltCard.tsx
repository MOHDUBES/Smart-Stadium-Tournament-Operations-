import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useAppStore } from '../store/useStore';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  role?: string;
  tabIndex?: number;
  'aria-label'?: string;
}

const TiltCard: React.FC<TiltCardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  onKeyDown, 
  role, 
  tabIndex, 
  'aria-label': ariaLabel 
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { highContrast } = useAppStore();
  const [isHovered, setIsHovered] = useState(false);

  // Mouse position values
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for rotation
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 20 });

  // Map mouse position to rotation degrees
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['10deg', '-10deg']);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-10deg', '10deg']);

  // Map to shadow offset
  const shadowX = useTransform(mouseXSpring, [-0.5, 0.5], [-15, 15]);
  const shadowY = useTransform(mouseYSpring, [-0.5, 0.5], [-15, 15]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (highContrast || !ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    
    const width = rect.width;
    const height = rect.height;
    
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      role={role}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={onKeyDown}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: highContrast ? 0 : rotateX,
        rotateY: highContrast ? 0 : rotateY,
        transformStyle: "preserve-3d",
      }}
      animate={{
        z: isHovered && !highContrast ? 20 : 0,
        scale: isHovered && !highContrast ? 1.02 : 1,
      }}
      transition={{ duration: 0.2 }}
      className={`relative rounded-2xl ${className}`}
    >
      <motion.div
        className="absolute inset-0 z-[-1] rounded-2xl pointer-events-none"
        style={{
          boxShadow: useTransform(
            [shadowX, shadowY],
            ([sx, sy]) => highContrast 
              ? 'none' 
              : isHovered 
                ? `${sx}px ${sy}px 40px rgba(0, 0, 0, 0.6), 0 0 20px rgba(47, 191, 159, 0.2)`
                : '0 15px 35px -5px rgba(0,0,0,0.5)'
          ),
        }}
      />
      {children}
    </motion.div>
  );
};

export default TiltCard;

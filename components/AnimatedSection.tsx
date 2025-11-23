import React from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: React.ReactNode;
  animation?: 'fade-in-up' | 'fade-in-left' | 'fade-in-right' | 'fade-in' | 'scale-in';
  delay?: number;
  className?: string;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  animation = 'fade-in-up',
  delay = 0,
  className = '',
}) => {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
    triggerOnce: true,
  });

  const style = delay > 0 ? { transitionDelay: `${delay}ms` } : {};

  return (
    <div
      ref={elementRef}
      className={`${animation} ${isVisible ? 'visible' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;


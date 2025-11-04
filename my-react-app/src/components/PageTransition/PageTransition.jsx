// src/components/PageTransition/PageTransition.jsx
import { useState, useEffect } from 'react';
import './PageTransition.css';

const PageTransition = ({ children, activeSection }) => {
  const [displayChildren, setDisplayChildren] = useState(children);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (children !== displayChildren) {
      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setDisplayChildren(children);
        setIsTransitioning(false);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [children, displayChildren]);

  return (
    <div className={`page-transition ${isTransitioning ? 'transitioning' : ''}`}>
      {displayChildren}
    </div>
  );
};

export default PageTransition;
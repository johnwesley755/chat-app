import React, { useState, useRef, useEffect, useCallback, forwardRef } from 'react';

type TooltipPosition = 'top' | 'right' | 'bottom' | 'left';

// Define interface for child props to properly type them
interface ChildProps {
  onMouseEnter?: (e: React.MouseEvent) => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
  ref?: React.Ref<HTMLElement>;
}

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  position?: TooltipPosition;
  delay?: number;
  className?: string;
}

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 300,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const updatePosition = useCallback(() => {
    if (!targetRef.current || !tooltipRef.current) return;
    
    const targetRect = targetRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    
    let x = 0;
    let y = 0;
    
    switch (position) {
      case 'top':
        x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        y = targetRect.top - tooltipRect.height - 8;
        break;
      case 'right':
        x = targetRect.right + 8;
        y = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'bottom':
        x = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;
        y = targetRect.bottom + 8;
        break;
      case 'left':
        x = targetRect.left - tooltipRect.width - 8;
        y = targetRect.top + targetRect.height / 2 - tooltipRect.height / 2;
        break;
    }
    
    // Ensure tooltip stays within viewport
    x = Math.max(8, Math.min(x, window.innerWidth - tooltipRect.width - 8));
    y = Math.max(8, Math.min(y, window.innerHeight - tooltipRect.height - 8));
    
    setCoords({ x, y });
  }, [position]);
  
  const showTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delay);
  }, [delay, updatePosition]);
  
  const hideTooltip = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  }, []);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (isVisible) {
      const handleScroll = () => {
        updatePosition();
      };
      
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('scroll', handleScroll, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [isVisible, updatePosition]);
  
  const positionClasses = {
    top: 'origin-bottom',
    right: 'origin-left',
    bottom: 'origin-top',
    left: 'origin-right',
  };
  
  // Use a simpler approach with a callback ref
  const setTargetRef = useCallback((node: HTMLElement | null) => {
    targetRef.current = node;
  }, []);
  
  // Create event handler props
  const eventHandlers = {
    onMouseEnter: (e: React.MouseEvent) => {
      showTooltip();
      // Cast children.props to ChildProps to access event handlers
      const childProps = children.props as ChildProps;
      if (childProps.onMouseEnter) {
        childProps.onMouseEnter(e);
      }
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hideTooltip();
      const childProps = children.props as ChildProps;
      if (childProps.onMouseLeave) {
        childProps.onMouseLeave(e);
      }
    },
    onFocus: (e: React.FocusEvent) => {
      showTooltip();
      const childProps = children.props as ChildProps;
      if (childProps.onFocus) {
        childProps.onFocus(e);
      }
    },
    onBlur: (e: React.FocusEvent) => {
      hideTooltip();
      const childProps = children.props as ChildProps;
      if (childProps.onBlur) {
        childProps.onBlur(e);
      }
    }
  };
  
  // Create a wrapper component that can handle refs properly
  const ChildWithRef = forwardRef<HTMLElement>((props, ref) => {
    // Combine the ref from forwardRef with our local ref
    const combinedRef = (node: HTMLElement | null) => {
      // Set our local ref
      setTargetRef(node);
      
      // Forward to the ref passed to ChildWithRef
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLElement | null>).current = node;
      }
      
      // We can't directly access children.ref, so we'll use a different approach
    };
    
    // Use a simpler approach - wrap the child in a span with our ref
    // This avoids the TypeScript errors with trying to access or modify the ref
    return (
      <span 
        ref={combinedRef}
        style={{ display: 'contents' }} // This makes the span invisible in the DOM
      >
        {React.cloneElement(children, eventHandlers)}
      </span>
    );
  });
  
  return (
    <>
      <ChildWithRef />
      {isVisible && (
        <div
          ref={tooltipRef}
          className={`fixed z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-sm dark:bg-gray-700 max-w-xs transition-opacity duration-200 ${
            positionClasses[position]
          } ${className}`}
          style={{
            left: `${coords.x}px`,
            top: `${coords.y}px`,
          }}
        >
          {content}
        </div>
      )}
    </>
  );
};

export default Tooltip;
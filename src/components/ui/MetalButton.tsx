import React from 'react';
import { cn } from '@/lib/utils';

interface MetalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  metalVariant?: 'silver' | 'silver-dark';
  isPrimary?: boolean; // Deprecated, use variantType="outlined"
  variantType?: 'secondary' | 'outlined' | 'filled';
  glowColor?: string;
  children: React.ReactNode;
}

export const MetalButton = React.forwardRef<HTMLButtonElement, MetalButtonProps>(
  ({ className, metalVariant = 'silver', isPrimary = false, variantType, glowColor = '#FF5F1F', children, ...props }, ref) => {
    
    // Determine effective variant type
    const effectiveVariant = variantType || (isPrimary ? 'outlined' : 'secondary');

    // Use CSS variables for adaptive metal look
    const adaptiveStyles = {
      outer: '', // Handled by inline style with CSS variables
      inner: 'border-[rgba(var(--metal-inner-mid),0.5)]', // approximate border
      text: 'text-[var(--metal-text)]',
      active: 'active:translate-y-[1px]',
      baseShadow: 'var(--metal-shadow-base)',
      activeShadow: 'var(--metal-shadow-active)',
    };

    // We ignore metalVariant prop for colors now, as we want it to adapt to theme.
    // But we keep the prop in interface for backward compatibility.
    const styles = adaptiveStyles;
    
    // Construct dynamic shadow and background
    let shadowStyle = styles.baseShadow;
    let backgroundStyle: React.CSSProperties = {
      backgroundImage: `linear-gradient(to bottom right, var(--metal-outer-start), var(--metal-outer-mid), var(--metal-outer-end))`
    };
    let innerBackgroundStyle: React.CSSProperties = {
      backgroundImage: `linear-gradient(to top left, var(--metal-inner-start), var(--metal-inner-mid), var(--metal-inner-end))`
    };

    let textShadowStyle = '0px 1px 1px rgba(255,255,255,0.2), -0.5px -0.5px 0 rgba(0,0,0,0.1)';
    let textColorStyle = undefined;

    if (effectiveVariant === 'outlined') {
      shadowStyle = `${styles.baseShadow}, 0 0 10px ${glowColor}, 0 0 20px ${glowColor}`;
      textShadowStyle = `
        -1px -1px 0 #000,  
         1px -1px 0 #000,
        -1px  1px 0 #000,
         1px  1px 0 #000,
         0 0 5px ${glowColor}, 
         0 0 10px ${glowColor}
      `;
      textColorStyle = glowColor;
    } else if (effectiveVariant === 'filled') {
      // Filled style: Colored background with metal overlay
      backgroundStyle = {
        backgroundColor: glowColor,
        backgroundImage: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 100%)'
      };
      // Keep base shadow for depth AND add glow
      shadowStyle = `${styles.baseShadow}, 0 0 10px ${glowColor}, 0 0 20px ${glowColor}`;
      // Text shadow for contrast on colored background
      textShadowStyle = '0px 1px 2px rgba(0,0,0,0.5)';
      // Text color is handled by className or default (usually passed as children or className)
      innerBackgroundStyle = { backgroundColor: 'rgba(0,0,0,0.1)' };
    }

    return (
      <button
        ref={ref}
        className={cn(
          'relative flex items-center justify-center rounded-xl font-bold tracking-wider px-8 py-4 transition-all duration-100',
          // styles.outer is empty now, background handled by style
          styles.active,
          className
        )}
        style={{ 
          fontFamily: 'var(--font-orbitron)',
          boxShadow: shadowStyle,
          ...backgroundStyle
        }}
        {...props}
      >
        {/* Brushed metal texture overlay */}
        <div className="absolute inset-0 rounded-xl opacity-20 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] pointer-events-none" />
        
        {/* Inner recessed area */}
        <div 
          className={cn(
            "absolute inset-[3px] rounded-lg flex items-center justify-center z-10 shadow-[inset_1px_1px_2px_rgba(0,0,0,0.1)]",
            // styles.inner removed, handled by style
          )} 
          style={innerBackgroundStyle}
        />

        {/* Text */}
        <span 
          className={cn("relative z-20", effectiveVariant === 'secondary' && styles.text)}
          style={{ 
            textShadow: textShadowStyle,
            color: textColorStyle
          }}
        >
          {children}
        </span>
      </button>
    );
  }
);

MetalButton.displayName = 'MetalButton';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fantasy-gold disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-fantasy-gold text-white hover:bg-yellow-600 shadow-md",
    secondary: "bg-fantasy-panel border border-slate-600 text-slate-200 hover:bg-slate-700",
    danger: "bg-fantasy-danger text-white hover:bg-red-600",
    ghost: "bg-transparent hover:bg-white/10 text-slate-300"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
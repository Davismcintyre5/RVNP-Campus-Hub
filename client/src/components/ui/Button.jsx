import Spinner from './Spinner.jsx';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
}) => {
  const variants = {
    primary: 'bg-bg-secondary text-text-primary border border-border-color hover:opacity-90',
    secondary: 'bg-bg-tertiary text-text-secondary border border-border-color hover:opacity-90',
    outline: 'bg-transparent text-text-primary border border-border-color hover:bg-bg-secondary',
    ghost: 'bg-transparent text-text-secondary hover:bg-bg-secondary',
    danger: 'bg-red-500 text-white hover:opacity-90',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        rounded-lg font-medium transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Spinner size="sm" />
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
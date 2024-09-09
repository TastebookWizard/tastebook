interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ loading = false, variant = 'primary', children, ...props }) => {
  const baseClasses = "w-full px-4 py-2 rounded-md text-sm hover:shadow-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out relative";
  const variantClasses = variant === 'primary'
    ? "bg-rose-500 text-white"
    : "bg-white text-rose-500 hover:text-white";

  return (
    <button
      className={`${baseClasses} ${variantClasses}`}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="flex justify-center items-center space-x-1">
          <span className="animate-loading-dot text-sm font-bold" style={{ animationDelay: '0ms' }}>.</span>
          <span className="animate-loading-dot text-sm font-bold" style={{ animationDelay: '200ms' }}>.</span>
          <span className="animate-loading-dot text-sm font-bold" style={{ animationDelay: '400ms' }}>.</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;

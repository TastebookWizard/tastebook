import { useState, useEffect } from "react";

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

const Input: React.FC<TextInputProps> = ({ className, icon, maxLength, ...props }) => {
  const [isClient, setIsClient] = useState(false);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (maxLength && props.value) {
      setCharCount(String(props.value).length);
    }
  }, [maxLength, props.value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (maxLength) {
      setCharCount(e.target.value.length);
    }
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className="relative flex items-center group">
      {icon && isClient && (
        <div className="absolute left-2.5 text-gray-300 transition-colors duration-300 ease-in-out group-focus-within:text-rose-500">
          {icon}
        </div>
      )}
      <input
        type="text"
        className={`
          w-full
          leading-6
          text-foreground
          p-3
          ${icon ? 'pl-8' : ''}
          ${maxLength ? 'pr-16' : ''}
          border border-gray-300 placeholder:text-gray-300 rounded-md
          hover:shadow-md
          outline-none focus:ring-2 focus:ring-rose-500 
          transition-all duration-300 ease-in-out
          ${className || ''}
        `}
        onChange={handleInputChange}
        onInput={(e) => {
          const target = e.target as HTMLInputElement;
          if (maxLength) {
            setCharCount(target.value.length);
          }
        }}
        maxLength={maxLength}
        {...props}
      />
      {maxLength && (
        <div className="absolute right-2.5 text-sm text-gray-400">
          {maxLength - charCount}
        </div>
      )}
    </div>
  );
};

export default Input;

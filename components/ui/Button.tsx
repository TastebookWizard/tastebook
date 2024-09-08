interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button: React.FC<ButtonProps> = (props) => {
  return (
    <button
      className="w-full px-4 py-2 rounded-md bg-rose-500 text-white text-sm hover:bg-rose-600 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-opacity-50 transition-all duration-300 ease-in-out"
      {...props}
    />
  );
};

export default Button;

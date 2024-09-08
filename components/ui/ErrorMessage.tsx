interface ErrorMessageProps {
  message: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => (
  <div className="border border-red-300 bg-red-50 text-red-500 text-sm mt-1 p-2 rounded flex items-center">
    <span className="fa-solid fa-circle-exclamation mr-2"></span>
    {message}
  </div>
);

export default ErrorMessage;

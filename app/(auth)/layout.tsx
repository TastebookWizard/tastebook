import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row h-screen">
      <div className="w-full sm:w-1/2 flex flex-col">
        {/* Left side content */}
        <div className="p-4">
          {/* Logo */}
          <div className="flex items-center space-x-4 justify-center sm:justify-start">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div className="text-4xl font-semibold">Tastebook</div>
          </div>
        </div>

        {/* Auth form */}
          <div className="flex-grow flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              {children}
            </div>
          </div>
      </div>
      <div className="w-0.5 bg-gray-200 hidden sm:block"></div>
      <div className="w-full sm:w-1/2 bg-rose-500">
        {/* Right side content */}
        <div className="h-full flex flex-col justify-center items-center text-white p-8">
          <h1 className="text-4xl font-bold mb-6">Welcome to Tastebook</h1>
          <p className="text-xl mb-8 text-center">
            Discover, share, and savor delicious recipes from around the world.
          </p>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <span className="block text-3xl font-bold mb-2">10k+</span>
              <span className="text-sm">Recipes</span>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <span className="block text-3xl font-bold mb-2">50k+</span>
              <span className="text-sm">Users</span>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <span className="block text-3xl font-bold mb-2">100+</span>
              <span className="text-sm">Countries</span>
            </div>
            <div className="bg-white bg-opacity-20 p-4 rounded-lg">
              <span className="block text-3xl font-bold mb-2">24/7</span>
              <span className="text-sm">Support</span>
            </div>
          </div>
          <div className="text-center">
            <p className="mb-4">
              Join our community today and start your culinary journey!
            </p>
            <Link
              href="/home"
              className="inline-block px-6 py-3 bg-white text-rose-500 font-semibold rounded-lg hover:bg-rose-500 hover:text-white transition-colors duration-300"
            >
              Continue as Guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

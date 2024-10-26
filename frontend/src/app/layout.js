"use client";
import "./globals.css"; // Your global styles
import { AuthProvider } from "@/context/AuthProvider"; // Adjust the path as necessary
import useAuth from "@/context/useAuth"; // Import the useAuth hook
import { useRouter } from "next/navigation";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <AuthProvider>
        <body>
          <header className="bg-dark_color p-6 shadow-lg  ">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-color4 text-3xl font-bold tracking-wide">
                GIVA SHOPPING STORE
              </h1>
              <AuthButton /> {/* Move AuthButton here */}
            </div>
          </header>

          <main className="min-h-screen p-6 ">{children}</main>

          <footer className="bg-gray-900 text-center py-4 text-gray-400 ">
            © GIVA SHOPPING STORE
          </footer>
        </body>
      </AuthProvider>
    </html>
  );
}

// Separate AuthButton component
const AuthButton = () => {
  const { isAuthenticated, logout } = useAuth(); // Use the hook here
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login"); // Redirect to login after logout
  };

  return (
    <nav className="space-x-6 text-lg">
      <a
        href="/"
        className="text-white hover:text-gray-300 transition-colors font-semibold px-3 py-2 rounded-md "
      >
        Home
      </a>
      {isAuthenticated ? (
        <button
          onClick={handleLogout}
          className="text-white hover:text-gray-300 transition-colors font-semibold px-3 py-2 rounded-md "
        >
          Logout
        </button>
      ) : (
        <a
          href="/login"
          className="text-white hover:text-gray-300 transition-colors font-semibold px-3 py-2 rounded-md "
        >
          Login
        </a>
      )}
    </nav>
  );
};

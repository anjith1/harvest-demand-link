
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type NavbarProps = {
  isLoggedIn: boolean;
  userType?: "user" | "farmer" | "admin" | null;
  onLogout?: () => void;
};

const Navbar = ({ isLoggedIn, userType, onLogout }: NavbarProps) => {
  const navigate = useNavigate();

  // Logo component with leaf graphic
  const Logo = () => (
    <div className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-agro-green-dark rounded-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
          <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
          <path d="M8.5 8.5v.01"></path>
          <path d="M16 12v.01"></path>
          <path d="M12 16v.01"></path>
        </svg>
      </div>
      <span className="text-xl font-bold text-agro-green-dark">AgroConnect</span>
    </div>
  );

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm py-3 px-4 md:px-6">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex-shrink-0">
          <Logo />
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-600 hover:text-agro-green-dark transition-colors">
            Home
          </Link>
          <Link to="/about" className="text-gray-600 hover:text-agro-green-dark transition-colors">
            About
          </Link>
          <Link to="/map" className="text-gray-600 hover:text-agro-green-dark transition-colors">
            Map
          </Link>
          {isLoggedIn && userType === "admin" && (
            <Link to="/admin" className="text-gray-600 hover:text-agro-green-dark transition-colors">
              Admin Dashboard
            </Link>
          )}
          {isLoggedIn && userType === "farmer" && (
            <Link to="/farmer" className="text-gray-600 hover:text-agro-green-dark transition-colors">
              Farmer Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {!isLoggedIn ? (
            <>
              <Button
                variant="outline"
                className="hidden md:inline-flex border-agro-green-dark text-agro-green-dark hover:bg-agro-green-dark hover:text-white"
                onClick={() => navigate("/login")}
              >
                Log in
              </Button>
              <Button 
                className="bg-agro-green-dark hover:bg-agro-green-light text-white"
                onClick={() => navigate("/register")}
              >
                Sign up
              </Button>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-gray-600 hover:text-agro-green-dark transition-colors">
                Dashboard
              </Link>
              <Button 
                variant="outline"
                className="border-agro-green-dark text-agro-green-dark hover:bg-agro-green-dark hover:text-white"
                onClick={onLogout}
              >
                Log out
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

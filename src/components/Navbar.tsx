import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { MenuIcon, X } from "lucide-react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-md shadow-sm py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <NavLink
          to="/"
          className="font-semibold text-xl tracking-tight transition-opacity hover:opacity-80"
        >
          TransactionGuard
        </NavLink>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition-all hover:text-primary ${
                isActive ? "text-primary" : "text-foreground/80"
              }`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `text-sm font-medium transition-all hover:text-primary ${
                isActive ? "text-primary" : "text-foreground/80"
              }`
            }
          >
            About
          </NavLink>
          <NavLink
            to="/detector"
            className={({ isActive }) =>
              `text-sm font-medium transition-all hover:text-primary ${
                isActive ? "text-primary" : "text-foreground/80"
              }`
            }
          >
            Fraud Detector
          </NavLink>
          <NavLink
            to="/manual-testing"
            className={({ isActive }) =>
              `text-sm font-medium transition-all hover:text-primary ${
                isActive ? "text-primary" : "text-foreground/80"
              }`
            }
          >
            Manual Testing
          </NavLink>
          <NavLink
            to="/login"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Login
          </NavLink>
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden focus:outline-none"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <MenuIcon className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg animate-slide-up border-t">
          <nav className="container mx-auto px-6 py-4 flex flex-col space-y-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-base font-medium py-2 transition-colors ${
                  isActive ? "text-primary" : "text-foreground/80"
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-base font-medium py-2 transition-colors ${
                  isActive ? "text-primary" : "text-foreground/80"
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/detector"
              className={({ isActive }) =>
                `text-base font-medium py-2 transition-colors ${
                  isActive ? "text-primary" : "text-foreground/80"
                }`
              }
            >
              Fraud Detector
            </NavLink>
            <NavLink
              to="/manual-testing"
              className={({ isActive }) =>
                `text-base font-medium py-2 transition-colors ${
                  isActive ? "text-primary" : "text-foreground/80"
                }`
              }
            >
              Manual Testing
            </NavLink>
            <NavLink
              to="/decision-tree"
              className={({ isActive }) =>
                `text-base font-medium py-2 transition-colors ${
                  isActive ? "text-primary" : "text-foreground/80"
                }`
              }
            >
              Decision Tree
            </NavLink>
            <NavLink
              to="/login"
              className="flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-base font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
            >
              Login
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

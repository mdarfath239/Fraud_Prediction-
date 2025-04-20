
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-secondary/50 border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="font-bold text-xl tracking-tight mb-4 inline-block">
              TransactionGuard
            </Link>
            <p className="text-muted-foreground max-w-md mt-2">
              Advanced fraud detection for businesses of all sizes. Protect your transactions with cutting-edge AI technology.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Products
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/detector" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                  Fraud Detector
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                  Enterprise
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                  API Access
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/" className="text-sm text-foreground/80 hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/50 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} TransactionGuard. All rights reserved.
          </p>
          
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/" className="text-sm text-foreground/70 hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link to="/" className="text-sm text-foreground/70 hover:text-primary transition-colors">
              Terms
            </Link>
            <Link to="/" className="text-sm text-foreground/70 hover:text-primary transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

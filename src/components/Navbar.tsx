import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Truck, User, LogIn, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useCurrentUser } from '@/hooks/useCurrentUser';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const currentUser = useCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to get initials
  const getInitials = (user) => {
    if (!user) return '';
    if (user.full_name) {
      return user.full_name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (user.phone) {
      return user.phone.slice(-2);
    }
    return '';
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-foreground">AgriMove</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/') ? 'text-primary bg-accent' : 'text-foreground hover:text-primary hover:bg-accent'}`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/about') ? 'text-primary bg-accent' : 'text-foreground hover:text-primary hover:bg-accent'}`}
            >
              About Us
            </Link>
            {!user && (
              <>
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/book') ? 'text-primary bg-accent' : 'text-foreground hover:text-primary hover:bg-accent'}`}
                >
                  Book Transport
                </Link>
                <Link
                  to="/login"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/register-vehicle') ? 'text-primary bg-accent' : 'text-foreground hover:text-primary hover:bg-accent'}`}
                >
                  Register Vehicle
                </Link>
              </>
            )}
            {user?.user_type === 'farmer' && (
              <Link
                to="/book"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/book') ? 'text-primary bg-accent' : 'text-foreground hover:text-primary hover:bg-accent'}`}
              >
                Book Transport
              </Link>
            )}
            {user?.user_type === 'driver' && (
              <Link
                to="/register-vehicle"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/register-vehicle') ? 'text-primary bg-accent' : 'text-foreground hover:text-primary hover:bg-accent'}`}
              >
                Register Vehicle
              </Link>
            )}
            {user && (
              <Link
                to="/chat"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/chat') ? 'text-primary bg-accent' : 'text-foreground hover:text-primary hover:bg-accent'}`}
              >
                Chat
              </Link>
            )}
            {user && user.user_type === 'farmer' && (
              <Link
                to="/farmer-dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/farmer-dashboard') ? 'text-primary bg-accent' : 'text-foreground hover:text-primary hover:bg-accent'}`}
              >
                Dashboard
              </Link>
            )}
            {user && user.user_type === 'driver' && (
              <Link
                to="/driver-dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/driver-dashboard') ? 'text-primary bg-accent' : 'text-foreground hover:text-primary hover:bg-accent'}`}
              >
                Dashboard
              </Link>
            )}
            {user?.user_type === 'admin' && (
              <Link
                to="/admin-dashboard"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive('/admin-dashboard') ? 'text-primary bg-accent' : 'text-foreground hover:text-primary hover:bg-accent'}`}
              >
                Admin Dashboard
              </Link>
            )}
            {!user && (
              <Link to="/login">
                <Button className="btn-secondary">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
            {user && (
              <>
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#ccc',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    marginRight: 8
                  }}>{getInitials(user)}</span>
                </Link>
                <Button variant="ghost" onClick={handleLogout}>Logout</Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
            <Link
              to="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'text-primary bg-accent' : 'text-foreground hover:text-primary hover:bg-accent'}`}
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/about') ? 'text-primary bg-accent' : 'text-foreground hover:text-primary hover:bg-accent'}`}
              onClick={() => setIsOpen(false)}
            >
              About Us
            </Link>
            {!user && (
              <>
                <Link
                  to="/login"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/book') ? 'text-primary bg-accent' : 'text-foreground hover:text-primary hover:bg-accent'}`}
                  onClick={() => setIsOpen(false)}
                >
                  Book Transport
                </Link>
                <Link
                  to="/login"
                  className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/register-vehicle') ? 'text-primary bg-accent' : 'text-foreground hover:text-primary hover:bg-accent'}`}
                  onClick={() => setIsOpen(false)}
                >
                  Register Vehicle
                </Link>
              </>
            )}
            {user?.user_type === 'farmer' && (
              <Link
                to="/book"
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/book') ? 'text-primary bg-accent' : 'text-foreground hover:text-primary hover:bg-accent'}`}
                onClick={() => setIsOpen(false)}
              >
                Book Transport
              </Link>
            )}
            {user?.user_type === 'driver' && (
              <Link
                to="/register-vehicle"
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/register-vehicle') ? 'text-primary bg-accent' : 'text-foreground hover:text-primary hover:bg-accent'}`}
                onClick={() => setIsOpen(false)}
              >
                Register Vehicle
              </Link>
            )}
            {user && (
              <Link
                to="/chat"
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/chat') ? 'text-primary bg-accent' : 'text-foreground hover:text-primary hover:bg-accent'}`}
                onClick={() => setIsOpen(false)}
              >
                Chat
              </Link>
            )}
            {user && user.user_type === 'farmer' && (
              <Link
                to="/farmer-dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/farmer-dashboard') ? 'text-primary bg-accent' : 'text-foreground hover:text-primary hover:bg-accent'}`}
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {user && user.user_type === 'driver' && (
              <Link
                to="/driver-dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/driver-dashboard') ? 'text-primary bg-accent' : 'text-foreground hover:text-primary hover:bg-accent'}`}
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
            )}
            {user?.user_type === 'admin' && (
              <Link
                to="/admin-dashboard"
                className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/admin-dashboard') ? 'text-primary bg-accent' : 'text-foreground hover:text-primary hover:bg-accent'}`}
                onClick={() => setIsOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
            {!user && (
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button className="btn-secondary w-full">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
            {user && (
              <div className="flex items-center space-x-2 mt-2">
                <Link to="/profile" onClick={() => setIsOpen(false)} style={{ display: 'flex', alignItems: 'center' }}>
                  <span style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#ccc',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    marginRight: 8
                  }}>{getInitials(user)}</span>
                </Link>
                <Button variant="ghost" onClick={handleLogout}>Logout</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
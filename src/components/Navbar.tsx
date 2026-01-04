import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';

const primaryLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Rooms', path: '/rooms' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Contact', path: '/contact' },
];

const exploreLinks = [
  { name: 'Amenities', path: '/amenities' },
  { name: 'Reviews', path: '/reviews' },
  { name: 'Location', path: '/location' },
  { name: 'FAQ', path: '/faq' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="hotel-container">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex flex-col">
            <span className={`font-serif text-2xl font-bold tracking-wide transition-colors ${
              isScrolled ? 'text-foreground' : 'text-primary-foreground'
            }`}>
              MONIPEE
            </span>
            <span className={`text-xs tracking-[0.3em] uppercase transition-colors ${
              isScrolled ? 'text-primary' : 'text-primary'
            }`}>
              HOTEL
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {primaryLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-link text-sm font-medium tracking-wide transition-colors ${
                  location.pathname === link.path
                    ? 'text-primary'
                    : isScrolled
                    ? 'text-foreground/80 hover:text-primary'
                    : 'text-primary-foreground/90 hover:text-primary-foreground'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={isScrolled ? 'text-foreground hover:text-primary' : 'text-primary-foreground hover:text-primary-foreground/80 hover:bg-white/10'}
                >
                  Explore
                  <ChevronDown className="ml-2 w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Explore</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {exploreLinks.map((link) => (
                  <DropdownMenuItem key={link.path} className="cursor-pointer">
                    <Link to={link.path} className="w-full">
                      {link.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* CTA Button */}
          <div className="hidden lg:flex items-center gap-4">
            <a href="tel:0322495451" className={`flex items-center gap-2 text-sm transition-colors ${
              isScrolled ? 'text-foreground' : 'text-primary-foreground'
            }`}>
              <Phone className="w-4 h-4" />
              032 249 5451
            </a>
            <ThemeToggle isScrolled={isScrolled} />
            
            {user ? (
              <>
                {user.role === 'customer' && (
                  <Link to="/dashboard/bookings">
                    <Button 
                      variant="ghost" 
                      className={isScrolled ? 'text-foreground hover:text-primary' : 'text-primary-foreground hover:text-primary-foreground/80 hover:bg-white/10'}
                    >
                      My Bookings
                    </Button>
                  </Link>
                )}
                
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}>
                  <Button 
                    variant="ghost" 
                    className={`flex items-center gap-2 ${isScrolled ? 'text-foreground hover:text-primary' : 'text-primary-foreground hover:text-primary-foreground/80 hover:bg-white/10'}`}
                  >
                    <User className="w-4 h-4" />
                    {user.name.split(' ')[0]}
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  onClick={logout}
                  className={`px-4 ${isScrolled ? '' : 'border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10'}`}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="outline" className={`px-4 ${isScrolled ? '' : 'border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10'}`}>
                  Login
                </Button>
              </Link>
            )}
            
            <Link to="/rooms">
              <Button className="btn-primary px-6">
                Book Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 transition-colors ${
              isScrolled ? 'text-foreground' : 'text-primary-foreground'
            }`}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden absolute top-full left-0 right-0 bg-background shadow-lg animate-fade-in">
            <div className="flex flex-col p-6 gap-4">
              {[...primaryLinks, ...exploreLinks].map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-lg font-medium py-2 border-b border-border/50 ${
                    location.pathname === link.path
                      ? 'text-primary'
                      : 'text-foreground'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="flex items-center justify-between py-2 border-b border-border/50">
                <a href="tel:0322495451" className="flex items-center gap-2 text-foreground">
                  <Phone className="w-5 h-5 text-primary" />
                  032 249 5451
                </a>
                <ThemeToggle isScrolled={true} />
              </div>

              {user ? (
                <>
                  <Link 
                    to={user.role === 'admin' ? '/admin' : '/dashboard'} 
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 text-foreground py-2 font-medium"
                  >
                    <User className="w-5 h-5 text-primary" />
                    My Dashboard ({user.name})
                  </Link>
                  {user.role === 'customer' && (
                    <Link 
                      to="/dashboard/bookings" 
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 text-foreground py-2 font-medium pl-8"
                    >
                      My Bookings
                    </Link>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="w-full mt-2"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login / Register
                  </Button>
                </Link>
              )}

              <Link to="/rooms" onClick={() => setIsOpen(false)}>
                <Button className="btn-primary w-full mt-2">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

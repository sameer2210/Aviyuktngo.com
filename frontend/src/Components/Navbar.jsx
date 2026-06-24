import { Menu, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import SkeletonImage from './SkeletonImage';

const navItems = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/storyline' },
  { label: 'Services', path: '/services' },
  { label: 'Events', path: '/gallery' },
  { label: 'Plans', path: '/plans' },
  { label: 'Donate', path: '/highlights' },
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Hide navbar on admin pages
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeMenuOnResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };

    window.addEventListener('resize', closeMenuOnResize);
    return () => window.removeEventListener('resize', closeMenuOnResize);
  }, [menuOpen]);

  const profileFallback = useMemo(
    () =>
      `https://ui-avatars.com/api/?name=${encodeURIComponent(
        user?.name || user?.email || 'User'
      )}&size=64&background=1c2438&color=f6f4ef`,
    [user?.email, user?.name]
  );

  const profileImage = user?.profilePic
    ? user.profilePic.trim().replace(/s96-c$/i, 's120-c').replace(/=s\d+(?:-c)?$/i, '=s120-c')
    : profileFallback;

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 pt-3 md:pt-4">
        <div
          className={`rounded-2xl border transition-all duration-500 ${
            scrolled
              ? 'glass-card border-white/20 shadow-[0_20px_70px_rgba(2,8,23,0.35)]'
              : 'border-transparent bg-transparent'
          }`}
        >
          <div className="h-16 md:h-[72px] grid grid-cols-[auto_1fr_auto] items-center gap-3 px-3 md:px-4">
            <Link to="/" className="inline-flex items-center">
              <SkeletonImage
                className="h-11 w-11 md:h-12 md:w-12 rounded-full object-cover ring-1 ring-white/40"
                src="https://res.cloudinary.com/dyvccryuz/image/upload/v1746258864/My%20Brand/logo_jo4h7x.png"
                alt="Aviyukt NGO Logo"
                loading="eager"
              />
            </Link>

            <nav className="hidden md:flex justify-center">
              <div className="inline-flex items-center gap-1 rounded-full bg-black/15 p-1 backdrop-blur-sm">
                {navItems.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `px-4 lg:px-5 py-2 rounded-full text-[15px] lg:text-[16px] font-medium tracking-wide transition-all duration-200 ${
                        isActive
                          ? 'bg-white text-[#111827]'
                          : 'text-[#f8f5ef] hover:text-white hover:bg-white/15'
                      }`
                    }
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </nav>

            <div className="hidden md:flex justify-end">
              {isAuthenticated ? (
                <div className="inline-flex items-center gap-2">
                  <Link
                    to="/profile"
                    className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-2 py-1.5 text-white hover:bg-white/25 transition-colors"
                  >
                    <SkeletonImage
                      src={profileImage}
                      fallbackSrc={profileFallback}
                      alt={user?.name ? `${user.name} profile` : 'Profile'}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-1 rounded-full border border-red-200/60 bg-red-500/20 px-3 py-2 text-red-100 hover:bg-red-500/30 transition-colors"
                    aria-label="Logout"
                  >
                    <FiLogOut />
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="luminous-btn inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold">
                  Login
                </Link>
              )}
            </div>

            <div className="md:hidden flex justify-end">
              <button
                onClick={() => setMenuOpen(prev => !prev)}
                className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-white/35 bg-white/10 text-white"
                aria-label="Toggle menu"
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="md:hidden px-3 pb-3">
              <div className="rounded-xl border border-white/20 bg-[#0f172a]/90 backdrop-blur-md p-2 flex flex-col">
                {navItems.map(item => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `px-3 py-2.5 rounded-lg text-[15px] transition-colors ${
                        isActive ? 'bg-white text-[#111827]' : 'text-[#f8f5ef] hover:bg-white/15'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}

                <div className="pt-2">
                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="w-full inline-flex justify-center items-center gap-2 rounded-lg border border-white/30 bg-white/10 px-4 py-2.5 text-[#f8f5ef] font-medium mb-2"
                      >
                        <SkeletonImage
                          src={profileImage}
                          fallbackSrc={profileFallback}
                          alt={user?.name ? `${user.name} profile` : 'Profile'}
                          className="h-6 w-6 rounded-full object-cover"
                        />
                        <span>Profile</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full inline-flex justify-center items-center gap-2 rounded-lg border border-red-200/60 bg-red-500/20 px-4 py-2.5 text-red-100 font-medium hover:bg-red-500/30 transition-colors"
                      >
                        <FiLogOut />
                        <span>Logout</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/auth"
                      onClick={() => setMenuOpen(false)}
                      className="w-full luminous-btn inline-flex justify-center items-center rounded-lg px-4 py-2.5 text-sm font-semibold"
                    >
                      Login
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

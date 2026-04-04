import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  
  // Logout State
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("Logging you out...");
  
  const isHome = location.pathname === '/';
  const isChat = location.pathname === '/chat';
  const isLogin = location.pathname === '/login';
  const isProfile = location.pathname === '/profile';
  const isRBIGuide = location.pathname === '/rbi-guide';
  const isTools = location.pathname === '/tools';
  const isLoggedIn = localStorage.getItem('isAuthenticated') === 'true';

  useEffect(() => {
    const updateUserData = () => {
        const storedUser = localStorage.getItem('arthSahay_currentUser');
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                setAvatar(user.avatar || null);
                
                // Format: "John Doe" -> "John D."
                const name = user.name || "User";
                const parts = name.split(' ');
                const display = parts.length > 1 ? `${parts[0]} ${parts[1][0]}.` : parts[0];
                setUserName(display);
            } catch (e) {
                console.error("Error parsing user data", e);
                setUserName("User");
            }
        }
    };

    // Initial load
    updateUserData();

    // Listen for custom event from Profile/Login page
    const handleUserUpdate = () => {
        updateUserData();
    };

    window.addEventListener('userUpdate', handleUserUpdate);
    
    return () => {
        window.removeEventListener('userUpdate', handleUserUpdate);
    };
  }, []);

  const handleLogout = () => {
      // 1. Trigger Loading State
      setIsLoggingOut(true);
      setLogoutMessage("Logging you out...");

      // 2. Delay for transition
      setTimeout(() => {
          setLogoutMessage("Logged out successfully.");
          
          // 3. Cleanup & Redirect
          setTimeout(() => {
              localStorage.removeItem('isAuthenticated');
              localStorage.removeItem('arthSahay_currentUser');
              window.dispatchEvent(new Event('userUpdate'));
              navigate('/login');
          }, 800); 
      }, 1500);
  };

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLogin || isChat) return null; 

  // Determine the target path for the main brand/home link
  const homeLinkTarget = isLoggedIn ? "/" : "/login";

  return (
    <>
    {/* Logout Overlay */}
    {isLoggingOut && (
        <div className="fixed inset-0 z-[100] bg-navy/95 backdrop-blur-md flex flex-col items-center justify-center text-white animate-fadeInUp">
            <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-teal animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center font-bold text-xs">AS</div>
            </div>
            <h2 className="text-2xl font-bold font-serif mb-2 tracking-wide">{logoutMessage}</h2>
            <p className="text-gray-400 text-sm">Securely clearing your session...</p>
        </div>
    )}

    <nav className="fixed w-full z-50 bg-navy text-white py-4 shadow-lg border-b border-white/10 backdrop-blur-md bg-navy/95">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
            {/* Global Back Button (Hidden on Home) */}
            {!isHome && (
                <button 
                    onClick={() => navigate(-1)} 
                    className="p-2 rounded-xl hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-200 group"
                    aria-label="Go Back"
                    title="Go Back"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 group-hover:-translate-x-1 transition-transform">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </button>
            )}

            {/* Main Brand Logo/Home Link */}
            <Link to={homeLinkTarget} className="flex items-center gap-3 group">
            {/* Refined Logo Icon */}
            <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center relative overflow-hidden border border-white/10 shadow-xl group-hover:shadow-teal/20 group-hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-teal/20 via-transparent to-transparent"></div>
                <span className="font-serif text-xl font-bold text-white relative z-10 leading-none mt-1 tracking-tighter">AS</span>
                <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-teal rounded-full animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]"></div>
            </div>
            
            {/* Refined Logo Text */}
            <div className="flex flex-col">
                <div className="flex items-center gap-2">
                    <h1 className="text-xl font-serif font-bold text-white tracking-tight leading-none">
                    ArthSahay
                    </h1>
                    <span className="px-1.5 py-0.5 rounded-md bg-teal/10 border border-teal/20 text-[10px] font-bold text-teal tracking-wider font-sans">
                    24/7
                    </span>
                </div>
                <span className="text-[9px] text-gray-400 uppercase tracking-widest font-medium ml-0.5">A Tata Capital Initiative</span>
            </div>
            </Link>
        </div>
        
        {/* Desktop Links */}
        {!isChat && !isProfile && !isRBIGuide && !isTools && (
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
              <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="hover:text-white transition-colors">How it Works</a>
              <a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-white transition-colors">Products</a>
              
              <Link to="/tools" className="text-orange hover:text-white transition-colors font-bold flex items-center gap-1.5 group">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 group-hover:animate-pulse">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                LoanSarthi 360
              </Link>

              <a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="hover:text-white transition-colors">Support</a>

              <Link to="/rbi-guide" className="text-orange hover:text-white transition-colors font-bold">RBI Customer Guide</Link>
          </div>
        )}
        
        <div className="flex items-center gap-4">
          {!isChat && !isProfile && (
            <>
              {!isLoggedIn && (
                  <>
                      <Link to="/login" state={{ mode: 'login' }} className="hidden lg:block text-sm font-semibold text-gray-300 hover:text-white transition-colors">
                        Login
                      </Link>
                      {/* Sign Up Link Removed */}
                  </>
              )}
              {isLoggedIn ? (
                  <Link to="/profile" className="flex items-center gap-3 group">
                      <div className="text-right hidden sm:block">
                          <p className="text-xs font-bold text-white group-hover:text-teal transition-colors">{userName}</p>
                          <p className="text-[10px] text-gray-400">Privilege</p>
                      </div>
                      {avatar ? (
                          <img src={avatar} alt="Profile" className="w-9 h-9 rounded-full object-cover ring-2 ring-white/10 group-hover:ring-teal/50 transition-all" />
                      ) : (
                          <div className="w-9 h-9 rounded-full bg-teal text-white flex items-center justify-center font-bold text-sm ring-2 ring-white/10 group-hover:ring-teal/50 transition-all font-serif">
                              {userName.charAt(0)}
                          </div>
                      )}
                  </Link>
              ) : (
                <Link
                    to="/login"
                    state={{ mode: 'signup' }}
                    className="px-6 py-2.5 bg-teal hover:bg-tealDark text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-teal/25 hover:-translate-y-0.5 text-sm flex items-center gap-2"
                >
                    Apply Now
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
              )}
            </>
          )}
          
          {(isChat || isProfile) && (
             <div className="flex items-center gap-4">
                 <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-red-400 font-semibold hover:text-red-300 transition-colors text-sm rounded-lg hover:bg-white/5"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
                    </svg>
                    Log Out
                </button>
             </div>
          )}
        </div>
      </div>
    </nav>
    </>
  );
}
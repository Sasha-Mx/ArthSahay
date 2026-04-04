import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Validation Regex Patterns
const REGEX = {
  NAME: /^[a-zA-Z\s\.]{3,}$/,
  MOBILE: /^[6-9]\d{9}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  AADHAAR: /^\d{12}$/,
  PAN: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/ // Added special char requirement
};

// Helper: Format Phone Number (12345 67890)
const formatPhoneNumber = (value: string) => {
    if (!value) return "";
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length > 5) {
        return `${cleaned.slice(0, 5)} ${cleaned.slice(5, 10)}`;
    }
    return cleaned;
};

// Captcha Component
const CaptchaBox = ({ 
  captchaCode, 
  userCaptchaInput, 
  setUserCaptchaInput, 
  generateCaptcha 
}: { 
  captchaCode: string; 
  userCaptchaInput: string; 
  setUserCaptchaInput: (val: string) => void; 
  generateCaptcha: () => void; 
}) => (
  <div className="space-y-2">
       <label className="text-xs font-bold text-navy uppercase tracking-wide">Security Check</label>
       <div className="flex gap-2">
           <div className="w-36 h-12 bg-softGray rounded-lg border border-gray-200 flex items-center justify-center relative overflow-hidden select-none shrink-0">
               <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 11px)'}}></div>
               <span className="font-mono text-lg font-bold text-navy tracking-widest relative z-10" style={{textShadow: '2px 2px 0px rgba(0,0,0,0.1)'}}>
                   {captchaCode}
               </span>
           </div>
           <button type="button" onClick={generateCaptcha} className="p-3 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors shrink-0" title="Refresh Code">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
           </button>
           <input 
              type="text" 
              value={userCaptchaInput}
              onChange={(e) => setUserCaptchaInput(e.target.value)}
              className="flex-1 w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:border-orange focus:ring-2 focus:ring-orange/10 outline-none uppercase font-bold text-center tracking-widest placeholder-gray-300 transition-all min-w-0"
              placeholder="CODE"
              maxLength={6}
           />
       </div>
  </div>
);

// Password Strength Checker
const checkPasswordStrength = (password: string) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@$!%*?&]/.test(password)) strength++; // Added special character check

  if (strength <= 2) return { text: "Weak", color: "text-red-500", width: "33.33%", barColor: "bg-red-500" };
  if (strength <= 4) return { text: "Moderate", color: "text-orange-500", width: "66.66%", barColor: "bg-orange-500" };
  return { text: "Strong", color: "text-green-500", width: "100%", barColor: "bg-green-500" };
};


export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Mode Toggle
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Login Specific State
  const [activeLoginTab, setActiveLoginTab] = useState<'mobile' | 'email'>('mobile');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(0);
  const [resendStatus, setResendStatus] = useState('');

  // Forgot Password State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  // Signup Specific State (Comprehensive)
  const [signupData, setSignupData] = useState({
    fullName: '',
    dob: '',
    aadhaar: '',
    pan: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});
  const passwordStrength = checkPasswordStrength(signupData.password); // Password strength state
  
  // Common State
  const [captchaCode, setCaptchaCode] = useState('');
  const [userCaptchaInput, setUserCaptchaInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

  // Handle Initial State
  useEffect(() => {
    if (location.state?.mode === 'signup') {
        setIsSignUp(true);
    }
    generateCaptcha();
  }, [location]);

  // Generate simple random captcha
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; 
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(result);
    setUserCaptchaInput('');
  };

  // Timer logic for OTP
  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleResendOtp = () => {
      setTimer(30);
      setResendStatus('OTP sent successfully!');
      setTimeout(() => setResendStatus(''), 3000);
  };

  // --- Login Handlers ---
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGlobalError('');

    if (userCaptchaInput.toUpperCase() !== captchaCode) {
        setGlobalError("Incorrect CAPTCHA code.");
        generateCaptcha();
        return;
    }

    // --- REALTIME AUTH CHECK ---
    const usersDB = JSON.parse(localStorage.getItem('arthSahay_users') || '[]');

    if (activeLoginTab === 'mobile') {
        if (!REGEX.MOBILE.test(loginPhone)) {
             setGlobalError("Invalid Mobile Number"); return;
        }
        
        // Check if phone exists
        const userExists = usersDB.find((u: any) => u.mobile === loginPhone);
        if (!userExists) {
            setGlobalError("Account not found. Please Sign Up first.");
            return;
        }

        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setOtpSent(true);
            setTimer(30);
        }, 1500);
    } else {
        // Email Login
        if (!loginEmail || !loginPassword) {
            setGlobalError("Please fill all fields"); return;
        }

        const user = usersDB.find((u: any) => u.email === loginEmail && u.password === loginPassword);
        
        setIsLoading(true);
        setTimeout(() => {
             if (user) {
                 completeAuth("Welcome back!", user);
             } else {
                 setIsLoading(false);
                 setGlobalError("Invalid Email or Password. If you are new, please Sign Up.");
             }
        }, 1500);
    }
  };

  const handleVerifyLoginOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.join('').length !== 4) {
      setGlobalError("Enter full 4-digit OTP"); return;
    }
    
    // In mobile flow, we already checked existence before sending OTP, 
    // but let's fetch the user object again to login.
    const usersDB = JSON.parse(localStorage.getItem('arthSahay_users') || '[]');
    const user = usersDB.find((u: any) => u.mobile === loginPhone);

    setIsLoading(true);
    setTimeout(() => {
      if (user) {
          completeAuth("Logged in via Mobile.", user);
      } else {
          // Should rarely happen if handleLoginSubmit logic is tight
          setIsLoading(false);
          setGlobalError("Authentication failed. User not found.");
      }
    }, 1500);
  };

  // --- Forgot Password Handler ---
  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!REGEX.EMAIL.test(forgotEmail)) {
          setGlobalError("Please enter a valid email address.");
          return;
      }
      
      const usersDB = JSON.parse(localStorage.getItem('arthSahay_users') || '[]');
      const user = usersDB.find((u: any) => u.email === forgotEmail);

      if (!user) {
          setGlobalError("Email address not found in our records.");
          return;
      }

      setGlobalError('');
      setForgotPasswordLoading(true);
      setTimeout(() => {
          setForgotPasswordLoading(false);
          setForgotPasswordSuccess(true);
      }, 1500);
  };

  const resetForgotPasswordModal = () => {
      setShowForgotPassword(false);
      setForgotEmail('');
      setForgotPasswordSuccess(false);
      setGlobalError('');
  };

  // --- Signup Handlers ---
  const handleSignupChange = (field: string, value: string) => {
      let formattedValue = value;

      if (field === 'aadhaar') {
          const digits = value.replace(/\D/g, '');
          const truncated = digits.slice(0, 12);
          formattedValue = truncated.replace(/(\d{4})(?=\d)/g, '$1 ');
      }
      if (field === 'pan') {
          formattedValue = value.toUpperCase();
      }

      setSignupData(prev => ({...prev, [field]: formattedValue}));
      
      let error = '';
      switch(field) {
          case 'fullName': if (!REGEX.NAME.test(value)) error = "Name must be at least 3 alphabets."; break;
          case 'mobile': if (!REGEX.MOBILE.test(value)) error = "Enter a valid 10-digit Indian mobile number."; break;
          case 'email': if (!REGEX.EMAIL.test(value)) error = "Invalid email address."; break;
          case 'aadhaar':
              const rawAadhaar = formattedValue.replace(/\s/g, '');
              if (rawAadhaar.length > 0 && !REGEX.AADHAAR.test(rawAadhaar)) error = "Enter valid 12-digit Aadhaar number.";
              break;
          case 'pan': if(value.length > 0 && !REGEX.PAN.test(value.toUpperCase())) error = "Enter valid PAN (e.g. ABCDE1234F)"; break;
          case 'password': if (!REGEX.PASSWORD.test(value)) error = "Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char."; break;
          case 'confirmPassword': if (value !== signupData.password) error = "Passwords do not match."; break;
          case 'dob':
              if (value) {
                  const birthDate = new Date(value);
                  const today = new Date();
                  let age = today.getFullYear() - birthDate.getFullYear();
                  const m = today.getMonth() - birthDate.getMonth();
                  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                      age--;
                  }
                  if (age < 18) {
                      error = "You must be at least 18 years old to apply.";
                  } else if (age > 100) {
                      error = "Please enter a valid date of birth.";
                  }
              } else {
                  error = "Date of Birth is required.";
              }
              break;
      }
      setSignupErrors(prev => ({...prev, [field]: error}));
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setGlobalError('');
      
      const hasErrors = Object.values(signupErrors).some(err => err !== '');
      const hasEmpty = Object.values(signupData).some(val => val === '');
      
      if (hasErrors || hasEmpty) {
          setGlobalError("Please fix the errors in the form before proceeding.");
          return;
      }

      if (userCaptchaInput.toUpperCase() !== captchaCode) {
        setGlobalError("Incorrect CAPTCHA code.");
        generateCaptcha();
        return;
    }

      // --- DUPLICATE CHECK ---
      const usersDB = JSON.parse(localStorage.getItem('arthSahay_users') || '[]');
      const duplicate = usersDB.find((u: any) => u.email === signupData.email || u.mobile === signupData.mobile);
      
      if (duplicate) {
          setGlobalError("User with this Email or Mobile already exists. Please Login.");
          return;
      }

      setIsLoading(true);
      setTimeout(() => {
          // --- REGISTER USER ---
          const newUser = {
              name: signupData.fullName,
              email: signupData.email,
              phone: signupData.mobile,
              mobile: signupData.mobile, // redundancy for safety
              aadhaar: signupData.aadhaar,
              pan: signupData.pan,
              dob: signupData.dob,
              password: signupData.password, // In real app, hash this!
              createdAt: new Date().toISOString()
          };
          
          usersDB.push(newUser);
          localStorage.setItem('arthSahay_users', JSON.stringify(usersDB));

          completeAuth(`Welcome, ${signupData.fullName.split(' ')[0]}! Your account is created.`, newUser);
      }, 2000);
  };

  const completeAuth = (msg: string, userData: any) => {
      setIsLoading(false);
      localStorage.setItem('isAuthenticated', 'true');
      
      // Persist ONLY the authenticated user to session storage
      localStorage.setItem('arthSahay_currentUser', JSON.stringify(userData));
      
      // Dispatch event so Navbar/Profile can update immediately
      window.dispatchEvent(new Event('userUpdate'));

      navigate('/profile', { state: { welcomeMessage: msg } });
  };

  // Helper for OTP Inputs
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value !== "") {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
        const prevInput = document.getElementById(`otp-${index-1}`);
        prevInput?.focus();
    }
  }

  return (
    <div className="min-h-screen bg-softGray flex flex-col relative overflow-hidden">
      
      <div className="flex-1 flex items-center justify-center p-4 md:p-6 relative z-10">
        
        {/* Main Card */}
        <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col md:flex-row md:h-[85vh] md:max-h-[900px] h-auto">
          
          {/* Left Side - Indian Touch + Fintech Aesthetics */}
          <div className="md:w-1/2 relative p-6 md:p-10 flex flex-col justify-between text-white overflow-y-auto no-scrollbar shrink-0 min-h-[500px] md:min-h-0 bg-navy">
             
             {/* Background: Deep Indigo Gradient */}
             <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#312E81] z-0"></div>
             
             {/* Pattern 1: Geometric Jali Overlay (Subtle) */}
             <div className="absolute inset-0 opacity-10 pointer-events-none z-0" 
                  style={{ 
                      backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(217, 119, 6, 0.15) 2px, transparent 2.5px)', 
                      backgroundSize: '24px 24px' 
                  }}>
             </div>

             {/* Pattern 2: Large Ornamental Mandala/Chakra (Bottom Left) */}
             <div className="absolute -bottom-24 -left-24 w-96 h-96 opacity-10 pointer-events-none animate-spin-slow text-white z-0">
                 <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
                    <circle cx="50" cy="50" r="48" />
                    <circle cx="50" cy="50" r="38" />
                    <path d="M50 2 L50 98 M2 50 L98 50 M16 16 L84 84 M16 84 L84 16" />
                    <circle cx="50" cy="50" r="15" />
                 </svg>
             </div>
             
             {/* Pattern 3: Top Right Decoration */}
             <div className="absolute top-0 right-0 w-32 h-32 opacity-20 pointer-events-none">
                 <svg viewBox="0 0 100 100" fill="currentColor" className="text-orange">
                     <path d="M0 0 L100 0 L100 100 C50 100 0 50 0 0 Z" />
                 </svg>
             </div>

            {/* Brand Header */}
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                     {/* Back Button */}
                     <button 
                        onClick={() => navigate('/')} 
                        className="p-2 -ml-2 rounded-xl hover:bg-white/10 text-white/70 hover:text-white transition-all duration-200 group"
                        title="Go Home"
                     >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 group-hover:-translate-x-1 transition-transform">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                        </svg>
                     </button>
                    <Link to="/" className="inline-flex items-center gap-3 group">
                        {/* Refined Logo Icon */}
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center relative overflow-hidden shadow-lg group-hover:scale-105 transition-transform">
                            <div className="absolute inset-0 bg-gradient-to-br from-teal/20 via-transparent to-transparent"></div>
                            <span className="font-serif text-xl font-bold text-navy relative z-10 leading-none mt-1 tracking-tighter">AS</span>
                            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-teal rounded-full animate-pulse"></div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-serif font-bold tracking-tight text-xl text-white">ArthSahay</span>
                            <span className="px-1.5 py-0.5 rounded bg-teal/20 border border-teal/30 text-[10px] font-bold text-teal tracking-wider font-sans">24/7</span>
                        </div>
                    </Link>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-[1.1]">
                    {isSignUp ? "Aarambh" : "Swagatam"} <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange to-yellow-300 text-3xl md:text-4xl font-sans font-semibold tracking-wide">
                        {isSignUp ? "Your Financial Journey." : "To Prosperity."}
                    </span>
                </h2>
                
                {/* Hindi Quote Section */}
                <div className="mb-6 border-l-2 border-orange pl-4">
                    <p className="text-xl md:text-2xl font-serif text-white/95 italic mb-1 leading-relaxed">
                        "विश्वास ही हमारी पूँजी है।"
                    </p>
                    <p className="text-xs text-orange uppercase tracking-widest font-sans font-bold">
                        (Trust is our true capital)
                    </p>
                </div>
            </div>

            {/* Customer Review Card - Indian Touch */}
            <div className="relative z-10 mt-auto pt-8">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl relative shadow-xl hover:bg-white/15 transition-colors duration-300">
                    <div className="absolute -top-3 -left-2 text-4xl text-orange opacity-80 font-serif leading-none">❝</div>
                    <p className="text-sm text-gray-100 italic leading-relaxed mb-4 relative z-10">
                        "Yaar, main toh soch bhi nahi sakti thi ki loan lena itna easy ho sakta hai! Kal hi maine education ke liye ₹3 lakh ka loan apply kiya ArthSahay pe, aur bas 8 minute mein approval aa gaya – bina kisi branch visit ke, Thank You ArthSahay"
                    </p>
                    <div className="flex items-center gap-3">
                        <img 
                            src={`https://api.dicebear.com/9.x/adventurer/svg?seed=ssm`}
                            alt="Customer" 
                            className="w-10 h-10 rounded-full object-cover shadow-lg border-2 border-white/20 bg-white"
                        />
                        <div>
                            <p className="text-sm font-bold text-white">Anjali Devi</p>
                            <p className="text-[10px] text-gray-300 uppercase">Verified Customer • Rampur Village, UP</p>
                        </div>
                        <div className="ml-auto flex text-yellow-400 text-xs gap-0.5">
                            {'★★★★★'}
                        </div>
                    </div>
                </div>
                
                {/* Trust Badge below review */}
                 <div className="flex items-center gap-2 mt-4 opacity-70">
                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                     <span className="text-[10px] font-semibold tracking-wider uppercase text-white">ISO 27001 Secured • RBI Regulated</span>
                 </div>
            </div>
          </div>

          {/* Right Side - Form Container */}
          <div className="md:w-1/2 bg-white relative flex flex-col h-full">
            {/* Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar">
                {/* Content Wrapper */}
                <div className="max-w-md mx-auto w-full min-h-full flex flex-col justify-center">
                    
                    <h3 className="text-2xl font-bold text-navy mb-1 font-serif">{isSignUp ? "Create Profile" : "Secure Login"}</h3>
                    <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                        {isSignUp 
                            ? "Enter details matching your Aadhaar to create your account." 
                            : "Login with your registered Mobile or Email."}
                    </p>

                    {globalError && (
                        <div className="mb-6 p-3 bg-red-50 border border-red-100 text-red-600 text-xs rounded-lg flex items-center gap-2 animate-fadeInUp">
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {globalError}
                        </div>
                    )}

                    {!isSignUp ? (
                        /* --- LOGIN FORM --- */
                        <>
                            <div className="flex p-1 bg-softGray rounded-xl mb-8 border border-gray-200">
                                <button 
                                    onClick={() => { setActiveLoginTab('mobile'); setGlobalError(''); generateCaptcha(); }}
                                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeLoginTab === 'mobile' ? 'bg-white text-navy shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-navy hover:bg-gray-200'}`}
                                >
                                    Mobile
                                </button>
                                <button 
                                    onClick={() => { setActiveLoginTab('email'); setGlobalError(''); generateCaptcha(); }}
                                    className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeLoginTab === 'email' ? 'bg-white text-navy shadow-sm ring-1 ring-black/5' : 'text-gray-500 hover:text-navy hover:bg-gray-200'}`}
                                >
                                    Email
                                </button>
                            </div>

                            <form onSubmit={otpSent ? handleVerifyLoginOtp : handleLoginSubmit} className="space-y-6">
                                {activeLoginTab === 'mobile' ? (
                                    !otpSent ? (
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-navy uppercase tracking-wide">Mobile Number</label>
                                            <div className="relative group">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">+91</span>
                                                <input 
                                                    type="tel" 
                                                    maxLength={11}
                                                    value={formatPhoneNumber(loginPhone)}
                                                    onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                                                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-orange focus:ring-4 focus:ring-orange/10 outline-none transition-all font-medium text-navy placeholder-gray-300"
                                                    placeholder="98765 43210"
                                                    autoFocus
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6 animate-fadeInUp">
                                            <div className="text-center">
                                                <p className="text-sm text-gray-500 mb-1">Enter OTP sent to +91 {formatPhoneNumber(loginPhone)}</p>
                                            </div>
                                            <div className="flex justify-center gap-3">
                                                {otp.map((data, index) => (
                                                    <input
                                                        key={index}
                                                        id={`otp-${index}`}
                                                        type="text"
                                                        maxLength={1}
                                                        value={data}
                                                        onChange={(e) => handleOtpChange(e.target, index)}
                                                        onKeyDown={(e) => handleBackspace(e, index)}
                                                        className="w-14 h-14 border-2 border-gray-200 rounded-xl text-center text-2xl font-bold text-navy focus:border-orange focus:outline-none focus:ring-4 focus:ring-orange/10 bg-softGray"
                                                    />
                                                ))}
                                            </div>
                                            {/* Resend OTP Logic */}
                                            <div className="text-center text-xs">
                                                {resendStatus ? (
                                                     <p className="text-green-600 font-bold animate-pulse">{resendStatus}</p>
                                                ) : (
                                                    timer > 0 ? (
                                                        <p className="text-gray-400">Resend OTP in <span className="font-bold text-navy">{timer}s</span></p>
                                                    ) : (
                                                        <button 
                                                            type="button" 
                                                            onClick={handleResendOtp}
                                                            className="text-orange font-bold hover:underline"
                                                        >
                                                            Resend OTP
                                                        </button>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-navy uppercase tracking-wide">Email</label>
                                            <input 
                                                type="email"
                                                value={loginEmail}
                                                onChange={(e) => setLoginEmail(e.target.value)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-orange focus:ring-4 focus:ring-orange/10 outline-none transition-all text-navy placeholder-gray-300"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-bold text-navy uppercase tracking-wide">Password</label>
                                                <button 
                                                    type="button"
                                                    onClick={() => { setShowForgotPassword(true); setGlobalError(''); }}
                                                    className="text-[10px] text-orange font-bold hover:underline"
                                                >
                                                    Forgot Password?
                                                </button>
                                            </div>
                                            <div className="relative">
                                                <input 
                                                    type={showLoginPassword ? "text" : "password"}
                                                    value={loginPassword}
                                                    onChange={(e) => setLoginPassword(e.target.value)}
                                                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-orange focus:ring-4 focus:ring-orange/10 outline-none transition-all text-navy placeholder-gray-300 pr-10"
                                                    placeholder="••••••••"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors"
                                                >
                                                    {showLoginPassword ? (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                        </svg>
                                                    ) : (
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {!otpSent && (
                                    <CaptchaBox 
                                        captchaCode={captchaCode}
                                        userCaptchaInput={userCaptchaInput}
                                        setUserCaptchaInput={setUserCaptchaInput}
                                        generateCaptcha={generateCaptcha}
                                    />
                                )}

                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full py-3.5 bg-navy text-white font-bold rounded-xl hover:bg-indigo-900 transition-all shadow-lg hover:shadow-indigo-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? "Processing..." : (otpSent ? 'Verify Login' : 'Continue')}
                                </button>
                            </form>
                        </>
                    ) : (
                        /* --- SIGNUP FORM --- */
                        <form onSubmit={handleSignupSubmit} className="space-y-5 animate-fadeInUp">
                            
                            {/* 1. Identity Section */}
                            <div className="space-y-4">
                                <h4 className="text-orange font-bold text-xs uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-orange"></span>
                                    Identity Details
                                </h4>
                                
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-navy">Full Name (as per Aadhaar & PAN Card)</label>
                                    <input 
                                        type="text"
                                        value={signupData.fullName}
                                        onChange={(e) => handleSignupChange('fullName', e.target.value)}
                                        className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-4 focus:ring-orange/10 outline-none transition-all ${signupErrors.fullName ? 'border-red-300 focus:border-red-300' : 'border-gray-300 focus:border-orange'}`}
                                        placeholder="e.g. Rahul Kumar Verma"
                                    />
                                    {signupErrors.fullName && <p className="text-[10px] text-red-500 font-medium">{signupErrors.fullName}</p>}
                                    <p className="text-[10px] text-gray-400">Used for e-KYC verification.</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-navy">Aadhaar Number</label>
                                        <input 
                                            type="text"
                                            maxLength={14}
                                            value={signupData.aadhaar}
                                            onChange={(e) => handleSignupChange('aadhaar', e.target.value)}
                                            className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-4 focus:ring-orange/10 outline-none transition-all ${signupErrors.aadhaar ? 'border-red-300 focus:border-red-300' : 'border-gray-300 focus:border-orange'}`}
                                            placeholder="1234 5678 9012"
                                        />
                                        {signupErrors.aadhaar && <p className="text-[10px] text-red-500 font-medium">{signupErrors.aadhaar}</p>}
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-navy">Date of Birth</label>
                                        <input 
                                            type="date"
                                            value={signupData.dob}
                                            onChange={(e) => handleSignupChange('dob', e.target.value)}
                                            className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-4 focus:ring-orange/10 outline-none transition-all text-navy ${signupErrors.dob ? 'border-red-300 focus:border-red-300' : 'border-gray-300 focus:border-orange'}`}
                                        />
                                        {signupErrors.dob && <p className="text-[10px] text-red-500 font-medium">{signupErrors.dob}</p>}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-navy">PAN Number</label>
                                    <input 
                                        type="text"
                                        maxLength={10}
                                        value={signupData.pan}
                                        onChange={(e) => handleSignupChange('pan', e.target.value)}
                                        className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-4 focus:ring-orange/10 outline-none transition-all font-mono uppercase ${signupErrors.pan ? 'border-red-300 focus:border-red-300' : 'border-gray-300 focus:border-orange'}`}
                                        placeholder="ABCDE1234F"
                                    />
                                    {signupErrors.pan && <p className="text-[10px] text-red-500 font-medium">{signupErrors.pan}</p>}
                                </div>
                            </div>

                            {/* 2. Contact Section */}
                            <div className="space-y-4 pt-2">
                                <h4 className="text-orange font-bold text-xs uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                                     <span className="w-1.5 h-1.5 rounded-full bg-orange"></span>
                                     Contact Info
                                </h4>
                                
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-navy">Mobile Number</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">+91</span>
                                        <input 
                                            type="tel"
                                            maxLength={11}
                                            value={formatPhoneNumber(signupData.mobile)}
                                            onChange={(e) => handleSignupChange('mobile', e.target.value.replace(/\D/g, ''))}
                                            className={`w-full pl-12 pr-4 py-3 bg-white border rounded-xl focus:ring-4 focus:ring-orange/10 outline-none transition-all ${signupErrors.mobile ? 'border-red-300 focus:border-red-300' : 'border-gray-300 focus:border-orange'}`}
                                            placeholder="98765 43210"
                                        />
                                    </div>
                                    {signupErrors.mobile && <p className="text-[10px] text-red-500 font-medium">{signupErrors.mobile}</p>}
                                    <p className="text-[10px] text-gray-400">OTP will be sent to this number for verification.</p>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-navy">Email Address</label>
                                    <input 
                                        type="email"
                                        value={signupData.email}
                                        onChange={(e) => handleSignupChange('email', e.target.value)}
                                        className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-4 focus:ring-orange/10 outline-none transition-all ${signupErrors.email ? 'border-red-300 focus:border-red-300' : 'border-gray-300 focus:border-orange'}`}
                                        placeholder="name@example.com"
                                    />
                                    {signupErrors.email && <p className="text-[10px] text-red-500 font-medium">{signupErrors.email}</p>}
                                    <p className="text-[10px] text-gray-400">For loan sanctions and statements.</p>
                                </div>
                            </div>

                            {/* 3. Security Section */}
                            <div className="space-y-4 pt-2">
                                <h4 className="text-orange font-bold text-xs uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-2">
                                     <span className="w-1.5 h-1.5 rounded-full bg-orange"></span>
                                     Security
                                </h4>
                                <div className="space-y-1"> {/* Combined password fields into one structure for strength indicator */}
                                    <label className="text-xs font-bold text-navy">Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showSignupPassword ? "text" : "password"}
                                            value={signupData.password}
                                            onChange={(e) => handleSignupChange('password', e.target.value)}
                                            className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-4 focus:ring-orange/10 outline-none transition-all pr-10 ${signupErrors.password ? 'border-red-300 focus:border-red-300' : 'border-gray-300 focus:border-orange'}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowSignupPassword(!showSignupPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors"
                                        >
                                            {showSignupPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {/* Password Strength Indicator */}
                                    {signupData.password.length > 0 && (
                                        <div className="mt-1">
                                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-300 ${passwordStrength.barColor}`} 
                                                    style={{ width: passwordStrength.width }}
                                                ></div>
                                            </div>
                                            <p className={`text-[10px] font-bold ${passwordStrength.color} mt-1`}>
                                                Password Strength: {passwordStrength.text}
                                            </p>
                                        </div>
                                    )}
                                    {signupErrors.password && <p className="text-[10px] text-red-500 font-medium">{signupErrors.password}</p>}
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-navy">Confirm Password</label>
                                    <div className="relative">
                                        <input 
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={signupData.confirmPassword}
                                            onChange={(e) => handleSignupChange('confirmPassword', e.target.value)}
                                            className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-4 focus:ring-orange/10 outline-none transition-all pr-10 ${signupErrors.confirmPassword ? 'border-red-300 focus:border-red-300' : 'border-gray-300 focus:border-orange'}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy transition-colors"
                                        >
                                            {showConfirmPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {signupErrors.confirmPassword && <p className="text-[10px] text-red-500 font-medium">{signupErrors.confirmPassword}</p>}
                                </div>
                            </div>

                            <div className="pt-2">
                                <CaptchaBox 
                                    captchaCode={captchaCode}
                                    userCaptchaInput={userCaptchaInput}
                                    setUserCaptchaInput={setUserCaptchaInput}
                                    generateCaptcha={generateCaptcha}
                                />
                            </div>

                            <div className="flex items-start gap-2 pt-2">
                                <input type="checkbox" id="terms" className="mt-1 accent-orange" />
                                <label htmlFor="terms" className="text-[10px] text-gray-500 leading-tight">
                                    I agree to the <a href="#" className="text-orange underline">Terms & Conditions</a> and authorize Tata Capital to fetch my credit report from CIBIL/Experian.
                                </label>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full py-3.5 bg-navy text-white font-bold rounded-xl hover:bg-indigo-900 transition-all shadow-lg hover:shadow-indigo-900/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                ) : "Create Secure Profile"}
                            </button>
                        </form>
                    )}
                    
                    {/* Toggle Login/Signup */}
                    <div className="mt-8 text-center pt-6 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            {isSignUp ? "Already have an account?" : "New to ArthSahay?"}
                            <button 
                                onClick={() => { setIsSignUp(!isSignUp); setGlobalError(''); generateCaptcha(); }}
                                className="text-orange font-bold ml-1 hover:underline focus:outline-none"
                            >
                                {isSignUp ? "Login" : "Sign Up"}
                            </button>
                        </p>
                    </div>

                    <div className="mt-8 text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <div className="h-px bg-gray-200 w-12"></div>
                            <span className="text-xs text-gray-400 uppercase tracking-widest">RBI Regulated Entity</span>
                            <div className="h-px bg-gray-200 w-12"></div>
                        </div>
                        <p className="text-[10px] text-gray-400">
                            By continuing, you agree to our <a href="#" className="underline hover:text-navy">Terms of Service</a> and <a href="#" className="underline hover:text-navy">Privacy Policy</a>.
                        </p>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

       {/* Forgot Password Modal */}
       {showForgotPassword && (
          <div className="absolute inset-0 z-50 bg-navy/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeInUp">
              <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl relative">
                  <button 
                    onClick={resetForgotPasswordModal}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  
                  {!forgotPasswordSuccess ? (
                      <>
                          <div className="w-12 h-12 bg-orange/10 rounded-full flex items-center justify-center text-orange text-2xl mb-4 mx-auto">
                              🔑
                          </div>
                          <h3 className="text-xl font-bold text-navy text-center mb-2">Reset Password</h3>
                          <p className="text-sm text-gray-500 text-center mb-6">
                              Enter your registered email address. We'll send you a secure link to reset your password.
                          </p>
                          
                          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                              <div className="space-y-1">
                                  <label className="text-xs font-bold text-navy">Email Address</label>
                                  <input 
                                      type="email"
                                      value={forgotEmail}
                                      onChange={(e) => setForgotEmail(e.target.value)}
                                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:border-orange focus:ring-4 focus:ring-orange/10 outline-none transition-all text-navy"
                                      placeholder="name@example.com"
                                      autoFocus
                                  />
                              </div>
                              
                              {globalError && <p className="text-xs text-red-500 font-bold text-center">{globalError}</p>}
                              
                              <button 
                                  type="submit" 
                                  disabled={forgotPasswordLoading}
                                  className="w-full py-3 bg-navy text-white font-bold rounded-xl hover:bg-teal transition-colors flex items-center justify-center gap-2"
                              >
                                  {forgotPasswordLoading ? "Sending..." : "Send Reset Link"}
                              </button>
                          </form>
                      </>
                  ) : (
                      <div className="text-center">
                          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-3xl mb-4 mx-auto animate-bounce">
                              ✓
                          </div>
                          <h3 className="text-xl font-bold text-navy mb-2">Check your Email</h3>
                          <p className="text-sm text-gray-500 mb-6">
                              We have sent a password reset link to <br/><span className="font-bold text-navy">{forgotEmail}</span>
                          </p>
                          <button 
                              onClick={resetForgotPasswordModal}
                              className="w-full py-3 bg-gray-100 text-navy font-bold rounded-xl hover:bg-gray-200 transition-colors"
                          >
                              Back to Login
                          </button>
                      </div>
                  )}
              </div>
          </div>
       )}
    </div>
  );
}
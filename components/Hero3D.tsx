import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Hero3D() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isAuthenticated') === 'true';

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-32 pb-20 bg-cream">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <div className="text-left space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy/5 border border-navy/10 text-navy font-bold text-xs uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-teal animate-pulse"></span>
              Powering Dreams with Tata Capital
          </div>
          <div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-navy leading-[1.1] tracking-tight mb-4">
              <span className="font-serif">ArthSahay</span> <span className="text-teal font-sans bg-teal/10 px-3 rounded-lg border border-teal/20 text-4xl lg:text-6xl align-middle inline-block py-1">24/7</span><br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-navy to-teal text-4xl lg:text-6xl">Intelligent Financing.</span>
            </h1>
            <p className="text-xl lg:text-2xl text-navy/70 font-serif italic font-medium">
              "Smart Loan Chuno, Apni Life ke Sapne Buno."
            </p>
          </div>
          
          <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
            Experience the trust of Tata Capital combined with next-gen AI. Instant approvals, transparent terms, and financial support whenever you need it.
          </p>

          <div className="flex gap-4">
            <Link 
                to={isLoggedIn ? "/chat" : "/login"}
                state={isLoggedIn ? { initialMessage: "i need to apply for a loan" } : { mode: 'signup' }}
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white bg-orange rounded-xl hover:bg-orangeDark transition-all shadow-lg hover:shadow-orange/30 hover:-translate-y-1"
            >
                {isLoggedIn ? "View Application Status" : "Start Application"}
            </Link>
             <button 
                onClick={() => navigate('/login', { state: { mode: 'signup' } })}
                className="px-8 py-4 text-lg font-bold text-navy border-2 border-navy/10 rounded-xl hover:bg-white hover:border-navy transition-all"
             >
                Check Eligibility
            </button>
          </div>
          
          <div className="pt-4 flex items-center gap-4 text-sm text-gray-500 font-medium">
             <p>Trusted by over <span className="text-navy font-bold">2.5 Million</span> Indians</p>
             <div className="h-4 w-px bg-gray-300"></div>
             <p>Member of <span className="text-navy font-bold">Tata Group</span></p>
          </div>
        </div>

        {/* Right Content - CSS Device Mockup */}
        <div className="relative flex justify-center lg:justify-end mt-10 lg:mt-0">
            {/* Laptop Mockup */}
            <div className="relative w-[90%] max-w-[500px] aspect-[4/3] bg-navy rounded-t-3xl p-4 shadow-2xl border-4 border-navy">
                <div className="w-full h-full bg-cream rounded-t-xl overflow-hidden relative p-6 flex flex-col items-center">
                    <div className="w-full h-8 flex items-center gap-2 mb-4 bg-gray-100 rounded-full px-4">
                         <div className="w-3 h-3 rounded-full bg-red-400"></div>
                         <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                         <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm w-full mb-4 border border-gray-100">
                        <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-teal flex items-center justify-center text-white text-xs">✓</div>
                                <span className="font-bold text-navy">Loan Sanctioned</span>
                             </div>
                             <span className="text-xs font-bold text-navy tracking-widest">TATA CAPITAL</span>
                        </div>
                        <div className="h-2 w-3/4 bg-gray-200 rounded-full mb-2"></div>
                        <div className="h-2 w-1/2 bg-gray-200 rounded-full"></div>
                    </div>
                     <div className="bg-white p-4 rounded-xl shadow-sm w-full border border-gray-100 opacity-60">
                         <div className="h-2 w-full bg-gray-200 rounded-full mb-2"></div>
                         <div className="h-2 w-5/6 bg-gray-200 rounded-full"></div>
                    </div>
                </div>
            </div>
            {/* Laptop Base */}
            <div className="absolute -bottom-4 w-[100%] max-w-[560px] h-4 bg-gray-800 rounded-b-xl shadow-xl"></div>

            {/* Phone Overlay */}
            <div className="absolute -bottom-12 -right-4 lg:right-10 w-[180px] bg-navy rounded-[30px] p-2 border-4 border-navy shadow-2xl hover:scale-105 transition-transform duration-500">
                <div className="w-full h-full bg-cream rounded-[24px] overflow-hidden flex flex-col relative">
                     <div className="bg-navy p-4 text-white text-xs">
                         <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-white/20 text-[8px] flex items-center justify-center font-serif">AS</div>
                             <span className="font-serif">ArthSahay</span>
                         </div>
                     </div>
                     <div className="p-3 flex-1 flex flex-col justify-end space-y-2">
                         <div className="bg-white p-2 rounded-lg rounded-tl-none shadow-sm text-[10px] text-gray-600">
                             Welcome to Tata Capital. How can I help?
                         </div>
                         <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                             <div className="text-[8px] text-gray-400">Approved Amount</div>
                             <div className="text-xs font-bold text-navy">₹ 5,00,000</div>
                         </div>
                         <button className="w-full py-2 bg-teal text-white text-[10px] font-bold rounded-lg">
                             Accept Offer
                         </button>
                     </div>
                </div>
            </div>
        </div>

      </div>
    </section>
  );
}
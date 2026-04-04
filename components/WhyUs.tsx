import React from 'react';

export default function WhyUs() {
  return (
    <section id="security" className="relative py-24 px-6 bg-white overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-teal/5 rounded-full blur-[120px]"></div>
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#E5E7EB 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            {/* Left Content - The Promise */}
            <div className="lg:w-1/2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy/5 border border-navy/10 text-navy text-xs font-bold uppercase tracking-wider mb-6">
                    <span className="w-2 h-2 rounded-full bg-teal animate-pulse"></span>
                    Tata Capital Security Protocol
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-navy mb-6 leading-tight">
                    Desh ka Bharosa,<br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal to-tealDark">Bank-Grade Suraksha.</span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-xl">
                    Your financial data is sacred. We treat it with the same rigorous security standards used by India's top banks. Encrypted, regulated, and transparent.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Feature 1 */}
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-teal/20 hover:shadow-lg transition-all group">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-teal/10 flex items-center justify-center text-teal group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>
                            </div>
                            <h3 className="text-navy font-bold">RBI Compliant</h3>
                        </div>
                        <p className="text-xs text-gray-500">Registered NBFC adhering to all fair practice codes.</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-orange/20 hover:shadow-lg transition-all group">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-orange/10 flex items-center justify-center text-orange group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>
                            </div>
                            <h3 className="text-navy font-bold">ISO 27001 Certified</h3>
                        </div>
                        <p className="text-xs text-gray-500">Global standard for information security management.</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-400/20 hover:shadow-lg transition-all group">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            </div>
                            <h3 className="text-navy font-bold">Total Privacy</h3>
                        </div>
                        <p className="text-xs text-gray-500">Data is never shared with third parties without consent.</p>
                    </div>

                     {/* Feature 4 */}
                     <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-purple-500/20 hover:shadow-lg transition-all group">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-navy font-bold">No Hidden Fees</h3>
                        </div>
                        <p className="text-xs text-gray-500">What you see is what you pay. 100% Transparent.</p>
                    </div>
                </div>
            </div>

            {/* Right Content - Visual Shield (Vault Card) */}
            <div className="lg:w-1/2 flex justify-center relative">
                <div className="relative w-80 h-96">
                    {/* Glowing layers - Subtle on light bg */}
                    <div className="absolute inset-0 bg-teal/5 rounded-[3rem] blur-xl animate-pulse"></div>
                    
                    {/* Main Card - Dark 'Vault' look to contrast */}
                    <div className="absolute inset-2 bg-gradient-to-br from-navy to-gray-800 rounded-[2.5rem] border border-gray-700 flex flex-col items-center justify-center p-8 text-center shadow-2xl shadow-navy/20">
                        <div className="w-24 h-24 bg-gradient-to-tr from-teal to-tealDark rounded-full flex items-center justify-center mb-6 shadow-lg shadow-teal/30 ring-4 ring-white/5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-white">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">100% Secured</h3>
                        <p className="text-gray-400 text-sm mb-6">End-to-end Encrypted Channel</p>
                        
                        <div className="w-full bg-white/5 rounded-lg p-3 flex items-center gap-3 border border-white/5">
                             <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                             <span className="text-xs font-mono text-green-400">System Active & Monitored</span>
                        </div>
                    </div>

                    {/* Floating Badges */}
                    <div className="absolute -right-8 top-10 bg-white p-3 rounded-lg shadow-xl animate-bounce border border-gray-100" style={{ animationDuration: '3s' }}>
                        <img src="https://cdn-icons-png.flaticon.com/512/2666/2666505.png" alt="Shield" className="w-6 h-6" />
                    </div>
                     <div className="absolute -left-6 bottom-20 bg-white p-3 rounded-lg shadow-xl border border-teal/20 animate-bounce" style={{ animationDuration: '4s' }}>
                        <span className="text-xs font-bold text-teal">SSL Certified</span>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </section>
  );
}
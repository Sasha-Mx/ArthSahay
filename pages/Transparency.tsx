import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function Transparency() {
  return (
    <div className="min-h-screen bg-cream font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
            
            <div className="mb-12 text-center">
                 <span className="text-orange font-bold text-sm tracking-wider uppercase mb-2 block">Our Commitment</span>
                 <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-navy via-teal to-orange mb-4">Transparency First</h1>
                 <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                    We believe financial products should be simple, fair, and fully transparent. Here is how we align with RBI guidelines to protect your rights.
                 </p>
            </div>

            {/* Regulatory Info Section */}
            <div className="bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e1b4b] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5 ring-1 ring-white/10">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] -mr-20 -mt-20 mix-blend-screen pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] -ml-20 -mb-20 mix-blend-screen pointer-events-none"></div>
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                        <div>
                            <span className="text-teal-400 font-bold text-xs tracking-widest uppercase block mb-1">RBI Consumer Charter</span>
                            <h3 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">Your Rights & Protections</h3>
                        </div>
                        <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs font-mono text-gray-300 backdrop-blur-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                            Compliance: ISO 27001
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Card 1 */}
                        <div className="group bg-[#111827]/50 border border-white/5 p-6 rounded-2xl hover:bg-[#1e293b]/80 transition-all duration-300 hover:border-teal/30 hover:-translate-y-1 relative overflow-hidden backdrop-blur-md">
                            <div className="w-12 h-12 bg-gradient-to-br from-teal/20 to-blue-500/20 rounded-xl flex items-center justify-center text-teal-300 mb-4 text-xl shadow-lg shadow-teal/5 border border-white/5">
                                ⚖️
                            </div>
                            <h4 className="font-bold text-lg mb-2 text-white group-hover:text-teal-200 transition-colors">Smart Borrowing Limits</h4>
                            <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300">
                                We follow RBI's guidelines to ensure your total EMIs do not exceed <strong>50% of your net income</strong>. There is no fixed cap, but we prioritize your financial health and credit score (700+).
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="group bg-[#111827]/50 border border-white/5 p-6 rounded-2xl hover:bg-[#1e293b]/80 transition-all duration-300 hover:border-blue-400/30 hover:-translate-y-1 relative overflow-hidden backdrop-blur-md">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-xl flex items-center justify-center text-blue-300 mb-4 text-xl shadow-lg shadow-blue/5 border border-white/5">
                                📄
                            </div>
                            <h4 className="font-bold text-lg mb-2 text-white group-hover:text-blue-200 transition-colors">Paperless Thresholds</h4>
                            <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300">
                                <strong>Loans ≤ ₹50,000:</strong> Instant approval with just a selfie & Aadhaar. 
                                <br/>
                                <strong>Loans > ₹50,000:</strong> Simple digital uploads (Bank Statement). No branch visits required.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="group bg-[#111827]/50 border border-white/5 p-6 rounded-2xl hover:bg-[#1e293b]/80 transition-all duration-300 hover:border-purple-400/30 hover:-translate-y-1 relative overflow-hidden backdrop-blur-md">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-xl flex items-center justify-center text-purple-300 mb-4 text-xl shadow-lg shadow-purple/5 border border-white/5">
                                🛡️
                            </div>
                            <h4 className="font-bold text-lg mb-2 text-white group-hover:text-purple-200 transition-colors">Your Safety Net</h4>
                            <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300">
                                Enjoy a <strong>3-7 day cooling-off period</strong> to return the loan interest-free if you change your mind. Grievances can be raised directly via the RBI CIMS portal.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
      </main>
      
      <Footer />
    </div>
  );
}
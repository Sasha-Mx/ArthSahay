import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import RBIFaq from '../components/RBIFaq';

export default function RBIGuide() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <Navbar />
      
      {/* 1. Hero Section */}
      <header className="pt-32 pb-20 px-6 bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-teal-300 font-bold text-xs uppercase tracking-wider mb-6">
             <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
             Customer Awareness Initiative
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-6 leading-tight font-serif">
            Understand Your Rights Under <br className="hidden md:block" />
            <span className="text-teal">RBI Digital Lending Rules (2025)</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-8">
            A simple guide to how instant personal loans work and the robust protections the RBI guarantees you for a safe, transparent digital borrowing experience.
          </p>
          <div className="flex justify-center gap-4">
             <div className="flex flex-col items-center gap-2">
                 <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">🛡️</div>
                 <span className="text-xs font-medium text-slate-400">Secure</span>
             </div>
             <div className="w-px h-16 bg-white/10"></div>
             <div className="flex flex-col items-center gap-2">
                 <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">⚖️</div>
                 <span className="text-xs font-medium text-slate-400">Regulated</span>
             </div>
             <div className="w-px h-16 bg-white/10"></div>
             <div className="flex flex-col items-center gap-2">
                 <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl">📝</div>
                 <span className="text-xs font-medium text-slate-400">Transparent</span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16 space-y-20">
        
        {/* 2. Step-By-Step Process (Tata Capital Instant Loan) */}
        <section>
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-navy mb-4">How Our 100% Digital Process Works</h2>
                <p className="text-slate-600 max-w-2xl mx-auto">
                    Tata Capital follows a strictly defined digital workflow to ensure speed without compromising on compliance.
                </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "1. Apply Online", desc: "Start via our secure website or app. No physical branch visit needed.", icon: "📱" },
                    { title: "2. e-KYC", desc: "Aadhaar-based OTP verification (UIDAI) or Video KYC for identity proof.", icon: "🆔" },
                    { title: "3. Upload Docs", desc: "Digital bank statements or salary slips for income assessment.", icon: "📂" },
                    { title: "4. Eligibility Check", desc: "AI assessment of credit score & affordability (LTI Ratio).", icon: "🔍" },
                    { title: "5. Offer & KFS", desc: "Receive specific loan amount, interest rate, and Key Fact Statement.", icon: "📋" },
                    { title: "6. E-Sign Sanction", desc: "Digitally sign the agreement. Read terms carefully before signing.", icon: "✍️" },
                    { title: "7. Instant Disbursal", desc: "Funds transferred directly to your verified bank account.", icon: "💸" },
                    { title: "8. Track Repayment", desc: "Monitor EMIs and statement via the dashboard 24/7.", icon: "📊" },
                ].map((step, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 text-6xl font-bold group-hover:scale-110 transition-transform cursor-default select-none">
                            {idx + 1}
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-teal/10 flex items-center justify-center text-2xl mb-4 text-teal-700">
                            {step.icon}
                        </div>
                        <h3 className="font-bold text-navy text-lg mb-2">{step.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">{step.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* 2.5 MERGED: Transparency & Safety Net Highlights */}
        <section>
             <div className="bg-gradient-to-br from-[#020617] via-[#0f172a] to-[#1e1b4b] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden shadow-2xl border border-white/5 ring-1 ring-white/10">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] -mr-20 -mt-20 mix-blend-screen pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] -ml-20 -mb-20 mix-blend-screen pointer-events-none"></div>
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
                
                <div className="relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                        <div>
                            <span className="text-teal-400 font-bold text-xs tracking-widest uppercase block mb-1">Our Core Commitment</span>
                            {/* Updated Colors: Transparency (White), First (Teal - Responsibility Color) */}
                            <h3 className="text-2xl md:text-3xl font-bold">
                                <span className="text-white">Transparency</span> <span className="text-teal">First</span>
                            </h3>
                        </div>
                        <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs font-mono text-gray-300 backdrop-blur-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                            Verified ISO 27001
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
                                We follow RBI's guidelines to ensure your total EMIs do not exceed <strong>50% of your net income</strong>. We prioritize your financial health and credit score (700+).
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
        </section>

        {/* 3. RBI Digital Lending Directions 2025 (Explained Simply) */}
        <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-200">
            <div className="mb-10">
                <span className="text-orange font-bold text-sm tracking-wider uppercase mb-2 block">Regulatory Framework</span>
                <h2 className="text-3xl font-bold text-navy">Detailed RBI Guidelines</h2>
            </div>

            <div className="space-y-8">
                {/* Rule Block 1 */}
                <div className="border-b border-slate-100 pb-8">
                    <h3 className="text-xl font-bold text-teal-700 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                        Transparency & The Key Fact Statement (KFS)
                    </h3>
                    <p className="text-slate-600 mb-4">
                        Lenders must provide a standardized **Key Fact Statement (KFS)** before the loan contract is signed. This document summarizes key details so you can compare offers easily.
                    </p>
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                        <h4 className="font-bold text-sm text-navy mb-3 uppercase tracking-wide">What must be in a KFS?</h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600">
                            <li className="flex items-center gap-2">✅ All-inclusive Annual Percentage Rate (APR)</li>
                            <li className="flex items-center gap-2">✅ Recovery mechanism details</li>
                            <li className="flex items-center gap-2">✅ Details of Grievance Redressal Officer</li>
                            <li className="flex items-center gap-2">✅ Cooling-off period details</li>
                            <li className="flex items-center gap-2">✅ Total amount to be repaid</li>
                            <li className="flex items-center gap-2">✅ Penal charges (if any)</li>
                        </ul>
                    </div>
                </div>

                {/* Rule Block 2 */}
                <div className="border-b border-slate-100 pb-8">
                    <h3 className="text-xl font-bold text-teal-700 mb-4 flex items-center gap-2">
                         <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                        Data Privacy & Consent
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <p className="text-slate-600 mb-4">
                                Lenders can only collect data that is **need-based** and with your **explicit consent**. You have the right to revoke consent at any time.
                            </p>
                            <ul className="space-y-2 text-sm text-slate-600">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 font-bold">✕</span> 
                                    <span>Lenders cannot access mobile phone resources like file systems, media, contact lists, or call logs.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 font-bold">✓</span> 
                                    <span>One-time access to camera, microphone, or location is allowed only for KYC purposes with permission.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 text-sm text-blue-800">
                            <strong>Note:</strong> ArthSahay stores all customer data in servers located within India, complying strictly with data localization norms.
                        </div>
                    </div>
                </div>

                {/* Rule Block 3 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
                     <div>
                        <h3 className="text-xl font-bold text-teal-700 mb-4 flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                            Sanctioning & Disbursal
                        </h3>
                        <p className="text-slate-600 text-sm">
                            Loans must be disbursed **directly** into the borrower's bank account. No pass-through accounts or third-party pool accounts are permitted.
                        </p>
                     </div>
                     <div>
                        <h3 className="text-xl font-bold text-teal-700 mb-4 flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-teal-500"></span>
                            Repayment & Penalties
                        </h3>
                        <p className="text-slate-600 text-sm">
                            Penal interest/charges must be based on the outstanding amount, not the total loan amount. These charges must be disclosed upfront in the KFS.
                        </p>
                     </div>
                </div>
            </div>
        </section>

        {/* 4. User Rights & Protections */}
        <section>
             <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-navy mb-4">Your Rights as a Borrower</h2>
                <p className="text-slate-600">Empower yourself with these RBI-mandated protections.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { 
                        title: "Right to Cooling-off", 
                        desc: "You have a 3-day window (for loans ≥ 7 days) to exit the loan by paying the principal + proportionate APR without any penalty.",
                        icon: "❄️" 
                    },
                    { 
                        title: "Right to Privacy", 
                        desc: "You can deny access to specific data permissions. We cannot force you to share contacts or gallery access to get a loan.",
                        icon: "🔒" 
                    },
                    { 
                        title: "Right to Fair Recovery", 
                        desc: "Recovery agents must be authorized and cannot call before 8 AM or after 7 PM. No harassment or intimidation is tolerated.",
                        icon: "🤝" 
                    },
                    { 
                        title: "Right to Information", 
                        desc: "You are entitled to a copy of the loan agreement and KFS in a language you understand.",
                        icon: "ℹ️" 
                    },
                    { 
                        title: "Grievance Redressal", 
                        desc: "If your complaint isn't resolved by us within 30 days, you can lodge a complaint on the RBI CIMS / CMS portal.",
                        icon: "📢" 
                    },
                    { 
                        title: "No Hidden Costs", 
                        desc: "Any fees not mentioned in the Key Fact Statement cannot be charged to you at any stage.",
                        icon: "🚫" 
                    }
                ].map((right, idx) => (
                    <div key={idx} className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:border-teal/50 transition-colors">
                        <div className="text-3xl mb-4">{right.icon}</div>
                        <h3 className="font-bold text-navy mb-2">{right.title}</h3>
                        <p className="text-sm text-slate-600 leading-relaxed">{right.desc}</p>
                    </div>
                ))}
            </div>
        </section>

        {/* 5. What Users Must Follow (Responsibilities) - REVISED PALETTE */}
        <section className="bg-navy rounded-3xl p-8 md:p-16 text-white overflow-hidden relative shadow-2xl border border-navy/50">
            {/* Vivid background elements to remove faded look */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal/20 rounded-full blur-[80px] -mr-20 -mt-20 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange/10 rounded-full blur-[80px] -ml-20 -mb-20 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-1/2">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 font-serif leading-tight">
                        Borrower <span className="text-teal">Responsibilities</span>
                    </h2>
                    <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                        Responsible borrowing ensures a healthy credit score and financial peace of mind. Follow this checklist to stay financially secure.
                    </p>
                    <Link to="/login" className="inline-block px-8 py-4 bg-white text-navy font-bold rounded-xl hover:bg-teal hover:text-white transition-all shadow-lg hover:shadow-teal/25 hover:-translate-y-1">
                        Check Eligibility Now
                    </Link>
                </div>
                <div className="md:w-1/2 w-full">
                    <div className="bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 space-y-5 shadow-xl">
                        {[
                            "Provide accurate income and KYC details.",
                            "Ensure your total EMI outgo is ≤ 50% of your income.",
                            "Avoid applying through unauthorized agents or WhatsApp.",
                            "Always read the Key Fact Statement (KFS) before OTP signing.",
                            "Repay EMIs on time to avoid penalties and credit score impact."
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 group">
                                <div className="w-6 h-6 rounded-full bg-teal flex items-center justify-center text-white text-xs font-bold mt-0.5 shadow-lg shadow-teal/20 group-hover:scale-110 transition-transform">✓</div>
                                <span className="text-base text-gray-200 group-hover:text-white transition-colors">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>

        {/* 6. Fraud Awareness Section */}
        <section className="bg-red-50 rounded-3xl p-8 border border-red-100">
            <div className="flex flex-col md:flex-row gap-8 items-start">
                 <div className="md:w-1/3 text-center md:text-left">
                     <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mx-auto md:mx-0 mb-4">
                        ⚠️
                     </div>
                     <h3 className="text-2xl font-bold text-red-800 mb-2">Beware of Fraud</h3>
                     <p className="text-red-700/80 text-sm">
                         Stay vigilant against digital lending scams.
                     </p>
                 </div>
                 <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="bg-white p-4 rounded-xl border border-red-100">
                         <h4 className="font-bold text-red-800 text-sm mb-1">No Upfront Fees</h4>
                         <p className="text-xs text-slate-600">Tata Capital never asks for an advance fee to process or sanction a loan.</p>
                     </div>
                     <div className="bg-white p-4 rounded-xl border border-red-100">
                         <h4 className="font-bold text-red-800 text-sm mb-1">Official Sources Only</h4>
                         <p className="text-xs text-slate-600">Only download apps from Google Play/App Store listed as 'Tata Capital'.</p>
                     </div>
                     <div className="bg-white p-4 rounded-xl border border-red-100">
                         <h4 className="font-bold text-red-800 text-sm mb-1">No APK Downloads</h4>
                         <p className="text-xs text-slate-600">Never install .apk files sent via SMS or WhatsApp.</p>
                     </div>
                     <div className="bg-white p-4 rounded-xl border border-red-100">
                         <h4 className="font-bold text-red-800 text-sm mb-1">Report Suspicion</h4>
                         <p className="text-xs text-slate-600">Contact customercare@tatacapital.com immediately if you suspect fraud.</p>
                     </div>
                 </div>
            </div>
        </section>

        {/* 7. Comprehensive FAQ Section */}
        <RBIFaq />

        {/* 8. CTA */}
        <div className="text-center py-8">
            <h3 className="text-xl font-bold text-navy mb-4">Ready to borrow responsibly?</h3>
            <div className="flex justify-center gap-4">
                 <Link to="/login" className="px-6 py-3 bg-navy text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg">
                    Check Loan Eligibility
                 </Link>
                 <a href="https://www.rbi.org.in" target="_blank" rel="noreferrer" className="px-6 py-3 bg-white border border-slate-200 text-navy font-bold rounded-xl hover:bg-slate-50 transition-colors">
                    Visit RBI Website
                 </a>
            </div>
        </div>

        {/* 9. Disclaimer */}
        <div className="border-t border-slate-200 pt-8 text-xs text-slate-400 leading-relaxed text-center max-w-4xl mx-auto">
            <p className="mb-2 font-bold">Disclaimer</p>
            <p>
                This page is an awareness initiative by Tata Capital Financial Services Limited to educate customers about digital lending norms. It does not constitute legal advice. Loan approvals are at the sole discretion of Tata Capital, subject to document verification and credit policy. Interest rates and terms may vary. Customers are advised to read the Key Fact Statement (KFS) and Loan Agreement carefully before digitally signing. For full terms and conditions, please visit www.tatacapital.com.
            </p>
        </div>

      </main>

      <Footer />
    </div>
  );
}
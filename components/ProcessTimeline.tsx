import React from 'react';

export default function ProcessTimeline() {
  const steps = [
    { title: "Need & Offer", active: false },
    { title: "KYC Verification", active: true },
    { title: "Income & Score Check", active: false },
    { title: "Decision & Guardrails", active: false },
    { title: "Sanction Letter", active: false },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
           <span className="text-orange font-bold text-sm tracking-wider uppercase mb-2 block">How It Works</span>
           <h2 className="text-4xl font-bold text-navy">Your Journey to Approval</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left: Steps */}
            <div className="space-y-4">
                <h3 className="text-2xl font-bold text-navy mb-8">Simple 5-Step Process</h3>
                <div className="bg-cream rounded-2xl p-8 border border-gray-100 shadow-sm">
                    {steps.map((step, idx) => (
                        <div key={idx} className="relative flex items-center gap-4 mb-6 last:mb-0">
                            {/* Connector Line */}
                            {idx !== steps.length - 1 && (
                                <div className="absolute left-[11px] top-8 w-0.5 h-8 bg-gray-200"></div>
                            )}
                            
                            {/* Icon */}
                            <div className={`z-10 w-6 h-6 rounded-full flex items-center justify-center border-2 ${step.active ? 'bg-teal border-teal' : 'bg-white border-gray-300'}`}>
                                {step.active && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                                {!step.active && idx < 1 && <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                            </div>
                            
                            {/* Text */}
                            <div className={`${step.active ? 'text-navy font-bold text-lg' : 'text-gray-500 font-medium'}`}>
                                {step.title}
                            </div>

                            {/* Active Indicator */}
                            {step.active && (
                                <div className="ml-auto px-3 py-1 bg-navy text-white text-xs rounded-full font-bold">
                                    In Progress
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Mockup */}
            <div className="relative">
                <div className="w-full max-w-md mx-auto bg-navy rounded-3xl p-6 shadow-2xl border-8 border-navy relative">
                     {/* Chat Header */}
                     <div className="flex items-center gap-4 mb-6 pb-4 border-b border-white/10">
                         <div className="w-10 h-10 rounded-full bg-teal flex items-center justify-center text-white">
                             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                             </svg>
                         </div>
                         <div>
                             <h4 className="text-white font-bold">Your SmartLoan Expert</h4>
                             <div className="flex items-center gap-1.5">
                                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                 <span className="text-xs text-gray-400">Online</span>
                             </div>
                         </div>
                         <div className="ml-auto text-gray-400">•••</div>
                     </div>

                     {/* Chat Messages */}
                     <div className="space-y-4 font-sans text-sm">
                         <div className="flex gap-3">
                             <div className="bg-gray-700/50 p-3 rounded-2xl rounded-tl-none text-gray-200 max-w-[85%] border border-white/5">
                                 Please confirm your mobile number to proceed with KYC.
                             </div>
                         </div>
                         
                         <div className="bg-white rounded-xl p-4 shadow-lg mx-4">
                             <label className="text-xs text-gray-500 block mb-1">Mobile Number</label>
                             <div className="font-bold text-navy text-lg mb-4">+91 98765 XXXXX</div>
                             <button className="w-full py-2 bg-teal hover:bg-tealDark text-white font-bold rounded-lg transition-colors">
                                 Send OTP
                             </button>
                         </div>

                         <div className="flex gap-3 flex-row-reverse">
                             <div className="bg-teal p-3 rounded-2xl rounded-tr-none text-white max-w-[85%] shadow-md">
                                 OTP Sent!
                             </div>
                         </div>
                     </div>

                     {/* Fade overlay at bottom */}
                     <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-navy to-transparent rounded-b-2xl"></div>
                </div>
                
                {/* Floating Badge */}
                <div className="absolute top-1/2 -right-4 md:-right-10 bg-white p-4 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3 animate-bounce" style={{ animationDuration: '3s' }}>
                     <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                         </svg>
                     </div>
                     <div>
                         <p className="text-xs text-gray-500 font-bold uppercase">Status</p>
                         <p className="text-navy font-bold">KYC Verified</p>
                     </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
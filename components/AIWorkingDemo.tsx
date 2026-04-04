import React, { useEffect, useState } from 'react';

export default function AIWorkingDemo() {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4000); // Change every 4 seconds
    return () => clearInterval(interval);
  }, []);

  const steps = [
    {
      id: 0,
      title: "Contextual Understanding",
      desc: "Unlike standard bots, ArthSahay understands intent. If you say 'medical emergency', it prioritizes speed and empathetic processing.",
      icon: "👂",
      color: "bg-blue-100 text-blue-600"
    },
    {
      id: 1,
      title: "Ethical Guardrails",
      desc: "Our AI is hard-coded with Tata's ethical values. It strictly checks for affordability to prevent over-borrowing while ensuring fair access.",
      icon: "🛡️",
      color: "bg-teal-100 text-teal-600"
    },
    {
      id: 2,
      title: "Human-in-the-Loop",
      desc: "While AI handles the speed, human experts are alerted for complex cases, ensuring you always have a safety net.",
      icon: "👥",
      color: "bg-orange-100 text-orange-600"
    }
  ];

  return (
    <section className="py-24 px-6 bg-white overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal/5 rounded-full blur-[100px] -mr-40 -mt-40 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left: Text & Steps */}
        <div className="order-2 lg:order-1">
           <span className="text-teal font-bold text-sm tracking-wider uppercase mb-2 block animate-pulse">Inside the Core</span>
           <h2 className="text-4xl lg:text-5xl font-bold text-navy mb-6 leading-tight">Not just an algorithm.<br/>A Financial Partner.</h2>
           <p className="text-gray-600 text-lg mb-10 leading-relaxed max-w-lg">
             See how ArthSahay processes your request with a balance of <span className="text-navy font-bold">computational speed</span> and <span className="text-navy font-bold">human-like empathy</span>.
           </p>

           <div className="space-y-4">
             {steps.map((step, idx) => (
               <div 
                 key={idx} 
                 className={`p-6 rounded-2xl transition-all duration-500 cursor-pointer border ${activeStep === idx ? 'bg-orange border-orange shadow-2xl scale-105 translate-x-2' : 'bg-white border-gray-100 hover:border-orange/30 hover:bg-orange/5'}`}
                 onClick={() => setActiveStep(idx)}
               >
                 <div className="flex items-start gap-4">
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl shrink-0 transition-colors ${activeStep === idx ? 'bg-white/20 text-white' : step.color}`}>
                     {step.icon}
                   </div>
                   <div>
                     <h3 className={`font-bold text-lg mb-2 ${activeStep === idx ? 'text-white' : 'text-navy'}`}>{step.title}</h3>
                     <p className={`text-sm leading-relaxed ${activeStep === idx ? 'text-white/90' : 'text-gray-500'}`}>
                       {step.desc}
                     </p>
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>

        {/* Right: Visual Simulation */}
        <div className="order-1 lg:order-2 relative h-[500px] lg:h-[600px] w-full bg-gradient-to-br from-cream to-white rounded-[40px] border-4 border-white shadow-2xl overflow-hidden flex flex-col items-center justify-center p-8">
            {/* Background Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#111827 1px, transparent 1px), linear-gradient(90deg, #111827 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

            {/* Central Node - High Quality 3D Visual */}
            <div className="relative z-10 w-48 h-48 mb-10 transition-all duration-500 hover:scale-105">
                <div className="absolute inset-0 bg-teal/30 rounded-full blur-3xl animate-pulse"></div>
                
                {/* Image Container with Neo-Glassmorphism */}
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white/50 shadow-2xl relative z-20 bg-black">
                    <img 
                        src="https://plus.unsplash.com/premium_photo-1664297939846-330cfd170bae?q=80&w=2055&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                        alt="AI Neural Core" 
                        className="w-full h-full object-cover scale-125 opacity-90 contrast-125 hover:rotate-3 transition-transform duration-[20s]"
                    />
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
                </div>
                
                {/* Orbiting Rings */}
                <div className="absolute -inset-4 border border-teal/40 rounded-full animate-[spin_8s_linear_infinite]"></div>
                <div className="absolute -inset-8 border border-orange/20 rounded-full animate-[spin_12s_linear_infinite_reverse]"></div>
                
                {/* Floating Particles/Nodes */}
                <div className="absolute -top-4 left-1/2 w-3 h-3 bg-orange rounded-full shadow-lg animate-bounce"></div>
                <div className="absolute -bottom-2 right-0 w-2 h-2 bg-teal rounded-full shadow-lg animate-pulse"></div>
            </div>

            {/* Dynamic Content Container */}
            <div className="relative z-10 w-full max-w-sm min-h-[180px]">
               {activeStep === 0 && (
                 <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 animate-fadeInUp">
                    <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
                        <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                        <div className="h-2 w-24 bg-gray-200 rounded"></div>
                        <span className="ml-auto text-xs text-gray-400">Just now</span>
                    </div>
                    <p className="text-navy font-bold text-lg">"I need money for surgery."</p>
                    <div className="mt-4 flex gap-2">
                        <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full border border-red-200 shadow-sm animate-pulse">Urgency: High</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-600 text-xs font-bold rounded-full border border-blue-200 shadow-sm">Category: Medical</span>
                    </div>
                 </div>
               )}

               {activeStep === 1 && (
                 <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 animate-fadeInUp">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Safety Check</span>
                        <div className="flex items-center gap-2">
                           <span className="w-2 h-2 rounded-full bg-teal animate-ping"></span>
                           <span className="text-teal font-bold text-xs">Processing...</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-2 rounded bg-gray-50">
                            <span className="text-sm text-navy font-medium">Credit Health</span>
                            <span className="text-teal font-bold text-sm">✓ Verified</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-gray-50">
                            <span className="text-sm text-navy font-medium">Fraud Database</span>
                            <span className="text-teal font-bold text-sm">✓ Clean</span>
                        </div>
                        <div className="flex justify-between items-center p-2 rounded bg-gray-50">
                            <span className="text-sm text-navy font-medium">Repayment Ability</span>
                            <span className="text-teal font-bold text-sm">✓ High</span>
                        </div>
                    </div>
                 </div>
               )}

               {activeStep === 2 && (
                 <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 animate-fadeInUp text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border-4 border-green-50">
                        ✓
                    </div>
                    <h3 className="text-xl font-bold text-navy mb-2">Loan Approved</h3>
                    <p className="text-sm text-gray-500 mb-4">Disbursing <span className="font-bold text-navy">₹5,00,000</span> to Account ending in XX89</p>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full border border-gray-200 text-xs text-gray-500">
                        <span className="w-2 h-2 rounded-full bg-teal"></span>
                        Verified by Human Agent
                    </div>
                 </div>
               )}
            </div>
            
            <div className="absolute bottom-6 flex items-center gap-2 text-[10px] text-gray-400 font-mono tracking-widest uppercase">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                System Operational • Latency: 12ms
            </div>
        </div>

      </div>
    </section>
  );
}
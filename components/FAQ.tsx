import React, { useState } from 'react';

const questions = [
  { q: "How fast is the loan approval process?", a: "With ArthSahay 24/7, approvals are instant for pre-qualified customers. For others, it typically takes less than 24 hours to complete the verification." },
  { q: "What documents do I need to apply?", a: "We primarily rely on digital data fetch. In most cases, just your PAN and Aadhaar (via DigiLocker) are enough. Occasionally, income proof (Bank Statement) might be requested via Account Aggregator." },
  { q: "Is my data safe with Tata Capital?", a: "Absolutely. We use bank-grade 256-bit encryption and comply with all RBI data localization and privacy guidelines. Your data is never shared without consent." },
  { q: "Are there any prepayment charges?", a: "For our flexi-loans, there are zero prepayment charges after 6 months. We believe in complete transparency with no hidden fees." },
  { q: "Can I track my application status?", a: "Yes, you can track it anytime through our chatbot. Just type 'Track Application' and provide your mobile number." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="max-w-4xl mx-auto mb-16">
        <div className="text-center mb-12">
            <span className="text-orange font-bold text-sm tracking-wider uppercase mb-2 block">Support</span>
            <h2 className="text-3xl font-bold text-navy">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
            {questions.map((item, idx) => (
            <div key={idx} className="border border-gray-200 rounded-xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full flex justify-between items-center p-5 text-left font-semibold text-navy hover:bg-gray-50 transition-colors"
                >
                {item.q}
                <span className={`transform transition-transform duration-200 text-teal ${openIndex === idx ? 'rotate-180' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </span>
                </button>
                <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                <div className="p-5 pt-0 text-gray-600 text-sm leading-relaxed border-t border-gray-100 mt-2">
                    {item.a}
                </div>
                </div>
            </div>
            ))}
        </div>
      </div>
    </section>
  );
}
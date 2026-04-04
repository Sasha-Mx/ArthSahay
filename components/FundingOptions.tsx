import React from 'react';
import { useNavigate } from 'react-router-dom';

const options = [
  {
    title: "SME Business Growth",
    description: "Capital to expand operations, purchase inventory, or upgrade equipment for your enterprise.",
    icon: "🚀",
    color: "bg-teal/10 text-teal",
    query: "I need a business loan for my SME."
  },
  {
    title: "Medical Emergency",
    description: "Immediate disbursement for hospitalization, surgeries, or urgent treatments. Priority processing.",
    icon: "🏥",
    color: "bg-orange/10 text-orange",
    query: "I need an urgent medical loan."
  },
  {
    title: "Dream Wedding",
    description: "Make your special day perfect without financial constraints. Flexible repayment options.",
    icon: "💍",
    color: "bg-navy/5 text-navy",
    query: "Tell me about wedding loans."
  },
  {
    title: "Travel & Leisure",
    description: "Explore the world now and pay later with easy EMIs. tailored for your vacation plans.",
    icon: "✈️",
    color: "bg-tealDark/10 text-tealDark",
    query: "I want to apply for a travel loan."
  }
];

export default function FundingOptions() {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-6 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
             <span className="text-orange font-bold text-sm tracking-wider uppercase mb-2 block">Special Schemes</span>
             <h2 className="text-3xl font-bold text-navy">Funding for every milestone</h2>
          </div>
          <button 
            onClick={() => navigate('/login', { state: { mode: 'signup' } })}
            className="text-teal font-bold hover:text-tealDark flex items-center gap-2 group text-sm"
          >
            View all schemes 
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {options.map((opt, idx) => (
            <div 
              key={idx} 
              onClick={() => navigate('/login', { state: { mode: 'signup' } })}
              className="p-6 rounded-2xl border border-gray-100 hover:border-teal/30 hover:shadow-lg transition-all cursor-pointer group bg-cream/30"
            >
              <div className={`w-12 h-12 rounded-xl ${opt.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                {opt.icon}
              </div>
              <h3 className="text-lg font-bold text-navy mb-2 group-hover:text-teal transition-colors">{opt.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-4">{opt.description}</p>
              <span className="text-xs font-bold text-navy uppercase tracking-wide flex items-center gap-1 group-hover:text-teal">
                Check Eligibility 
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LoanProduct } from '../types';

interface LoanCardProps extends LoanProduct {
  index?: number;
}

const LoanCard: React.FC<LoanCardProps> = ({ title, text, icon, index = 0 }) => {
  const navigate = useNavigate();

  const handleApply = () => {
    navigate('/login', { state: { mode: 'signup' } });
  };

  return (
    <div 
      className="neo-card p-8 flex flex-col items-start group hover:-translate-y-2 hover:shadow-xl transition-all duration-500 opacity-0 animate-fadeInUp h-full"
      style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
    >
      <div className="w-14 h-14 rounded-2xl bg-cream flex items-center justify-center text-3xl mb-6 group-hover:bg-teal group-hover:text-white transition-colors duration-300 border border-gray-100 shadow-sm group-hover:scale-110">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-navy mb-3 group-hover:text-teal transition-colors">{title}</h3>
      <p className="text-gray-600 leading-relaxed mb-6 text-sm">{text}</p>
      
      <div className="mt-auto pt-6 w-full border-t border-gray-100">
        <button 
          onClick={handleApply}
          className="w-full py-3 bg-navy text-white font-bold rounded-xl hover:bg-teal transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group-hover:gap-3"
        >
            Apply Now
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
        </button>
      </div>
    </div>
  );
};

export default LoanCard;
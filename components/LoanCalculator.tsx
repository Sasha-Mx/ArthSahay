import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoanCalculator() {
  const navigate = useNavigate();
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(10.5);
  const [tenure, setTenure] = useState(5);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    const r = rate / 12 / 100;
    const n = tenure * 12;
    // Prevent division by zero or invalid calculation
    if (amount > 0 && r > 0 && n > 0) {
        const emiValue = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const totalPayable = emiValue * n;
        const interest = totalPayable - amount;

        setEmi(Math.round(emiValue));
        setTotalInterest(Math.round(interest));
    } else {
        setEmi(0);
        setTotalInterest(0);
    }
  }, [amount, rate, tenure]);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getPositionStyle = (value: number, min: number, max: number) => {
    const percentage = (value - min) / (max - min);
    return {
        left: `calc(10px + (100% - 20px) * ${percentage})`
    };
  };

  const handleApply = () => {
    navigate('/login', { state: { mode: 'signup' } });
  };

  const handleBlur = (setter: React.Dispatch<React.SetStateAction<number>>, val: number, min: number, max: number) => () => {
    if (val < min) setter(min);
    if (val > max) setter(max);
  };

  return (
    <section className="py-12 md:py-20 px-4 md:px-6 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            
            <div className="text-left order-2 lg:order-1">
                <span className="text-orange font-bold text-sm tracking-wider uppercase mb-2 block">Calculator</span>
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-4 md:mb-6 leading-tight">
                    Estimate your monthly payments
                </h2>
                <p className="text-gray-600 text-base md:text-lg mb-8">
                    Adjust the loan amount, interest rate, and tenure to see how much you'll pay each month. Transparent and simple.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    <div className="p-4 bg-cream rounded-xl border border-gray-100 flex flex-col justify-center">
                        <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Monthly EMI</p>
                        <p className="text-2xl font-bold text-teal break-words">{formatCurrency(emi)}</p>
                    </div>
                    <div className="p-4 bg-cream rounded-xl border border-gray-100 flex flex-col justify-center">
                        <p className="text-gray-500 text-xs uppercase font-semibold mb-1">Total Interest</p>
                        <p className="text-2xl font-bold text-navy break-words">{formatCurrency(totalInterest)}</p>
                    </div>
                </div>
                 <button 
                    onClick={handleApply}
                    className="w-full mt-6 md:mt-8 py-3.5 md:py-4 bg-navy text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2"
                 >
                    Apply for this Loan
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                </button>
            </div>

            <div className="neo-card p-6 md:p-8 lg:p-10 space-y-8 md:space-y-10 order-1 lg:order-2">
                {/* Loan Amount */}
                <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                        <label className="text-navy font-bold text-sm md:text-base">Loan Amount</label>
                        <div className="self-start sm:self-auto flex items-center bg-cream rounded-lg border border-teal/20 px-3 py-1 focus-within:ring-2 focus-within:ring-teal/20 focus-within:border-teal transition-all">
                            <span className="text-teal font-bold mr-1">₹</span>
                            <input 
                                type="number" 
                                min="10000"
                                max="5000000"
                                value={amount} 
                                onChange={(e) => setAmount(Number(e.target.value))}
                                onBlur={handleBlur(setAmount, amount, 10000, 5000000)}
                                className="bg-transparent text-teal font-bold outline-none w-28 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                        </div>
                    </div>
                    <div className="relative w-full group pt-2 pb-1">
                        <div 
                            className="absolute bottom-full mb-3 -translate-x-1/2 bg-teal text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg whitespace-nowrap z-10"
                            style={getPositionStyle(amount, 10000, 5000000)}
                        >
                            {formatCurrency(amount)}
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-teal rotate-45"></div>
                        </div>
                        <input 
                            type="range" 
                            min="10000" 
                            max="5000000" 
                            step="10000" 
                            value={amount} 
                            onChange={(e) => setAmount(Number(e.target.value))} 
                            className="w-full cursor-pointer block focus:outline-none"
                        />
                    </div>
                </div>

                {/* Interest Rate */}
                <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                        <label className="text-navy font-bold text-sm md:text-base">Interest Rate (% p.a)</label>
                        <div className="self-start sm:self-auto flex items-center bg-cream rounded-lg border border-teal/20 px-3 py-1 focus-within:ring-2 focus-within:ring-teal/20 focus-within:border-teal transition-all">
                            <input 
                                type="number" 
                                min="5"
                                max="20"
                                step="0.1"
                                value={rate} 
                                onChange={(e) => setRate(Number(e.target.value))}
                                onBlur={handleBlur(setRate, rate, 5, 20)}
                                className="bg-transparent text-teal font-bold outline-none w-16 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <span className="text-teal font-bold ml-1">%</span>
                        </div>
                    </div>
                    <div className="relative w-full group pt-2 pb-1">
                        <div 
                            className="absolute bottom-full mb-3 -translate-x-1/2 bg-teal text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg whitespace-nowrap z-10"
                            style={getPositionStyle(rate, 5, 20)}
                        >
                            {rate}%
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-teal rotate-45"></div>
                        </div>
                        <input 
                            type="range" 
                            min="5" 
                            max="20" 
                            step="0.1" 
                            value={rate} 
                            onChange={(e) => setRate(Number(e.target.value))} 
                            className="w-full cursor-pointer block focus:outline-none"
                        />
                    </div>
                </div>

                {/* Tenure */}
                <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                        <label className="text-navy font-bold text-sm md:text-base">Tenure (Years)</label>
                         <div className="self-start sm:self-auto flex items-center bg-cream rounded-lg border border-teal/20 px-3 py-1 focus-within:ring-2 focus-within:ring-teal/20 focus-within:border-teal transition-all">
                            <input 
                                type="number" 
                                min="1"
                                max="30"
                                value={tenure} 
                                onChange={(e) => setTenure(Number(e.target.value))}
                                onBlur={handleBlur(setTenure, tenure, 1, 30)}
                                className="bg-transparent text-teal font-bold outline-none w-12 text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <span className="text-teal font-bold ml-1">Yrs</span>
                        </div>
                    </div>
                    <div className="relative w-full group pt-2 pb-1">
                         <div 
                            className="absolute bottom-full mb-3 -translate-x-1/2 bg-teal text-white text-xs font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg whitespace-nowrap z-10"
                            style={getPositionStyle(tenure, 1, 30)}
                        >
                            {tenure} Years
                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-teal rotate-45"></div>
                        </div>
                        <input 
                            type="range" 
                            min="1" 
                            max="30" 
                            step="1" 
                            value={tenure} 
                            onChange={(e) => setTenure(Number(e.target.value))} 
                            className="w-full cursor-pointer block focus:outline-none"
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400 mt-2">
                        <span>1 Year</span>
                        <span>30 Years</span>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
}
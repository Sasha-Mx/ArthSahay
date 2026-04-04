import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { jsPDF } from "jspdf";
import { addPdfHeader } from '../utils/pdfHelpers'; // Import shared PDF header utility


// --- Helper Components ---

interface ToolCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
}

const ToolCard: React.FC<ToolCardProps> = ({ title, desc, icon, onClick, color }) => (
  <div 
    onClick={onClick}
    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group h-full flex flex-col relative overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-gray-50 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`}></div>
    <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform shadow-inner`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-navy mb-2 group-hover:text-teal transition-colors relative z-10">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-grow relative z-10">{desc}</p>
    <div className="text-teal font-bold text-sm flex items-center gap-2 mt-auto relative z-10">
      Launch Tool <span className="group-hover:translate-x-1 transition-transform">→</span>
    </div>
  </div>
);

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy/80 backdrop-blur-sm animate-fadeInUp overflow-hidden">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl border border-white/20">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0 backdrop-blur-md">
          <h2 className="text-2xl font-bold text-navy font-serif">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 md:p-8 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- TOOL 1: CIBIL Intelligence & Advisory Engine ---
const CreditAdvisoryEngine = () => {
  const [score, setScore] = useState(720);
  const [utilization, setUtilization] = useState(30);
  const [inquiries, setInquiries] = useState(2);
  const [loanType, setLoanType] = useState('Personal Loan');
  const [analysis, setAnalysis] = useState<any>(null);

  const analyzeCredit = () => {
    let risk = "Low";
    let prob = "High";
    let bucket = "Good";
    let color = "text-green-600";
    let foirAdj = 0;
    let tips = [];

    // 1. Bucket Analysis
    if (score >= 800) { bucket = "Excellent"; foirAdj = 5; }
    else if (score >= 750) { bucket = "Very Good"; foirAdj = 0; }
    else if (score >= 700) { bucket = "Good"; foirAdj = -5; prob = "Medium"; color = "text-teal-600"; }
    else if (score >= 650) { bucket = "Average"; foirAdj = -10; prob = "Low"; risk = "Moderate"; color = "text-orange-600"; }
    else { bucket = "Poor"; foirAdj = -15; prob = "Very Low"; risk = "High"; color = "text-red-600"; }

    // 2. Risk Factors
    if (utilization > 50) {
        risk = risk === "Low" ? "Moderate" : "High";
        tips.push("High Credit Utilization (>50%) negatively impacts your score. Pay down credit card balances.");
    }
    if (inquiries > 3) {
        risk = risk === "Low" ? "Moderate" : "High";
        tips.push("Too many recent inquiries. Avoid applying for new loans for 3-6 months.");
    }

    // 3. Loan Type Constraints
    if (loanType === 'Personal Loan' && score < 700) tips.push("Personal Loans usually require a CIBIL of 700+. Consider a secured loan.");
    if (loanType === 'Home Loan' && score < 650) tips.push("Home Loan interest rates may be higher for scores < 650.");
    if (loanType === 'Medical Loan') tips.push("For medical emergencies, we consider alternative data points beyond just CIBIL.");

    if (tips.length === 0) tips.push("Maintain your good habits. Keep utilization low and pay on time.");

    setAnalysis({ bucket, risk, prob, foirAdj, color, tips });
  };

  const generateReport = () => {
    if (!analysis) return;
    const doc = new jsPDF();
    addPdfHeader(doc);

    doc.setFontSize(16);
    doc.setTextColor(15, 23, 42);
    doc.text("CIBIL Intelligence Report", 15, 45);

    doc.setTextColor(0, 0, 0);
    let y = 55;
    doc.setFontSize(12);
    doc.text(`Applicant Score: ${score}`, 15, y);
    doc.text(`Risk Assessment: ${analysis.risk}`, 15, y + 10);
    doc.text(`Approval Probability: ${analysis.prob}`, 15, y + 20);

    y += 35;
    doc.setFont("helvetica", "bold");
    doc.text("Advisory & Improvement Plan:", 15, y);
    doc.setFont("helvetica", "normal");
    y += 10;
    
    analysis.tips.forEach((tip: string) => {
        doc.text(`• ${tip}`, 15, y);
        y += 8;
    });

    doc.save("ArthSahay_CIBIL_Advisory.pdf");
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
           <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CIBIL Score</label>
           <input type="number" value={score} onChange={(e) => setScore(Number(e.target.value))} className="w-full p-3 border rounded-xl" />
           <input type="range" min="300" max="900" value={score} onChange={(e) => setScore(Number(e.target.value))} className="w-full mt-2 accent-navy" />
        </div>
        <div>
           <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Target Loan</label>
           <select value={loanType} onChange={(e) => setLoanType(e.target.value)} className="w-full p-3 border rounded-xl bg-white">
               <option>Personal Loan</option>
               <option>Home Loan</option>
               <option>Medical Loan</option>
               <option>Education Loan</option>
           </select>
        </div>
        <div>
           <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Credit Utilization (%)</label>
           <input type="number" value={utilization} onChange={(e) => setUtilization(Number(e.target.value))} className="w-full p-3 border rounded-xl" />
        </div>
        <div>
           <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Recent Inquiries (6mo)</label>
           <input type="number" value={inquiries} onChange={(e) => setInquiries(Number(e.target.value))} className="w-full p-3 border rounded-xl" />
        </div>
      </div>

      <button onClick={analyzeCredit} className="w-full py-4 bg-navy text-white font-bold rounded-xl hover:bg-teal transition-all">
        Analyze Credit Health
      </button>

      {analysis && (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 animate-fadeInUp">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className={`text-2xl font-bold ${analysis.color}`}>{analysis.bucket} ({score})</h3>
                    <p className="text-xs text-gray-500">Credit Category</p>
                </div>
                <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${analysis.risk === 'Low' ? 'bg-green-500' : analysis.risk === 'Moderate' ? 'bg-orange' : 'bg-red-500'}`}>
                        {analysis.risk} Risk
                    </span>
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <p className="text-gray-400 text-xs">Approval Chance</p>
                    <p className="font-bold text-navy">{analysis.prob}</p>
                </div>
                <div className="bg-white p-3 rounded-lg border border-gray-100">
                    <p className="text-gray-400 text-xs">FOIR Impact</p>
                    <p className="font-bold text-navy">{analysis.foirAdj > 0 ? '+' : ''}{analysis.foirAdj}% Capacity</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-100">
                <h4 className="font-bold text-navy text-sm mb-2">💡 Improvement Plan</h4>
                <ul className="space-y-2">
                    {analysis.tips.map((tip: string, i: number) => (
                        <li key={i} className="text-xs text-gray-600 flex gap-2">
                            <span className="text-teal font-bold">•</span> {tip}
                        </li>
                    ))}
                </ul>
            </div>

            <button onClick={generateReport} className="w-full mt-4 py-3 border border-navy text-navy font-bold rounded-lg hover:bg-navy hover:text-white transition-colors">
                Download Advisory PDF
            </button>
        </div>
      )}
    </div>
  );
};

// --- TOOL 2: Affordability Assessment Engine ---
const AffordabilityEngine = () => {
  // General Inputs
  const [loanType, setLoanType] = useState('Personal Loan');
  const [income, setIncome] = useState(60000);
  const [obligations, setObligations] = useState(15000);
  const [tenure, setTenure] = useState(60);
  const [interest, setInterest] = useState(11.5);
  
  // Specific Inputs
  const [medicalEst, setMedicalEst] = useState(500000);
  const [insurance, setInsurance] = useState(200000);
  const [isEmergency, setIsEmergency] = useState(false);
  
  const [tuition, setTuition] = useState(1000000);
  const [living, setLiving] = useState(200000);
  
  const [result, setResult] = useState<any>(null);

  const calculateAffordability = () => {
    let baseFoir = 0.50; // 50% Standard
    let requiredAmount = 0;
    let loanCategoryNote = "";

    // 1. Calculate Required Amount & FOIR Adjustments
    if (loanType === 'Medical Loan') {
        requiredAmount = Math.max(0, medicalEst - insurance);
        if (isEmergency) {
            baseFoir += 0.05; // 5% Relaxation
            loanCategoryNote = "Emergency protocol active: +5% FOIR relaxation applied.";
        }
    } else if (loanType === 'Education Loan') {
        requiredAmount = tuition + living;
        baseFoir = 0.55; // Slightly higher for education
        loanCategoryNote = "Education Loan: Higher FOIR allowed with co-applicant.";
    } else {
        requiredAmount = 0;
    }

    // 2. Calculate Disposable Income for EMI
    const maxEMI = (income * baseFoir) - obligations;
    
    // 3. Reverse Calculate Max Loan Amount (PV)
    const r = interest / 12 / 100;
    const n = tenure;
    let maxAffordableLoan = 0;
    
    if (maxEMI > 0) {
        maxAffordableLoan = (maxEMI * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
    }

    // 4. Analysis
    const gap = requiredAmount > 0 ? requiredAmount - maxAffordableLoan : 0;
    const status = (requiredAmount > 0 && maxAffordableLoan >= requiredAmount) ? "Sufficient" : (requiredAmount > 0 ? "Shortfall" : "Eligible");

    setResult({
        maxEMI,
        maxAffordableLoan: Math.round(maxAffordableLoan),
        requiredAmount,
        gap: Math.round(gap),
        status,
        effectiveFoir: Math.round(baseFoir * 100),
        loanCategoryNote
    });
  };

  const generatePDF = () => {
      if (!result) return;
      const doc = new jsPDF();
      addPdfHeader(doc);

      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      doc.text("Affordability Assessment Report", 15, 45);

      doc.setTextColor(0, 0, 0);
      let y = 60;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text(`Loan Type: ${loanType}`, 15, y);
      y += 10;
      doc.setFont("helvetica", "normal");
      doc.text(`Net Monthly Income: Rs. ${income.toLocaleString()}`, 15, y);
      doc.text(`Existing Obligations: Rs. ${obligations.toLocaleString()}`, 15, y + 8);
      
      y += 20;
      doc.setFillColor(240, 240, 240);
      doc.rect(15, y, 180, 40, 'F');
      doc.setFont("helvetica", "bold");
      doc.text("Assessment Results", 20, y + 10);
      doc.setFont("helvetica", "normal");
      doc.text(`Max EMI Capacity: Rs. ${Math.round(result.maxEMI).toLocaleString()}`, 20, y + 20);
      doc.text(`Max Affordable Loan: Rs. ${result.maxAffordableLoan.toLocaleString()}`, 20, y + 30);
      
      if (result.requiredAmount > 0) {
          doc.text(`Required Amount: Rs. ${result.requiredAmount.toLocaleString()}`, 110, y + 20);
          doc.setTextColor(result.gap > 0 ? 200 : 0, 0, 0);
          doc.text(`Gap/Shortfall: Rs. ${result.gap > 0 ? result.gap.toLocaleString() : 'Nil'}`, 110, y + 30);
      }

      y += 50;
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      doc.text("Notes & Logic:", 15, y);
      doc.setFont("helvetica", "normal");
      doc.text(`• Effective FOIR Used: ${result.effectiveFoir}%`, 15, y + 8);
      doc.text(`• ${result.loanCategoryNote}`, 15, y + 16);
      
      doc.save("Affordability_Report.pdf");
  };

  return (
    <div className="space-y-6">
        <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Loan Category</label>
            <div className="grid grid-cols-3 gap-2">
                {['Personal Loan', 'Medical Loan', 'Education Loan'].map(t => (
                    <button 
                        key={t}
                        onClick={() => setLoanType(t)}
                        className={`py-2 px-3 rounded-lg text-xs font-bold border transition-colors ${loanType === t ? 'bg-navy text-white border-navy' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Net Monthly Income</label>
                <input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} className="w-full p-3 border rounded-xl" />
            </div>
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Existing EMIs</label>
                <input type="number" value={obligations} onChange={(e) => setObligations(Number(e.target.value))} className="w-full p-3 border rounded-xl" />
            </div>
            
            {loanType === 'Medical Loan' && (
                <>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Medical Estimate</label>
                        <input type="number" value={medicalEst} onChange={(e) => setMedicalEst(Number(e.target.value))} className="w-full p-3 border rounded-xl border-orange/30 bg-orange/5" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Insurance Cover</label>
                        <input type="number" value={insurance} onChange={(e) => setInsurance(Number(e.target.value))} className="w-full p-3 border rounded-xl border-orange/30 bg-orange/5" />
                    </div>
                    <div className="md:col-span-2 flex items-center gap-2">
                        <input type="checkbox" checked={isEmergency} onChange={(e) => setIsEmergency(e.target.checked)} className="w-4 h-4 accent-red-500" />
                        <span className="text-sm font-bold text-red-600">Is this a Medical Emergency? (Applies relaxed norms)</span>
                    </div>
                </>
            )}

            {loanType === 'Education Loan' && (
                <>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tuition Fees</label>
                        <input type="number" value={tuition} onChange={(e) => setTuition(Number(e.target.value))} className="w-full p-3 border rounded-xl border-blue-200 bg-blue-50" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Living Expenses</label>
                        <input type="number" value={living} onChange={(e) => setLiving(Number(e.target.value))} className="w-full p-3 border rounded-xl border-blue-200 bg-blue-50" />
                    </div>
                </>
            )}
            
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tenure (Months): {tenure}</label>
                <input type="range" min="12" max="120" step="12" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full accent-teal" />
            </div>
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Interest Rate (%): {interest}</label>
                <input type="range" min="8" max="18" step="0.5" value={interest} onChange={(e) => setInterest(Number(e.target.value))} className="w-full accent-teal" />
            </div>
        </div>

        <button onClick={calculateAffordability} className="w-full py-4 bg-teal text-white font-bold rounded-xl hover:bg-tealDark transition-all shadow-lg">
            Check Affordability
        </button>

        {result && (
            <div className="bg-white rounded-xl border border-gray-200 p-6 animate-fadeInUp">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold">Max Affordable Loan</p>
                        <p className="text-3xl font-bold text-navy">₹ {result.maxAffordableLoan.toLocaleString()}</p>
                    </div>
                    {result.status === 'Shortfall' && (
                        <div className="text-right">
                            <p className="text-xs text-red-500 uppercase font-bold">Shortfall</p>
                            <p className="text-xl font-bold text-red-600">₹ {result.gap.toLocaleString()}</p>
                        </div>
                    )}
                </div>

                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">EMI Capacity (FOIR {result.effectiveFoir}%)</span>
                        <span className="font-bold text-navy">₹ {Math.round(result.maxEMI).toLocaleString()}/mo</span>
                    </div>
                    {result.requiredAmount > 0 && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Required Amount</span>
                            <span className="font-bold text-navy">₹ {result.requiredAmount.toLocaleString()}</span>
                        </div>
                    )}
                </div>

                <button onClick={generatePDF} className="w-full py-3 border border-gray-300 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    Download Assessment Report
                </button>
            </div>
        )}
    </div>
  );
};

// --- TOOL 3: EMI Calculator (Standard) ---
const EMICalculator = () => {
  const [amount, setAmount] = useState(500000);
  const [rate, setRate] = useState(10.5);
  const [tenure, setTenure] = useState(60);
  const [result, setResult] = useState({ emi: 0, totalInterest: 0, totalPayment: 0 });

  useEffect(() => {
    const P = amount;
    const R = rate / 12 / 100;
    const N = tenure;
    const emiValue = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
    const totalPayment = emiValue * N;
    setResult({
      emi: Math.round(emiValue),
      totalInterest: Math.round(totalPayment - P),
      totalPayment: Math.round(totalPayment)
    });
  }, [amount, rate, tenure]);

  return (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div>
                    <label className="flex justify-between text-xs font-bold text-gray-500 uppercase mb-1">
                        Loan Amount <span>₹ {amount.toLocaleString()}</span>
                    </label>
                    <input type="range" min="50000" max="5000000" step="10000" value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full accent-teal" />
                </div>
                <div>
                    <label className="flex justify-between text-xs font-bold text-gray-500 uppercase mb-1">
                        Interest Rate <span>{rate}%</span>
                    </label>
                    <input type="range" min="8" max="20" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-teal" />
                </div>
                <div>
                    <label className="flex justify-between text-xs font-bold text-gray-500 uppercase mb-1">
                        Tenure <span>{tenure} Months</span>
                    </label>
                    <input type="range" min="12" max="84" step="6" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full accent-teal" />
                </div>
            </div>
            
            <div className="flex flex-col justify-center items-center bg-gray-50 rounded-xl p-6 border border-gray-200">
                <p className="text-xs text-gray-400 uppercase font-bold mb-2">Monthly EMI</p>
                <p className="text-3xl font-bold text-teal mb-4">₹ {result.emi.toLocaleString()}</p>
                <div className="w-full text-xs text-gray-500 space-y-1">
                    <div className="flex justify-between"><span>Principal</span><span>₹ {amount.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span>Total Interest</span><span className="text-orange font-bold">₹ {result.totalInterest.toLocaleString()}</span></div>
                    <div className="flex justify-between border-t border-gray-200 pt-1 mt-1 font-bold text-navy"><span>Total Payment</span><span>₹ {result.totalPayment.toLocaleString()}</span></div>
                </div>
            </div>
        </div>
    </div>
  );
};

// --- TOOL 4: Smart Document Checker (NEW IMPLEMENTATION) ---
const SmartDocumentChecker = () => {
    const [empType, setEmpType] = useState('Salaried');
    const [loanType, setLoanType] = useState('Personal Loan');
    const [checkedDocs, setCheckedDocs] = useState<string[]>([]);
    
    // 1. Employment Type Rules
    const empRules: any = {
        'Salaried': ['Aadhaar Card', 'PAN Card', 'Last 3 Months Salary Slips', 'Last 6 Months Bank Statement', 'Form 16 or Latest ITR', 'Employment ID Card', 'Current Address Proof'],
        'Self-Employed Professional': ['Aadhaar Card', 'PAN Card', 'Professional Qualification Certificate', 'GST Return (if applicable)', 'Last 12 Months Bank Statement', 'ITR (Last 2 Years)', 'Income Computation Sheet', 'Office Address Proof'],
        'Business Owner': ['Aadhaar Card', 'PAN (Personal & Business)', 'GST Registration', 'Udyam Certificate', 'Business Registration Proof', 'ITR (Last 3 Years)', 'Profit & Loss + Balance Sheet', 'Current Account Statement (12 Mo)'],
        'Freelancer': ['Aadhaar Card', 'PAN Card', 'Last 12 Months Bank Statement', 'Income Declaration', 'Form 26AS', 'Client Invoice Samples']
    };

    // 2. Loan Type Rules
    const loanRules: any = {
        'Home Loan': ['Sale Agreement', 'Builder NOC', 'Property Tax Receipt / Electricity Bill', 'Income Proof', 'KYC Documents'],
        'Personal Loan': ['KYC Documents', 'Income Proof', 'Bank Statements', 'Employment Proof', 'Existing EMI Details'],
        'Business Loan': ['GST Registration', 'Business Proof', 'Financial Statements', 'ITR', 'Bank Statements', 'MSME Certificate'],
        'Education Loan': ['Admission Letter', 'Fee Structure', 'Academic Records', 'Guarantor Documents', 'Sponsor Income Proof'],
        'Medical Loan': ['Hospital Estimate Letter', 'Doctor Prescription', 'Treatment Cost Sheet', 'Patient ID', 'Income Documents']
    };

    // Combine and Deduplicate
    const getRequiredDocs = () => {
        const profileDocs = empRules[empType] || [];
        const productDocs = loanRules[loanType] || [];
        return Array.from(new Set([...profileDocs, ...productDocs]));
    };

    const allDocs = getRequiredDocs();
    const missingDocs = allDocs.filter(d => !checkedDocs.includes(d));

    const toggleDoc = (doc: string) => {
        if(checkedDocs.includes(doc)) setCheckedDocs(checkedDocs.filter(d => d !== doc));
        else setCheckedDocs([...checkedDocs, doc]);
    };

    const generatePDF = () => {
        const doc = new jsPDF();
        addPdfHeader(doc); // Standard Header

        doc.setFontSize(16);
        doc.setTextColor(15, 23, 42);
        doc.text("Smart Document Checklist", 15, 45);

        doc.setFontSize(11);
        doc.setTextColor(100);
        doc.text(`Profile: ${empType} | Loan: ${loanType}`, 15, 52);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 15, 58);

        let y = 70;
        const maxContentY = doc.internal.pageSize.getHeight() - 40; // Leave 40mm for footer
        
        // Table Header
        doc.setFillColor(241, 245, 249);
        doc.rect(15, y-8, 180, 10, 'F');
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(0);
        doc.text("Document Name", 20, y-2);
        doc.text("Status", 150, y-2);
        y += 5;

        allDocs.forEach((item) => {
            if (y > maxContentY - 10) { // Check if space is critically low for the next line
                doc.addPage();
                addPdfHeader(doc);
                y = 40; // Reset y for new page
                // Re-add table header on new page
                doc.setFillColor(241, 245, 249);
                doc.rect(15, y-8, 180, 10, 'F');
                doc.setFont("helvetica", "bold");
                doc.setFontSize(10);
                doc.setTextColor(0);
                doc.text("Document Name", 20, y-2);
                doc.text("Status", 150, y-2);
                y += 5;
            }
            const isChecked = checkedDocs.includes(item);
            doc.setFont("helvetica", "normal");
            doc.text(item, 20, y);
            
            if(isChecked) {
                doc.setTextColor(0, 128, 0);
                doc.text("READY", 150, y);
            } else {
                doc.setTextColor(200, 0, 0);
                doc.text("MISSING", 150, y);
            }
            doc.setTextColor(0);
            y += 8;
        });
        
        // Footer Note (ensure it's on the last page)
        // Adjust y if content ended very close to the footer
        if (y > maxContentY - 30) { // Ensure at least 30mm for note and disclaimer
             doc.addPage();
             addPdfHeader(doc);
             y = 40;
        } else {
            y += 10;
        }

        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text("Note: Additional documents may be requested based on credit policy.", 15, y);


        doc.save(`Checklist_${empType}_${loanType}.pdf`);
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Employment Type</label>
                    <select value={empType} onChange={(e) => setEmpType(e.target.value)} className="w-full p-3 border rounded-xl bg-white">
                        {Object.keys(empRules).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Loan Type</label>
                    <select value={loanType} onChange={(e) => setLoanType(e.target.value)} className="w-full p-3 border rounded-xl bg-white">
                        {Object.keys(loanRules).map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="font-bold text-navy">Required Documents ({allDocs.length})</h4>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${missingDocs.length === 0 ? 'bg-green-100 text-green-700' : 'bg-orange/10 text-orange'}`}>
                        {missingDocs.length === 0 ? 'All Set!' : `${missingDocs.length} Missing`}
                    </span>
                </div>
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {allDocs.map(doc => (
                        <label key={doc} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-transparent hover:border-gray-100 transition-all">
                            <input type="checkbox" checked={checkedDocs.includes(doc)} onChange={() => toggleDoc(doc)} className="w-5 h-5 accent-teal rounded" />
                            <span className={`text-sm ${checkedDocs.includes(doc) ? "text-gray-800 font-bold line-through opacity-50" : "text-navy"}`}>{doc}</span>
                            {checkedDocs.includes(doc) && <span className="ml-auto text-green-600 text-xs font-bold">✓</span>}
                        </label>
                    ))}
                </div>
            </div>
            
            <button onClick={generatePDF} className="w-full py-3 bg-navy text-white font-bold rounded-lg hover:bg-teal transition-colors shadow-lg flex items-center justify-center gap-2">
                 <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                 Download Smart Checklist
            </button>
        </div>
    );
};

// --- TOOL 5: SIP Wealth Builder ---
const SIPCalculator = () => {
  const [investment, setInvestment] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const monthlyRate = rate / 12 / 100;
    const months = years * 12;
    const invested = investment * months;
    
    // Future Value Formula for SIP
    const futureValue = investment * ( (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate ) * (1 + monthlyRate);
    
    setResult({
        invested: Math.round(invested),
        gains: Math.round(futureValue - invested),
        total: Math.round(futureValue)
    });
  }, [investment, rate, years]);

  const generatePDF = () => {
      if (!result) return;
      const doc = new jsPDF();
      addPdfHeader(doc);

      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      doc.text("SIP Wealth Builder Report", 15, 45);

      doc.setTextColor(0, 0, 0);
      let y = 60;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.text("Investment Plan", 15, y);
      y += 10;
      doc.setFont("helvetica", "normal");
      doc.text(`Monthly Investment: Rs. ${investment.toLocaleString()}`, 15, y);
      doc.text(`Expected Annual Return: ${rate}%`, 15, y + 8);
      doc.text(`Tenure: ${years} Years`, 15, y + 16);
      
      y += 30;
      doc.setFillColor(240, 240, 240);
      doc.rect(15, y, 180, 40, 'F');
      doc.setFont("helvetica", "bold");
      doc.text("Projected Wealth", 20, y + 10);
      doc.setFont("helvetica", "normal");
      doc.text(`Total Invested: Rs. ${result.invested.toLocaleString()}`, 20, y + 20);
      doc.text(`Estimated Returns: Rs. ${result.gains.toLocaleString()}`, 20, y + 30);
      doc.setFont("helvetica", "bold");
      doc.text(`Future Value: Rs. ${result.total.toLocaleString()}`, 110, y + 25);
      
      y += 50;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text("Disclaimer: Mutual Fund investments are subject to market risks.", 15, y);
      
      doc.save("SIP_Wealth_Report.pdf");
  };

  const totalValue = result ? result.total : 1;
  const investedPct = result ? (result.invested / totalValue) * 100 : 0;
  const gainsPct = result ? (result.gains / totalValue) * 100 : 0;

  return (
    <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Controls */}
            <div className="space-y-6">
                <div>
                    <label className="flex justify-between text-xs font-bold text-gray-500 uppercase mb-1">
                        Monthly Investment <span>₹ {investment.toLocaleString()}</span>
                    </label>
                    <input type="range" min="500" max="100000" step="500" value={investment} onChange={(e) => setInvestment(Number(e.target.value))} className="w-full accent-navy" />
                </div>
                <div>
                    <label className="flex justify-between text-xs font-bold text-gray-500 uppercase mb-1">
                        Expected Return Rate <span>{rate}%</span>
                    </label>
                    <input type="range" min="8" max="30" step="0.1" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="w-full accent-teal" />
                </div>
                <div>
                    <label className="flex justify-between text-xs font-bold text-gray-500 uppercase mb-1">
                        Time Period <span>{years} Years</span>
                    </label>
                    <input type="range" min="1" max="30" step="1" value={years} onChange={(e) => setYears(Number(e.target.value))} className="w-full accent-navy" />
                </div>
            </div>

            {/* Visuals */}
            {result && (
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-6 border border-gray-100 relative">
                    <div className="relative w-48 h-48">
                        <svg width="100%" height="100%" viewBox="0 0 100 100" className="transform -rotate-90">
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#E2E8F0" strokeWidth="20" />
                            {/* Invested Part */}
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0F172A" strokeWidth="20" 
                                strokeDasharray={`${(investedPct / 100) * 251} 251`} className="transition-all duration-500 ease-out" />
                            {/* Gains Part */}
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#0D9488" strokeWidth="20" 
                                strokeDasharray={`${(gainsPct / 100) * 251} 251`} strokeDashoffset={-((investedPct / 100) * 251)} className="transition-all duration-500 ease-out" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-gray-400 text-[10px] uppercase font-bold">Future Value</span>
                            <span className="text-lg font-bold text-navy">₹{result.total < 10000000 ? (result.total/100000).toFixed(2) + 'L' : (result.total/10000000).toFixed(2) + 'Cr'}</span>
                        </div>
                    </div>
                    <div className="flex justify-center gap-6 mt-6 w-full text-xs">
                        <div className="text-center">
                            <span className="block w-3 h-3 bg-navy rounded-full mx-auto mb-1"></span>
                            <span className="text-gray-500">Invested</span>
                            <p className="font-bold text-navy">₹ {result.invested.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                            <span className="block w-3 h-3 bg-teal rounded-full mx-auto mb-1"></span>
                            <span className="text-gray-500">Est. Returns</span>
                            <p className="font-bold text-navy">₹ {result.gains.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            )}
        </div>

        <button onClick={generatePDF} className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-lg flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4-4m0 0l-4 4m4-4v12"></path></svg>
            Download SIP Growth Report
        </button>
    </div>
  );
};

// --- TOOL 6: Smart Eligibility & FOIR Engine (NEW IMPLEMENTATION) ---
const SmartEligibilityEngine = () => {
    const [income, setIncome] = useState(75000);
    const [obligations, setObligations] = useState(15000);
    const [cibil, setCibil] = useState(750);
    const [employerCat, setEmployerCat] = useState('MNC');
    const [interest, setInterest] = useState(11.5);
    const [tenure, setTenure] = useState(5);
    
    const [result, setResult] = useState<any>(null);

    useEffect(() => {
        calculateEligibility();
    }, [income, obligations, cibil, employerCat, interest, tenure]);

    const calculateEligibility = () => {
        let baseFoir = 0.50;
        let foirAdj = 0;
        let riskFlags = [];
        let recommendations = [];
        
        // CIBIL Logic
        if (cibil >= 800) { foirAdj += 0.05; }
        else if (cibil >= 750) { foirAdj += 0; }
        else if (cibil >= 700) { foirAdj += -0.05; recommendations.push("Improve CIBIL to 750+ for higher eligibility."); }
        else if (cibil >= 650) { foirAdj += -0.10; riskFlags.push("Moderate Credit Risk"); }
        else { foirAdj += -0.15; riskFlags.push("High Credit Risk"); recommendations.push("Consider a co-applicant or secured loan."); }

        // Employer Category Logic
        if (employerCat === 'Govt' || employerCat === 'MNC') {
            foirAdj += 0.05;
        }

        // Final FOIR Calculation
        const finalFoir = Math.max(0.2, Math.min(0.75, baseFoir + foirAdj));
        
        // EMI Capacity
        const maxEmiCapacity = (income * finalFoir) - obligations;
        
        // Max Loan Calculation (PV)
        let maxLoan = 0;
        if (maxEmiCapacity > 0) {
            const r = interest / 12 / 100;
            const n = tenure * 12;
            maxLoan = (maxEmiCapacity * (Math.pow(1 + r, n) - 1)) / (r * Math.pow(1 + r, n));
        }

        let probability = "Medium";
        if (cibil >= 750 && maxEmiCapacity > 5000) probability = "High";
        if (cibil < 650 || maxEmiCapacity <= 0) probability = "Low";

        setResult({
            maxLoan: Math.round(maxLoan),
            maxEmi: Math.round(maxEmiCapacity),
            foir: Math.round(finalFoir * 100),
            probability,
            riskFlags,
            recommendations
        });
    };

    const generatePDF = () => {
        if (!result) return;
        const doc = new jsPDF();
        addPdfHeader(doc); // Standard Header

        doc.setFontSize(16);
        doc.setTextColor(15, 23, 42);
        doc.text("Advanced Eligibility Report", 15, 45);

        doc.setTextColor(0,0,0);
        let y = 60;
        doc.setFontSize(12);
        doc.text(`Employer Category: ${employerCat}`, 15, y);
        doc.text(`Credit Score: ${cibil}`, 15, y + 10);
        doc.text(`Monthly Income: Rs. ${income.toLocaleString()}`, 15, y + 20);
        
        y += 40;
        doc.setFont("helvetica", "bold");
        doc.text("Eligibility Analysis", 15, y);
        doc.setFont("helvetica", "normal");
        doc.text(`Max Eligible Loan: Rs. ${result.maxLoan.toLocaleString()}`, 15, y + 10);
        doc.text(`FOIR Applied: ${result.foir}%`, 15, y + 20);
        doc.text(`Approval Probability: ${result.probability}`, 15, y + 30);
        
        if (result.recommendations.length > 0) {
            y += 50;
            doc.setFont("helvetica", "bold");
            doc.text("Recommendations:", 15, y);
            doc.setFont("helvetica", "normal");
            result.recommendations.forEach((rec: string, i: number) => {
                doc.text(`• ${rec}`, 15, y + 10 + (i*8));
            });
        }
        
        doc.save("Eligibility_Report.pdf");
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Inputs */}
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Monthly Income</label>
                    <input type="number" value={income} onChange={(e) => setIncome(Number(e.target.value))} className="w-full p-3 border rounded-xl" />
                </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Existing Obligations</label>
                    <input type="number" value={obligations} onChange={(e) => setObligations(Number(e.target.value))} className="w-full p-3 border rounded-xl" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">CIBIL Score: {cibil}</label>
                    <input type="range" min="300" max="900" value={cibil} onChange={(e) => setCibil(Number(e.target.value))} className="w-full accent-indigo-600" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Employer Category</label>
                    <select value={employerCat} onChange={(e) => setEmployerCat(e.target.value)} className="w-full p-3 border rounded-xl bg-white">
                        <option value="MNC">MNC / Public Ltd</option>
                        <option value="Govt">Government</option>
                        <option value="Tier3">Tier 2/3 Company</option>
                        <option value="Self">Self-Employed</option>
                    </select>
                </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tenure: {tenure} Years</label>
                    <input type="range" min="1" max="10" step="1" value={tenure} onChange={(e) => setTenure(Number(e.target.value))} className="w-full accent-indigo-600" />
                </div>
                 <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rate: {interest}%</label>
                    <input type="range" min="8" max="24" step="0.25" value={interest} onChange={(e) => setInterest(Number(e.target.value))} className="w-full accent-indigo-600" />
                </div>
            </div>

            {/* Results */}
            {result && (
                <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-100 mt-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
                    
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Max Eligible Loan</p>
                            <h3 className="text-4xl font-bold text-indigo-900 mt-1">₹ {result.maxLoan.toLocaleString()}</h3>
                            <p className="text-sm text-indigo-700 mt-2 font-medium">EMI Capacity: ₹ {result.maxEmi.toLocaleString()}</p>
                        </div>
                        <div className={`px-4 py-2 rounded-lg font-bold text-sm shadow-sm ${result.probability === 'High' ? 'bg-green-100 text-green-700' : result.probability === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                            {result.probability} Chance
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-4 relative z-10">
                        <div className="bg-white/60 p-3 rounded-lg">
                            <p className="text-xs text-indigo-400">Applied FOIR</p>
                            <p className="font-bold text-indigo-900">{result.foir}%</p>
                        </div>
                        <div className="bg-white/60 p-3 rounded-lg">
                             <p className="text-xs text-indigo-400">Tenure</p>
                            <p className="font-bold text-indigo-900">{tenure * 12} Months</p>
                        </div>
                    </div>

                    {result.recommendations.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-indigo-200/50">
                            <p className="text-xs font-bold text-indigo-500 mb-2 uppercase">Optimization Tips</p>
                            <ul className="space-y-1">
                                {result.recommendations.map((rec: string, i: number) => (
                                    <li key={i} className="text-xs text-indigo-800 flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <button onClick={generatePDF} className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-indigo-200 transition-all">
                        Download Detailed Report
                    </button>
                </div>
            )}
        </div>
    );
};

// --- MAIN PAGE ---

export default function LoanTools() {
  const [activeTool, setActiveTool] = useState<number | null>(null);

  const tools = [
    {
      id: 1,
      title: "Smart Affordability Engine",
      desc: "Advanced logic for Medical, Education & Personal loans with FOIR check.",
      icon: "⚖️",
      color: "bg-blue-100 text-blue-600",
      component: <AffordabilityEngine />
    },
    {
      id: 2,
      title: "CIBIL Intelligence & Advisory",
      desc: "Analyze score, predict approval odds & get improvement tips.",
      icon: "🧠",
      color: "bg-purple-100 text-purple-600",
      component: <CreditAdvisoryEngine />
    },
    {
      id: 3,
      title: "EMI Calculator",
      desc: "Standard monthly payment planner.",
      icon: "🧮",
      color: "bg-teal/10 text-teal",
      component: <EMICalculator />
    },
    {
      id: 4,
      title: "Smart Document Checker",
      desc: "Intelligent checklist generator for every loan type & profile.",
      icon: "📋",
      color: "bg-red-100 text-red-600",
      component: <SmartDocumentChecker />
    },
    {
      id: 5,
      title: "SIP Wealth Builder",
      desc: "Plan your future wealth with compound interest visualizer.",
      icon: "📈",
      color: "bg-green-100 text-green-600",
      component: <SIPCalculator />
    },
    {
      id: 6,
      title: "Smart Eligibility & FOIR Engine",
      desc: "Check max loan eligibility with CIBIL & Employer Category adjustments.",
      icon: "⚡",
      color: "bg-indigo-100 text-indigo-600",
      component: <SmartEligibilityEngine />
    }
  ];

  const getActiveComponent = () => {
    const tool = tools.find(t => t.id === activeTool);
    return tool ? tool.component : null;
  };

  const getActiveTitle = () => {
    const tool = tools.find(t => t.id === activeTool);
    return tool ? tool.title : "";
  };

  return (
    <div className="min-h-screen bg-cream font-sans flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-16 animate-fadeInUp">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-navy/5 border border-navy/10 text-navy font-bold text-xs uppercase tracking-wider mb-4">
                <span className="w-2 h-2 rounded-full bg-orange animate-pulse"></span>
                ArthSahay Intelligence
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-navy mb-6 font-serif">
              LoanSarthi <span className="text-teal font-sans">360</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A complete digital suite for smarter, safer, and RBI-compliant borrowing decisions.
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {tools.map((tool, index) => (
              <div key={tool.id} className="animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
                <ToolCard 
                  title={tool.title}
                  desc={tool.desc}
                  icon={tool.icon}
                  color={tool.color}
                  onClick={() => setActiveTool(tool.id)}
                />
              </div>
            ))}
          </div>

          {/* Modal Container */}
          <Modal 
            isOpen={activeTool !== null} 
            onClose={() => setActiveTool(null)}
            title={getActiveTitle()}
          >
            {getActiveComponent()}
          </Modal>

        </div>
      </main>

      <Footer />
    </div>
  );
}
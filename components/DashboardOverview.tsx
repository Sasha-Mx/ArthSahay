import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";

// --- Configuration: Loan Document Mapping ---
const LOAN_DOC_REQUIREMENTS: Record<string, string[]> = {
  "Personal Loan": ["Salary Slip (Last 2 Months)", "Bank Statement (Last 3 Months)", "PAN Card", "Aadhaar Card"],
  "Home Loan": ["Property Papers", "Income Proof (ITR/Form 16)", "PAN Card", "Aadhaar Card", "Bank Statements"],
  "Auto Loan": ["Vehicle Quote", "Salary Slip (Last 3 Months)", "PAN Card", "Aadhaar Card", "Address Proof"],
  "Education Loan": ["Admission Letter", "Fee Structure", "Income Proof", "Co-Signer Docs", "PAN Card", "Aadhaar Card"],
  "Business Loan": ["GST Returns", "ITR (Last 2 Years)", "Business Proof (e.g., Udyam)", "Bank Statements (Last 12 Months)", "PAN Card", "Aadhaar Card"],
  "Medical Loan": ["Doctor's Certificate/Medical Report", "Hospital Bills/Invoices", "Prescription/Estimate", "Income Proof (Salary Slip/ITR)", "PAN Card", "Aadhaar Card"]
};

// --- Dummy Recent Application Data ---
const dummyApplication = {
  loanType: "Personal Loan",
  applicationId: "TC-PL-8829-WEB",
  amount: 500000,
  tenureMonths: 60,
  interestRate: 11.49,
  currentStage: "Verification Pending",
  isUrgentMedicalLoan: false,
};

// Helper: Format Phone Number (12345 67890)
const formatPhoneNumber = (value: string) => {
    if (!value) return "";
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length > 5) {
        return `${cleaned.slice(0, 5)} ${cleaned.slice(5, 10)}`;
    }
    return cleaned;
};

// Helper: Get Doc Type
const getDocType = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("aadhaar") || n.includes("pan") || n.includes("id")) return "ID";
    if (n.includes("statement") || n.includes("slip") || n.includes("itr") || n.includes("form 16")) return "PDF";
    return "DOC";
};

// Helper: Get Score Status
const getScoreStatus = (score: number) => {
  if (score >= 750) return { label: 'Excellent', color: 'text-green-600', stroke: '#16a34a', bg: 'bg-green-100', text: 'text-green-800' };
  if (score >= 700) return { label: 'Good', color: 'text-teal-600', stroke: '#0d9488', bg: 'bg-teal-100', text: 'text-teal-800' };
  if (score >= 650) return { label: 'Average', color: 'text-yellow-600', stroke: '#ca8a04', bg: 'bg-yellow-100', text: 'text-yellow-800' };
  return { label: 'Needs Attention', color: 'text-red-600', stroke: '#dc2626', bg: 'bg-red-100', text: 'text-red-800' };
};

interface UserDocument {
  id: number;
  name: string;
  type: string;
  status: 'Verified' | 'Pending' | 'Action Required';
  date: string;
  isCustom?: boolean;
  isVerified: boolean;
  extracted_data?: Record<string, any>;
}

interface UserProfile {
  name: string;
  email: string;
  emailVerified: boolean;
  phone: string;
  phoneVerified: boolean;
  aadhaar: string;
  aadhaarVerified: boolean;
  pan?: string;
  panVerified: boolean;
  dob: string;
  creditScore: number;
  address: string;
  avatar?: string;
  loanType: string;
  currentStage: string;
}

interface DashboardOverviewProps {
  user: UserProfile | null;
  onContinueApplication: () => void;
  onViewDetails: () => void;
  onDownloadReport: (user: UserProfile) => void;
  onEditProfileClick: () => void; // To open the edit profile modal
}

// Confetti Component (Simple CSS based)
const Confetti = ({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <div className="confetti-container">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)`,
            '--x': `${(Math.random() - 0.5) * 400}px`,
            '--y': `${(Math.random() - 0.5) * 400}px`,
            '--delay': `${Math.random() * 2}s`,
            '--duration': `${2 + Math.random() * 2}s`,
            '--scale': `${0.5 + Math.random()}`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
};


export default function DashboardOverview({ user, onContinueApplication, onViewDetails, onDownloadReport, onEditProfileClick }: DashboardOverviewProps) {
    const navigate = useNavigate();
    const [isConfettiActive, setIsConfettiActive] = useState(false);

    // Documents data needed for `completionPercentage` calculation
    const docs: UserDocument[] = useMemo(() => {
        if (!user) return [];
        const vaultStr = localStorage.getItem('arthSahay_vault');
        const vaultDocs = vaultStr ? JSON.parse(vaultStr) : [];
        const currentRequiredList = LOAN_DOC_REQUIREMENTS[dummyApplication.loanType] || [];

        return currentRequiredList.map((docName, index) => {
            let isVerified = false;
            const foundInVault = vaultDocs.find((d: any) => d.name === docName);
            if (foundInVault) {
                isVerified = true;
            }
            if (docName.includes("Aadhaar Card") && user?.aadhaarVerified) isVerified = true;
            if (docName.includes("PAN Card") && user?.panVerified) isVerified = true;

            return {
                id: index,
                name: docName,
                type: getDocType(docName),
                status: isVerified ? 'Verified' : 'Action Required',
                date: isVerified ? 'Pre-verified' : '-',
                isVerified: isVerified
            } as UserDocument;
        });
    }, [user]);

    const totalRequiredDocs = LOAN_DOC_REQUIREMENTS[dummyApplication.loanType]?.length || 0;
    const verifiedDocsCount = docs.filter(d => d.isVerified).length;
    const completionPercentage = totalRequiredDocs > 0 ? (verifiedDocsCount / totalRequiredDocs) * 100 : 0;
    
    useEffect(() => {
        if (user && docs.length > 0 && docs.every(d => d.isVerified)) {
            triggerConfetti();
        } else {
            setIsConfettiActive(false);
        }
    }, [user, docs]);

    const triggerConfetti = () => {
        setIsConfettiActive(true);
        setTimeout(() => setIsConfettiActive(false), 3000);
    };

    if (!user) {
        return <div className="text-center text-gray-500 py-8">Please log in to view your dashboard.</div>;
    }

    const renderUserSummaryCard = () => {
        return (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-navy text-white flex items-center justify-center font-bold text-2xl border-2 border-gray-100 shadow-sm">
                        {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-navy truncate">{user.name}</h3>
                        <p className="text-xs text-gray-500">Member ID: AS-8829910</p>
                    </div>
                    <button
                        onClick={onEditProfileClick}
                        className="text-teal font-bold text-xs border border-teal/30 px-3 py-1.5 rounded-lg hover:bg-teal hover:text-white transition-colors flex items-center gap-1"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                        Edit
                    </button>
                </div>
                <div className="space-y-4">
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="min-w-0 flex-1 mr-2">
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Email</p>
                            <p className="text-sm font-medium text-navy truncate" title={user.email}>{user.email}</p>
                        </div>
                        <div>
                            {user.emailVerified ? (
                                <span className="bg-[#00C896]/10 text-[#00C896] border border-[#00C896]/20 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                    Verified <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                </span>
                            ) : (
                                <span className="bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap">
                                    Verify OTP
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                        <div className="min-w-0 flex-1 mr-2">
                            <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Phone</p>
                            <p className="text-sm font-medium text-navy">{formatPhoneNumber(user.phone)}</p>
                        </div>
                        <div>
                            {user.phoneVerified ? (
                                <span className="bg-[#00C896]/10 text-[#00C896] border border-[#00C896]/20 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                                    Verified <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                                </span>
                            ) : (
                                <span className="bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap">
                                    Verify OTP
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderCreditScoreCard = () => {
        const scoreStatus = getScoreStatus(user.creditScore);
        const radius = 80;
        const strokeWidth = 12;
        const normalizedScore = Math.min(Math.max(user.creditScore - 300, 0), 600);
        const percentage = normalizedScore / 600;
        const circumference = Math.PI * radius;
        const strokeDashoffset = circumference * (1 - percentage);

        return (
            <div className="neo-card p-6 bg-white flex flex-col items-center">
                <div className="w-full flex justify-between items-center mb-6">
                    <h3 className="font-bold text-navy">Credit Health</h3>
                    <span className={`text-[10px] ${scoreStatus.bg} ${scoreStatus.text} px-2 py-1 rounded-full font-bold uppercase tracking-wider`}>{scoreStatus.label}</span>
                </div>
                <div className="relative w-48 h-28 flex justify-center overflow-hidden">
                    <svg className="w-full h-full" viewBox="0 0 200 110">
                        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} strokeLinecap="round" />
                        <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke={scoreStatus.stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000 ease-out" />
                    </svg>
                    <div className="absolute bottom-0 w-full text-center mb-1">
                        <span className={`text-4xl font-bold ${scoreStatus.color}`}>{user.creditScore}</span>
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest mt-1">CIBIL Score</p>
                    </div>
                </div>
                <div className="flex justify-between w-full px-4 text-[10px] text-gray-400 mt-2 font-medium"><span>300 (Poor)</span><span>900 (Excellent)</span></div>
                <button onClick={() => onDownloadReport(user)} className={`mt-6 w-full py-2.5 ${scoreStatus.color} text-sm font-bold border border-current rounded-xl hover:bg-gray-50 transition-colors opacity-90 hover:opacity-100 flex items-center justify-center gap-2`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg> View Detailed Report
                </button>
            </div>
        );
    };

    const renderStatsRow = () => (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-gray-400 text-xs uppercase font-bold">Active Applications</p>
                <p className="text-2xl font-bold text-navy mt-1">1</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-gray-400 text-xs uppercase font-bold">Approved Limit</p>
                <p className="text-2xl font-bold text-teal mt-1">₹{dummyApplication.amount.toLocaleString()}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <p className="text-gray-400 text-xs uppercase font-bold">Pending Actions</p>
                <p className="text-2xl font-bold text-orange mt-1">{totalRequiredDocs - verifiedDocsCount}</p>
            </div>
        </div>
    );

    const renderActiveApplicationCard = () => (
        <div className="neo-card p-6 bg-white">
            <h3 className="font-bold text-lg text-navy mb-4">Recent Applications</h3>
            <div className="border border-gray-100 rounded-xl p-5 hover:border-teal/30 transition-all bg-gray-50/50">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-teal/10 flex items-center justify-center text-xl">
                            {dummyApplication.loanType === "Personal Loan" && "💰"}
                            {dummyApplication.loanType === "Home Loan" && "🏠"}
                            {dummyApplication.loanType === "Auto Loan" && "🚗"}
                            {dummyApplication.loanType === "Education Loan" && "🎓"}
                            {dummyApplication.loanType === "Business Loan" && "💼"}
                            {dummyApplication.loanType === "Medical Loan" && "🚑"}
                        </div>
                        <div><h4 className="font-bold text-navy">{dummyApplication.loanType}</h4><p className="text-xs text-gray-500">Ref: {dummyApplication.applicationId}</p></div>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-xs font-bold rounded-full animate-pulse">{dummyApplication.currentStage}</span>
                </div>
                {dummyApplication.loanType === "Medical Loan" && dummyApplication.isUrgentMedicalLoan && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg mb-4 text-xs font-bold">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        Hamari madad se jaldi theek ho jayenge – fast verification for emergencies.
                    </div>
                )}
                <div className="flex justify-between items-center text-sm mb-4">
                    <div><p className="text-gray-400 text-xs">Amount</p><p className="font-bold text-navy">₹{dummyApplication.amount.toLocaleString()}</p></div>
                    <div><p className="text-gray-400 text-xs">Tenure</p><p className="font-bold text-navy">{dummyApplication.tenureMonths} Months</p></div>
                    <div><p className="text-gray-400 text-xs">Rate</p><p className="font-bold text-navy">{dummyApplication.interestRate}%</p></div>
                </div>
                <div className="w-full bg-gray-200 h-1.5 rounded-full mb-4 overflow-hidden"><div className="bg-teal h-full" style={{width: `${completionPercentage}%`}}></div></div>
                <div className="flex gap-3">
                    <button onClick={onContinueApplication} className="flex-1 py-2.5 bg-navy text-white text-sm font-bold rounded-lg hover:bg-teal transition-colors shadow-sm">Continue Application</button>
                    <button onClick={onViewDetails} className="px-4 py-2.5 bg-white border border-gray-200 text-navy text-sm font-bold rounded-lg hover:bg-gray-50">View Details</button>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fadeInUp">
            <Confetti active={isConfettiActive} />
            <h2 className="text-2xl font-bold text-navy font-serif mb-6">My Home Page Overview</h2>
            
            {/* Split into two columns for the overview part */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (User Summary & Credit Score) */}
                <div className="lg:col-span-1 space-y-8">
                    {renderUserSummaryCard()}
                    {renderCreditScoreCard()}
                </div>
                {/* Right Column (Stats Row & Active Application) */}
                <div className="lg:col-span-2 space-y-8">
                    {renderStatsRow()}
                    {renderActiveApplicationCard()}
                </div>
            </div>
        </div>
    );
}

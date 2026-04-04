import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Message, ChecklistItem, AgentRole } from '../types';
import { sendMessageToGemini } from '../services/geminiService';
import { jsPDF } from "jspdf";
import { addPdfHeader } from '../utils/pdfHelpers';

// Define System Agents for the Right Panel
const SYSTEM_AGENTS = [
  { id: 'master', name: 'Master Orchestrator', role: 'System Core', icon: '🤖', color: 'bg-tataBlue', position: 'center' },
  { id: 'sales', name: 'Sales Agent', role: 'Offers & Pricing', icon: '💼', color: 'bg-teal', position: 'top-left' },
  { id: 'verification', name: 'Verification Agent', role: 'KYC & Docs', icon: '🔍', color: 'bg-orange', position: 'top-right' },
  { id: 'underwriting', name: 'Underwriting Agent', role: 'Risk Analysis', icon: '⚖️', color: 'bg-purple-600', position: 'bottom-left' },
  { id: 'sanction', name: 'Sanction Generator', role: 'Disbursal', icon: '📄', color: 'bg-green-600', position: 'bottom-right' },
];

const AGENTS: Record<AgentRole, { name: string; color: string; icon: string }> = {
  master: { name: "Master Agent", color: "bg-tataBlue", icon: "🤖" },
  sales: { name: "Sales Agent", color: "bg-teal", icon: "💼" },
  verification: { name: "Verification Agent", color: "bg-orange", icon: "🔍" },
  underwriting: { name: "Underwriting Agent", color: "bg-purple-600", icon: "⚖️" },
  sanction: { name: "Sanction Generator", color: "bg-green-600", icon: "📄" }
};

// Reusable Fintech Bot Icon
const BotIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.352-.272-2.636-.759-3.801a.75.75 0 00-.722-.515 11.209 11.209 0 01-7.877-3.08zM12 17.25a5.25 5.25 0 100-10.5 5.25 5.25 0 000 10.5zm0-1.5a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z" clipRule="evenodd" />
    <path d="M12 12.75a.75.75 0 100-1.5.75.75 0 000 1.5z" />
  </svg>
);

// Helper to parse bold markdown (**text**) into JSX
const parseMessageText = (text: string) => {
  if (!text) return null;
  
  // Split by double asterisks
  const parts = text.split(/(\*\*.*?\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Remove asterisks and wrap in strong
      return <strong key={index} className="font-bold text-navy bg-navy/5 px-1 rounded">{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export default function Chat() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // --- STATE ---
  const [messages, setMessages] = useState<Message[]>(() => {
    let userName = "";
    try {
        const userStr = localStorage.getItem('arthSahay_currentUser');
        if (userStr) {
            const u = JSON.parse(userStr);
            // Use first name
            userName = u.name ? ` ${u.name.split(' ')[0]}` : "";
        }
    } catch (e) {}

    return [{
      id: 'welcome',
      role: 'model',
      agent: 'master',
      text: `Namaste!🙏🏻,${userName} I'm your SmartLoan Expert. How can I help with your financing needs today?`,
      timestamp: new Date()
    }];
  });
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Changed activeWorker to activeWorkers array to support multiple agents simultaneously
  const [activeWorkers, setActiveWorkers] = useState<string[]>([]);
  
  // Logout State
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("Logging you out...");
  
  // Redirect Overlay State
  const [showRedirectOverlay, setShowRedirectOverlay] = useState(false);
  const [redirectMessage, setRedirectMessage] = useState("");
  const [redirectTarget, setRedirectTarget] = useState("");

  // Mapped Checklist to determine agent completion status
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', label: 'Needs', status: 'pending' },
    { id: '2', label: 'Offers', status: 'pending' },
    { id: '3', label: 'Verify', status: 'pending' },
    { id: '4', label: 'Decision', status: 'pending' },
    { id: '5', label: 'Sanction', status: 'pending' },
  ]);

  // Sidebar State
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  // Security & Modal State
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [securityPin, setSecurityPin] = useState(['', '', '', '']);
  const [securityError, setSecurityError] = useState('');
  
  // Structured Data from AI
  const [sanctionData, setSanctionData] = useState<any>(null);
  const [rejectionData, setRejectionData] = useState<any>(null);
  const [downloadType, setDownloadType] = useState<'sanction' | 'rejection'>('sanction');

  // State for welcome/success toasts
  const [welcomeToast, setWelcomeToast] = useState<string | null>(null);


  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check login status for conditional redirects
  const isLoggedIn = localStorage.getItem('isAuthenticated') === 'true';

  // --- EFFECT: Scroll on message ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeWorkers]); // Updated dependency

  useEffect(() => {
    if (location.state?.initialMessage) {
      handleUserAction(location.state.initialMessage);
    }
  }, [location]);

  // --- LOGIC: Checklist Updates ---
  const updateChecklist = (workerNamesInput: string) => {
      // Split by comma to handle multiple agents passed as string e.g. "Agent A, Agent B"
      const workerNames = workerNamesInput.split(',').map(s => s.trim());
      
      setActiveWorkers(prev => {
          // Add new workers avoiding duplicates
          const unique = new Set([...prev, ...workerNames]);
          return Array.from(unique);
      });

      setChecklist(prev => {
          const newChecklist = [...prev];
          // Logic mapping worker agents to new steps
          // 1. Needs -> initial interaction (assumed active/completed early)
          newChecklist[0].status = 'completed'; // Needs
          
          workerNames.forEach(workerName => {
              if (workerName.includes("Sales")) newChecklist[1].status = 'loading'; // Offers
              if (workerName.includes("Verification")) newChecklist[2].status = 'loading'; // Verify
              if (workerName.includes("Underwriting") || workerName.includes("Compliance")) newChecklist[3].status = 'loading'; // Decision
              if (workerName.includes("Sanction")) newChecklist[4].status = 'loading'; // Sanction
          });
          return newChecklist;
      });
  };

  const markChecklistComplete = (workerNames: string[]) => {
      setChecklist(prev => {
          const newChecklist = [...prev];
          workerNames.forEach(workerName => {
              if (workerName.includes("Sales")) newChecklist[1].status = 'completed';
              if (workerName.includes("Verification")) newChecklist[2].status = 'completed';
              if (workerName.includes("Underwriting") || workerName.includes("Compliance")) newChecklist[3].status = 'completed';
              if (workerName.includes("Sanction")) newChecklist[4].status = 'completed';
          });
          return newChecklist;
      });
  };

  // Helper function to determine agent status for the UI
  const getAgentStatus = (agentId: string) => {
    // Specific logic for Master Agent
    if (agentId === 'master') {
        // Master is "processing" if system is loading but no sub-worker is active
        if (isLoading && activeWorkers.length === 0) return 'processing';
        return 'online'; // Default state for Master
    }

    let isProcessing = false;
    let isCompleted = false;

    if (agentId === 'sales') {
        isProcessing = activeWorkers.some(w => w.includes("Sales"));
        isCompleted = checklist[1].status === 'completed';
    } else if (agentId === 'verification') {
        isProcessing = activeWorkers.some(w => w.includes("Verification"));
        isCompleted = checklist[2].status === 'completed';
    } else if (agentId === 'underwriting') {
        isProcessing = activeWorkers.some(w => w.includes("Underwriting") || w.includes("Compliance"));
        isCompleted = checklist[3].status === 'completed';
    } else if (agentId === 'sanction') {
        isProcessing = activeWorkers.some(w => w.includes("Sanction"));
        isCompleted = checklist[4].status === 'completed';
    }

    if (isProcessing) return 'processing';
    if (isCompleted) return 'completed';
    return 'idle';
  };

  // --- LOGIC: Chat ---
  const handleUserAction = async (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);
    setInputText('');

    // If first message, mark 'Needs' as processing/complete visually
    setChecklist(prev => {
        const c = [...prev];
        if (c[0].status === 'pending') c[0].status = 'completed';
        return c;
    });

    try {
        const responseText = await sendMessageToGemini(text, (agentName, data) => { // Updated to receive `data`
            updateChecklist(agentName);
            // Handle structured data for Sanction Letter
            if (agentName === "SanctionData" && data) {
                setSanctionData(data);
            }
            if (agentName === "RejectionData" && data) {
                setRejectionData(data);
            }
        });

        let action: Message['action'] = undefined;
        let cleanText = responseText;

        if (responseText.includes("[ACTION: UPLOAD_REQUEST]")) {
            action = 'upload_request';
            cleanText = cleanText.replace("[ACTION: UPLOAD_REQUEST]", "");
        } else if (responseText.includes("[ACTION: OPTION_SELECT]")) {
            action = 'option_select';
            cleanText = cleanText.replace("[ACTION: OPTION_SELECT]", "");
        } else if (responseText.includes("[ACTION: OVER_LIMIT_OPTIONS]")) {
            action = 'over_limit_options';
            cleanText = cleanText.replace("[ACTION: OVER_LIMIT_OPTIONS]", "");
        } else if (responseText.includes("[ACTION: DOWNLOAD_LINK]")) {
            action = 'download_link';
            cleanText = cleanText.replace("[ACTION: DOWNLOAD_LINK]", "");
        } else if (responseText.includes("[ACTION: DOWNLOAD_REJECTION_LINK]")) {
            action = 'download_rejection_link';
            cleanText = cleanText.replace("[ACTION: DOWNLOAD_REJECTION_LINK]", "");
        }

        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model',
            agent: 'master',
            text: cleanText.trim(),
            timestamp: new Date(),
            action: action
        }]);

        // Cleanup active workers
        if (activeWorkers.length > 0) {
            markChecklistComplete(activeWorkers);
            setActiveWorkers([]);
        }

    } catch (error) {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            role: 'model',
            agent: 'master',
            text: "I apologize, connection interrupted. Please try again.",
            timestamp: new Date()
        }]);
    } finally {
        setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    handleUserAction(inputText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // --- LOGIC: Actions ---
  const handleUpload = () => fileInputRef.current?.click();
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          // Send as a special formatted message that the Master Agent can recognize as a file input
          // This simulates "sending the file" which the Master Agent prompt will catch to run OCR
          handleUserAction(`[SYSTEM: User uploaded file: ${file.name}]`);
      }
  };
  const handleOptionSelect = (opt: string) => handleUserAction(`I select: ${opt}`);
  
  const handleDownloadClick = (type: 'sanction' | 'rejection') => {
      setDownloadType(type);
      setShowSecurityModal(true);
      setSecurityPin(['', '', '', '']);
      setSecurityError('');
  };

  // Function to verify PIN and trigger PDF download
  const verifyAndDownload = () => {
    const correctPin = "1234";
    if (securityPin.join('') === correctPin) {
        setSecurityError('');
        const doc = new jsPDF();
        addPdfHeader(doc); // Use shared header

        if (downloadType === 'sanction' && sanctionData) {
            // Sanction Letter Specifics
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.setTextColor(0, 76, 151); // Tata Blue
            doc.text("SANCTION LETTER", 105, 45, { align: "center" });

            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            const dateStr = new Date().toLocaleDateString();
            doc.text(`Date: ${dateStr}`, 15, 60);
            doc.text(`Ref No: ${sanctionData.sanction_id || 'AS/PL/2025/WEB-001'}`, 150, 60);

            doc.text(`To,`, 15, 70);
            doc.setFont("helvetica", "bold");
            doc.text(`${sanctionData.cust_name}`, 15, 75);
            doc.setFont("helvetica", "normal");

            doc.text("Subject: Sanction of Personal Loan Facility", 15, 85);

            doc.text("Dear Customer,", 15, 95);
            const intro = "We are pleased to inform you that based on your application and credit appraisal, we have sanctioned a Personal Loan limit as per the terms mentioned below:";
            const splitIntro = doc.splitTextToSize(intro, 180);
            doc.text(splitIntro, 15, 102);

            // Table Box
            let y = 115;
            doc.setFillColor(245, 247, 250);
            doc.rect(15, y, 180, 50, 'F');
            doc.setDrawColor(200);
            doc.rect(15, y, 180, 50, 'S');

            const drawRow = (label: string, value: string, yPos: number) => {
                doc.setFont("helvetica", "normal");
                doc.text(label, 20, yPos);
                doc.setFont("helvetica", "bold");
                doc.text(value, 100, yPos);
            };

            drawRow("Sanctioned Amount", `Rs. ${sanctionData.loan_amount.toLocaleString()}`, y + 10);
            drawRow("Tenure", `${sanctionData.tenure_months} Months`, y + 20);
            drawRow("Interest Rate", `${sanctionData.interest_rate_annual}% p.a.`, y + 30);
            drawRow("Monthly EMI", `Rs. ${sanctionData.emi.toLocaleString()}`, y + 40);

            y += 60;
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            const terms = [
                "1. The loan shall be disbursed to your verified bank account.",
                "2. Interest is calculated on a monthly reducing balance basis.",
                "3. This sanction is valid for 30 days from the date of issue.",
                "4. Processing fees and other charges as per the Key Fact Statement (KFS)."
            ];
            
            doc.text("Key Terms & Conditions:", 15, y);
            y += 8;
            terms.forEach(term => {
                doc.text(term, 15, y);
                y += 6;
            });

            y += 15;
            doc.text("For Tata Capital Financial Services Limited", 15, y);
            y += 15;
            // Signature placeholder
            doc.setFont("helvetica", "italic");
            doc.setTextColor(100);
            doc.text("(Digitally Signed)", 15, y);

            doc.save("ArthSahay_Sanction_Letter.pdf");
            setWelcomeToast("Sanction Letter downloaded successfully!");

        } else if (downloadType === 'rejection' && rejectionData) {
            // Rejection Letter Specifics
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.setTextColor(150, 0, 0); // Dark Red
            doc.text("REJECTION LETTER", 105, 45, { align: "center" });

            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            const dateStr = rejectionData.DATE || new Date().toLocaleDateString();
            doc.text(`Ref No: ${rejectionData.APPLICATION_ID || 'AS-REJ-001'}`, 15, 60);
            doc.text(`Date: ${dateStr}`, 150, 60);

            doc.text(`Applicant Name: ${rejectionData.FULL_NAME}`, 15, 70);
            doc.text(`Mobile: ${rejectionData.MOBILE}`, 150, 70);

            doc.text("Subject: Loan Application Status – Not Approved at This Time", 15, 80);

            doc.setFont("helvetica", "normal");
            let y = 90;
            doc.text(`Dear ${rejectionData.FULL_NAME},`, 15, y);
            y += 10;
            
            const intro = `Thank you for applying for a ${rejectionData.LOAN_TYPE || 'Loan'} with Tata Capital through ArthSahay 24/7. After completing our credit assessment and internal policy checks, we regret to inform you that we are unable to approve your loan application at this moment.`;
            const splitIntro = doc.splitTextToSize(intro, 180);
            doc.text(splitIntro, 15, y);
            y += 20; // Approx height of intro paragraph

            doc.setFont("helvetica", "bold");
            doc.text("Your application could not be approved due to the following reason(s):", 15, y);
            y += 8;
            doc.setFont("helvetica", "normal");
            
            const reasons = [rejectionData.REASON_1, rejectionData.REASON_2, rejectionData.REASON_3].filter(Boolean);
            reasons.forEach(reason => {
                doc.text(`• ${reason}`, 15, y);
                y += 6;
            });
            y += 5;

            const policyNote = "Please note that these decisions are made in accordance with Tata Capital’s internal credit policies and the RBI’s Digital Lending Guidelines. Our goal is to ensure safe, responsible borrowing aligned with your financial well-being.";
            const splitPolicy = doc.splitTextToSize(policyNote, 180);
            doc.text(splitPolicy, 15, y);
            y += 15;

            doc.setFont("helvetica", "bold");
            doc.text("Next Steps You Can Consider:", 15, y);
            y += 8;
            doc.setFont("helvetica", "normal");
            const steps = [
                "Apply with a lower loan amount",
                "Try increasing the loan tenure to reduce EMI",
                "Improve credit score by clearing outstanding dues",
                rejectionData.REAPPLY_WAIT_PERIOD ? `Re-apply after ${rejectionData.REAPPLY_WAIT_PERIOD} days` : "Re-apply after 30 days"
            ];
            steps.forEach(step => {
                doc.text(`- ${step}`, 15, y);
                y += 6;
            });
            y += 10;

            const closing = "This is not a reflection of your worthiness as a customer, and we would be glad to re-evaluate your loan once the above conditions improve.";
            const splitClosing = doc.splitTextToSize(closing, 180);
            doc.text(splitClosing, 15, y);
            y += 15;

            doc.text("Warm regards,", 15, y);
            doc.text("ArthSahay 24/7", 15, y + 5);
            doc.text("Tata Capital Financial Services Limited", 15, y + 10);
            
            y += 20;
            doc.setFont("helvetica", "italic");
            doc.setTextColor(100);
            doc.text("(Computer-generated document. Signature not required.)", 15, y);

            doc.save("ArthSahay_Rejection_Letter.pdf");
            setWelcomeToast("Rejection Letter downloaded.");
        } else {
            setSecurityError("Document data unavailable. Please try again.");
        }
        
        setShowSecurityModal(false);
        setSecurityPin(['', '', '', '']);
        setTimeout(() => setWelcomeToast(null), 3000);
    } else {
        setSecurityError("Incorrect PIN. Please try again.");
    }
  };

  const handleLogout = () => {
      // 1. Trigger Loading State
      setIsLoggingOut(true);
      setLogoutMessage("Logging you out...");

      // 2. Delay for transition
      setTimeout(() => {
          setLogoutMessage("Logged out successfully.");
          
          // 3. Cleanup & Redirect
          setTimeout(() => {
              localStorage.removeItem('isAuthenticated');
              localStorage.removeItem('arthSahay_currentUser');
              window.dispatchEvent(new Event('userUpdate'));
              navigate('/login');
          }, 800); 
      }, 1500);
  };

  const handleSidebarRedirect = (path: string, message: string) => {
    setShowRedirectOverlay(true);
    setRedirectMessage(message);
    setRedirectTarget(path);

    setTimeout(() => {
        navigate(path);
        setShowRedirectOverlay(false);
        setRedirectMessage("");
        setRedirectTarget("");
    }, 2000); // 2-second delay
  };

  // --- RENDER ---
  return (
    <div className="flex h-screen bg-neutralGray font-sans overflow-hidden relative">
      
      {/* Logout Overlay */}
      {isLoggingOut && (
          <div className="fixed inset-0 z-[100] bg-tataBlue/95 backdrop-blur-md flex flex-col items-center justify-center text-white animate-fadeInUp">
              <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-white animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-xs">AS</div>
              </div>
              <h2 className="text-2xl font-bold font-serif mb-2 tracking-wide">{logoutMessage}</h2>
              <p className="text-white/80 text-sm">Thank you for banking with ArthSahay.</p>
          </div>
      )}

      {/* Redirect Overlay */}
      {showRedirectOverlay && (
          <div className="fixed inset-0 z-[100] bg-tataBlue/95 backdrop-blur-md flex flex-col items-center justify-center text-white animate-fadeInUp">
              <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full border-4 border-white/10 border-t-white animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center font-bold text-xs">AS</div>
              </div>
              <h2 className="text-2xl font-bold font-serif mb-2 tracking-wide">{redirectMessage}</h2>
              <p className="text-white/80 text-sm">Please wait while we redirect you...</p>
          </div>
      )}

      {/* Welcome Toast */}
      {welcomeToast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-navy text-white px-5 py-3 rounded-xl shadow-lg border border-white/20 animate-fadeInUp text-sm font-medium">
              {welcomeToast}
          </div>
      )}

      {/* 1. Sidebar (Far Left) */}
      <div 
        className={`${isSidebarExpanded ? 'w-56' : 'w-20'} bg-white h-full shadow-lg border-r border-gray-200 transition-all duration-300 flex flex-col z-20 shrink-0`}
        onMouseEnter={() => setIsSidebarExpanded(true)}
        onMouseLeave={() => setIsSidebarExpanded(false)}
      >
         <div className="h-16 flex items-center justify-center border-b border-gray-100">
             <div className="w-8 h-8 bg-tataBlue rounded-lg flex items-center justify-center text-white font-serif font-bold shadow-lg shadow-tataBlue/20">AS</div>
             {isSidebarExpanded && <span className="ml-3 font-bold text-tataBlue text-sm animate-fadeInUp font-serif">ArthSahay</span>}
         </div>

         <div className="flex-1 py-6 flex flex-col gap-2">
             <button onClick={() => handleSidebarRedirect(isLoggedIn ? '/' : '/login', 'Redirecting to Home...')} className="flex items-center px-6 py-3 text-gray-500 hover:bg-tataLightBlue hover:text-tataBlue transition-colors relative group">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
                 {isSidebarExpanded && <span className="ml-4 font-medium text-sm animate-fadeInUp">Home</span>}
                 {isSidebarExpanded && <div className="absolute left-0 top-0 bottom-0 w-1 bg-tataBlue opacity-0 group-hover:opacity-100 transition-opacity"></div>}
             </button>
             <button onClick={() => handleSidebarRedirect('/profile', 'Redirecting to Profile...')} className="flex items-center px-6 py-3 text-gray-500 hover:bg-tataLightBlue hover:text-tataBlue transition-colors relative group">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                 {isSidebarExpanded && <span className="ml-4 font-medium text-sm animate-fadeInUp">Profile</span>}
                 {isSidebarExpanded && <div className="absolute left-0 top-0 bottom-0 w-1 bg-tataBlue opacity-0 group-hover:opacity-100 transition-opacity"></div>}
             </button>
         </div>

         <div className="py-6 border-t border-gray-100">
             <button onClick={handleLogout} className="flex items-center w-full px-6 py-3 text-red-500 hover:bg-red-50 transition-colors relative group">
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" /></svg>
                 {isSidebarExpanded && <span className="ml-4 font-medium text-sm animate-fadeInUp">Log Out</span>}
             </button>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full min-w-0">
         
         {/* 2. Top Header */}
         <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-center shrink-0 z-10 shadow-sm">
            <h1 className="text-lg font-bold text-tataBlue tracking-tight font-serif">ArthSahay 24/7 Smart Loan Expert</h1>
         </header>

         {/* 3. Two-Panel Layout */}
         <div className="flex-1 flex p-4 md:p-6 gap-6 overflow-hidden">
            
            {/* Left Chat Panel */}
            <div className="flex-1 flex flex-col bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 min-w-0">
               {/* Header */}
               <div className="bg-tataBlue px-6 py-4 flex items-center gap-4 shrink-0 shadow-md relative z-10">
                  <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-tataBlue border-2 border-white/20 shadow-inner p-1.5">
                          <BotIcon className="w-full h-full" />
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-tataBlue"></div>
                  </div>
                  <div>
                      <h2 className="text-white font-bold text-base leading-tight font-serif">SmartLoan Expert</h2>
                      <p className="text-tataLightBlue text-xs font-medium tracking-wide">by Tata Capital</p>
                  </div>
               </div>
               
               {/* Messages Area */}
               <div className="flex-1 overflow-y-auto p-6 bg-neutralGray/50 custom-scrollbar flex flex-col gap-4">
                  {messages.map((msg) => (
                      <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          {msg.role === 'model' && (
                              <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-tataBlue p-1.5 mr-2 mt-1 shrink-0 shadow-sm">
                                  <BotIcon className="w-full h-full" />
                              </div>
                          )}
                          <div className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm shadow-sm leading-relaxed
                              ${msg.role === 'user' 
                                ? 'bg-tataBlue text-white rounded-br-none shadow-tataBlue/10' 
                                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                              }`}>
                              
                              {/* Custom rendering for File Upload System Message */}
                              {msg.text.startsWith('[SYSTEM: User uploaded file:') ? (
                                  <div className="flex flex-col gap-1 items-end">
                                      <div className="flex items-center gap-3 bg-white/10 p-2.5 rounded-xl border border-white/20 shadow-sm backdrop-blur-sm">
                                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center text-white">
                                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
                                          </div>
                                          <div className="text-left">
                                              <p className="text-sm font-bold text-white">{msg.text.split('file:')[1].replace(']', '').trim()}</p>
                                              <p className="text-[10px] text-white/70">Sent for verification</p>
                                          </div>
                                          <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center text-white text-xs ml-1">
                                              ✓
                                          </div>
                                      </div>
                                  </div>
                              ) : (
                                  <div className="whitespace-pre-line">{parseMessageText(msg.text)}</div>
                              )}
                              
                              {/* Actions Rendering */}
                              {msg.action === 'option_select' && (
                                  <div className="mt-4 flex flex-col sm:flex-row gap-3">
                                      {/* Generic buttons that serve as selectors for the AI's content */}
                                      <button onClick={() => handleOptionSelect("Option 1")} className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-tataBlue hover:bg-tataLightBlue/20 text-tataBlue font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm group">
                                         <span className="w-5 h-5 rounded-full bg-tataBlue text-white flex items-center justify-center group-hover:scale-110 transition-transform">1</span>
                                         Select Option 1
                                      </button>
                                      <button onClick={() => handleOptionSelect("Option 2")} className="flex-1 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 hover:border-tataBlue hover:bg-tataLightBlue/20 text-tataBlue font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm group">
                                         <span className="w-5 h-5 rounded-full bg-tataBlue text-white flex items-center justify-center group-hover:scale-110 transition-transform">2</span>
                                         Select Option 2
                                      </button>
                                  </div>
                              )}
                              {msg.action === 'over_limit_options' && (
                                  <div className="mt-4 flex flex-col gap-3">
                                      <div className="flex gap-3">
                                          <button onClick={() => handleOptionSelect("Option 1")} className="flex-1 px-4 py-3 bg-green-50 rounded-xl border border-green-200 hover:border-green-500 text-green-700 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm">
                                              <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px]">1</span>
                                              Select Safe Option 1
                                          </button>
                                          <button onClick={() => handleOptionSelect("Option 2")} className="flex-1 px-4 py-3 bg-green-50 rounded-xl border border-green-200 hover:border-green-500 text-green-700 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm">
                                              <span className="w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-[10px]">2</span>
                                              Select Safe Option 2
                                          </button>
                                      </div>
                                      <button onClick={() => handleOptionSelect("Proceed with original request")} className="w-full px-4 py-3 bg-red-50 rounded-xl border border-red-200 hover:bg-red-100 text-red-600 font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm">
                                          ⚠️ Continue with requested amount (High Risk)
                                      </button>
                                  </div>
                              )}
                              {msg.action === 'upload_request' && (
                                  <button onClick={handleUpload} className="mt-3 px-4 py-2 bg-orange text-white text-xs font-bold rounded-lg hover:bg-orangeDark transition-colors w-full flex items-center justify-center gap-2">
                                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg> Upload Required Document
                                  </button>
                              )}
                              {msg.action === 'download_link' && (
                                  <button onClick={() => handleDownloadClick('sanction')} className="mt-3 px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors w-full flex items-center justify-center gap-2">
                                      Download Sanction Letter
                                  </button>
                              )}
                              {msg.action === 'download_rejection_link' && (
                                  <button onClick={() => handleDownloadClick('rejection')} className="mt-3 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors w-full flex items-center justify-center gap-2">
                                      Download Rejection Letter
                                  </button>
                              )}
                              
                              <span className={`block text-[9px] mt-1 opacity-60 ${msg.role === 'user' ? 'text-tataLightBlue text-right' : 'text-gray-400'}`}>
                                  {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                          </div>
                      </div>
                  ))}
                  
                  {isLoading && (
                      <div className="flex justify-start">
                          <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-tataBlue p-1.5 mr-2 mt-1 shadow-sm">
                              <BotIcon className="w-full h-full" />
                          </div>
                          <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-100"></span>
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-200"></span>
                          </div>
                      </div>
                  )}
                  <div ref={messagesEndRef} />
               </div>

               {/* Input Area */}
               <div className="p-4 bg-white border-t border-gray-100 shrink-0">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-tataBlue focus-within:ring-1 focus-within:ring-tataBlue transition-all shadow-inner">
                      <input 
                          ref={inputRef}
                          type="text" 
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder="Type your message..."
                          className="flex-1 bg-transparent border-none outline-none text-sm text-navy placeholder-gray-400"
                      />
                      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileSelect} />
                      <button onClick={handleSend} disabled={!inputText.trim()} className="w-8 h-8 bg-tataBlue rounded-full flex items-center justify-center text-white hover:bg-tataBlue/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" /></svg>
                      </button>
                  </div>
               </div>
            </div>

            {/* Right Agent Panel (Cluster Design) */}
            <div className="w-80 hidden lg:flex flex-col gap-6 overflow-hidden">
               {/* Active Agents Card */}
               <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100 flex-1 overflow-hidden relative">
                  <h3 className="font-bold text-tataBlue text-lg mb-6 flex items-center gap-2 z-10 relative">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25z" /></svg>
                      Active Agents
                  </h3>
                  
                  {/* Agent Cluster Visual */}
                  <div className="relative w-full h-full flex items-center justify-center p-4">
                        {/* Connecting Lines (Background) */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                            {/* Lines connecting Center to corners */}
                            <div className="absolute w-[80%] h-[1px] bg-tataBlue rotate-45"></div>
                            <div className="absolute w-[80%] h-[1px] bg-tataBlue -rotate-45"></div>
                            {/* Central Circle Outline */}
                            <div className="absolute w-32 h-32 rounded-full border border-tataBlue border-dashed animate-spin-slow"></div>
                        </div>

                        {SYSTEM_AGENTS.map((agent) => {
                            const status = getAgentStatus(agent.id);
                            const isProcessing = status === 'processing';
                            const isCompleted = status === 'completed';
                            const isOnline = status === 'online';
                            const isActive = isProcessing || isOnline || isCompleted;

                            // Positioning Logic (Grid-like radial)
                            let posClass = "";
                            if (agent.position === 'center') posClass = "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20";
                            else if (agent.position === 'top-left') posClass = "top-8 left-4";
                            else if (agent.position === 'top-right') posClass = "top-8 right-4";
                            else if (agent.position === 'bottom-left') posClass = "bottom-8 left-4";
                            else if (agent.position === 'bottom-right') posClass = "bottom-8 right-4";

                            return (
                                <div 
                                    key={agent.id} 
                                    className={`absolute flex flex-col items-center gap-1 transition-all duration-500 ${posClass}`}
                                >
                                    <div className={`relative rounded-full flex items-center justify-center shadow-md transition-all duration-500
                                        ${agent.position === 'center' ? 'w-16 h-16 text-2xl' : 'w-12 h-12 text-lg'}
                                        ${isProcessing ? `scale-110 shadow-[0_0_15px_rgba(13,148,136,0.6)] ${agent.color} text-white ring-2 ring-offset-2 ring-teal-400` 
                                          : isCompleted ? 'bg-white border-2 border-green-500 text-green-600 scale-100'
                                          : isOnline ? `${agent.color} text-white opacity-100` 
                                          : 'bg-gray-100 text-gray-400 border border-gray-200 grayscale opacity-60 scale-90'
                                        }
                                    `}>
                                        {/* Icon Content */}
                                        <span className="relative z-10">{isCompleted ? '✓' : agent.icon}</span>
                                        
                                        {/* Ping Animation for Processing */}
                                        {isProcessing && (
                                            <span className={`absolute inset-0 rounded-full ${agent.color} opacity-40 animate-ping`}></span>
                                        )}
                                    </div>
                                    
                                    {/* Label */}
                                    <span className={`text-[10px] font-bold text-center px-2 py-0.5 rounded-full transition-all duration-300
                                        ${isProcessing ? 'bg-tataBlue text-white scale-105 shadow-sm' 
                                          : isCompleted ? 'text-green-700' 
                                          : 'text-gray-400'
                                        }
                                    `}>
                                        {agent.name.split(' ')[0]}
                                    </span>
                                </div>
                            );
                        })}
                  </div>
               </div>
            </div>

         </div>
      </div>

      {/* Security Modal */}
      {showSecurityModal && (
          <div className="absolute inset-0 z-50 bg-tataBlue/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-fadeInUp">
                  <h3 className="text-xl font-bold text-tataBlue text-center mb-4">Secure Download</h3>
                  <p className="text-sm text-gray-500 text-center mb-6">Enter PIN to access document.</p>
                  <div className="flex justify-center gap-3 mb-6">
                        {securityPin.map((d, i) => (
                            <input key={i} type="password" maxLength={1} className="w-12 h-12 border-2 border-gray-200 rounded-xl text-center text-xl font-bold focus:border-tataBlue outline-none text-navy" value={d} onChange={(e) => {
                                const n = [...securityPin]; n[i] = e.target.value; setSecurityPin(n);
                                if(e.target.value && e.target.nextSibling) (e.target.nextSibling as HTMLElement).focus();
                            }} />
                        ))}
                  </div>
                  {securityError && <p className="text-center text-red-500 text-xs font-bold mb-4">{securityError}</p>}
                  <button onClick={verifyAndDownload} className="w-full py-3 bg-tataBlue text-white font-bold rounded-xl hover:bg-tataBlue/90 transition-colors">Verify</button>
                  <button onClick={() => setShowSecurityModal(false)} className="w-full mt-2 py-2 text-gray-400 text-xs font-bold hover:text-gray-600">Cancel</button>
              </div>
          </div>
      )}
    </div>
  );
}
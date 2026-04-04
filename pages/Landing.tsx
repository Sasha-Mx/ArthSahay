import React, { useEffect, useState, useMemo } from 'react';
import Navbar from "../components/Navbar";
import Hero3D from "../components/Hero3D";
import TrustBar from "../components/TrustBar";
import LoanCard from "../components/LoanCard";
import WhyUs from "../components/WhyUs";
import LoanCalculator from "../components/LoanCalculator";
import ProcessTimeline from "../components/ProcessTimeline";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import FundingOptions from "../components/FundingOptions";
import AIWorkingDemo from "../components/AIWorkingDemo";
import DashboardOverview from '../components/DashboardOverview'; // New import
import { LoanProduct } from '../types';
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf'; // For PDF generation in DashboardOverview
import { addPdfHeader } from '../utils/pdfHelpers'; // Import shared PDF header utility


// --- Dummy Recent Application Data (duplicated for Landing page's DashboardOverview) ---
const dummyApplication = {
  loanType: "Personal Loan",
  applicationId: "TC-PL-8829-WEB",
  amount: 500000,
  tenureMonths: 60,
  interestRate: 11.49,
  currentStage: "Verification Pending",
  isUrgentMedicalLoan: false,
};

// Define UserProfile interface here as well, since DashboardOverview uses it
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

export default function Landing() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [editFormData, setEditFormData] = useState<UserProfile | null>(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [welcomeToast, setWelcomeToast] = useState<string | null>(null);


  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem('isAuthenticated') === 'true';
      setIsLoggedIn(authStatus);
      if (authStatus) {
        const storedUser = localStorage.getItem('arthSahay_currentUser');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser({
            name: userData.name || "User",
            email: userData.email || "",
            emailVerified: userData.emailVerified || false,
            phone: userData.phone || userData.mobile || "",
            phoneVerified: userData.phoneVerified || false,
            aadhaar: userData.aadhaar || "",
            aadhaarVerified: userData.aadhaarVerified || false,
            pan: userData.pan || "",
            panVerified: userData.panVerified || false,
            dob: userData.dob || "",
            creditScore: userData.creditScore || 785, // Default score
            address: userData.address || "Address Pending Update",
            avatar: userData.avatar,
            loanType: dummyApplication.loanType, // Keep fixed for dashboard display
            currentStage: dummyApplication.currentStage
          });
        }
      } else {
        setUser(null);
      }
    };

    checkAuth(); // Initial check

    window.addEventListener('userUpdate', checkAuth);
    return () => window.removeEventListener('userUpdate', checkAuth);
  }, []);

  const products: LoanProduct[] = [
    { 
      title: "Personal Loan", 
      text: "Get up to ₹10L instantly for travel or lifestyle needs. No collateral required.", 
      icon: "👤" 
    },
    { 
      title: "Medical Loan", 
      text: "Emergency funds for hospitalization or surgeries. Instant approval with priority processing.", 
      icon: "🏥" 
    },
    { 
      title: "Education Loan", 
      text: "Fuel your career aspirations with low-interest loans designed for students and skill upgradation.", 
      icon: "🎓" 
    },
    { 
      title: "Home Renovation", 
      text: "Transform your living space. Quick disbursement for repairs, painting, or furnishing your dream home.", 
      icon: "🏠" 
    },
  ];

    // Helper: Format Phone Number (12345 67890) - duplicated from Profile, consider shared util
    const formatPhoneNumber = (value: string) => {
        if (!value) return "";
        const cleaned = value.replace(/\D/g, '');
        if (cleaned.length > 5) {
            return `${cleaned.slice(0, 5)} ${cleaned.slice(5, 10)}`;
        }
        return cleaned;
    };


  // --- Dashboard Overview Handlers ---
  const handleContinueApplicationClick = () => {
      if (user) {
          navigate('/chat', { state: { initialMessage: `Track my ${dummyApplication.loanType} application (ID: ${dummyApplication.applicationId}).` } });
      } else {
          navigate('/login');
      }
  };

  const handleViewDetailsClick = () => {
      setShowDetailsModal(true);
  };

  const handleEditProfileClick = () => {
      if (user) setEditFormData(user);
      setShowEditProfileModal(true);
  };

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
      if (editFormData) {
          setEditFormData(prev => ({ ...prev, [field]: value }));
      }
  };

  const saveProfile = () => {
      if (!editFormData || !user) return;
      setIsSavingProfile(true);
      setTimeout(() => {
          const updatedUser = {
              ...editFormData,
          };
          setUser(updatedUser);
          const currentUser = JSON.parse(localStorage.getItem('arthSahay_currentUser') || '{}');
          Object.assign(currentUser, updatedUser);
          localStorage.setItem('arthSahay_currentUser', JSON.stringify(currentUser));
          window.dispatchEvent(new Event('userUpdate'));
          setIsSavingProfile(false);
          setShowEditProfileModal(false);
          setWelcomeToast("Profile updated successfully!");
          setTimeout(() => setWelcomeToast(null), 3000);
      }, 1000);
  };

  const handleDownloadReport = (currentUser: UserProfile) => {
    if (!currentUser) return;
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.getHeight();
    const maxContentY = pageHeight - 40; // Leave 40mm for footer

    let y = 40; // Starting Y position for content after header

    const checkPageBreak = (requiredSpace: number) => {
        if (y + requiredSpace > maxContentY) {
            doc.addPage();
            addPdfHeader(doc);
            y = 40; // Reset y for new page
        }
    };

    addPdfHeader(doc); // Add initial header

    // --- User Details ---
    checkPageBreak(50); // Estimate space for Applicant Details section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Applicant Details", 15, y);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.line(15, y + 2, 195, y + 2);

    y += 15;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);

    let age = "N/A";
    if (currentUser.dob) {
      const birth = new Date(currentUser.dob);
      const diff = Date.now() - birth.getTime();
      const ageDate = new Date(diff);
      age = Math.abs(ageDate.getUTCFullYear() - 1970).toString();
    }

    const maskedAadhaar = currentUser.aadhaar ? `XXXX XXXX ${currentUser.aadhaar.replace(/\s/g, '').slice(-4)}` : 'Not Linked';
    const maskedPan = currentUser.pan ? `XXXXX${currentUser.pan.slice(5, 9)}${currentUser.pan.slice(-1)}` : 'Not Linked';

    doc.text(`Name: ${currentUser.name}`, 15, y);
    doc.text(`Age: ${age} Years`, 110, y);
    y += 10;
    doc.text(`Mobile: ${currentUser.phone}`, 15, y);
    doc.text(`Email: ${currentUser.email}`, 110, y);
    y += 10;
    doc.text(`Aadhaar: ${maskedAadhaar}`, 15, y);
    doc.text(`PAN: ${maskedPan}`, 110, y);

    y += 20;

    // --- Credit Profile ---
    checkPageBreak(50); // Estimate space for Credit Profile section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Credit Profile", 15, y);
    doc.line(15, y + 2, 195, y + 2);

    y += 15;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);

    const getScoreStatusForPdf = (score: number) => {
      if (score >= 750) return { label: 'Excellent', color: '#16a34a', bg: '#dcfce7', text: '#16a34a' };
      if (score >= 700) return { label: 'Good', color: '#0d9488', bg: '#ccfbf1', text: '#0d9488' };
      if (score >= 650) return { label: 'Average', color: '#ca8a04', bg: '#fef9c3', text: '#ca8a04' };
      return { label: 'Needs Attention', color: '#dc2626', bg: '#fee2e2', text: '#dc2626' };
    };
    const scoreStatus = getScoreStatusForPdf(currentUser.creditScore);

    doc.text(`CIBIL Score: ${currentUser.creditScore}`, 15, y);
    doc.setTextColor(scoreStatus.color); // Apply color for rating
    doc.text(`Rating: ${scoreStatus.label}`, 110, y);
    doc.setTextColor(50, 50, 50); // Reset color
    y += 10;
    doc.text(`Report Date: ${new Date().toLocaleDateString()}`, 15, y);

    // Determine if the dummy application is currently pending (not sanctioned/completed)
    const isApplicationPending = dummyApplication.currentStage !== "Sanctioned" && dummyApplication.currentStage !== "Completed";

    // --- Pending Application Process Details ---
    checkPageBreak(60); // Estimate space for this section
    y += 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Pending Application Process Details", 15, y);
    doc.line(15, y + 2, 195, y + 2);

    y += 15;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);

    const LOAN_DOC_REQUIREMENTS_LANDING: Record<string, string[]> = { // Local copy
      "Personal Loan": ["Salary Slip (Last 2 Months)", "Bank Statement (Last 3 Months)", "PAN Card", "Aadhaar Card"],
      "Home Loan": ["Property Papers", "Income Proof (ITR/Form 16)", "PAN Card", "Aadhaar Card", "Bank Statements"],
      "Auto Loan": ["Vehicle Quote", "Salary Slip (Last 3 Months)", "PAN Card", "Aadhaar Card", "Address Proof"],
      "Education Loan": ["Admission Letter", "Fee Structure", "Income Proof", "Co-Signer Docs", "PAN Card", "Aadhaar Card"],
      "Business Loan": ["GST Returns", "ITR (Last 2 Years)", "Business Proof (e.g., Udyam)", "Bank Statements (Last 12 Months)", "PAN Card", "Aadhaar Card"],
      "Medical Loan": ["Doctor's Certificate/Medical Report", "Hospital Bills/Invoices", "Prescription/Estimate", "Income Proof (Salary Slip/ITR)", "PAN Card", "Aadhaar Card"]
    };
    const docsForPdf = LOAN_DOC_REQUIREMENTS_LANDING[dummyApplication.loanType] || [];
    const vaultDocs = JSON.parse(localStorage.getItem('arthSahay_vault') || '[]');
    const verifiedDocsCountForPdf = docsForPdf.filter(docName =>
      vaultDocs.some((d: any) => d.name === docName && d.isVerified) || // Check for isVerified from vault
      (docName.includes("Aadhaar Card") && currentUser.aadhaarVerified) ||
      (docName.includes("PAN Card") && currentUser.panVerified)
    ).length;
    const totalRequiredDocsForPdf = docsForPdf.length;


    if (isApplicationPending) {
      doc.text(`Current Loan: ${dummyApplication.loanType} (ID: ${dummyApplication.applicationId})`, 15, y);
      y += 10;
      doc.text(`Next Step: ${dummyApplication.currentStage}`, 15, y);
      y += 10;
      doc.text(`Documents Pending: ${totalRequiredDocsForPdf - verifiedDocsCountForPdf} (See checklist below)`, 15, y);
    } else {
      doc.text("No active or pending loan applications at this time.", 15, y);
      y += 10;
      doc.text("Consider exploring our loan products to get started.", 15, y);
    }

    // --- Newly Applied Application Details (Conditional) ---
    if (isApplicationPending) {
      checkPageBreak(80); // Estimate space for this section
      y += 20;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(15, 23, 42);
      doc.text("Newly Applied Application (Details)", 15, y);
      doc.line(15, y + 2, 195, y + 2);

      y += 15;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(50, 50, 50);
      doc.text(`Product: ${dummyApplication.loanType}`, 15, y);
      doc.text(`Application ID: ${dummyApplication.applicationId}`, 110, y);
      y += 10;
      doc.text(`Requested Amount: Rs. ${dummyApplication.amount.toLocaleString()}`, 15, y);
      doc.text(`Submission Date: 15 Oct, 2025`, 110, y);
      y += 10;
      doc.text(`Current Stage: ${dummyApplication.currentStage}`, 15, y);
      if (dummyApplication.loanType === "Medical Loan" && dummyApplication.isUrgentMedicalLoan) {
        y += 10;
        doc.text(`Urgency: Medical Emergency - Priority Processing`, 15, y);
      }
    }

    // --- Document Checklist ---
    checkPageBreak(50 + (docsForPdf.length * 8)); // Estimate space for section header + all docs
    y += 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(15, 23, 42);
    doc.text("Document Checklist Status (for " + dummyApplication.loanType + ")", 15, y);
    doc.line(15, y + 2, 195, y + 2);

    y += 15;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    docsForPdf.forEach(d => {
      checkPageBreak(8); // Space for one document line
      doc.setTextColor(50, 50, 50);
      doc.text(d, 15, y);

      const isDocVerified = vaultDocs.some((v: any) => v.name === d && v.isVerified) ||
        (d.includes("Aadhaar Card") && currentUser.aadhaarVerified) ||
        (d.includes("PAN Card") && currentUser.panVerified);

      if (isDocVerified) {
        doc.setTextColor(0, 128, 0);
        doc.text("VERIFIED", 110, y);
      } else {
        doc.setTextColor(220, 38, 38);
        doc.text("ACTION REQUIRED", 110, y);
      }
      y += 8;
    });

    // --- Footer (always at the very bottom of the last page) ---
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("This is a computer-generated document and does not require a signature.", 15, pageHeight - 15);
    doc.text("ArthSahay 24/7 | Tata Capital Financial Services Limited", 15, pageHeight - 10);

    doc.save("ArthSahay_Credit_Report.pdf");
  };

  return (
    <div className="min-h-screen bg-cream overflow-x-hidden font-sans">
      <Navbar />
      {welcomeToast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-navy text-white px-5 py-3 rounded-xl shadow-lg border border-white/20 animate-fadeInUp text-sm font-medium">
              {welcomeToast}
          </div>
      )}
      <Hero3D />
      <TrustBar />

      {/* Conditional Dashboard Overview Section */}
      {isLoggedIn && user && (
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <DashboardOverview 
            user={user}
            onContinueApplication={handleContinueApplicationClick}
            onViewDetails={handleViewDetailsClick}
            onDownloadReport={handleDownloadReport}
            onEditProfileClick={handleEditProfileClick}
          />
        </section>
      )}

      <AIWorkingDemo />

      <section id="services" className="py-24 px-6 max-w-7xl mx-auto">
         <div className="text-center mb-16">
            <span className="text-orange font-bold text-sm tracking-wider uppercase mb-2 block">Our Services</span>
            <h2 className="text-4xl font-bold text-navy">Tailored financial products for you</h2>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((p, idx) => (
              <LoanCard 
                key={p.title} 
                title={p.title} 
                text={p.text} 
                icon={p.icon} 
                index={idx}
              />
            ))}
         </div>
      </section>

      <FundingOptions />

      <ProcessTimeline />
      
      <div className="bg-gray-50 border-y border-gray-200">
        <LoanCalculator />
      </div>

      <WhyUs />
      
      <Testimonials />

      <FAQ />
      
      <Footer />

      {/* Application Details Modal - Duplicated for Landing page */}
      {showDetailsModal && user && (
          <div className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeInUp">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                  <button 
                    onClick={() => setShowDetailsModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <h3 className="text-xl font-bold text-navy text-center mb-6">Application Details</h3>
                  <div className="space-y-4 text-sm">
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500">Loan Type</span>
                          <span className="font-bold text-navy">{dummyApplication.loanType}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500">Application ID</span>
                          <span className="font-bold text-navy">{dummyApplication.applicationId}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500">Requested Amount</span>
                          <span className="font-bold text-navy">₹{dummyApplication.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500">Status</span>
                          <span className="font-bold text-orange">{dummyApplication.currentStage}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-500">Submission Date</span>
                          <span className="font-bold text-navy">15 Oct, 2025</span>
                      </div>
                  </div>
                  <button onClick={() => { setShowDetailsModal(false); navigate('/chat', { state: { initialMessage: `Tell me about my ${dummyApplication.loanType} application (ID: ${dummyApplication.applicationId}).` }}); }} className="w-full mt-6 py-3 bg-tataBlue text-white font-bold rounded-xl hover:bg-tataBlue/90 transition-colors">
                      Discuss with AI Expert
                  </button>
              </div>
          </div>
      )}

       {/* Edit Profile Modal - Duplicated for Landing page */}
       {showEditProfileModal && editFormData && (
          <div className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeInUp">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
                  <button 
                    onClick={() => setShowEditProfileModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <h3 className="text-xl font-bold text-navy text-center mb-6">Edit Profile</h3>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                          <input type="text" value={editFormData.name} onChange={(e) => handleProfileChange('name', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:border-navy outline-none" disabled />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
                          <input type="email" value={editFormData.email} onChange={(e) => handleProfileChange('email', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:border-navy outline-none" />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone</label>
                          <input type="tel" value={editFormData.phone} onChange={(e) => handleProfileChange('phone', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:border-navy outline-none" disabled />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Date of Birth</label>
                          <input type="date" value={editFormData.dob} onChange={(e) => handleProfileChange('dob', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:border-navy outline-none" disabled />
                      </div>
                      <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Address</label>
                          <textarea value={editFormData.address} onChange={(e) => handleProfileChange('address', e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl focus:border-navy outline-none"></textarea>
                      </div>
                  </div>
                  
                  <button onClick={saveProfile} disabled={isSavingProfile} className="w-full mt-6 py-3 bg-navy text-white font-bold rounded-xl hover:bg-teal transition-colors flex items-center justify-center gap-2">
                      {isSavingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
              </div>
          </div>
       )}
    </div>
  );
}
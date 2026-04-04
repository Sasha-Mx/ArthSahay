import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { jsPDF } from "jspdf";
import { addPdfHeader } from '../utils/pdfHelpers'; // Import shared PDF header utility


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
  isUrgentMedicalLoan: false, // Only relevant for Medical Loan, but kept for consistency
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

interface UserDocument {
  id: number;
  name: string;
  type: string; // e.g., 'ID', 'PDF', 'DOC'
  status: 'Verified' | 'Pending' | 'Action Required';
  date: string;
  isCustom?: boolean;
  isVerified: boolean; // Added for checklist
  extracted_data?: Record<string, any>; // To store simulated OCR data
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
            '--x': `${(Math.random() - 0.5) * 400}px`, // Custom property for X translation
            '--y': `${(Math.random() - 0.5) * 400}px`, // Custom property for Y translation
            '--delay': `${Math.random() * 2}s`, // Custom property for animation delay
            '--duration': `${2 + Math.random() * 2}s`, // Custom property for animation duration
            '--scale': `${0.5 + Math.random()}`, // Custom property for initial scale
          } as React.CSSProperties} // Cast to CSSProperties for custom properties
        />
      ))}
    </div>
  );
};


export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();

  // --- State: UI & Navigation ---
  const [activeTab, setActiveTab] = useState('profile-details'); // Default to showing profile summary
  const [welcomeToast, setWelcomeToast] = useState<string | null>(null);
  const [isConfettiActive, setIsConfettiActive] = useState(false);

  // --- State: User Profile ---
  const [user, setUser] = useState<UserProfile | null>(null);
  // `selectedLoanType` will remain tied to the dummy application for dashboard display
  const [selectedLoanType] = useState(dummyApplication.loanType); 
  // `documentsDisplayLoanType` will control the documents shown in the "My Documents" tab
  const [documentsDisplayLoanType, setDocumentsDisplayLoanType] = useState(dummyApplication.loanType);
  const [isUrgentMedicalLoan, setIsUrgentMedicalLoan] = useState(dummyApplication.isUrgentMedicalLoan); // New state for medical urgency

  // --- State: Modals ---
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  // --- State: Forms & Verification ---
  const [verificationOtp, setVerificationOtp] = useState<string[]>([]);
  const [verificationError, setVerificationError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationTarget, setVerificationTarget] = useState<'phone' | 'email' | 'resume' | 'aadhaar' | 'pan'>('phone');
  const [verificationStep, setVerificationStep] = useState<'input_id' | 'input_otp'>('input_otp');
  const [idInputValue, setIdInputValue] = useState('');

  // --- State: Documents ---
  const [activeUploadId, setActiveUploadId] = useState<number | null>(null);
  const [docs, setDocs] = useState<UserDocument[]>([]);
  const [showAddDocMenu, setShowAddDocMenu] = useState(false);

  // --- State: Edit Profile Form ---
  const [editFormData, setEditFormData] = useState<UserProfile | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  // --- Helper: Get Doc Type ---
  const getDocType = (name: string) => {
      const n = name.toLowerCase();
      if (n.includes("aadhaar") || n.includes("pan") || n.includes("id")) return "ID";
      if (n.includes("statement") || n.includes("slip") || n.includes("itr") || n.includes("form 16")) return "PDF";
      return "DOC";
  };

  // Memoized required documents based on `documentsDisplayLoanType`
  const requiredDocsForLoan = useMemo(() => LOAN_DOC_REQUIREMENTS[documentsDisplayLoanType] || [], [documentsDisplayLoanType]);

  // Document completion status
  const totalRequiredDocs = requiredDocsForLoan.length;
  const verifiedDocsCount = docs.filter(d => d.isVerified).length;
  const completionPercentage = totalRequiredDocs > 0 ? (verifiedDocsCount / totalRequiredDocs) * 100 : 0;

  useEffect(() => {
    // 1. Auth Check
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuth) {
      navigate('/login');
      return;
    }

    // 2. Load User Data
    const storedUserJson = localStorage.getItem('arthSahay_currentUser');
    if (!storedUserJson) {
        localStorage.removeItem('isAuthenticated');
        navigate('/login');
        return;
    }

    const userData = JSON.parse(storedUserJson);

    // 3. Initialize User Profile
    const profileData: UserProfile = {
        name: userData.name || "User",
        email: userData.email || "",
        emailVerified: false,
        phone: userData.phone || userData.mobile || "",
        phoneVerified: false,
        aadhaar: userData.aadhaar || "",
        aadhaarVerified: userData.aadhaarVerified || false,
        pan: userData.pan || "",
        panVerified: userData.panVerified || false,
        dob: userData.dob || "",
        creditScore: 785,
        address: userData.address || "Address Pending Update",
        avatar: userData.avatar,
        loanType: dummyApplication.loanType, // Always set to dummy application's type
        currentStage: dummyApplication.currentStage
    };

    setUser(profileData);
    setEditFormData(profileData);
    // `documentsDisplayLoanType` is initialized to dummyApplication.loanType default.
    // Set medical urgency if applicable to the dummy loan.
    if (dummyApplication.loanType === "Medical Loan") {
        setIsUrgentMedicalLoan(dummyApplication.isUrgentMedicalLoan);
    }

    // 5. Welcome Message
    if (location.state?.welcomeMessage) {
        setWelcomeToast(location.state.welcomeMessage);
        const timer = setTimeout(() => setWelcomeToast(null), 5000);
        return () => clearTimeout(timer);
    }
  }, [navigate, location]);


  // Effect to update documents when `documentsDisplayLoanType` changes
  useEffect(() => {
      if (!user) return;

      const vaultDocs = JSON.parse(localStorage.getItem('arthSahay_vault') || '[]');

      // Documents list is now based on `documentsDisplayLoanType`
      const currentRequiredList = LOAN_DOC_REQUIREMENTS[documentsDisplayLoanType] || [];

      const newDocs: UserDocument[] = currentRequiredList.map((docName, index) => {
          let status: 'Action Required' | 'Verified' | 'Pending' = 'Action Required';
          let date = '-';
          let isVerified = false;
          let extracted_data: Record<string, any> | undefined = undefined;

          // Auto-Check 1: Identity from Profile (ONLY IF VERIFIED)
          if (docName.includes("Aadhaar Card") && user.aadhaarVerified) {
              status = 'Verified';
              date = 'Linked via UIDAI';
              isVerified = true;
              extracted_data = {
                document_type: "Address Proof",
                uid_last_4: user.aadhaar ? user.aadhaar.replace(/\s/g, '').slice(-4) : 'XXXX',
                name: user.name,
                address: user.address,
                dob: user.dob
              };
          } else if (docName.includes("PAN Card") && user.panVerified) {
              status = 'Verified';
              date = 'Linked via NSDL';
              isVerified = true;
              extracted_data = {
                document_type: "Identity Proof",
                pan_number: user.pan || 'XXXXXXXXXX',
                name: user.name,
                dob: user.dob
              };
          } else {
              // Auto-Check 2: Check Vault
              const foundInVault = vaultDocs.find((d: any) => d.name === docName);
              if (foundInVault) {
                  status = 'Verified';
                  date = foundInVault.date;
                  isVerified = true;
                  extracted_data = foundInVault.extracted_data; // Preserve OCR data from vault
              }
          }

          return {
              id: index + Date.now(), // Ensure unique IDs
              name: docName,
              type: getDocType(docName),
              status: status,
              date: date,
              isCustom: false,
              isVerified: isVerified,
              extracted_data: extracted_data
          };
      });

      setDocs(newDocs);

      // Check for confetti burst on initial load for this loan type
      if (newDocs.length > 0 && newDocs.every(d => d.isVerified)) {
          triggerConfetti();
      } else {
        setIsConfettiActive(false); // Reset confetti if not all docs are verified
      }

  }, [documentsDisplayLoanType, user]); // Re-run when `documentsDisplayLoanType` or user changes


  // Trigger confetti burst
  const triggerConfetti = () => {
    setIsConfettiActive(true);
    setTimeout(() => setIsConfettiActive(false), 3000); // Confetti lasts 3 seconds
  };

  // --- Profile Image Handlers ---
  const handleProfileImageClick = () => {
    profileImageInputRef.current?.click();
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && user) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const updatedUser = { ...user, avatar: result };
        setUser(updatedUser);
        const currentUser = JSON.parse(localStorage.getItem('arthSahay_currentUser') || '{}');
        currentUser.avatar = result;
        localStorage.setItem('arthSahay_currentUser', JSON.stringify(currentUser));
        window.dispatchEvent(new Event('userUpdate'));
      };
      reader.readAsDataURL(file);
    }
  };

  // --- Edit Profile Handlers ---
  const handleEditProfileClick = () => {
      if(user) setEditFormData(user);
      setShowEditProfileModal(true);
  };

  const handleProfileChange = (field: keyof UserProfile, value: string) => {
      if (editFormData) {
          // @ts-ignore
          setEditFormData(prev => ({ ...prev, [field]: value }));
      }
  };

  const saveProfile = () => {
      if (!editFormData || !user) return;
      setIsSavingProfile(true);
      setTimeout(() => {
          const emailChanged = editFormData.email !== user.email;
          const phoneChanged = editFormData.phone !== user.phone;

          const updatedUser = {
              ...editFormData,
              emailVerified: emailChanged ? false : user.emailVerified,
              phoneVerified: phoneChanged ? false : user.phoneVerified,
              loanType: selectedLoanType, // Save selected loan type to user profile (this is the FIXED one)
          };

          setUser(updatedUser);

          const currentUser = JSON.parse(localStorage.getItem('arthSahay_currentUser') || '{}');
          Object.assign(currentUser, updatedUser); // Merge updates
          localStorage.setItem('arthSahay_currentUser', JSON.stringify(currentUser));
          window.dispatchEvent(new Event('userUpdate'));

          setIsSavingProfile(false);
          setShowEditProfileModal(false);
          setWelcomeToast("Profile updated successfully!");
          setTimeout(() => setWelcomeToast(null), 3000);
      }, 1000);
  };

  // --- Verification Handlers ---
  const handleVerifyEmail = () => {
      if (!user) return;
      setVerificationTarget('email');
      setVerificationStep('input_otp');
      setVerificationOtp(new Array(4).fill(''));
      setVerificationError('');
      setShowVerifyModal(true);
      setWelcomeToast(`OTP sent to ${user.email}`);
      setTimeout(() => setWelcomeToast(null), 3000);
  };

  const handleVerifyPhone = () => {
      if (!user) return;
      setVerificationTarget('phone');
      setVerificationStep('input_otp');
      setVerificationOtp(new Array(4).fill(''));
      setVerificationError('');
      setShowVerifyModal(true);
      setWelcomeToast(`OTP sent to ${user.phone}`);
      setTimeout(() => setWelcomeToast(null), 3000);
  };

  // --- Document Verification Handlers (Aadhaar/PAN) ---
  const handleVerifyDocument = (docName: string) => {
      setVerificationError('');
      if (docName.includes('Aadhaar Card')) {
          setVerificationTarget('aadhaar');
          if (user?.aadhaar) {
              setVerificationStep('input_otp');
              setIdInputValue(user.aadhaar);
          } else {
              setVerificationStep('input_id');
              setIdInputValue('');
          }
          setVerificationOtp(new Array(6).fill(''));
      } else if (docName.includes('PAN Card')) {
          setVerificationTarget('pan');
          if (user?.pan) {
              setVerificationStep('input_otp');
              setIdInputValue(user.pan);
          } else {
              setVerificationStep('input_id');
              setIdInputValue('');
          }
          setVerificationOtp(new Array(6).fill(''));
      } else {
          return;
      }
      setShowVerifyModal(true);
  };

  const handleSendIdOtp = () => {
      if (verificationTarget === 'aadhaar' && idInputValue.length < 12) {
          setVerificationError("Enter valid 12-digit Aadhaar Number");
          return;
      }
      if (verificationTarget === 'pan' && idInputValue.length < 10) {
          setVerificationError("Enter valid 10-char PAN Number");
          return;
      }

      setVerificationError('');
      setIsVerifying(true);

      setTimeout(() => {
          setIsVerifying(false);
          setVerificationStep('input_otp');
          setWelcomeToast(`OTP sent to mobile linked with ${verificationTarget.toUpperCase()}`);
          setTimeout(() => setWelcomeToast(null), 3000);
      }, 1000);
  };

  // --- Document Handlers ---
  const handleUploadClick = (id: number, docName: string) => {
      if (docName.includes('Aadhaar Card') || docName.includes('PAN Card')) {
          handleVerifyDocument(docName);
          return;
      }
      setActiveUploadId(id);
      fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && activeUploadId !== null) {
          // 1. UI Status Update
          const updatedDocs = docs.map(doc => {
              if (doc.id === activeUploadId) {
                  return { ...doc, status: 'Pending' as const, name: doc.name }; // Keep original required name
              }
              return doc;
          });
          setDocs(updatedDocs);

          // 2. Simulate Upload & Save to Vault
          setTimeout(() => {
              const uploadDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

              const docName = docs.find(d => d.id === activeUploadId)?.name;
              let extracted_data: Record<string, any> | undefined = undefined;

              // Simulate OCR extraction for key documents
              if (docName?.includes("Salary Slip")) {
                extracted_data = {
                  document_type: "Income Proof",
                  net_monthly_income: 85000 + Math.floor(Math.random() * 10000), // Dynamic income
                  employer_name: "Tata Consultancy Services", 
                  pay_period: `October ${new Date().getFullYear()}`,
                  deductions: 4500,
                  bank_name: "HDFC Bank"
                };
              } else if (docName?.includes("Bank Statement")) {
                extracted_data = {
                  document_type: "Financial Proof",
                  transactions_count: 120,
                  average_balance: 50000,
                  bank_name: "HDFC Bank"
                };
              }
              // For other documents, `extracted_data` remains undefined or generic


              const finalDocs = docs.map(doc => {
                  if (doc.id === activeUploadId) {
                      return {
                          ...doc,
                          status: 'Verified' as const,
                          isVerified: true, // Mark as verified
                          date: uploadDate,
                          extracted_data: extracted_data // Attach simulated OCR data
                      };
                  }
                  return doc;
              });
              setDocs(finalDocs);

              // Save to Global Vault (Simulated Persistence)
              if (docName) {
                  const vault = JSON.parse(localStorage.getItem('arthSahay_vault') || '[]');
                  // Remove old version if exists
                  const newVault = vault.filter((v: any) => v.name !== docName);
                  newVault.push({ 
                    name: docName, 
                    date: uploadDate, 
                    fileName: file.name, 
                    isVerified: true,
                    extracted_data: extracted_data // Save OCR data to vault
                  });
                  localStorage.setItem('arthSahay_vault', JSON.stringify(newVault));
              }

              setActiveUploadId(null);
              if(fileInputRef.current) fileInputRef.current.value = '';

              // Check for confetti burst
              if (finalDocs.every(d => d.isVerified)) {
                  triggerConfetti();
              }

          }, 1500);
      }
  };

  const handleAddDocument = (docName: string) => {
      const newDoc: UserDocument = {
          id: Date.now(),
          name: docName,
          type: getDocType(docName),
          status: 'Action Required',
          date: '-',
          isCustom: true,
          isVerified: false
      };
      setDocs([...docs, newDoc]);
      setShowAddDocMenu(false);
  };

  const handleDeleteDocument = (id: number) => {
      setDocs(docs.filter(doc => doc.id !== id));
  };

  // --- Application Handlers ---
  const handleContinueApplicationClick = () => {
      setVerificationTarget('resume');
      setVerificationStep('input_otp');
      setVerificationOtp(new Array(4).fill(''));
      setShowVerifyModal(true);
      setVerificationError('');
  };

  const handleViewDetailsClick = () => {
      setShowDetailsModal(true);
  };

  // --- OTP Logic ---
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
      if (isNaN(Number(element.value))) return;
      const newOtp = [...verificationOtp];
      newOtp[index] = element.value;
      setVerificationOtp(newOtp);
      if (element.nextSibling && element.value !== "") {
          (element.nextSibling as HTMLElement).focus();
      }
  };

  const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && verificationOtp[index] === "" && index > 0) {
        const prevInput = document.getElementById(`verify-otp-${index-1}`);
        prevInput?.focus();
    }
  };

  const verifyAndResume = () => {
      const requiredLength = verificationTarget === 'aadhaar' || verificationTarget === 'pan' ? 6 : 4;
      if (verificationOtp.join('').length !== requiredLength) {
          setVerificationError(`Please enter a valid ${requiredLength}-digit OTP`);
          return;
      }
      setIsVerifying(true);
      setTimeout(() => {
          setIsVerifying(false);
          setShowVerifyModal(false);

          if (user) {
            let updatedUser = { ...user };
            let extracted_data: Record<string, any> | undefined = undefined;

            if (verificationTarget === 'email') {
                updatedUser.emailVerified = true;
                setWelcomeToast("Email verified successfully!");
            } else if (verificationTarget === 'phone') {
                updatedUser.phoneVerified = true;
                setWelcomeToast("Phone number verified!");
            } else if (verificationTarget === 'resume') {
                // For resume, we assume phone is verified for proceeding to chat
                updatedUser.phoneVerified = true;
                // Navigate with dummyApplication details for context
                navigate('/chat', { state: { initialMessage: `Track my ${dummyApplication.loanType} application (ID: ${dummyApplication.applicationId}).` } });
            } else if (verificationTarget === 'aadhaar') {
                updatedUser.aadhaar = idInputValue;
                updatedUser.aadhaarVerified = true;
                setWelcomeToast("Aadhaar Verified Successfully!");
                extracted_data = {
                  document_type: "Address Proof",
                  uid_last_4: idInputValue.replace(/\s/g, '').slice(-4),
                  name: updatedUser.name,
                  address: updatedUser.address, // Use address from profile for simulation
                  dob: updatedUser.dob
                };
            } else if (verificationTarget === 'pan') {
                updatedUser.pan = idInputValue;
                updatedUser.panVerified = true;
                setWelcomeToast("PAN Verified Successfully!");
                extracted_data = {
                  document_type: "Identity Proof",
                  pan_number: idInputValue,
                  name: updatedUser.name,
                  dob: updatedUser.dob
                };
            }
            setUser(updatedUser); // Update state

            // Update Local Storage
            const currentUser = JSON.parse(localStorage.getItem('arthSahay_currentUser') || '{}');
            Object.assign(currentUser, updatedUser); // Merge updates
            localStorage.setItem('arthSahay_currentUser', JSON.stringify(currentUser));
            window.dispatchEvent(new Event('userUpdate')); // Notify Navbar etc.

            // Update Document List Status for Aadhaar/PAN
            if (verificationTarget === 'aadhaar' || verificationTarget === 'pan') {
                const docName = verificationTarget === 'aadhaar' ? 'Aadhaar Card' : 'PAN Card';
                setDocs(prev => {
                  const newDocs = prev.map(d => d.name.includes(docName) ? { 
                    ...d, 
                    status: 'Verified' as const, 
                    isVerified: true, 
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    extracted_data: extracted_data // Attach simulated OCR data
                  } : d);
                  
                  // Save OCR data to vault for Aadhaar/PAN as well
                  const vault = JSON.parse(localStorage.getItem('arthSahay_vault') || '[]');
                  const newVault = vault.filter((v: any) => v.name !== docName);
                  newVault.push({ 
                    name: docName, 
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), 
                    isVerified: true,
                    extracted_data: extracted_data // Save OCR data to vault
                  });
                  localStorage.setItem('arthSahay_vault', JSON.stringify(newVault));

                  // Check for confetti burst - only if ALL docs for the *currently displayed* loan type are verified
                  if (newDocs.length > 0 && newDocs.every(d => d.isVerified)) {
                      triggerConfetti();
                  }
                  return newDocs;
                });
            }
          }

          setTimeout(() => setWelcomeToast(null), 3000);
      }, 1500);
  };

  const getScoreStatus = (score: number) => {
    if (score >= 750) return { label: 'Excellent', color: 'text-green-600', stroke: '#16a34a', bg: 'bg-green-100', text: 'text-green-800' };
    if (score >= 700) return { label: 'Good', color: 'text-teal-600', stroke: '#0d9488', bg: 'bg-teal-100', text: 'text-teal-800' };
    if (score >= 650) return { label: 'Average', color: 'text-yellow-600', stroke: '#ca8a04', bg: 'bg-yellow-100', text: 'text-yellow-800' };
    return { label: 'Needs Attention', color: 'text-red-600', stroke: '#dc2626', bg: 'bg-red-100', text: 'text-red-800' };
  };

  const handleDownloadReport = () => {
    if (!user) return;
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
    if (user.dob) {
      const birth = new Date(user.dob);
      const diff = Date.now() - birth.getTime();
      const ageDate = new Date(diff);
      age = Math.abs(ageDate.getUTCFullYear() - 1970).toString();
    }

    const maskedAadhaar = user.aadhaar ? `XXXX XXXX ${user.aadhaar.replace(/\s/g, '').slice(-4)}` : 'Not Linked';
    const maskedPan = user.pan ? `XXXXX${user.pan.slice(5, 9)}${user.pan.slice(-1)}` : 'Not Linked';

    doc.text(`Name: ${user.name}`, 15, y);
    doc.text(`Age: ${age} Years`, 110, y);
    y += 10;
    doc.text(`Mobile: ${user.phone}`, 15, y);
    doc.text(`Email: ${user.email}`, 110, y);
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

    const scoreStatus = getScoreStatus(user.creditScore);

    doc.text(`CIBIL Score: ${user.creditScore}`, 15, y);

    doc.setTextColor(scoreStatus.color.replace('text-', '#')); // Convert Tailwind class to hex color
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

    const docsForPdf = LOAN_DOC_REQUIREMENTS[dummyApplication.loanType] || [];
    const vaultDocs = JSON.parse(localStorage.getItem('arthSahay_vault') || '[]');
    const verifiedDocsCountForPdf = docsForPdf.filter(docName =>
      vaultDocs.some((d: any) => d.name === docName && d.isVerified) || // Check for isVerified from vault
      (docName.includes("Aadhaar Card") && user.aadhaarVerified) ||
      (docName.includes("PAN Card") && user.panVerified)
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
      if (dummyApplication.loanType === "Medical Loan" && isUrgentMedicalLoan) {
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
    doc.text("Document Checklist Status (for " + documentsDisplayLoanType + ")", 15, y); // Indicate current loan type
    doc.line(15, y + 2, 195, y + 2);

    y += 15;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    docs.forEach(d => {
      checkPageBreak(8); // Space for one document line
      doc.setTextColor(50, 50, 50);
      doc.text(d.name, 15, y);

      const isDocVerified = vaultDocs.some((v: any) => v.name === d.name && v.isVerified) || // Corrected: d.name not d
        (d.name.includes("Aadhaar Card") && user.aadhaarVerified) ||
        (d.name.includes("PAN Card") && user.panVerified);

      if (isDocVerified) {
        doc.setTextColor(0, 128, 0); // Green
        doc.text("VERIFIED", 110, y);
      } else {
        doc.setTextColor(220, 38, 38); // Red
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

  // --- Render Helpers ---

  const renderUserSummaryCard = () => {
    if (!user) return null;
    return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative overflow-hidden">
        {/* Header: Avatar + Name + Edit */}
        <div className="flex items-start gap-4 mb-6">
            <div className="relative group cursor-pointer" onClick={handleProfileImageClick}>
                {user.avatar ? (
                    <img src={user.avatar} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 shadow-sm" />
                ) : (
                    <div className="w-16 h-16 rounded-full bg-navy text-white flex items-center justify-center font-bold text-2xl border-2 border-gray-100 shadow-sm">
                        {user.name.charAt(0)}
                    </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>
                </div>
            </div>
            <input type="file" ref={profileImageInputRef} onChange={handleProfileImageChange} className="hidden" accept="image/*" />

            <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-navy truncate">{user.name}</h3>
                <p className="text-xs text-gray-500">Member ID: AS-8829910</p>
            </div>

            <button
                onClick={handleEditProfileClick}
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
                        <button
                            onClick={handleVerifyEmail}
                            className="bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors whitespace-nowrap"
                        >
                            Verify OTP
                        </button>
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
                        <button
                            onClick={handleVerifyPhone}
                            className="bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-bold px-3 py-1.5 rounded-lg hover:bg-amber-200 transition-colors whitespace-nowrap"
                        >
                            Verify OTP
                        </button>
                    )}
                </div>
            </div>

            {/* Aadhaar Row */}
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="min-w-0 flex-1 mr-2">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Aadhaar Number</p>
                    <p className="text-sm font-medium text-navy tracking-widest font-mono">
                        {user.aadhaar ? `XXXX XXXX ${user.aadhaar.replace(/\s/g, '').slice(-4)}` : 'Not Linked'}
                    </p>
                </div>
                <div>
                     {user.aadhaarVerified ?
                        <span className="text-teal text-xs font-bold flex items-center gap-1">✓ Verified</span>
                        :
                        <button onClick={() => handleVerifyDocument('Aadhaar Card')} className="text-[10px] text-orange font-bold border border-orange px-2 py-1 rounded bg-orange/5 hover:bg-orange/10">
                            {user.aadhaar ? 'Verify' : 'Add'}
                        </button>
                     }
                </div>
            </div>

            {/* PAN Row */}
            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="min-w-0 flex-1 mr-2">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">PAN Number</p>
                    <p className="text-sm font-medium text-navy tracking-widest font-mono">
                        {user.pan ? `XXXXX${user.pan.slice(5,9)}${user.pan.slice(-1)}` : 'Not Linked'}
                    </p>
                </div>
                <div>
                     {user.panVerified ?
                        <span className="text-teal text-xs font-bold flex items-center gap-1">✓ Verified</span>
                        :
                        <button onClick={() => handleVerifyDocument('PAN Card')} className="text-[10px] text-orange font-bold border border-orange px-2 py-1 rounded bg-orange/5 hover:bg-orange/10">
                            {user.pan ? 'Verify' : 'Add'}
                        </button>
                     }
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="p-3 border border-gray-100 rounded-xl text-center bg-gray-50/50">
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Loan Type</p>
                    <p className="text-sm font-bold text-navy mt-0.5">{dummyApplication.loanType}</p> {/* Use dummyApplication */}
                </div>
                <div className="p-3 border border-gray-100 rounded-xl text-center bg-gray-50/50 relative overflow-hidden">
                    <div className={`absolute top-2 right-2 w-2 h-2 rounded-full ${dummyApplication.currentStage === 'Sanctioned' ? 'bg-[#00C896]' : dummyApplication.currentStage.includes('Pending') ? 'bg-amber-500' : 'bg-red-500'}`}></div>
                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Stage</p>
                    <p className="text-sm font-bold text-navy mt-0.5">{dummyApplication.currentStage}</p> {/* Use dummyApplication */}
                </div>
            </div>
        </div>
    </div>
  )};

  const renderCreditScoreCard = () => {
    if(!user) return null;
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
        <button onClick={handleDownloadReport} className={`mt-6 w-full py-2.5 ${scoreStatus.color} text-sm font-bold border border-current rounded-xl hover:bg-gray-50 transition-colors opacity-90 hover:opacity-100 flex items-center justify-center gap-2`}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg> View Detailed Report
        </button>
    </div>
  )};

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
            {dummyApplication.loanType === "Medical Loan" && isUrgentMedicalLoan && (
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
                <button onClick={handleContinueApplicationClick} className="flex-1 py-2.5 bg-navy text-white text-sm font-bold rounded-lg hover:bg-teal transition-colors shadow-sm">Continue Application</button>
                <button onClick={handleViewDetailsClick} className="px-4 py-2.5 bg-white border border-gray-200 text-navy text-sm font-bold rounded-lg hover:bg-gray-50">View Details</button>
            </div>
        </div>
    </div>
  );

  const renderDocumentsCard = () => (
    <div className="neo-card p-6 bg-white relative">
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
        <div className="flex justify-between items-center mb-4">
            <div>
                <h3 className="font-bold text-lg text-navy">My Documents</h3>
                <p className="text-xs text-gray-500">Required for {documentsDisplayLoanType}</p> {/* Use documentsDisplayLoanType here */}
            </div>
            <div className="flex items-center gap-3">
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${completionPercentage === 100 ? 'bg-green-100 text-green-700' : 'bg-orange/10 text-orange'}`}>
                    {verifiedDocsCount}/{totalRequiredDocs} Docs Uploaded
                </span>
                <div className="relative">
                    <button onClick={() => setShowAddDocMenu(!showAddDocMenu)} className="text-teal text-xs font-bold hover:bg-teal/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"><span>+</span> Add Document</button>
                    {showAddDocMenu && (
                        <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-10 animate-fadeInUp">
                            <div className="p-1">
                                {['Bank Statement', 'Form 16', 'Voter ID', 'Electricity Bill'].map((item) => (
                                    <button key={item} onClick={() => handleAddDocument(item)} className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-navy rounded-lg transition-colors">{item}</button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        
        {/* NEW: Loan Type Selector for Documents */}
        <div className="flex flex-wrap gap-2 mb-6 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <span className="text-xs font-bold text-navy uppercase tracking-wider mr-2 self-center">View Docs For:</span>
            {Object.keys(LOAN_DOC_REQUIREMENTS).map(loan => (
                <button
                    key={loan}
                    onClick={() => setDocumentsDisplayLoanType(loan)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${documentsDisplayLoanType === loan ? 'bg-navy text-white border-navy' : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200 hover:text-navy'}`}
                >
                    {loan}
                </button>
            ))}
        </div>

        {documentsDisplayLoanType === "Medical Loan" && (
            <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-xl mb-4">
                <div className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 accent-red-500" checked={isUrgentMedicalLoan} onChange={() => setIsUrgentMedicalLoan(!isUrgentMedicalLoan)} />
                    <span className="text-sm font-bold text-red-700">Mark as Urgent for Priority Processing</span>
                </div>
                {isUrgentMedicalLoan && <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-200 text-red-800 font-bold animate-pulse">Fast-Track On</span>}
            </div>
        )}
        <div className="space-y-3">
            {docs.map((doc, idx) => (
                <div key={doc.id} className={`flex items-center justify-between p-3 border rounded-lg transition-all duration-300 animate-fadeInUp ${doc.isVerified ? 'bg-teal/5 border-teal/30' : 'bg-white border-gray-100 hover:bg-gray-50'}`} style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold
                            ${doc.isVerified ? 'bg-teal/20 text-teal' : doc.status === 'Pending' ? 'bg-gray-200 text-gray-500 animate-pulse' : 'bg-orange/10 text-orange'}`}>
                            {doc.isVerified ? (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"></path></svg>
                            ) : (
                                doc.status === 'Pending' ? '...' : (doc.type || 'DOC')
                            )}
                        </div>
                        <div className="text-sm">
                            <p className={`font-semibold ${doc.isVerified ? 'text-navy' : 'text-gray-800'}`}>{doc.name}</p>
                            <p className="text-[10px] text-gray-400">{doc.isVerified ? `Verified on ${doc.date}` : 'Action Required'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {doc.isVerified ? (
                            <span className="text-teal text-xs font-bold bg-teal/10 px-2 py-1 rounded-full">✓ Verified</span>
                        ) : (
                            <button
                                onClick={() => handleUploadClick(doc.id, doc.name)}
                                className="text-white text-xs font-bold px-3 py-1 bg-orange rounded-full hover:bg-orangeDark transition-colors shadow-sm"
                            >
                                {(doc.name.includes('Aadhaar Card') || doc.name.includes('PAN Card')) ? 'Verify Now' : 'Upload Karo'}
                            </button>
                        )}
                        {doc.isCustom && doc.status !== 'Pending' && <button onClick={() => handleDeleteDocument(doc.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Remove">✕</button>}
                    </div>
                </div>
            ))}
        </div>
    </div>
  );

  const renderOffersSection = () => (
      <div className="space-y-6 animate-fadeInUp">
          <h2 className="text-2xl font-bold text-navy">Exclusive Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="neo-card p-6 bg-gradient-to-br from-teal/10 to-transparent border border-teal/20">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-teal text-white rounded-xl flex items-center justify-center text-2xl">✈️</div>
                        <span className="px-3 py-1 bg-teal text-white text-xs font-bold rounded-full">Pre-Approved</span>
                    </div>
                    <h3 className="font-bold text-xl text-navy">Travel Loan @ 10.99%</h3>
                    <p className="text-sm text-gray-600 mt-2 mb-4">Your credit history qualifies you for a special rate on travel loans up to ₹3 Lakhs.</p>
                    <button onClick={() => navigate('/chat', { state: { initialMessage: "I'm interested in the travel loan offer!" } })} className="text-teal text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all">
                        Apply Now <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </button>
               </div>
               <div className="neo-card p-6 bg-gradient-to-br from-orange/10 to-transparent border border-orange/20">
                    <div className="flex justify-between items-start mb-4">
                        <div className="w-12 h-12 bg-orange text-white rounded-xl flex items-center justify-center text-2xl">🎓</div>
                        <span className="px-3 py-1 bg-orange text-white text-xs font-bold rounded-full">New Product</span>
                    </div>
                    <h3 className="font-bold text-xl text-navy">Skill Upgradation Loan</h3>
                    <p className="text-sm text-gray-600 mt-2 mb-4">Get up to ₹1 Lakh for online courses or certifications. Invest in yourself!</p>
                    <button onClick={() => navigate('/chat', { state: { initialMessage: "Tell me more about Skill Upgradation Loans." } })} className="text-orange text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all">
                        Learn More <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
                    </button>
               </div>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-cream font-sans flex flex-col">
      <Navbar />
      <Confetti active={isConfettiActive} />

      {/* Welcome Toast */}
      {welcomeToast && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-navy text-white px-5 py-3 rounded-xl shadow-lg border border-white/20 animate-fadeInUp text-sm font-medium">
              {welcomeToast}
          </div>
      )}

      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header */}
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-navy mb-2 font-serif">My Profile</h1>
              <p className="text-gray-600 text-lg">Manage your details, documents & applications.</p>
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/chat', { state: { initialMessage: "i need to apply for a loan" } })}
                    className="flex items-center gap-2 px-5 py-2.5 bg-tataBlue text-white font-bold rounded-lg hover:bg-tataBlue/90 transition-colors shadow-md text-sm"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 1.523-.8 2.946-2.047 3.756V17.25a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75v-.089c-1.422.03-2.851.05-4.278.05-.984 0-1.897-.102-2.757-.27v.089a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75v-1.494A6.702 6.702 0 013 12c0-3.072 2.305-5.558 5.25-5.924V4.5A.75.75 0 019 3.75h1.5a.75.75 0 01.75.75v.75C12.986 5.376 14.167 5.76 15.192 6.31c.258.14.502.29.732.449a.75.75 0 01-.584 1.353m-4.089 9.88c-.8.016-1.6.027-2.4.027a4.524 4.524 0 01-1.096-.123V12a5.23 5.23 0 00-.641-2.653 4.5 4.5 0 01-.164-.296c.196-.264.5-.472.96-.636C8.86 7.602 10.373 7.5 12 7.5c1.17 0 2.28.161 3.313.454.43.125.848.28 1.242.465a.75.75 0 01-.791 1.258A6.785 6.785 0 0015.75 12h-.089c-.917.007-1.83.018-2.75.018-.707 0-1.408-.009-2.107-.027z" /></svg>
                    Chat with Expert
                </button>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-8">
            <button 
                onClick={() => setActiveTab('profile-details')} 
                className={`px-6 py-3 text-sm font-semibold border-b-2 ${activeTab === 'profile-details' ? 'border-navy text-navy' : 'border-transparent text-gray-500 hover:text-navy'}`}
            >
                My Profile Details
            </button>
            <button 
                onClick={() => setActiveTab('documents')}
                className={`px-6 py-3 text-sm font-semibold border-b-2 ${activeTab === 'documents' ? 'border-navy text-navy' : 'border-transparent text-gray-500 hover:text-navy'}`}
            >
                My Documents
            </button>
            <button 
                onClick={() => setActiveTab('offers')}
                className={`px-6 py-3 text-sm font-semibold border-b-2 ${activeTab === 'offers' ? 'border-navy text-navy' : 'border-transparent text-gray-500 hover:text-navy'}`}
            >
                Offers
            </button>
          </div>

          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (User Summary & Credit Score) - ALWAYS VISIBLE */}
            <div className="lg:col-span-1 space-y-8 animate-fadeInUp">
                {renderUserSummaryCard()}
                {renderCreditScoreCard()}
            </div>

            {/* Right Column (Dynamic Tabs) */}
            <div className="lg:col-span-2 space-y-8">
              {activeTab === 'profile-details' && ( 
                <div className="space-y-8 animate-fadeInUp">
                    <h2 className="text-2xl font-bold text-navy font-serif mb-6">My Profile Details</h2>
                    {renderStatsRow()}
                    {renderActiveApplicationCard()}
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="animate-fadeInUp">
                    {renderDocumentsCard()}
                </div>
              )}

              {activeTab === 'offers' && (
                <div className="animate-fadeInUp">
                    {renderOffersSection()}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* --- Modals --- */}
      {/* Verification Modal (OTP) */}
      {showVerifyModal && user && (
          <div className="fixed inset-0 z-50 bg-navy/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeInUp">
              <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl relative">
                  <button 
                    onClick={() => setShowVerifyModal(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  
                  {verificationStep === 'input_id' ? (
                      <>
                          <h3 className="text-xl font-bold text-navy text-center mb-2">{verificationTarget === 'aadhaar' ? 'Enter Aadhaar' : 'Enter PAN'}</h3>
                          <p className="text-sm text-gray-500 text-center mb-6">Please enter your {verificationTarget} number to proceed with OTP verification.</p>
                          <div className="mb-4">
                              <input
                                  type="text"
                                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-center text-navy font-bold focus:border-orange outline-none"
                                  value={idInputValue}
                                  onChange={(e) => setIdInputValue(e.target.value)}
                                  placeholder={verificationTarget === 'aadhaar' ? '1234 5678 9012' : 'ABCDE1234F'}
                              />
                          </div>
                          {verificationError && <p className="text-center text-red-500 text-xs font-bold mb-4">{verificationError}</p>}
                          <button onClick={handleSendIdOtp} disabled={isVerifying} className="w-full py-3 bg-navy text-white font-bold rounded-xl hover:bg-teal transition-colors flex items-center justify-center gap-2">
                              {isVerifying ? 'Sending OTP...' : 'Send OTP'}
                          </button>
                      </>
                  ) : (
                      <>
                          <h3 className="text-xl font-bold text-navy text-center mb-2">Verify OTP</h3>
                          <p className="text-sm text-gray-500 text-center mb-6">
                              Enter the OTP sent to {verificationTarget === 'email' ? user.email : (verificationTarget === 'phone' ? formatPhoneNumber(user.phone) : `mobile linked with ${verificationTarget.toUpperCase()}`)}.
                          </p>
                          <div className="flex justify-center gap-3 mb-6">
                                {Array.from({ length: verificationTarget === 'aadhaar' || verificationTarget === 'pan' ? 6 : 4 }).map((_, i) => (
                                    <input key={i} id={`verify-otp-${i}`} type="text" maxLength={1} className="w-12 h-12 border-2 border-gray-200 rounded-xl text-center text-xl font-bold focus:border-orange outline-none text-navy" value={verificationOtp[i]} onChange={(e) => handleOtpChange(e.target, i)} onKeyDown={(e) => handleBackspace(e, i)} />
                                ))}
                          </div>
                          {verificationError && <p className="text-center text-red-500 text-xs font-bold mb-4">{verificationError}</p>}
                          <button onClick={verifyAndResume} disabled={isVerifying} className="w-full py-3 bg-navy text-white font-bold rounded-xl hover:bg-teal transition-colors">
                              {isVerifying ? 'Verifying...' : 'Verify'}
                          </button>
                      </>
                  )}
              </div>
          </div>
      )}

      {/* Application Details Modal */}
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

       {/* Edit Profile Modal */}
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
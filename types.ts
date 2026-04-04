export type AgentRole = 'master' | 'sales' | 'verification' | 'underwriting' | 'sanction';

export interface Message {
  id: string;
  role: 'user' | 'model';
  agent?: AgentRole;
  text: string;
  timestamp: Date;
  isThinking?: boolean;
  action?: 'upload_request' | 'option_select' | 'download_link' | 'track_status' | 'download_rejection_link' | 'over_limit_options';
}

export interface LoanProduct {
  title: string;
  text: string;
  icon: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  status: 'pending' | 'loading' | 'completed';
}

export interface WorkerAgentInput {
  [key: string]: any;
}

// User Profile Interface
export interface UserProfile {
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

// User Document Interface
export interface UserDocument {
  id: number;
  name: string;
  type: string; // e.g., 'ID', 'PDF', 'DOC'
  status: 'Verified' | 'Pending' | 'Action Required';
  date: string;
  isCustom?: boolean;
  isVerified: boolean; // Added for checklist
  extracted_data?: Record<string, any>; // To store simulated OCR data
}
import React, { useState } from 'react';

const faqData = [
  {
    category: "Loan Sanction Process",
    items: [
      { q: "How long does sanction take?", a: "For pre-approved customers, sanction is often instant. For standard applications, it typically takes 2 to 24 hours after you submit all required documents." },
      { q: "What documents are needed for sanction?", a: "Standard requirements include KYC (Aadhaar & PAN), income proof (Bank Statements or Salary Slips), and a live selfie. We use digital fetch to minimize uploads." },
      { q: "Why can a loan get rejected even with a good CIBIL score?", a: "Even with high CIBIL, rejection can happen if your Debt-to-Income ratio is too high (existing high EMIs), your employment stability is unverified, or there are discrepancies in your documents." },
      { q: "What is the Key Fact Statement (KFS) and why is it important?", a: "The KFS is a mandatory summary sheet provided before you sign. It lists the All-Inclusive APR, total repayment amount, and grievance details so you can clearly understand the loan cost." },
      { q: "What is a sanction letter and what details does it contain?", a: "A sanction letter is an official approval offer. It contains the approved loan amount, interest rate, tenure, processing fees, and validty period of the offer." },
      { q: "Does pre-approved mean guaranteed approval?", a: "No. 'Pre-approved' means you meet the initial policy criteria. Final approval is subject to successful document verification and credit policy checks." }
    ]
  },
  {
    category: "Eligibility & Verification",
    items: [
      { q: "What are the basic eligibility requirements?", a: "Generally: Age 21-58 years, Minimum monthly income of ₹15,000, and a Credit Score of 700+. Work experience of at least 1 year is preferred." },
      { q: "Why do lenders check bank statements and salary slips?", a: "To verify that your salary is actually credited, check for steady income, and assess your spending habits/existing liabilities (Affordability Check)." },
      { q: "Why must the total EMI be below 50% of income?", a: "This is a safety guardrail. We ensure you have at least 50% of your income remaining for daily expenses and savings after paying all EMIs." },
      { q: "What is affordability analysis?", a: "It is a calculation lenders perform to estimate your 'surplus income' (Income minus Expenses minus Existing EMIs) to decide if you can afford a new loan." }
    ]
  },
  {
    category: "RBI Digital Lending Rules (2025)",
    items: [
      { q: "What is the Cooling-off period?", a: "It is a window (typically 3 days for loans ≥ 7 days) during which you can cancel the loan and return the principal. You only pay interest for the days you held the money, with no penalty." },
      { q: "How are data privacy and consent handled?", a: "Apps can only ask for need-based permissions. They cannot access your contact list or media gallery. You must explicitly consent to any data collection." },
      { q: "What is the rule on disbursals?", a: "Loans must be disbursed directly from the lender's bank account to your bank account. No third-party pool accounts are allowed." },
      { q: "What is Explainable AI?", a: "If an AI model rejects your loan, the lender must provide a basic reason (e.g., 'Low Credit Score' or 'High Leverage') rather than just saying 'Rejected'." },
      { q: "Are recovery agents allowed to harass customers?", a: "Absolutely not. RBI rules state recovery agents can only call between 8 AM and 7 PM, cannot use abusive language, and cannot harass friends/family." }
    ]
  },
  {
    category: "Charges, Penalties & Repayment",
    items: [
      { q: "How is interest calculated?", a: "Interest is usually calculated on a 'Reducing Balance' basis, meaning you pay interest only on the outstanding principal amount." },
      { q: "What is penal interest?", a: "If you miss an EMI, penal interest (e.g., 2% per month) is charged ONLY on the overdue amount, not on the entire loan balance." },
      { q: "What happens if an EMI bounces?", a: "Your bank may charge a bounce fee, the lender charges a late payment fee, and your CIBIL score will drop significantly." },
      { q: "Are prepayment or foreclosure charges allowed?", a: "For floating rate personal loans, RBI often mandates zero foreclosure charges. For fixed rates, a small fee (up to 4%) may apply." },
      { q: "How can I avoid penalties?", a: "Ensure your bank account has sufficient funds 2 days before the EMI date. Setting up an e-NACH (Auto-debit) is the safest method." }
    ]
  },
  {
    category: "Data Privacy & Security",
    items: [
      { q: "Is my Aadhaar data safe in digital lending?", a: "Yes. Regulated entities use 'Aadhaar Vaults' or masked Aadhaar to store data securely, complying with UIDAI and RBI norms." },
      { q: "How long is my data stored?", a: "Data is stored only for the duration required by law (typically 5-10 years for audit purposes), after which it must be deleted." },
      { q: "Can the app access my gallery or contacts?", a: "No. Under new RBI rules, digital lending apps are prohibited from accessing mobile contact lists or media galleries." },
      { q: "How can I revoke consent?", a: "You can revoke consent via the app's privacy settings or by emailing the lender's Grievance Officer. However, this may affect ongoing services." }
    ]
  },
  {
    category: "Customer Rights",
    items: [
      { q: "Can I reject a loan during the cooling-off period?", a: "Yes. You have the absolute right to exit the loan agreement within the cooling-off period by repaying the principal + proportionate APR." },
      { q: "Do I have a right to receive the KFS?", a: "Yes. You must receive the Key Fact Statement before the actual loan agreement. Always read it before entering the OTP." },
      { q: "How do I file a grievance?", a: "First, contact the lender's Nodal Officer. If unresolved after 30 days, file a complaint on the RBI CMS (Sachet) portal." }
    ]
  },
  {
    category: "Fraud Awareness",
    items: [
      { q: "How do I identify fake loan apps?", a: "Fake apps often have no website, use Gmail addresses for support, demand access to contacts, and harass you for repayment within 7 days." },
      { q: "Should I pay a 'processing fee' before the loan is sanctioned?", a: "NEVER. Legitimate lenders deduct the processing fee from the loan amount during disbursal. Asking for upfront cash is a scam." },
      { q: "How do I report a loan scam?", a: "Report it immediately to the National Cyber Crime Reporting Portal (cybercrime.gov.in) and your local police station." }
    ]
  },
  {
    category: "Loan Impact on CIBIL",
    items: [
      { q: "Does taking a loan affect my score?", a: "Applying causes a small temporary dip (hard inquiry). However, timely repayment increases your score over the long term." },
      { q: "How do missed EMIs affect my score?", a: "A single missed EMI can drop your score by 30-50 points and stays on your report for years, affecting future borrowing ability." },
      { q: "How can I improve my CIBIL after rejection?", a: "Wait 6 months before re-applying. clear existing dues, and ensure you don't use more than 30% of your credit card limit." }
    ]
  },
  {
    category: "General Awareness",
    items: [
      { q: "What is the difference between Sanction and Disbursal?", a: "Sanction is the approval of the loan. Disbursal is the actual transfer of money to your bank account." },
      { q: "Why do small document discrepancies cause delays?", a: "Lenders strictly follow KYC norms (AML/CFT). Name mismatches (e.g. 'Kumar' vs 'Kr.') can trigger manual verification checks." },
      { q: "Can lenders provide cash loans?", a: "No. Digital lenders must transfer funds digitally to the bank account. Cash disbursals are generally prohibited." },
      { q: "What is the difference between Secured vs Unsecured loans?", a: "Personal loans are usually 'Unsecured' (no collateral needed). Secured loans (like Gold/Home loans) require you to pledge an asset." },
      { q: "Who can apply for these loans?", a: "Salaried and Self-Employed individuals with proof of income. Students/Housewives typically need a co-borrower with income." }
    ]
  }
];

export default function RBIFaq() {
  const [activeCategory, setActiveCategory] = useState<string | null>("Loan Sanction Process");
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const toggleCategory = (cat: string) => {
    if (activeCategory === cat) {
      setActiveCategory(null);
    } else {
      setActiveCategory(cat);
      setOpenQuestion(null); // Reset open question when switching categories
    }
  };

  const toggleQuestion = (q: string) => {
    setOpenQuestion(openQuestion === q ? null : q);
  };

  return (
    <section className="bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-sm" id="faq-section">
      <div className="text-center mb-10">
        <span className="text-orange font-bold text-sm tracking-wider uppercase mb-2 block">Customer Knowledge Base</span>
        <h2 className="text-2xl md:text-3xl font-bold text-navy">
          Frequently Asked Questions on <br/>
          <span className="text-teal">Sanctions & RBI Guidelines (2025)</span>
        </h2>
        <p className="text-slate-500 mt-4 text-sm max-w-2xl mx-auto">
          Everything you need to know about your loan, your rights, and the regulations protecting you.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Categories Sidebar (Desktop) / Dropdown (Mobile) */}
        <div className="lg:w-1/4 space-y-2">
           <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Categories</h3>
           <div className="flex flex-col gap-2">
             {faqData.map((cat) => (
               <button
                 key={cat.category}
                 onClick={() => toggleCategory(cat.category)}
                 className={`text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex justify-between items-center
                   ${activeCategory === cat.category 
                     ? 'bg-navy text-white shadow-md' 
                     : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-navy'
                   }`}
               >
                 {cat.category}
                 <span className="lg:hidden">
                   {activeCategory === cat.category ? '−' : '+'}
                 </span>
                 <span className="hidden lg:block text-xs opacity-60">
                    {activeCategory === cat.category ? '●' : ''}
                 </span>
               </button>
             ))}
           </div>
        </div>

        {/* Questions Area */}
        <div className="lg:w-3/4">
           {faqData.map((cat) => (
             <div key={cat.category} className={`${activeCategory === cat.category ? 'block' : 'hidden lg:hidden'}`}>
                {/* Mobile Header for Category (Repeated for clarity in long scroll) */}
                <h3 className="lg:hidden text-xl font-bold text-navy mb-4 mt-6 border-b pb-2 border-slate-100">
                    {cat.category}
                </h3>

                <div className="space-y-4">
                  {cat.items.map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`border rounded-xl transition-all duration-300 overflow-hidden
                        ${openQuestion === item.q 
                          ? 'bg-teal/5 border-teal/30 shadow-sm' 
                          : 'bg-white border-slate-100 hover:border-slate-200'
                        }`}
                    >
                      <button
                        onClick={() => toggleQuestion(item.q)}
                        className="w-full text-left px-5 py-4 flex justify-between items-start gap-4"
                      >
                        <span className={`font-semibold text-sm md:text-base ${openQuestion === item.q ? 'text-teal-800' : 'text-navy'}`}>
                          {item.q}
                        </span>
                        <span className={`text-xl leading-none transition-transform duration-300 ${openQuestion === item.q ? 'rotate-180 text-teal' : 'text-slate-400'}`}>
                          ⌄
                        </span>
                      </button>
                      
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openQuestion === item.q ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                      >
                        <div className="px-5 pb-5 pt-0 text-slate-600 text-sm leading-relaxed">
                           {item.a}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
           ))}

           {/* Empty State / Instruction if no category selected (Desktop only edge case) */}
           {!activeCategory && (
             <div className="hidden lg:flex h-full items-center justify-center text-slate-400 text-sm italic">
               Select a category to view questions.
             </div>
           )}
        </div>
      </div>
    </section>
  );
}
import { GoogleGenAI, Chat, FunctionDeclaration, Type } from "@google/genai";

// --- MOCK DATA FOR TEST MODE ---
const MOCK_CUSTOMERS = [
  {
    "cust_id": "CUST001",
    "name": "Rahul Verma",
    "age": 30,
    "city": "Mumbai",
    "phone": "9876543210",
    "email": "rahul.verma@example.com",
    "kyc": { "aadhaar": "Verified", "pan": "Verified", "address": "Verified" },
    "financials": { "income": 85000, "employment_type": "Salaried", "existing_emis": 5000, "bank_health": "Good" },
    "credit": { "cibil": 782, "inquiries_6m": 1, "delinquency": "No" },
    "loan_offer": { "pre_approved_limit": 500000, "suggested_roi": 11.5, "recommended_tenure": 60, "offer_date": "2025-01-10" }
  },
  {
    "cust_id": "CUST002",
    "name": "Anjali Mehta",
    "age": 27,
    "city": "Delhi",
    "phone": "9890011223",
    "email": "anjali.mehta@example.com",
    "kyc": { "aadhaar": "Verified", "pan": "Verified", "address": "Verified" },
    "financials": { "income": 62000, "employment_type": "Salaried", "existing_emis": 8000, "bank_health": "Good" },
    "credit": { "cibil": 738, "inquiries_6m": 2, "delinquency": "No" },
    "loan_offer": { "pre_approved_limit": 350000, "suggested_roi": 12.25, "recommended_tenure": 48, "offer_date": "2025-01-08" }
  },
  {
    "cust_id": "CUST003",
    "name": "Sameer Khan",
    "age": 36,
    "city": "Bengaluru",
    "phone": "9811122233",
    "email": "sameer.khan@example.com",
    "kyc": { "aadhaar": "Verified", "pan": "Verified", "address": "Verified" },
    "financials": { "income": 95000, "employment_type": "Self-Employed", "existing_emis": 15000, "bank_health": "Average" },
    "credit": { "cibil": 724, "inquiries_6m": 3, "delinquency": "No" },
    "loan_offer": { "pre_approved_limit": 400000, "suggested_roi": 13.0, "recommended_tenure": 36, "offer_date": "2025-01-05" }
  },
  {
    "cust_id": "CUST004",
    "name": "Priya Sharma",
    "age": 29,
    "city": "Pune",
    "phone": "9765432109",
    "email": "priya.sharma@example.com",
    "kyc": { "aadhaar": "Verified", "pan": "Verified", "address": "Verified" },
    "financials": { "income": 120000, "employment_type": "Salaried", "existing_emis": 0, "bank_health": "Good" },
    "credit": { "cibil": 812, "inquiries_6m": 1, "delinquency": "No" },
    "loan_offer": { "pre_approved_limit": 800000, "suggested_roi": 10.99, "recommended_tenure": 60, "offer_date": "2025-01-02" }
  },
  {
    "cust_id": "CUST005",
    "name": "Vikas Patel",
    "age": 42,
    "city": "Ahmedabad",
    "phone": "9822334455",
    "email": "vikas.patel@example.com",
    "kyc": { "aadhaar": "Verified", "pan": "Verified", "address": "Verified" },
    "financials": { "income": 45000, "employment_type": "Salaried", "existing_emis": 7000, "bank_health": "Average" },
    "credit": { "cibil": 705, "inquiries_6m": 2, "delinquency": "No" },
    "loan_offer": { "pre_approved_limit": 200000, "suggested_roi": 13.5, "recommended_tenure": 36, "offer_date": "2024-12-28" }
  },
  {
    "cust_id": "CUST006",
    "name": "Neha Gupta",
    "age": 33,
    "city": "Jaipur",
    "phone": "9844556677",
    "email": "neha.gupta@example.com",
    "kyc": { "aadhaar": "Verified", "pan": "Verified", "address": "Verified" },
    "financials": { "income": 70000, "employment_type": "Self-Employed", "existing_emis": 12000, "bank_health": "Good" },
    "credit": { "cibil": 748, "inquiries_6m": 3, "delinquency": "No" },
    "loan_offer": { "pre_approved_limit": 300000, "suggested_roi": 12.75, "recommended_tenure": 48, "offer_date": "2024-12-30" }
  },
  {
    "cust_id": "CUST007",
    "name": "Arjun Nair",
    "age": 31,
    "city": "Kochi",
    "phone": "9887766554",
    "email": "arjun.nair@example.com",
    "kyc": { "aadhaar": "Verified", "pan": "Verified", "address": "Verified" },
    "financials": { "income": 38000, "employment_type": "Salaried", "existing_emis": 9000, "bank_health": "Average" },
    "credit": { "cibil": 668, "inquiries_6m": 4, "delinquency": "Yes" },
    "loan_offer": { "pre_approved_limit": 150000, "suggested_roi": 15.0, "recommended_tenure": 24, "offer_date": "2024-12-20" }
  },
  {
    "cust_id": "CUST008",
    "name": "Sonal Desai",
    "age": 26,
    "city": "Surat",
    "phone": "9833221100",
    "email": "sonal.desai@example.com",
    "kyc": { "aadhaar": "Verified", "pan": "Verified", "address": "Verified" },
    "financials": { "income": 52000, "employment_type": "Salaried",
      "existing_emis": 4000, "bank_health": "Good" },
    "credit": { "cibil": 732, "inquiries_6m": 1, "delinquency": "No" },
    "loan_offer": { "pre_approved_limit": 250000, "suggested_roi": 12.9, "recommended_tenure": 48, "offer_date": "2025-01-06" }
  },
  {
    "cust_id": "CUST009",
    "name": "Imran Sheikh",
    "age": 39,
    "city": "Hyderabad",
    "phone": "9877001122",
    "email": "imran.sheikh@example.com",
    "kyc": { "aadhaar": "Verified", "pan": "Verified", "address": "Verified" },
    "financials": { "income": 88000, "employment_type": "Self-Employed", "existing_emis": 10000, "bank_health": "Good" },
    "credit": { "cibil": 759, "inquiries_6m": 2, "delinquency": "No" },
    "loan_offer": { "pre_approved_limit": 600000, "suggested_roi": 11.9, "recommended_tenure": 60, "offer_date": "2025-01-03" }
  },
  {
    "cust_id": "CUST010",
    "name": "Kavita Reddy",
    "age": 34,
    "city": "Chennai",
    "phone": "9866112233",
    "email": "kavita.reddy@example.com",
    "kyc": { "aadhaar": "Verified", "pan": "Verified", "address": "Verified" },
    "financials": { "income": 30000, "employment_type": "Salaried", "existing_emis": 8000, "bank_health": "Poor" },
    "credit": { "cibil": 642, "inquiries_6m": 5, "delinquency": "Yes" },
    "loan_offer": { "pre_approved_limit": 120000, "suggested_roi": 15.5, "recommended_tenure": 24, "offer_date": "2024-12-18" }
  }
];

// --- SYSTEM PROMPTS ---

const PROMPTS = {
  MASTER: `
You are the **Master Orchestrator & Relationship Manager** for *ArthSahay Smart Loans*.
You talk like a **top-performing digital sales officer** at a fintech. 💼

**YOUR PERSONA:** Professional, clear, reassuring, and efficient.

**CORE DIRECTIVE:**
1.  **Analyze User Input:** Determine if the user is entering **TEST MODE**, **UPLOADING A FILE**, or **STANDARD MODE**.
2.  **Test Mode Trigger:** User input contains "Test Mode CUST...".
3.  **Upload Trigger:** User input starts with "[SYSTEM: User uploaded file: ...]".
4.  **Standard Mode Trigger:** All other inputs (e.g., "I need a loan", "Apply", "Help", "i need to apply for a loan", "Track application").

---

### 📂 PROTOCOL 1: HANDLING FILE UPLOADS
**Trigger:** Input contains "[SYSTEM: User uploaded file: [Filename]]"

1.  **Acknowledge & Scan:** 
    *   Call \`run_ocr_agent\` with the filename immediately.
    *   **CRITICAL:** If you were waiting for a specific document (e.g., "Salary Slip"), you **MUST** pass that name as the \`doc_type\` parameter to the tool. This ensures the scanner recognizes it even if the filename is generic.
2.  **Report Verification:**
    *   Say: "✅ **Received & Verified:** [File Name] 📄"
    *   "Type: **[Doc Type from OCR]** confirmed."
3.  **CHECK GAP ANALYSIS & PROCEED:**
    *   **CRITICAL LOGIC:** Treat this uploaded document as **PRESENT** and **VERIFIED**.
    *   Combine it with any existing \`vault_documents\` you know of.
    *   **IF** the uploaded document satisfies the pending requirement (or if all key docs are now present):
        *   **PROCEED TO AMOUNT REQUEST.** Do not ask for the same document again.
        *   Say: "Great! That completes your documentation. 📂✅"
        *   **ASK:** "To generate your exact offer, please tell me: **How much loan amount do you need** and for **how many months/years**? 💰"
    *   **ELSE** (Still missing OTHER documents):
        *   Say: "Thanks for that. To complete your application, I still need: [Missing Document Name]."
        *   Append \`[ACTION: UPLOAD_REQUEST]\`.

---

### 🟢 PROTOCOL 2: TEST MODE (Mock Data)
**Trigger:** User says "Test Mode CUST[ID]" (e.g., "Test Mode CUST001").

1.  **Identity Lookup:** Call \`fetch_test_identity\` with the ID.
    *   *Response:* "Test Mode Active 🟢. Found profile for **[Name]**. Please tell me the **Loan Amount** and **Tenure**."
2.  **Consent:** Ask for consent to fetch KYC.
3.  **KYC Fetch:** Call \`fetch_test_kyc_data\`.
4.  **Sales Offer:** Call \`consult_sales_agent\` using the fetched financial data.
    *   **CRITICAL RESPONSE FORMAT:**
        1.  **Display Fetched Details:**
            "📊 **Profile & KYC Fetched:**
            • **Name:** [Name]
            • **Mobile:** [Phone]
            • **PAN:** [PAN Status/Number]
            • **Aadhaar:** [Aadhaar Status/Number]
            • **Income:** ₹[Income]
            • **CIBIL:** [Score]"
        2.  **Check for Over Limit:**
            *   **IF** \`exceeds_limit\` is true in the Sales Agent response:
                *   Say: "⚠️ **Note:** The amount you requested (₹[Requested Amount]) exceeds your pre-approved limit. Based on your profile, here are the best offers I can sanction immediately:"
                *   Display the offers.
                *   Say: "You can select one of these safe offers, or if you insist on the higher amount, we can proceed with a manual evaluation (which may risk rejection)."
                *   Append \`[ACTION: OVER_LIMIT_OPTIONS]\`.
            *   **ELSE**:
                *   Present Offers normally.
                *   Append \`[ACTION: OPTION_SELECT]\`.
5.  **Underwriting & Decision:**
    *   **Trigger:** User selects Option 1/2 OR says "Proceed with original request".
    *   **Action:** Call \`consult_underwriting_agent\`.
        *   If "Proceed with original request": Pass the *original* requested amount (which exceeds the limit).
        *   If "Option 1" or "Option 2": Pass the *safe* amount from the option.
    *   **Logic:**
        *   **IF REJECTED** (Likely if original high amount was chosen):
            1. Call \`generate_rejection_letter\` with the failure reasons.
            2. Say: "I regret to inform you that your request for **₹[Amount]** has been **declined**. 📉\n\n**Reason:** [Main Reason]\n\nPlease download the formal rejection letter below."
            3. Append \`[ACTION: DOWNLOAD_REJECTION_LINK]\`.
        *   **IF APPROVED** (Likely if safe option chosen):
            1. Call \`generate_sanction_letter\`.
            2. Say: "🎉 **Congratulations! Loan Approved.** \n\nI have generated the sanction letter based on the test profile. Please download it below."
            3. Append \`[ACTION: DOWNLOAD_LINK]\`.

---

### 🔵 PROTOCOL 3: STANDARD MODE (Real User Profile)
**Trigger:** Default flow for users (e.g., "I need to apply for a loan", "Hi").

**STEP 1: SMART PROFILE CHECK**
*   **IMMEDIATELY** call \`consult_profile_vault\` to see what the user already has in their dashboard.
*   **CHECK CONTEXT:** If \`active_loan_type\` is present, acknowledge it. "I see you have an active **[active_loan_type]** application."

**STEP 2: LOAN TYPE SELECTION**
*   **IF** \`active_loan_type\` was found in Step 1, **SKIP** this step and assume that loan type.
*   **ELSE**, if the user has NOT specified a loan type, you MUST ask: "Which type of loan would you like to apply for today? 🤔"
    *   **Personal Loan** 👤
    *   **Home Loan** 🏠
    *   **Auto Loan** 🚗
    *   **Education Loan** 🎓
    *   **Medical Loan** 🏥

**STEP 3: DOCUMENT CHECK (Vault Analysis)**
*   Once the **Loan Type** is known (e.g., Personal Loan):
*   **ACTION:** Review the \`vault_documents\` list retrieved in STEP 1.
*   **Required Docs for Personal Loan:** Salary Slip (or Income Proof), Bank Statement, PAN, Aadhaar.
*   **CONDITION A: MISSING DOCUMENTS**
    *   If any key document is missing from the vault:
        *   Say: "To proceed with your **[Loan Type]**, I see we are missing a few documents in your dashboard. 📂"
        *   List the missing items clearly (e.g., "• Salary Slip", "• Bank Statement").
        *   Say: "Please upload these documents so I can verify your profile instantly."
        *   Append \`[ACTION: UPLOAD_REQUEST]\`.
        *   **STOP** and wait for user upload (Protocol 1).
*   **CONDITION B: ALL DOCUMENTS PRESENT**
    *   If all key documents are found in \`vault_documents\`:
        *   Say: "Perfect! 🌟 I see all required documents (Identity & Income proof) are already verified in your vault. 📂✅"
        *   **IMMEDIATE NEXT STEP:** Ask for the amount.
        *   Say: "**How much loan amount** do you need and for **what tenure**? 💰"

**STEP 4: VERIFICATION & DATA CHAINING**
*   **Trigger:** User provides Amount & Tenure.
*   **Action 1 (KYC Check):** 
    *   Call \`consult_kyc_agent\`.
    *   **CRITICAL:** Pass arguments explicitly:
        *   \`vault_data\`: The \`vault_documents\` list from Step 1.
        *   \`user_input_phone\`: The phone number from profile.
        *   \`user_input_address\`: The address from profile.
*   **Action 2 (Chain to Sales):**
    *   Once the KYC Agent returns the **Verified Income**, IMMEDIATELY Call \`consult_sales_agent\` using this **Verified Income** and the **User's Requested Amount**.
    *   *Do not wait for user input between these steps. Chain the tool calls.*

**STEP 5: FULL PROFILE & OFFER PRESENTATION**
*   **Trigger:** Sales Agent has returned offers.
*   **Action:** Construct a comprehensive response covering both verification and offers.
    
    **RESPONSE FORMAT (STRICTLY FOLLOW THIS):**
    
    1.  **VERIFIED KYC SUMMARY (MUST DISPLAY FIRST):**
        "✅ **KYC & Financials Verified**
        • **Name:** [Name from KYC]
        • **Aadhaar:** [Last 4 digits] (Verified)
        • **PAN:** [Masked] (Verified)
        • **Address:** [City/State from Profile]
        • **CIBIL Score:** [Score from Profile] (Excellent)
        • **Verified Monthly Income:** ₹[Income returned by KYC Agent] 💵"

    2.  **CHECK FOR OVER LIMIT & OFFERS:**
        *   **IF** \`exceeds_limit: true\`:
            *   **Warning:** "⚠️ **Note:** The amount you requested (₹[Requested Amount]) exceeds your eligible pre-approved limit based on your verified income. Here are the best offers I can sanction immediately:"
            *   **Present Offers:** Show the options generated by the Sales Agent.
            *   **Ask:** "You can select one of these safe offers, or if you insist on the higher amount, we can proceed with a **manual evaluation** (which may risk rejection)."
            *   **Action:** Append \`[ACTION: OVER_LIMIT_OPTIONS]\`.
        *   **ELSE**:
            *   **Present Offers:** Show the options generated by the Sales Agent.
            *   **Action:** Append \`[ACTION: OPTION_SELECT]\`.

**STEP 6: UNDERWRITING & SANCTION**
*   **Trigger:** User selects an Option OR says "Proceed with original request".
*   **Action:** Call \`consult_underwriting_agent\`.
    *   **SCENARIO A:** User selected Safe Option -> Pass Safe Amount.
    *   **SCENARIO B:** User chose "Proceed with original" -> Pass Original (High) Amount.
*   **Outcome:**
    *   **CASE A: APPROVED** -> Call \`generate_sanction_letter\`. Say "Congratulations!" and append \`[ACTION: DOWNLOAD_LINK]\`.
    *   **CASE B: REJECTED** -> Call \`generate_rejection_letter\`. Say "Declined due to [Reason]" and append \`[ACTION: DOWNLOAD_REJECTION_LINK]\`.

---

**UI TRIGGER REFERENCE (Append exactly as needed):**
*   \`[ACTION: UPLOAD_REQUEST]\` -> Shows upload button.
*   \`[ACTION: OPTION_SELECT]\` -> Shows Option 1 / Option 2 buttons.
*   \`[ACTION: OVER_LIMIT_OPTIONS]\` -> Shows Option 1 / Option 2 / Proceed Original buttons.
*   \`[ACTION: DOWNLOAD_LINK]\` -> Shows Sanction Download button.
*   \`[ACTION: DOWNLOAD_REJECTION_LINK]\` -> Shows Rejection Download button.
  `,

  SALES: `
You are the **Sales Offer Agent** for ArthSahay Smart Loans.
You don't speak to the user, but you generate the **sales logic and numbers** for the Master Agent.

**Your Job:**
Translate raw income + profile into clear, attractive loan offers.

**Input:** { cust_id, requested_amount, tenure_months, pre_approved_limit }

**CRITICAL RULE: RESPECT THE REQUESTED AMOUNT**
1. **Determine Exceeds Limit:**
   - **IF** \`requested_amount\` > \`pre_approved_limit\`:
     - Set \`exceeds_limit\`: **true**.
     - **Option 1 MUST BE CAPPED**: Generate Option 1 for the \`pre_approved_limit\` (the maximum we can give).
     - Label it: "**Option 1 - Max Eligible Limit**".
     - Benefit: "Maximum amount available based on current eligibility. (Requested amount exceeds limit)."
   - **IF** \`requested_amount\` <= \`pre_approved_limit\`:
     - Set \`exceeds_limit\`: **false**.
     - **Option 1 (User Request)**: Match the User's \`requested_amount\`.
     - Label it: "**Option 1 - Requested Offer**".
     - Benefit: "Matches your exact requirement."

2. **Option 2 (Smart Alternate):**
   - Provide a balanced alternative.
   - If Option 1 was the requested amount, make this one "Max Eligibility" or "Lower EMI".
   - If Option 1 was Max Eligibility (because request was too high), make this "Instant Comfort" (lower amount/EMI).

**Output JSON Structure:**
{
  "exceeds_limit": Boolean,
  "customer_segment": "String",
  "logic_summary": "String",
  "options": [
    { 
      "label": "Option 1", 
      "amount": Number, 
      "tenure": Number, 
      "emi": Number, 
      "rate": Number,
      "benefit": "String"
    },
    { 
      "label": "Option 2", 
      "amount": Number, 
      "tenure": Number, 
      "emi": Number, 
      "rate": Number,
      "benefit": "String"
    }
  ],
  "recommendation_text": "String"
}

**Tone Rules for your text fields:**
*   Always positive: "designed around your income", "to keep you comfortable".
  `,

  KYC: `
You are the **KYC Agent**.
Input: { vault_data, user_input_phone, user_input_address, income_source_doc }

**CORE LOGIC:**
1. Check the input details.
2. **INCOME GENERATION RULE:** If 'income' is not explicitly provided in the input, YOU MUST GENERATE IT.
   - Assume the user's uploaded documents (like Salary Slip/Bank Statement) were valid.
   - **Generate a random verified Net Monthly Income between ₹92,000 and ₹1,45,000.**
   - Do not mention it is random. Present it as "Verified from Income Proof".

**Output JSON Structure:**
{
  "status": "Verified",
  "name": "String",
  "pan": "String",
  "address": "String",
  "verified_income": Number,
  "notes": ["String"]
}

**Style Guide for your 'notes' field:**
*   Keep it short, bullet-based, and visual.
*   Focus on "what we are checking" and "why it keeps things safe".
*   Example: "✅ Phone matches CRM records."
*   Example: "✅ Income verified via digital bank statement fetch."
  `,

  OCR: `
You are the **OCR & Document Intelligence Agent**.
Input: { file_name, file_type, context }
Output: JSON containing structured extracted data.
  `,

  UNDERWRITING: `
You are the **Underwriting Agent**.
Input: { cust_profile, request, vault_documents }

**CRITICAL LOGIC:**
1. Check **CIBIL Score**. If < 650, Recommendation = "Reject".
2. Check **Affordability**.
   - Calculate EMI for the *requested amount*.
   - If (Existing EMIs + New EMI) > (Net Income * 0.60), this is HIGH RISK.
   - If the request is for the "Original Amount" and it exceeds the pre-approved limit significantly (e.g. > 20% higher), Recommendation = "Reject".
   - Reason: "Requested amount exceeds affordability capacity (FOIR > 60%)."

**Style Guide for your 'reasons' field:**
*   Use 3–4 bullets.
*   Format: Score, Obligations, LTI, Decision.
*   Example: "• CIBIL score: **750** (Excellent) 🌟"

**Output JSON Structure (Strict):**
{
  "recommendation": "approve",
  "max_amount": Number,
  "risk_band": "String",
  "reasons": ["String"]
}
  `,

  COMPLIANCE: `
You are the **Compliance Guardrail Agent**.
Input: { uw_recommendation, risk_band, amount, kyc_status }
Hard Rules: Full KYC required. Customer Consent required.

**Output JSON Structure:**
{
  "final_status": "approved",
  "remarks": "String"
}
  `,

  SANCTION: `
SANCTION LETTER GENERATOR (ArthSahay NBFC)

You are the Sanction Letter Generator Agent for ArthSahay (Tata Capital ecosystem).
Your role is to generate a clear, professional, compliant, NBFC-style sanction letter using only the structured loan details provided by the underwriting system.

Important Behaviour Guidelines

Format the letter professionally, with clear sections, headers, tables, and bullet points.

Use formal financial language appropriate for Indian NBFC compliance.

Insert no imaginary numbers. Use ONLY the values provided in the user input.

Do NOT mention that AI generated the letter.

Do NOT invent loan features, fees, or regulatory clauses.

Keep tone formal, precise, and legally safe.

---

Required Output Format

The letter must contain the following sections in order:

---

1. Header Section

Include:

ArthSahay Branding

“A Tata Capital Initiative”

Date of Issue

Sanction Reference Number

Customer Name

Customer City (if provided)

Application ID (if provided)

---

2. Subject Line

Subject: Sanction Letter for Personal Loan Facility

---

3. Opening Paragraph

Acknowledge approval based on the customer’s application and credit assessment.

---

4. Sanction Summary Table (Core of the Letter)

Create a neat summary table with:

Term / Condition	Details

Product	Personal Loan (Unsecured)
Sanctioned Amount	₹X
Tenure	Y months
Rate of Interest	R% p.a. (Reducing Balance)
Monthly EMI	₹E
Processing Fee	₹PF
Total Amount Payable	₹T
Prepayment Charges	e.g., Nil after 12 EMIs, else 4%
Disbursement Mode	Bank Transfer to verified account

---

5. Compliance & KYC Summary

Include:

KYC Status: Verified

PAN Masked

Aadhaar Masked

CIBIL Score (ONLY if provided)

---

6. Key Terms & Conditions

Bullet points such as:

Cooling-off period

Penal interest for overdue EMIs

Validity of sanction letter

Mandate registration requirement

Digital agreement requirement


(Again — NO invented values, use generic descriptions unless provided.)

---

7. Closing

Include:

A warm closing line

Statement that the document is system-generated

NBFC registered office address (generic, safe placeholder)

---

Safety Rules

Never generate legal commitments beyond the data given.

Never specify any regulatory reference unless already provided.

Do not hallucinate: if a field is missing, say “Not Provided”.

---

Final Output Requirement

Return the sanction letter as clean, formatted plain text, ready to convert into PDF.
  `,

  REJECTION: `
You are the Rejection Letter Agent for ArthSahay 24/7 (Tata Capital).
Generate a formal, empathetic, RBI-compliant Loan Rejection Letter using ONLY the fields provided in the user JSON input.
Do NOT invent any missing values. If any key data is missing (name, application ID, date), leave it blank instead of guessing.

Your output MUST follow this exact structure:

------------------------------------------------------------
REJECTION LETTER
ArthSahay 24/7 – A Tata Capital Initiative

Reference No.: {{APPLICATION_ID}}
Date: {{DATE}}
Applicant Name: {{FULL_NAME}}
Registered Mobile: {{MOBILE}}

Subject: Loan Application Status – Not Approved at This Time

Dear {{FULL_NAME}},

Thank you for applying for a {{LOAN_TYPE}} with Tata Capital through ArthSahay 24/7. After completing our credit assessment and internal policy checks, we regret to inform you that we are unable to approve your loan application at this moment.

Your application could not be approved due to the following reason(s):

- {{REASON_1}}
- {{REASON_2}}
- {{REASON_3}}

(Only include reasons provided in the input JSON. Do NOT generate or assume any new reasons.)

Please note that these decisions are made in accordance with Tata Capital’s internal credit policies and the RBI’s Digital Lending Guidelines. Our goal is to ensure safe, responsible borrowing aligned with your financial well-being.

Next Steps You Can Consider:
- Apply with a lower loan amount
- Try increasing the loan tenure to reduce EMI
- Improve credit score by clearing outstanding dues and maintaining timely repayments
- Re-apply after {{REAPPLY_WAIT_PERIOD}} days (if provided in input data)

This is not a reflection of your worthiness as a customer, and we would be glad to re-evaluate your loan once the above conditions improve.

For any assistance, you may contact us or revisit your ArthSahay dashboard to view personalized tips for improving eligibility.

Warm regards,
ArthSahay 24/7
Tata Capital Financial Services Limited

(Computer-generated document. Signature not required.)
------------------------------------------------------------

OUTPUT FORMAT REQUIREMENTS:
- Use clean, well-formatted Markdown.
- Do not add marketing language. Keep it empathetic and factual.
- Do not invent loan amounts, scores, or unverified details.
- Include only the reasons and data points explicitly provided by the caller.
- At the end, add a machine-readable metadata block in JSON:
{
 "application_id": "...",
 "generated_at": "<ISO timestamp>",
 "template_version": "v1.0",
 "data_used_keys": [...]
}
  `
};

// --- TOOL DEFINITIONS ---

const profileVaultTool: FunctionDeclaration = {
    name: "consult_profile_vault",
    description: "Access the user's secure profile vault to retrieve verified personal details, active loan application type, uploaded documents, and OCR-extracted data.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            user_id: { type: Type.STRING, description: "Optional user ID to fetch" }
        }
    }
};

const ocrTool: FunctionDeclaration = {
    name: "run_ocr_agent",
    description: "Run OCR on a document to extract structured data.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            file_name: { type: Type.STRING },
            doc_type: { type: Type.STRING, description: "e.g. Salary Slip, Aadhaar. PROVIDE THIS if you requested a specific document." }
        },
        required: ["file_name"]
    }
};

const salesTool: FunctionDeclaration = {
  name: "consult_sales_agent",
  description: "Consult the Sales Agent to calculate EMI and check pre-approved limits.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      cust_id: { type: Type.STRING },
      requested_amount: { type: Type.NUMBER },
      tenure_months: { type: Type.NUMBER },
      pre_approved_limit: { type: Type.NUMBER },
      interest_rate_annual: { type: Type.NUMBER }
    },
    required: ["requested_amount", "tenure_months"]
  }
};

const kycTool: FunctionDeclaration = {
  name: "consult_kyc_agent",
  description: "Consult the KYC Agent to verify phone and address.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      cust_id: { type: Type.STRING },
      crm_phone: { type: Type.STRING },
      crm_address: { type: Type.STRING },
      user_phone: { type: Type.STRING },
      user_address: { type: Type.STRING },
      vault_data: { 
          type: Type.ARRAY, 
          items: {
              type: Type.OBJECT,
              properties: {
                  name: { type: Type.STRING },
                  type: { type: Type.STRING },
                  extracted_data: { type: Type.OBJECT }
              }
          }
      }
    },
    required: ["user_phone", "user_address"]
  }
};

const underwritingTool: FunctionDeclaration = {
  name: "consult_underwriting_agent",
  description: "Consult the Underwriting Agent to assess risk and eligibility.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      loan_type: { type: Type.STRING },
      cust_profile: { 
        type: Type.OBJECT,
        properties: {
           age: { type: Type.NUMBER },
           city_tier: { type: Type.STRING },
           employment_type: { type: Type.STRING },
           net_income_monthly: { type: Type.NUMBER },
           existing_emi_total: { type: Type.NUMBER },
           credit_score: { type: Type.NUMBER }
        }
      },
      request: {
        type: Type.OBJECT,
        properties: {
            requested_amount: { type: Type.NUMBER },
            tenure_months: { type: Type.NUMBER },
            pre_approved_limit: { type: Type.NUMBER }
        }
      }
    },
    required: ["cust_profile", "request"]
  }
};

const complianceTool: FunctionDeclaration = {
  name: "consult_compliance_guardrail",
  description: "Consult Compliance Agent to validate decision against RBI rules.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      uw_recommendation: { type: Type.STRING },
      risk_band: { type: Type.STRING },
      score: { type: Type.NUMBER },
      foir: { type: Type.NUMBER },
      amount: { type: Type.NUMBER },
      pre_approved_limit: { type: Type.NUMBER },
      emi: { type: Type.NUMBER },
      net_salary_monthly: { type: Type.NUMBER },
      customer_consent: { type: Type.BOOLEAN },
      kyc_status: { type: Type.STRING },
      kfs_shown_and_accepted: { type: Type.BOOLEAN }
    },
    required: ["uw_recommendation", "amount", "score"]
  }
};

const sanctionTool: FunctionDeclaration = {
  name: "generate_sanction_letter",
  description: "Generate a formal sanction letter text.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      cust_name: { type: Type.STRING },
      cust_id: { type: Type.STRING },
      loan_amount: { type: Type.NUMBER },
      tenure_months: { type: Type.NUMBER },
      emi: { type: Type.NUMBER },
      interest_rate_annual: { type: Type.NUMBER },
      risk_band: { type: Type.STRING },
      sanction_id: { type: Type.STRING }
    },
    required: ["cust_name", "loan_amount", "emi"]
  }
};

const rejectionTool: FunctionDeclaration = {
  name: "generate_rejection_letter",
  description: "Generate a formal rejection letter with specific reasons.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      APPLICATION_ID: { type: Type.STRING },
      DATE: { type: Type.STRING },
      FULL_NAME: { type: Type.STRING },
      MOBILE: { type: Type.STRING },
      LOAN_TYPE: { type: Type.STRING },
      REASON_1: { type: Type.STRING },
      REASON_2: { type: Type.STRING },
      REASON_3: { type: Type.STRING },
      REAPPLY_WAIT_PERIOD: { type: Type.STRING }
    },
    required: ["APPLICATION_ID", "FULL_NAME", "REASON_1"]
  }
};

// NEW: Step 1 of Test Mode
const fetchIdentityTool: FunctionDeclaration = {
    name: "fetch_test_identity",
    description: "Step 1 of Test Mode: Fetches basic identity (name, city) for a mock customer ID.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            cust_id: { type: Type.STRING }
        },
        required: ["cust_id"]
    }
};

// NEW: Step 2 of Test Mode (KYC)
const fetchKycTool: FunctionDeclaration = {
    name: "fetch_test_kyc_data",
    description: "Step 2 of Test Mode: Fetches sensitive KYC, Financials, and Credit data. Only call after user consent.",
    parameters: {
        type: Type.OBJECT,
        properties: {
            cust_id: { type: Type.STRING }
        },
        required: ["cust_id"]
    }
};


let chatSession: Chat | null = null;

// --- WORKER AGENT EXECUTOR ---

async function runWorkerAgent(systemInstruction: string, input: any): Promise<any> {
    
    // --- SPECIAL LOCAL HANDLERS (No API Call Needed) ---
    if (systemInstruction === "PROFILE_VAULT_FETCH") {
        // Read from Browser LocalStorage
        try {
            const userStr = localStorage.getItem('arthSahay_currentUser');
            const vaultStr = localStorage.getItem('arthSahay_vault');
            
            const userData = userStr ? JSON.parse(userStr) : {};
            
            // Fix: correctly parse the vault structure. 
            // The Profile Dashboard saves it as { documents: [] }, but sometimes it might be just [] in older versions.
            let vaultDocs = [];
            if (vaultStr) {
                const parsedVault = JSON.parse(vaultStr);
                if (Array.isArray(parsedVault)) {
                    vaultDocs = parsedVault;
                } else if (parsedVault && Array.isArray(parsedVault.documents)) {
                    vaultDocs = parsedVault.documents;
                } else if (typeof parsedVault === 'object') {
                     // Handle case where it might be just an object but we treat as list
                     vaultDocs = Object.values(parsedVault); 
                }
            }
            
            console.log("Vault Fetched:", vaultDocs); // Debugging

            // Consolidate data for the Master Agent
            return {
                status: "success",
                profile: {
                    name: userData.name,
                    phone: userData.phone,
                    email: userData.email,
                    address: userData.address, // Added address to be available for Master Agent
                    aadhaar_last_4: userData.aadhaar ? userData.aadhaar.replace(/\s/g, '').slice(-4) : null,
                    pan: userData.pan || null,
                    active_loan_type: userData.loanType || null, // Active loan type from profile
                    credit_score: userData.creditScore || 785, // Retrieve CIBIL score
                    is_verified: {
                        aadhaar: !!userData.aadhaarVerified, 
                        pan: !!userData.panVerified,
                        phone: userData.phoneVerified || false
                    }
                },
                documents: vaultDocs.map((d: any) => ({
                    name: d.name,
                    status: d.status || "VERIFIED",
                    type: d.type,
                    uploaded_on: d.timestamp || d.date,
                    // Crucial: Pass the pre-extracted OCR data to the Master Agent
                    ocr_data: d.extracted_data || null 
                }))
            };
        } catch (e) {
            console.error("Vault Access Error:", e);
            return { status: "error", message: "Failed to read local profile vault." };
        }
    }

    if (systemInstruction === "FETCH_IDENTITY") {
        const custId = input.cust_id?.toUpperCase();
        const data = MOCK_CUSTOMERS.find(c => c.cust_id === custId);
        if (data) {
            return { status: "success", data: { name: data.name, city: data.city, id: data.cust_id } };
        } else {
            return { status: "error", message: "Customer ID not found in Mock DB." };
        }
    }

    if (systemInstruction === "FETCH_KYC") {
        const custId = input.cust_id?.toUpperCase();
        const data = MOCK_CUSTOMERS.find(c => c.cust_id === custId);
        if (data) {
            return { 
                status: "success", 
                kyc: data.kyc,
                financials: data.financials,
                credit: data.credit,
                loan_offer: data.loan_offer
            };
        }
        return { status: "error", message: "Data lookup failed." };
    }

    if (systemInstruction === "OCR_SIMULATION") {
        // Simulating an OCR process for a file uploaded DURING chat
        // We now match the robust schema of the Dashboard OCR so chat-uploaded files look the same
        const fileName = (input.file_name || "Document").toLowerCase();
        
        // Use provided doc_type hint if available, otherwise default logic
        let doc_type = input.doc_type || "Document"; 
        let extracted_data = {};

        // If explicitly told it's a Salary Slip OR filename matches
        if (doc_type === "Salary Slip" || fileName.includes("salary") || fileName.includes("slip")) {
            doc_type = "Salary Slip";
            extracted_data = {
                document_type: "Income Proof",
                net_monthly_income: 85000, 
                employer_name: "Tata Consultancy Services", 
                pay_period: "September 2025",
                deductions: 4500,
                bank_name: "HDFC Bank"
            };
        } else if (fileName.includes("aadhaar") || doc_type.includes("Aadhaar")) {
            doc_type = "Aadhaar Card";
            extracted_data = {
                document_type: "Address Proof",
                uid_last_4: "9012",
                name: "User Verified",
                address: "Flat 402, Lotus Tower, Mumbai, MH",
                dob: "15-08-1992"
            };
        } else if (fileName.includes("pan") || doc_type.includes("PAN")) {
            doc_type = "PAN Card";
            extracted_data = {
                document_type: "Identity Proof",
                pan_number: "ABCDE1234F",
                name: "User Verified",
                dob: "15-08-1992"
            };
        } else {
            extracted_data = { summary: "Document scanned successfully. Pending manual review." };
        }

        return {
            doc_type: doc_type,
            extracted_data: extracted_data,
            confidence: 0.98,
            status: "success"
        };
    }

    // --- STANDARD API WORKERS ---
    const API_KEY = process.env.API_KEY; // Explicitly declare API_KEY
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    try {
        // Check if it is the Sanction Letter or Rejection Letter Generator, which expects raw text output
        // Updated check for Rejection Letter
        if (systemInstruction.includes("SANCTION LETTER GENERATOR") || systemInstruction.includes("Rejection Letter Agent")) {
             const textResp = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: JSON.stringify(input),
                config: { systemInstruction: systemInstruction }
             });
             return { letter_text: textResp.text };
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: JSON.stringify(input),
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: 'application/json'
            }
        });
        
        let responseText = response.text || "{}";
        if (!responseText.trim()) return {}; // Safety check for empty response
        
        // --- Enhanced JSON Cleaning Strategy ---
        // 1. Remove markdown fences
        let cleanJson = responseText.replace(/```json\n?|\n?```/g, "").trim();
        
        // 2. Extract first valid JSON object block { ... } to avoid trailing garbage
        const firstBrace = cleanJson.indexOf('{');
        const lastBrace = cleanJson.lastIndexOf('}');
        if (firstBrace !== -1 && lastBrace !== -1) {
            cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
        }

        try {
            // Attempt standard parse first
            return JSON.parse(cleanJson);
        } catch (parseError) {
            console.warn("Standard JSON parse failed, attempting repairs on:", cleanJson);
            
            // 3. Fix unquoted keys (e.g., { key: "value" } -> { "key": "value" })
            cleanJson = cleanJson.replace(/([{,]\s*)([a-zA-Z0-9_]+?)\s*:/g, '$1"$2":');
            
            // 4. Remove trailing commas (e.g., { "a": 1, } -> { "a": 1 })
            cleanJson = cleanJson.replace(/,(\s*[}\]])/g, '$1');

            // 5. Improved fix for missing commas between properties.
            // Captures the end of a value (quote, digit, letter for true/false/null, or closing bracket)
            // followed by whitespace, followed by a quote (start of next key).
            cleanJson = cleanJson.replace(/([\}\]"]|[0-9a-z])\s+(?=")/gi, '$1,');

            return JSON.parse(cleanJson);
        }

    } catch (e) {
        console.error("Worker Agent Error", e);
        return { error: "Agent failed to process request due to technical error." };
    }
}

// --- MAIN SERVICE ---

export const initializeChat = (): void => {
  // Ensure API_KEY is explicitly read and available.
  const API_KEY = process.env.API_KEY; 
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: PROMPTS.MASTER,
      tools: [
        { functionDeclarations: [profileVaultTool, ocrTool, salesTool, kycTool, underwritingTool, complianceTool, sanctionTool, rejectionTool, fetchIdentityTool, fetchKycTool] }
      ]
    },
  });
};

export const sendMessageToGemini = async (
    message: string, 
    onAgentAction?: (agentName: string, data?: any) => void // Updated to include data parameter
): Promise<string> => {
  if (!chatSession) initializeChat();
  if (!chatSession) return "System Error: Chat not initialized.";

  try {
    let result = await chatSession.sendMessage({ message });
    
    // Loop to handle function calls (Multi-Agent Orchestration)
    let functionCalls = result.functionCalls;
    let loopCount = 0;
    const MAX_LOOPS = 6;

    while (functionCalls && functionCalls.length > 0 && loopCount < MAX_LOOPS) {
        loopCount++;
        const responseParts = [];

        for (const call of functionCalls) {
            console.log(`[Master] Calling Tool: ${call.name}`, call.args);
            
            let workerResponse: any = {};
            
            // Dispatch to Worker Agents
            if (call.name === 'consult_profile_vault') {
                 if (onAgentAction) onAgentAction("Profile Vault");
                 workerResponse = await runWorkerAgent("PROFILE_VAULT_FETCH", call.args);
            } else if (call.name === 'fetch_test_identity') {
                 if (onAgentAction) onAgentAction("Master Agent"); // Step 1: Basic Lookup
                 workerResponse = await runWorkerAgent("FETCH_IDENTITY", call.args);
            } else if (call.name === 'fetch_test_kyc_data') {
                 if (onAgentAction) onAgentAction("Verification Agent, Underwriting Agent"); // Step 3: Trigger BOTH Agents
                 workerResponse = await runWorkerAgent("FETCH_KYC", call.args);
            } else if (call.name === 'run_ocr_agent') {
                 if (onAgentAction) onAgentAction("OCR Agent");
                 workerResponse = await runWorkerAgent("OCR_SIMULATION", call.args);
            } else if (call.name === 'consult_sales_agent') {
                if (onAgentAction) onAgentAction("Sales Agent");
                workerResponse = await runWorkerAgent(PROMPTS.SALES, call.args);
            } else if (call.name === 'consult_kyc_agent') {
                if (onAgentAction) onAgentAction("Verification Agent");
                workerResponse = await runWorkerAgent(PROMPTS.KYC, call.args);
            } else if (call.name === 'consult_underwriting_agent') {
                if (onAgentAction) onAgentAction("Underwriting Agent");
                workerResponse = await runWorkerAgent(PROMPTS.UNDERWRITING, call.args);
            } else if (call.name === 'consult_compliance_guardrail') {
                if (onAgentAction) onAgentAction("Compliance Agent");
                workerResponse = await runWorkerAgent(PROMPTS.COMPLIANCE, call.args);
            } else if (call.name === 'generate_sanction_letter') {
                if (onAgentAction) onAgentAction("Sanction Generator");
                workerResponse = await runWorkerAgent(PROMPTS.SANCTION, call.args);
                // Pass structured data to UI instead of text
                if (onAgentAction && call.args) {
                    onAgentAction("SanctionData", call.args);
                }
            } else if (call.name === 'generate_rejection_letter') {
                if (onAgentAction) onAgentAction("Sanction Generator"); // Reusing same UI agent name for simplicity
                workerResponse = await runWorkerAgent(PROMPTS.REJECTION, call.args);
                // Pass structured rejection data to UI
                if (onAgentAction && call.args) {
                    onAgentAction("RejectionData", call.args);
                }
            }

            console.log(`[Worker] Response:`, workerResponse);

            // Construct part for function response
            responseParts.push({
                functionResponse: {
                    name: call.name,
                    response: workerResponse,
                    id: call.id
                }
            });
        }

        // Send tool results back to Master via sendMessage (standard Chat API)
        // We pass an object with 'parts' to satisfy the ContentUnion requirement
        result = await chatSession.sendMessage({ message: responseParts });
        
        functionCalls = result.functionCalls;
    }

    return result.text || "I processed the data but have no response.";

  } catch (error) {
    console.error("Master Agent Error:", error);
    return "I am currently experiencing high traffic on the Tata Capital network. Please try again.";
  }
};
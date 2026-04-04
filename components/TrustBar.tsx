import React from 'react';

export default function TrustBar() {
  return (
    <div className="bg-navy border-t border-white/10 py-6 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 text-sm font-medium text-gray-300">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full border border-teal flex items-center justify-center">
             <svg className="w-3 h-3 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          Bank-grade encryption
        </div>
        <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-gray-700"></div>
        <div className="flex items-center gap-3">
           <div className="w-5 h-5 rounded-full border border-teal flex items-center justify-center">
             <svg className="w-3 h-3 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          PCI-ready infrastructure
        </div>
        <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-gray-700"></div>
        <div className="flex items-center gap-3">
           <div className="w-5 h-5 rounded-full border border-teal flex items-center justify-center">
             <svg className="w-3 h-3 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
          </div>
          RBI guideline-aligned flow
        </div>
      </div>
    </div>
  );
}
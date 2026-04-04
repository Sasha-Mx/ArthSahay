import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-navy text-white pt-20 pb-10 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group" onClick={() => window.scrollTo(0,0)}>
              {/* Refined Logo Icon */}
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center relative overflow-hidden border border-white/10 shadow-lg group-hover:bg-white/10 transition-colors">
                 <div className="absolute inset-0 bg-gradient-to-br from-teal/20 to-transparent"></div>
                 <span className="font-serif text-xl font-bold text-white relative z-10 leading-none mt-1 tracking-tighter">AS</span>
                 <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-teal rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                 <div className="flex items-center gap-2">
                    <h2 className="text-xl font-serif font-bold tracking-tight leading-none text-white">ArthSahay</h2>
                    <span className="px-1.5 py-0.5 rounded bg-teal/10 border border-teal/20 text-[10px] font-bold text-teal tracking-wider font-sans">24/7</span>
                 </div>
                 <span className="text-[9px] text-gray-400 mt-1 uppercase tracking-widest">Part of Tata Capital</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              ArthSahay 24/7 is a digital initiative by Tata Capital Financial Services Limited, bringing AI-driven transparency to lending.
            </p>
            <div className="flex gap-4">
               {/* Social placeholders */}
               <a href="#" onClick={(e) => e.preventDefault()} className="w-8 h-8 rounded-full bg-white/10 hover:bg-teal transition-colors cursor-pointer flex items-center justify-center font-serif font-bold">f</a>
               <a href="#" onClick={(e) => e.preventDefault()} className="w-8 h-8 rounded-full bg-white/10 hover:bg-teal transition-colors cursor-pointer flex items-center justify-center font-serif font-bold">in</a>
               <a href="#" onClick={(e) => e.preventDefault()} className="w-8 h-8 rounded-full bg-white/10 hover:bg-teal transition-colors cursor-pointer flex items-center justify-center font-serif font-bold">𝕏</a>
            </div>
          </div>

          {/* Links Column 1 */}
          <div>
            <h3 className="font-bold text-lg mb-6 font-serif">Our Offerings</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-teal transition-colors">Personal Loans</a></li>
              <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-teal transition-colors">Home Loans</a></li>
              <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-teal transition-colors">Business Loans</a></li>
              <li><a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-teal transition-colors">Loan Against Property</a></li>
            </ul>
          </div>

           {/* Links Column 2 */}
           <div>
            <h3 className="font-bold text-lg mb-6 font-serif">Corporate</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo(0,0); }} className="hover:text-teal transition-colors">About Tata Capital</a></li>
              <li><a href="#testimonials" onClick={(e) => scrollToSection(e, 'testimonials')} className="hover:text-teal transition-colors">Success Stories</a></li>
              <li><a href="#faq" onClick={(e) => scrollToSection(e, 'faq')} className="hover:text-teal transition-colors">Help & Support</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-teal transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Trust/Contact Column */}
          <div>
            <h3 className="font-bold text-lg mb-6 font-serif">Registered Office</h3>
            <div className="text-gray-400 text-sm mb-6 leading-relaxed">
                11th Floor, Tower A, Peninsula Business Park,<br/>
                Ganpatrao Kadam Marg, Lower Parel,<br/>
                Mumbai - 400013
            </div>
            
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                 <div className="flex items-center gap-2 mb-2">
                     <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center text-navy font-bold text-[10px]">RBI</div>
                     <span className="font-bold text-xs text-white">RBI Reg. No. N-13.01925</span>
                 </div>
                 <p className="text-[10px] text-gray-400">Tata Capital Financial Services Limited</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
           <p>© 2025 Tata Capital Financial Services Limited. All rights reserved.</p>
           <div className="flex gap-6 mt-4 md:mt-0">
               <a href="#security" onClick={(e) => scrollToSection(e, 'security')} className="hover:text-white">Privacy Policy</a>
               <a href="#security" onClick={(e) => scrollToSection(e, 'security')} className="hover:text-white">Terms of Use</a>
               <a href="#security" onClick={(e) => scrollToSection(e, 'security')} className="hover:text-white">Fair Practices Code</a>
           </div>
        </div>
      </div>
    </footer>
  );
}
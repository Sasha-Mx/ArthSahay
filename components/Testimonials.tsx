import React from 'react';

const stories = [
  {
    name: "Ravi Kumar",
    location: "Lucknow",
    loanType: "Wedding Loan",
    story: "Arre wah! Maine kabhi socha nahi tha loan lena itna simple hoga. Beti ki shaadi ke liye funds chahiye the aur ArthSahay ne bas kuch hi minto mein loan pass kar diya. Bilkul tension-free!",
    rating: 5,
    avatarColor: "bg-teal"
  },
  {
    name: "Simran Kaur",
    location: "Chandigarh",
    loanType: "Business Growth",
    story: "Bhai, kamaal ki service hai! Business badhane ke liye paise chahiye the. Paperwork ka koi jhanjhat nahi, sab kuch phone pe hi ho gaya. Thank you Tata Capital!",
    rating: 5,
    avatarColor: "bg-tealDark"
  },
  {
    name: "Priya Sharma",
    location: "Mumbai",
    loanType: "Medical Emergency",
    story: "I needed urgent funds for a medical emergency. The AI assistant helped me check eligibility in minutes, and the money was in my account instantly. Truly a lifesaver!",
    rating: 5,
    avatarColor: "bg-orange"
  },
  {
    name: "Rahul Verma",
    location: "Bangalore",
    loanType: "Home Renovation",
    story: "The transparency is amazing. No hidden fees, clear terms, and the app is very easy to use. I highly recommend ArthSahay for quick loans.",
    rating: 4,
    avatarColor: "bg-navy"
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 px-6 bg-cream relative overflow-hidden">
       {/* Decorative blobs */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-teal/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
       <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
           <span className="text-orange font-bold text-sm tracking-wider uppercase mb-2 block">Happy Stories</span>
           <h2 className="text-4xl font-bold text-navy">Trusted by millions across India</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stories.map((story, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1 relative group flex flex-col">
                    <div className="absolute top-6 right-6 text-5xl font-serif text-gray-100 group-hover:text-teal/10 transition-colors">"</div>
                    
                    <div className="flex items-center gap-1 mb-4 text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                             <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={i < story.rating ? "currentColor" : "none"} stroke="currentColor" className="w-4 h-4">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={i < story.rating ? 0 : 1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.53.044.739.676.354.965l-4.12 3.083a.562.562 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.12-3.084c-.386-.289-.176-.921.354-.965l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                             </svg>
                        ))}
                    </div>

                    <p className="text-gray-600 italic mb-6 relative z-10 leading-relaxed text-sm min-h-[100px]">
                        "{story.story}"
                    </p>

                    <div className="flex items-center gap-3 mt-auto">
                        <div className={`w-10 h-10 rounded-full ${story.avatarColor} text-white flex items-center justify-center font-bold text-sm shrink-0`}>
                            {story.name.charAt(0)}
                        </div>
                        <div>
                            <h4 className="font-bold text-navy text-sm leading-tight">{story.name}</h4>
                            <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">{story.location} • {story.loanType}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
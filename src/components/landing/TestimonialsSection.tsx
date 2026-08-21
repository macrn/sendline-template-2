import React from 'react';
import { Star } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Julian Hayes',
      role: 'Head of Growth, Nordic Apparel',
      quote: 'We migrated 850,000 subscribers from Klaviyo in 48 hours. Not only did we cut our ESP bill by 60%, but our open rates climbed to 54.2% thanks to Sendline’s curated typography and warm IP pools.',
      metric: '+18.4% Revenue Lift'
    },
    {
      name: 'Elena Rostova',
      role: 'CTO, ModernForm',
      quote: 'Sub-30ms latency on transactional magic links is unheard of. Our developers love the clean Node.js SDK and our marketing team builds editorial campaigns without touching a line of code.',
      metric: '22ms Average Latency'
    },
    {
      name: 'Marcus Vance',
      role: 'Founder, Velocity Coffee',
      quote: 'The Screener inbox completely eliminated inbound cold email noise for our team. Plus, rewarding subscribers with points right in their order emails generated $14,000 in repeat sales.',
      metric: '4.8x ROI on Loyalty'
    }
  ];

  return (
    <section className="py-24 bg-white border-t border-stone-200 relative">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-stone-500 font-sans">
            Stories
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-stone-950 tracking-tight mt-3 font-sans">
            Loved by modern founders, engineers, and designers.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[#FAF8F5] border border-stone-200 flex flex-col justify-between space-y-6 hover:border-stone-300 transition-all"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500 gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                    ))}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-200/70 text-stone-800">
                    {t.metric}
                  </span>
                </div>

                <p className="text-sm text-stone-700 leading-relaxed font-serif-body text-base">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-200/80">
                <div className="text-sm font-bold text-stone-950 font-sans">{t.name}</div>
                <div className="text-xs text-stone-500 font-sans">{t.role}</div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

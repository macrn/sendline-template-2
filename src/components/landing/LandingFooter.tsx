import React from 'react';
import { AppView } from '../../types';
import { ArrowUpRight } from 'lucide-react';

interface LandingFooterProps {
  onNavigate: (view: AppView) => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-950 text-stone-400 text-xs py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-stone-800">
          
          {/* Brand Column */}
          <div className="col-span-2 space-y-4">
            <span className="text-2xl font-black tracking-tighter text-white font-sans">
              sendline
            </span>
            
            <p className="text-xs text-stone-400 max-w-sm leading-relaxed">
              Email marketing that’s different by design. Built with curated typography, the first-time sender screener, sub-30ms transactional API, and customer rewards.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-emerald-400 bg-stone-900 px-3 py-1 rounded-full border border-stone-800 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>All Systems Operational</span>
            </div>
          </div>

          {/* Column 1: Products */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">Products</div>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('marketing')} className="hover:text-white transition-colors cursor-pointer">
                  Email Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('transactional')} className="hover:text-white transition-colors cursor-pointer">
                  Transactional API
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('inbox')} className="hover:text-white transition-colors cursor-pointer">
                  Screener Inbox
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('loyalty')} className="hover:text-white transition-colors cursor-pointer">
                  Loyalty & Rewards
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('template-editor')} className="hover:text-white transition-colors cursor-pointer">
                  Template Library
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Architecture */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">Infrastructure</div>
            <ul className="space-y-2 text-stone-400">
              <li>US-East (Virginia) — 18ms</li>
              <li>US-West (Oregon) — 22ms</li>
              <li>EU-Central (Frankfurt) — 29ms</li>
              <li>
                <button onClick={() => onNavigate('admin')} className="text-stone-300 hover:text-white transition-colors cursor-pointer">
                  Domain & IP Warmup
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Platform */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-white">Platform</div>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors cursor-pointer">
                  Live Dashboard
                </button>
              </li>
              <li>
                <a href="#comparison" className="hover:text-white transition-colors">
                  ESP Comparison
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing Plans
                </a>
              </li>
              <li>
                <span className="text-stone-500">GDPR & SOC2 Certified</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Sendline Global Inc. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <a href="https://sendline.io/" target="_blank" rel="noopener noreferrer" className="hover:text-stone-300 flex items-center gap-1">
              <span>sendline.io</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <span className="hover:text-stone-300 cursor-pointer">Privacy</span>
            <span className="hover:text-stone-300 cursor-pointer">Terms</span>
            <span className="hover:text-stone-300 cursor-pointer">Security</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

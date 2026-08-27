import { Link } from 'react-router-dom';
import { Network } from 'lucide-react';
import type { ReactNode } from 'react';

interface HeaderProps {
  active?: 'dashboard' | 'candidates' | 'shortlist';
  shortlistCount?: number;
  children?: ReactNode;
}

export function Header({ active, shortlistCount = 0 }: HeaderProps) {
  const linkBase =
    'px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-slate-800 hover:text-slate-100';
  const activeClass = 'bg-brand-600 text-white';

  const navLink = (to: string, label: string, key: 'dashboard' | 'candidates' | 'shortlist') => (
    <Link
      to={to}
      className={`${linkBase} ${active === key ? activeClass : 'text-slate-300'}`}
      aria-current={active === key ? 'page' : undefined}
    >
      {label}
    </Link>
  );

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3" aria-label="TalentGraph home">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div className="leading-none">
              <span className="font-bold text-slate-100 text-lg">TalentGraph</span>
              <p className="text-xs text-slate-500 mt-0.5">Graph-Powered Candidate Discovery</p>
            </div>
          </Link>
        </div>

        <nav className="flex items-center gap-1" aria-label="Main navigation">
          {navLink('/', 'Dashboard', 'dashboard')}
          {navLink('/candidates', 'Candidates', 'candidates')}
          {navLink('/shortlist', `Shortlist${shortlistCount > 0 ? ` (${shortlistCount})` : ''}`, 'shortlist')}
        </nav>
      </div>
    </header>
  );
}

import React from 'react';
import { 
  User, 
  HardHat, 
  Building2, 
  Building, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Award,
  ChevronRight,
  HelpCircle
} from 'lucide-react';

export type OnboardingRoleType = 'customer' | 'worker' | 'organization' | 'cooperative';

interface AccountTypeSelectorProps {
  onSelectRole: (role: OnboardingRoleType) => void;
  onBackToLogin: () => void;
}

export const AccountTypeSelector: React.FC<AccountTypeSelectorProps> = ({
  onSelectRole,
  onBackToLogin
}) => {
  const options = [
    {
      id: 'customer' as OnboardingRoleType,
      badge: 'COMMERCIAL & RESIDENTIAL',
      title: 'Customer / Facility Client',
      headline: 'I need certified cooperative services',
      description: 'Book verified trade artisans, emergency repairs, deep exterior wash, and guaranteed service delivery with transparent pricing.',
      icon: User,
      accentColor: 'from-blue-600 to-cyan-600',
      badgeBg: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300',
      borderHover: 'hover:border-blue-500',
      checkPoints: ['Instant booking & live tracking', 'Direct worker calling & voice chat', 'Escrow & cooperative invoice protection']
    },
    {
      id: 'worker' as OnboardingRoleType,
      badge: 'ARTISANS & DAILY WORKERS',
      title: 'Worker / Skilled Artisan',
      headline: 'I want to find work & access welfare benefits',
      description: 'Join your local labour cooperative society. Receive verified jobs, fair wage guarantees, digital identity, pension & insurance.',
      icon: HardHat,
      accentColor: 'from-emerald-600 to-teal-600',
      badgeBg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      borderHover: 'hover:border-emerald-500',
      checkPoints: ['No commission cuts on daily wages', 'Cooperative health & social security', 'Voice-assisted and multilingual interface']
    },
    {
      id: 'organization' as OnboardingRoleType,
      badge: 'ENTERPRISE & CONTRACTORS',
      title: 'Organization / Company',
      headline: 'I want to hire structured workforce teams',
      description: 'Bulk dispatch, facility management contracts, GST invoicing, and verified skilled crews backed by cooperative governance.',
      icon: Building,
      accentColor: 'from-amber-600 to-orange-600',
      badgeBg: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      borderHover: 'hover:border-amber-500',
      checkPoints: ['Contract compliance & GST billing', 'Bulk artisan project deployments', 'Dedicated cooperative account officer']
    },
    {
      id: 'cooperative' as OnboardingRoleType,
      badge: 'OFFICIALS & DISPATCHERS',
      title: 'Cooperative Society Official',
      headline: 'I represent an authorized cooperative',
      description: 'Member verification, trade certifications, welfare fund management, and city-wide emergency dispatch control terminal.',
      icon: Building2,
      accentColor: 'from-purple-600 to-indigo-600',
      badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300',
      borderHover: 'hover:border-purple-500',
      checkPoints: ['Approval-based security clearance', 'Audited society dispatch logs', 'Worker welfare & PF management']
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-purple-900 dark:text-purple-300 text-xs font-mono font-bold tracking-wide">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>SAHAKARI SEVA ONBOARDING</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          How will you use Sahakari Seva?
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Choose the account profile that matches your role. Each portal is customized with specialized tools, verification workflows, and security standards.
        </p>
      </div>

      {/* Grid of 4 Role Choices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((opt) => {
          const Icon = opt.icon;
          return (
            <div
              key={opt.id}
              onClick={() => onSelectRole(opt.id)}
              className={`group relative p-5 sm:p-6 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 ${opt.borderHover} transition-all duration-200 shadow-md hover:shadow-xl cursor-pointer flex flex-col justify-between`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${opt.badgeBg}`}>
                    {opt.badge}
                  </span>
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${opt.accentColor} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {opt.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                    {opt.headline}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                    {opt.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                  {opt.checkPoints.map((cp, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>{cp}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-2 flex items-center justify-between text-xs font-bold font-mono text-purple-700 dark:text-purple-400 group-hover:translate-x-1 transition-transform">
                <span>Start {opt.title.split('/')[0].trim()} Registration</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Switch back to login */}
      <div className="pt-4 text-center border-t border-slate-200 dark:border-slate-800">
        <p className="text-xs text-slate-600 dark:text-slate-400">
          Already registered on Sahakari Seva?{' '}
          <button
            type="button"
            onClick={onBackToLogin}
            className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer ml-1"
          >
            Sign in to your account
          </button>
        </p>
      </div>
    </div>
  );
};

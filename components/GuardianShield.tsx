import React from 'react';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { GuardianStatus } from '../types';

interface GuardianShieldProps {
  status: GuardianStatus;
}

const GuardianShield: React.FC<GuardianShieldProps> = ({ status }) => {
  return (
    <div className={`
      flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300
      ${status.level === 'safe' 
        ? 'bg-nexus-success/10 border-nexus-success/30 text-nexus-success' 
        : status.level === 'warning' 
          ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' 
          : 'bg-nexus-danger/10 border-nexus-danger/30 text-nexus-danger animate-pulse'}
    `}>
      {status.level === 'safe' && <ShieldCheck size={14} />}
      {status.level === 'warning' && <Shield size={14} />}
      {status.level === 'danger' && <ShieldAlert size={14} />}
      
      <span className="text-xs font-bold uppercase tracking-wider">
        {status.level === 'safe' ? 'Guardian Active' : status.level}
      </span>
      
      {status.reason && status.level !== 'safe' && (
        <span className="text-[10px] opacity-70 hidden md:inline">| {status.reason}</span>
      )}
    </div>
  );
};

export default GuardianShield;
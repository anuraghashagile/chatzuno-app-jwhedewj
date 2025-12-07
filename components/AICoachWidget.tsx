import React from 'react';
import { Sparkles, Zap, MessageCircle } from 'lucide-react';

interface AICoachWidgetProps {
  advice: string;
  status: 'good' | 'stalled' | 'awkward';
  visible: boolean;
}

const AICoachWidget: React.FC<AICoachWidgetProps> = ({ advice, status, visible }) => {
  if (!visible) return null;

  const getStatusColor = () => {
    switch(status) {
      case 'good': return 'border-nexus-success text-nexus-success shadow-nexus-success/20';
      case 'stalled': return 'border-yellow-400 text-yellow-400 shadow-yellow-400/20';
      case 'awkward': return 'border-nexus-danger text-nexus-danger shadow-nexus-danger/20';
      default: return 'border-nexus-400 text-nexus-400';
    }
  };

  const getIcon = () => {
    switch(status) {
      case 'good': return <Sparkles size={18} />;
      case 'stalled': return <Zap size={18} />;
      case 'awkward': return <MessageCircle size={18} />;
    }
  };

  return (
    <div className={`
      w-full md:w-64 bg-nexus-800/50 backdrop-blur-lg border border-white/5 p-4 rounded-xl 
      flex flex-col gap-2 transition-all duration-500
      ${status === 'good' ? 'bg-nexus-success/5' : ''}
    `}>
      <div className="flex items-center justify-between text-xs font-mono uppercase tracking-widest text-white/50 mb-1">
        <span>AI Coach Active</span>
        <div className={`w-2 h-2 rounded-full ${status === 'good' ? 'bg-nexus-success' : status === 'stalled' ? 'bg-yellow-400' : 'bg-nexus-danger'}`}></div>
      </div>
      
      <div className={`border-l-2 pl-3 py-1 ${getStatusColor()} transition-colors duration-500`}>
        <div className="flex items-center gap-2 mb-1 font-bold text-sm">
          {getIcon()}
          <span>{status === 'good' ? 'Flowing' : status === 'stalled' ? 'Boost Needed' : 'Reset Needed'}</span>
        </div>
        <p className="text-sm text-white/90 leading-tight">
          "{advice}"
        </p>
      </div>
      
      {status !== 'good' && (
        <button className="mt-2 text-xs bg-white/10 hover:bg-white/20 text-white py-1 px-2 rounded transition-colors self-start">
          Use Suggestion
        </button>
      )}
    </div>
  );
};

export default AICoachWidget;
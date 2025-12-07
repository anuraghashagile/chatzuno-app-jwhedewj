import React from 'react';
import { Target, X } from 'lucide-react';
import { DiscoveryTask } from '../types';

interface DiscoveryCardProps {
  task: DiscoveryTask | null;
  onClose: () => void;
}

const DiscoveryCard: React.FC<DiscoveryCardProps> = ({ task, onClose }) => {
  if (!task || !task.active) return null;

  return (
    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40 w-[90%] md:w-[400px]">
      <div className="relative bg-gradient-to-r from-nexus-500 to-nexus-accent p-[1px] rounded-lg shadow-[0_0_30px_rgba(109,40,217,0.4)]">
        <div className="bg-nexus-900 rounded-lg p-4 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
          
          <div className="flex justify-between items-start mb-2 relative z-10">
            <div className="flex items-center gap-2 text-nexus-accent">
              <Target size={20} className="animate-spin-slow" />
              <h3 className="font-bold text-sm tracking-wider uppercase">Discovery Mission</h3>
            </div>
            <button onClick={onClose} className="text-white/50 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
          
          <h2 className="text-xl font-bold text-white mb-1 relative z-10">{task.title}</h2>
          <p className="text-sm text-nexus-400 relative z-10">{task.description}</p>
          
          <div className="mt-3 flex gap-2">
            <button onClick={onClose} className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs py-2 rounded transition-colors">
              Accept Challenge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoveryCard;
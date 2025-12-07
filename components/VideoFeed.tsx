import React, { useEffect, useRef } from 'react';
import { Mic, MicOff, Video, VideoOff } from 'lucide-react';

interface VideoFeedProps {
  stream: MediaStream | null;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isBlurred: boolean;
  label: string;
  avatarSeed: string;
}

const VideoFeed: React.FC<VideoFeedProps> = ({ 
  stream, 
  isMuted, 
  isVideoEnabled, 
  isBlurred,
  label,
  avatarSeed
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  // Generate a deterministic color from seed
  const getColor = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00ffffff).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
  };

  const bgStyle = { backgroundColor: getColor(avatarSeed) };

  return (
    <div className="relative w-full h-full bg-nexus-900 overflow-hidden rounded-xl border border-nexus-700 shadow-lg group">
      
      {/* Video Element */}
      {isVideoEnabled && stream ? (
        <video
          ref={videoRef}
          autoPlay
          muted={label === "You"} // Always mute self to prevent feedback
          playsInline
          className={`w-full h-full object-cover transition-all duration-300 ${isBlurred ? 'blur-md' : ''}`}
        />
      ) : (
        /* Avatar Fallback */
        <div className="w-full h-full flex items-center justify-center flex-col animate-pulse-slow" style={bgStyle}>
          <div className="text-6xl mb-2">👤</div>
          <p className="font-mono opacity-50 text-sm uppercase tracking-widest">Signal Not Found</p>
        </div>
      )}

      {/* Overlay UI */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end">
        <div>
          <h3 className="text-white font-bold drop-shadow-md">{label}</h3>
          <div className="flex items-center space-x-2 mt-1">
             {/* Audio Visualization Bars (Fake) */}
            <div className="flex space-x-1 h-3 items-end">
              {[1,2,3,4].map(i => (
                <div key={i} className={`w-1 bg-nexus-success rounded-full ${isMuted ? 'h-1 opacity-20' : 'animate-pulse-fast'}`} style={{height: isMuted ? '2px' : `${Math.random() * 12 + 4}px`}}></div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          {isMuted ? <MicOff size={16} className="text-nexus-danger" /> : <Mic size={16} className="text-white" />}
          {isVideoEnabled ? <Video size={16} className="text-white" /> : <VideoOff size={16} className="text-nexus-danger" />}
        </div>
      </div>
      
      {/* Privacy Indicator */}
      {label === "Stranger" && isBlurred && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
          <span className="text-xs font-mono text-white">PRIVACY BLUR ACTIVE</span>
        </div>
      )}
    </div>
  );
};

export default VideoFeed;
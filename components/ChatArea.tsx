import React, { useRef, useEffect, useState } from 'react';
import { Send, ArrowDown, Loader2, ImageIcon, ShieldCheck, Smile, Flag, Mic, Square, Play, Pause, AlertTriangle, Plus, Lock, Eye, EyeOff, Timer, XCircle, Check, Ghost } from 'lucide-react';
import { Message, MessageType } from '../types';

interface ChatAreaProps {
  messages: Message[];
  inputValue: string;
  setInputValue: (val: string) => void;
  onSend: () => void;
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAudioSend: (base64Audio: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onReaction: (msgId: string, emoji: string) => void;
  onReport: (msgId: string) => void;
  onImageExpire: (msgId: string) => void;
  onImageView: (msgId: string) => void;
  isTyping: boolean;
  userName?: string;
  strangerName?: string;
}

const QUICK_REACTIONS = ['❤️', '😂', '😮', '😢', '🔥', '👍', '🎉', '👀'];
const MAX_TEXT_LENGTH = 300;

// Replaces simple ImageBubble with Secure logic
const SecureImageBubble: React.FC<{ 
  src: string, 
  settings?: Message['imageSettings'], 
  isUser: boolean,
  msgId: string,
  onExpire: (id: string) => void,
  onView: (id: string) => void
}> = ({ src, settings, isUser, msgId, onExpire, onView }) => {
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    // Robust Timer Logic: Calculate remaining time based on viewedAt timestamp
    if (settings?.isViewed && settings.viewedAt && settings.duration && !settings.isExpired) {
      
      const calculateRemaining = () => {
        const now = Date.now();
        const endTime = settings.viewedAt! + (settings.duration! * 1000);
        const remaining = Math.ceil((endTime - now) / 1000);
        return remaining;
      };

      // Initial check
      const initialRemaining = calculateRemaining();
      
      if (initialRemaining <= 0) {
        setTimeLeft(0);
        onExpire(msgId);
        return;
      }
      
      setTimeLeft(initialRemaining);

      const timer = setInterval(() => {
        const remaining = calculateRemaining();
        setTimeLeft(remaining);
        
        if (remaining <= 0) {
          clearInterval(timer);
          onExpire(msgId);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [settings, msgId, onExpire]);

  // Handle viewing (only for Receiver)
  const handleView = () => {
    if (isUser) return;
    if (settings?.isExpired) return;
    
    if (!settings?.isViewed) {
      if (confirm("Allow viewing of this secure image? Timer will start immediately.")) {
        onView(msgId);
        // Optimistically set time left
        if (settings?.duration) {
          setTimeLeft(settings.duration);
        }
      }
    }
  };

  // --- EXPIRED STATE (For both) ---
  if (settings?.isExpired) {
    return (
      <div className="mb-2 w-full sm:w-[280px] h-56 bg-gray-900/50 rounded-xl border border-red-500/20 flex flex-col items-center justify-center gap-3 p-4 text-center select-none animate-fade-in">
        <XCircle size={40} className="text-red-500/50" />
        <span className="text-sm font-mono text-red-400 font-bold">Image Expired</span>
      </div>
    );
  }

  // --- SENDER VIEW ---
  if (isUser) {
    return (
       <div className="mb-2 rounded-xl overflow-hidden relative min-h-[150px] flex items-center justify-center bg-black/5 dark:bg-white/5 group border border-border/50">
         <img 
            src={`data:image/jpeg;base64,${src}`} 
            alt="Sent" 
            className="w-full h-auto max-h-[400px] object-contain opacity-90 transition-opacity group-hover:opacity-100"
          />
          {/* Status Overlay */}
          <div className={`
             absolute top-3 right-3 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md border border-white/10 shadow-lg font-medium
             ${settings?.isViewed ? 'bg-red-600/90 text-white animate-pulse' : 'bg-black/60 text-white'}
          `}>
             {settings?.isViewed ? (
                <>
                  <Timer size={14} /> {timeLeft !== null ? `${timeLeft}s` : 'Opened'}
                </>
             ) : (
                <>
                  {settings?.duration ? `${settings.duration}s` : '∞'} • Sent
                </>
             )}
          </div>
       </div>
    );
  }

  // --- RECEIVER: LOCKED STATE ---
  if (!settings?.isViewed) {
    return (
      <button 
        onClick={handleView}
        className="mb-2 w-full sm:w-[280px] h-64 bg-surface/50 backdrop-blur-md rounded-xl border border-accent/30 flex flex-col items-center justify-center gap-4 p-4 hover:bg-surface/70 transition-colors group cursor-pointer shadow-sm relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-accent/5 group-hover:bg-accent/10 transition-colors"></div>
        <div className="relative p-5 bg-accent/10 rounded-full text-accent group-hover:scale-110 transition-transform ring-1 ring-accent/20">
          <Lock size={32} />
        </div>
        <div className="relative flex flex-col items-center">
          <span className="font-bold text-base">Sensitive Content</span>
          <span className="text-xs text-secondary opacity-80 mt-1">
            Tap to allow & view 
            {settings?.duration ? ` (${settings.duration}s)` : ' (No timer)'}
          </span>
        </div>
      </button>
    );
  }

  // --- RECEIVER: VIEWING STATE ---
  return (
    <div 
      className="mb-2 rounded-xl overflow-hidden relative min-h-[150px] flex items-center justify-center bg-black select-none border border-border/30 shadow-inner"
      onContextMenu={(e) => e.preventDefault()}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center animate-pulse z-0 bg-surface/10">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
        </div>
      )}
      
      {/* Security Overlay */}
      <div className="absolute inset-0 z-20 bg-transparent"></div>

      <img 
        src={`data:image/jpeg;base64,${src}`} 
        alt="Secure Content" 
        className={`w-full h-auto max-h-[400px] object-contain transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={() => setLoading(false)}
        style={{ pointerEvents: 'none' }} 
      />

      {/* Timer Overlay */}
      {settings?.duration && (
        <div className="absolute top-4 right-4 z-30 bg-red-600/90 text-white font-mono font-bold px-3 py-1.5 rounded-full shadow-lg border border-white/20 flex items-center gap-2 animate-pulse text-sm">
           <Timer size={16} />
           {timeLeft}s
        </div>
      )}
    </div>
  );
};

// New Waveform Component for Recording UI
const RecordingWaveform = () => (
  <div className="flex items-center gap-1 h-6 px-4">
    {[...Array(12)].map((_, i) => (
      <div 
        key={i} 
        className="w-1 bg-red-500 rounded-full animate-recordwave"
        style={{ 
          // Staggered delay for random "voice" effect
          animationDelay: `-${Math.random() * 0.5}s`,
          animationDuration: `${0.5 + Math.random() * 0.5}s`
        }}
      />
    ))}
    <span className="text-red-500 font-mono text-sm ml-2 animate-pulse font-bold">Recording...</span>
  </div>
);

// Improved Audio Bubble with "WhatsApp-like" Visualizer
const AudioBubble: React.FC<{ src: string, isUser: boolean }> = ({ src, isUser }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  };

  return (
    <div className={`flex items-center gap-3 min-w-[220px] p-2 select-none`}>
      <button 
        onClick={togglePlay}
        className={`
          w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95 shrink-0
          ${isUser ? 'bg-userText text-userBubble' : 'bg-strangerText text-strangerBubble'}
        `}
      >
        {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
      </button>
      
      <div className="flex flex-col gap-1 flex-1">
        {/* Visualizer: Bars */}
        <div className="h-6 flex items-center gap-[2px] opacity-90">
            {[...Array(30)].map((_, i) => {
              // Calculate progress
              const totalBars = 30;
              const progressPercent = duration ? currentTime / duration : 0;
              const barIndexPercent = i / totalBars;
              const isPlayed = barIndexPercent < progressPercent;
              
              const staticHeight = 4 + Math.abs(Math.sin(i * 0.5)) * 12;

              return (
                <div 
                  key={i}
                  className={`w-1 rounded-full transition-all duration-100 ${isPlaying ? 'animate-soundwave' : ''}`}
                  style={{ 
                    backgroundColor: 'currentColor',
                    opacity: isPlayed ? 1 : 0.3,
                    height: isPlaying ? undefined : `${staticHeight}px`,
                    animationDelay: `-${i * 0.05}s` 
                  }}
                />
              );
            })}
        </div>
        <div className="flex justify-between text-[10px] font-medium opacity-70 font-mono tracking-wide">
          <span>{formatTime(currentTime)}</span>
          <span>{duration ? formatTime(duration) : '--:--'}</span>
        </div>
      </div>

      <audio 
        ref={audioRef} 
        src={`data:audio/webm;base64,${src}`} 
        onEnded={() => setIsPlaying(false)} 
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        className="hidden" 
      />
    </div>
  );
};


const TextBubble: React.FC<{ text: string }> = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const shouldTruncate = text.length > MAX_TEXT_LENGTH;

  if (!shouldTruncate) {
    return <div className="whitespace-pre-wrap break-words leading-relaxed">{text}</div>;
  }

  return (
    <div className="whitespace-pre-wrap break-words leading-relaxed">
      {expanded ? text : `${text.slice(0, MAX_TEXT_LENGTH)}...`}
      <button 
        onClick={() => setExpanded(!expanded)} 
        className="ml-1 text-xs font-bold underline opacity-80 hover:opacity-100 focus:outline-none"
      >
        {expanded ? 'Read less' : 'Read more'}
      </button>
    </div>
  );
};

const GuardianIndicator: React.FC<{ status?: { level: 'safe' | 'warning' | 'danger'; reason?: string } }> = ({ status }) => {
  if (!status) return null;
  let colorClass = "text-secondary";
  if (status.level === 'warning') colorClass = "text-yellow-500";
  if (status.level === 'danger') colorClass = "text-red-500";
  return <div className={`ml-2 ${colorClass}`} title={status.reason || status.level}><ShieldCheck size={14} /></div>;
};

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  inputValue,
  setInputValue,
  onSend,
  onImageSelect,
  onAudioSend,
  onKeyDown,
  onReaction,
  onReport,
  onImageExpire,
  onImageView,
  isTyping,
  userName,
  strangerName
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [isInputFocused, setIsInputFocused] = useState(false);
  
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  useEffect(() => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
      if (isNearBottom) {
        scrollToBottom();
      } else {
        setShowScrollButton(true);
      }
    }
  }, [messages, isTyping]);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 500);
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' }); 
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
           audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64String = reader.result?.toString().split(',')[1];
          if (base64String) {
            onAudioSend(base64String);
          }
        };
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error accessing microphone:", err);
       try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          audioChunksRef.current = [];
          mediaRecorder.ondataavailable = e => audioChunksRef.current.push(e.data);
          mediaRecorder.onstop = () => {
             const audioBlob = new Blob(audioChunksRef.current);
             const reader = new FileReader();
             reader.readAsDataURL(audioBlob);
             reader.onloadend = () => {
                 const base64String = reader.result?.toString().split(',')[1];
                 if(base64String) onAudioSend(base64String);
             }
             stream.getTracks().forEach(t => t.stop());
          }
          mediaRecorder.start();
          setIsRecording(true);
       } catch (fallbackErr) {
          alert("Microphone access denied or not supported.");
       }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleCustomReaction = (msgId: string) => {
    const emoji = prompt("Type an emoji (or use your keyboard picker):");
    if (emoji && emoji.trim().length > 0) {
      onReaction(msgId, emoji.trim());
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-5xl mx-auto border-x border-border/50 dark:border-none bg-surface/30 relative">
      
      {/* Messages Scroll Area */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 no-scrollbar scroll-smooth pb-12 relative z-10"
      >
        {messages.map((msg) => {
          const isUser = msg.type === MessageType.USER;
          const isSystem = msg.type === MessageType.SYSTEM;
          const isReported = msg.isReported;
          // Calculate time left if it's a vanish message (cosmetic only, filtering is done in parent)
          const isVanish = !!msg.vanishAt;

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-6 animate-fade-in">
                <span className="text-xs font-medium text-secondary bg-surface/80 px-4 py-1.5 rounded-full border border-border shadow-sm backdrop-blur-sm tracking-wide">
                  {msg.text}
                </span>
              </div>
            );
          }

          return (
            <div 
              key={msg.id} 
              className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} animate-slide-up group relative`}
            >
              <div className={`max-w-[85%] sm:max-w-[75%] flex flex-col ${isUser ? 'items-end' : 'items-start'} relative`}>
                
                <span className={`text-[10px] font-bold text-secondary/60 uppercase tracking-wider mb-1 px-1 ${isUser ? 'mr-1' : 'ml-1'}`}>
                  {isUser ? (userName || 'You') : (strangerName || 'Stranger')}
                </span>

                <div 
                  className={`
                    relative px-5 py-3.5 rounded-2xl text-base shadow-sm backdrop-blur-sm transition-all duration-200 mb-1
                    ${isUser 
                      ? 'bg-userBubble text-userText rounded-br-none' 
                      : 'bg-strangerBubble text-strangerText rounded-bl-none'}
                    ${isReported ? 'blur-md opacity-60 select-none grayscale' : ''}
                  `}
                >
                  {isReported && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <span className="bg-black/70 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                        <AlertTriangle size={14} /> Content Hidden
                      </span>
                    </div>
                  )}

                  {msg.image && (
                    <SecureImageBubble 
                      src={msg.image} 
                      settings={msg.imageSettings} 
                      isUser={isUser}
                      msgId={msg.id}
                      onExpire={onImageExpire}
                      onView={onImageView}
                    />
                  )}
                  
                  {msg.audio && (
                    <AudioBubble src={msg.audio} isUser={isUser} />
                  )}

                  {msg.text && (
                    <div className="flex items-center gap-1">
                      {isVanish && <Ghost size={12} className="animate-[pulse_3s_ease-in-out_infinite] text-purple-400/60 shrink-0" />}
                      <TextBubble text={msg.text} />
                      <GuardianIndicator status={msg.guardianStatus} />
                    </div>
                  )}

                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                     <div className={`absolute -bottom-8 ${isUser ? 'left-0' : 'right-0'} flex gap-1 z-20`}>
                       {Object.entries(msg.reactions).map(([emoji, count]) => (
                         <button 
                           key={emoji} 
                           onClick={() => onReaction(msg.id, emoji)}
                           className="bg-surface border border-border shadow-sm px-3 py-1 rounded-xl text-base hover:scale-110 transition-transform flex items-center gap-1"
                         >
                           {emoji} <span className="text-xs font-bold opacity-60">{(count as number) > 1 ? count : ''}</span>
                         </button>
                       ))}
                     </div>
                  )}
                </div>

                <span className={`text-[9px] text-secondary opacity-50 px-1 mt-0.5 flex items-center gap-1`}>
                   {isVanish ? 'Auto-Deletes • ' : ''}
                   {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>

                {!isReported && (
                  <div className={`
                    absolute top-1/2 -translate-y-1/2 ${isUser ? '-left-20' : '-right-20'} 
                    opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 p-1
                  `}>
                     <div className="relative group/emoji">
                        <button className="p-2 bg-surface rounded-full text-secondary hover:text-accent shadow-sm border border-border transition-transform hover:scale-110">
                          <Smile size={16} />
                        </button>
                        
                        <div className={`
                           absolute bottom-full mb-2 ${isUser ? 'left-0' : 'right-0'}
                           flex items-center gap-1 p-2 bg-surface border border-border shadow-xl rounded-full
                           opacity-0 invisible group-hover/emoji:opacity-100 group-hover/emoji:visible
                           transition-all duration-200 transform origin-bottom z-30 scale-95 group-hover/emoji:scale-100
                        `}>
                           {QUICK_REACTIONS.map(emoji => (
                             <button 
                               key={emoji}
                               onClick={() => onReaction(msg.id, emoji)}
                               className="text-2xl hover:scale-125 transition-transform p-1"
                             >
                               {emoji}
                             </button>
                           ))}
                           <div className="w-px h-6 bg-border mx-1"></div>
                           <button onClick={() => handleCustomReaction(msg.id)} className="p-1.5 hover:bg-black/5 rounded-full">
                              <Plus size={16} />
                           </button>
                        </div>
                     </div>

                     {!isUser && (
                       <button 
                         onClick={() => onReport(msg.id)}
                         className="p-2 bg-surface rounded-full text-secondary hover:text-red-500 shadow-sm border border-border transition-transform hover:scale-110"
                         title="Report Message"
                       >
                         <Flag size={16} />
                       </button>
                     )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {showScrollButton && (
        <button 
          onClick={() => scrollToBottom()} 
          className="absolute bottom-24 right-6 z-20 bg-accent text-background p-3 rounded-full shadow-lg animate-bounce hover:bg-accentHover transition-colors"
        >
          <ArrowDown size={20} />
        </button>
      )}

      <div className="p-4 sm:p-5 bg-background/80 backdrop-blur-xl border-t border-border shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className={`
           relative flex items-center gap-3 p-2 rounded-[1.5rem] border transition-all duration-300
           ${isRecording 
              ? 'bg-red-500/5 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]' 
              : isInputFocused 
                ? 'bg-inputBg border-accent shadow-lg ring-1 ring-accent/10' 
                : 'bg-inputBg border-border shadow-sm'
           }
        `}>
           {isRecording ? (
             <>
               <div className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center animate-pulse">
                 <Mic size={20} />
               </div>
               <div className="flex-1 overflow-hidden">
                 <RecordingWaveform />
               </div>
               <div className="flex items-center gap-2 mr-1">
                 <button 
                   onClick={() => {
                     stopRecording(); 
                     setIsRecording(false);
                   }} 
                   className="p-2 text-secondary hover:text-primary text-xs font-bold uppercase tracking-wider"
                 >
                   Cancel
                 </button>
                 <button 
                   onClick={stopRecording} 
                   className="w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-transform hover:scale-105"
                 >
                    <Square size={16} fill="currentColor" />
                 </button>
               </div>
             </>
           ) : (
             <>
               <button 
                 onClick={startRecording}
                 className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:text-accent hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0"
                 title="Record Voice Note"
               >
                 <Mic size={20} />
               </button>

               <label className="w-10 h-10 rounded-full flex items-center justify-center text-secondary hover:text-accent hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0">
                 <input type="file" accept="image/*" className="hidden" onChange={onImageSelect} />
                 <ImageIcon size={20} />
               </label>

               <input
                 ref={inputRef}
                 type="text"
                 value={inputValue}
                 onChange={(e) => setInputValue(e.target.value)}
                 onKeyDown={onKeyDown}
                 onFocus={() => setIsInputFocused(true)}
                 onBlur={() => setIsInputFocused(false)}
                 placeholder={isTyping ? `${strangerName || 'Stranger'} is typing...` : "Type a message..."}
                 className="flex-1 bg-transparent border-none outline-none text-primary placeholder:text-secondary/50 h-10 text-base min-w-0"
               />

               <button 
                 onClick={onSend}
                 disabled={!inputValue.trim()}
                 className={`
                   w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform shrink-0
                   ${inputValue.trim() 
                     ? 'bg-accent text-background hover:scale-110 shadow-md' 
                     : 'bg-border/50 text-secondary/50 cursor-not-allowed'}
                 `}
               >
                 <Send size={18} />
               </button>
             </>
           )}
        </div>
        
        <div className="text-center mt-2">
           <span className="text-[10px] text-secondary/40 font-mono flex items-center justify-center gap-1">
             <ShieldCheck size={10} /> End-to-End Encrypted • Zero Trace
           </span>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
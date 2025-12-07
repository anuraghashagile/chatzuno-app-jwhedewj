import React, { useState, useEffect, useRef } from 'react';
import { Sun, Moon, LogOut, Settings, X, Globe, Square, Play, ArrowRight, Flag, AlertTriangle, Timer, Check, Image as ImageIcon, Ghost, MessageCircle, Mic, Send, ShieldCheck, Smile, Plus } from 'lucide-react';
import ChatArea from './components/ChatArea';
import { Message, MessageType, UserProfile } from './types';
import { AGE_OPTIONS, GENDER_OPTIONS, LOCATION_OPTIONS, IMAGE_TIMER_OPTIONS, REGIONAL_NAMES } from './constants';
import DarkVeil from './components/DarkVeil';
import { db, isConfigured } from './firebase';
import { collection, addDoc, onSnapshot, query, orderBy, limit, serverTimestamp, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// Custom Unique Logo Component (Infinity Bubble)
const ChatzunoLogo = ({ size = 32, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    className={className}
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Speech Bubble Container */}
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    
    {/* Infinity Symbol (Meaningful Connection) */}
    <path d="M12 12c-1.3-1.8-2.6-2.7-4-2.7A2.7 2.7 0 0 0 5.3 12a2.7 2.7 0 0 0 2.7 2.7c1.4 0 2.7-.9 4-2.7zm0 0c1.3 1.8 2.6 2.7 4 2.7a2.7 2.7 0 0 0 2.7-2.7 2.7 2.7 0 0 0-2.7-2.7c-1.4 0-2.7.9-4 2.7z" />
  </svg>
);

// 3D Phone Chat Animation Component - Realistic Purple Titanium Style
const PerspectiveChatInterface = () => {
  return (
    <div className="relative group w-[180px] h-[380px] sm:w-[220px] sm:h-[460px] lg:w-[260px] lg:h-[540px] mx-auto transition-transform duration-700 hover:scale-[1.02] animate-float" style={{ perspective: '1500px' }}>
      
      {/* Floating Ghost Element (Right) */}
      <div className="absolute -right-8 top-1/2 -translate-y-1/2 z-50 animate-float" style={{ animationDelay: '1s' }}>
         <div className="bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/50 transform rotate-12">
            <Ghost size={32} className="text-purple-600" fill="currentColor" />
         </div>
      </div>

      {/* Floating Ghost Element (Left) */}
      <div className="absolute -left-10 top-24 z-50 animate-float" style={{ animationDelay: '2.5s' }}>
         <div className="bg-white/90 backdrop-blur-md p-2.5 rounded-2xl shadow-xl border border-white/50 transform -rotate-12">
            <Ghost size={26} className="text-pink-500" fill="currentColor" />
         </div>
      </div>

      <div 
        className="relative w-full h-full bg-[#1a0b2e] rounded-[2rem] shadow-2xl border-[3px] border-[#4c1d95] overflow-hidden"
        style={{ 
            transform: 'rotateY(-12deg) rotateX(5deg)', 
            boxShadow: '25px 35px 60px rgba(0,0,0,0.4), inset 0 0 0 2px rgba(255,255,255,0.1)' 
        }}
      >
        {/* Purple Titanium Frame Bezel */}
        <div className="absolute inset-0 rounded-[1.8rem] border-[5px] border-[#5b21b6] pointer-events-none z-50 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]"></div>

        {/* Hardware Buttons */}
        <div className="absolute top-16 -left-[5px] w-[3px] h-6 bg-[#6d28d9] rounded-l-md shadow-md"></div>
        <div className="absolute top-24 -left-[5px] w-[3px] h-10 bg-[#6d28d9] rounded-l-md shadow-md"></div>
        <div className="absolute top-20 -right-[5px] w-[3px] h-14 bg-[#6d28d9] rounded-r-md shadow-md"></div>

        {/* Screen Container */}
        <div className="w-full h-full bg-surface/95 flex flex-col relative overflow-hidden rounded-[1.8rem]">
            
            {/* Dynamic Island */}
            <div className="absolute top-0 w-full h-8 flex justify-center items-start z-40 pt-1.5 pointer-events-none">
                <div className="w-[60px] h-[18px] bg-black rounded-full flex items-center justify-center px-1.5 relative shadow-md">
                    <div className="w-[60%] h-full flex items-center gap-1.5">
                       <div className="w-1 h-1 bg-[#1a1a1a] rounded-full blur-[0.3px]"></div>
                       <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse opacity-60"></div>
                    </div>
                </div>
            </div>

            {/* App Header */}
            <div className="h-16 bg-surface/90 backdrop-blur-md border-b border-border/10 flex items-end pb-2 px-3 gap-2 z-30">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 shadow-md flex items-center justify-center text-white font-bold text-xs shrink-0">
                   <ChatzunoLogo size={16} />
                </div>
                <div className="flex flex-col justify-center mb-0.5">
                    <span className="text-[10px] font-bold text-primary tracking-wide leading-tight">Chatzuno</span>
                    <div className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-green-500"></div>
                        <span className="text-[8px] text-secondary/70 leading-none">Online</span>
                    </div>
                </div>
            </div>

            {/* Chat Content with Animation Loop */}
            <div className="flex-1 p-2.5 space-y-2.5 overflow-hidden relative z-10 flex flex-col justify-end pb-14">
                
                {/* 1. Stranger Message */}
                <div className="flex justify-start animate-slide-up-fade" style={{ animationDuration: '0.6s', animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards' }}>
                    <div className="bg-strangerBubble/90 backdrop-blur-sm px-2.5 py-1.5 rounded-2xl rounded-bl-none shadow-sm max-w-[85%] text-[9px] sm:text-[10px] text-strangerText font-medium">
                        Hello! How are you doing? 👋
                    </div>
                </div>

                {/* 2. User Typing -> Message */}
                <div className="flex justify-end animate-slide-up-fade" style={{ animationDuration: '0.6s', animationDelay: '2s', opacity: 0, animationFillMode: 'forwards' }}>
                    <div className="bg-userBubble px-2.5 py-1.5 rounded-2xl rounded-br-none shadow-md shadow-accent/10 max-w-[85%] text-[9px] sm:text-[10px] text-userText font-medium">
                        I'm doing great! Just chilling. How about you?
                    </div>
                </div>

                {/* 3. Stranger Typing Indicator */}
                <div className="flex justify-start animate-fade-in" style={{ animationDelay: '3.5s', animationDuration: '0.5s', opacity: 0, animationFillMode: 'forwards' }}>
                     <div className="bg-strangerBubble/50 px-2 py-1 rounded-xl rounded-bl-none w-8 flex items-center gap-0.5">
                        <div className="w-0.5 h-0.5 bg-strangerText/50 rounded-full animate-bounce"></div>
                        <div className="w-0.5 h-0.5 bg-strangerText/50 rounded-full animate-bounce delay-75"></div>
                        <div className="w-0.5 h-0.5 bg-strangerText/50 rounded-full animate-bounce delay-150"></div>
                     </div>
                </div>

                {/* 4. Stranger Image Message */}
                <div className="flex justify-start animate-slide-up-fade" style={{ animationDuration: '0.6s', animationDelay: '5s', opacity: 0, animationFillMode: 'forwards' }}>
                     <div className="bg-strangerBubble/90 backdrop-blur-sm px-2 py-2 rounded-2xl rounded-bl-none shadow-sm max-w-[75%] text-[10px] sm:text-xs text-strangerText flex flex-col gap-1.5 absolute bottom-[60px] z-20">
                        <span className="font-medium px-1 text-[8px]">Look at this view! 🌅</span>
                        <div className="h-16 w-full bg-gradient-to-br from-orange-400/20 to-pink-500/20 rounded-lg border border-white/10 flex items-center justify-center relative overflow-hidden group">
                            <ImageIcon size={14} className="opacity-50" />
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <div className="h-12 bg-surface/90 backdrop-blur-xl border-t border-border/10 flex items-center px-2.5 gap-1.5 z-30 absolute bottom-0 w-full">
                <div className="w-6 h-6 rounded-full bg-secondary/5 flex items-center justify-center">
                    <Plus size={12} className="text-secondary" />
                </div>
                <div className="flex-1 h-7 bg-secondary/5 rounded-full border border-border/10 flex items-center px-2">
                   <div className="w-1 h-1 bg-secondary/20 rounded-full animate-pulse"></div>
                </div>
                <div className="w-7 h-7 rounded-full bg-accent shadow-lg shadow-accent/20 flex items-center justify-center">
                    <Send size={12} className="text-white ml-0.5" />
                </div>
            </div>
            
            {/* Glossy Reflection Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none rounded-[1.8rem] z-50"></div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  // --- STATE ---
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  
  // Profile State
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    gender: 'Male',
    age: '18-21',
    location: 'India (General)',
    interests: ''
  });
  const [isProfileSubmitted, setIsProfileSubmitted] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  // Chat State
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isVanishMode, setIsVanishMode] = useState(false);
  const [strangerName, setStrangerName] = useState<string>('');
  const [now, setNow] = useState(Date.now());
  
  // Connection Error State
  const [connectionError, setConnectionError] = useState<string | null>(null);

  // Image Preview & Timer State
  const [pendingImage, setPendingImage] = useState<string | null>(null);
  const [imageTimer, setImageTimer] = useState<number | null>(30); // Default 30s

  // --- INIT IDENTITY ---
  useEffect(() => {
    let uid = localStorage.getItem('chatzuno_uid');
    if (!uid) {
      uid = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('chatzuno_uid', uid);
    }
    setCurrentUserId(uid);
  }, []);

  // --- EFFECT: Theme ---
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark' || isVanishMode) { // Vanish mode forces dark theme
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme, isVanishMode]);

  // --- EFFECT: Time Ticker + Vanish Cleanup ---
  useEffect(() => {
    const interval = setInterval(() => {
      const currentNow = Date.now();
      setNow(currentNow);
      
      // Auto-delete expired messages from DB (only if I authored them, to share load)
      messages.forEach(msg => {
        if (msg.vanishAt && msg.vanishAt < currentNow && msg.userId === currentUserId) {
           deleteDoc(doc(db, "messages", msg.id)).catch(err => console.log("Cleanup err", err));
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [messages, currentUserId]);

  // --- EFFECT: Realtime Chat Listener ---
  useEffect(() => {
    if (!isConnected) return;
    
    // Check configuration first
    if (!isConfigured) {
      setConnectionError("Firebase Config is missing.");
      return;
    }

    // Subscribe to Firestore 'messages' collection
    try {
      const q = query(collection(db, "messages"), orderBy("timestamp", "asc"), limit(100));
      
      const unsubscribe = onSnapshot(q, 
        (snapshot) => {
          setConnectionError(null); 
          const msgs: Message[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            const isMe = data.userId === currentUserId;
            // Handle timestamp conversion
            const timestamp = data.timestamp?.toMillis ? data.timestamp.toMillis() : Date.now();
            
            msgs.push({
              id: doc.id,
              text: data.text,
              userId: data.userId,
              image: data.image,
              imageSettings: data.imageSettings,
              audio: data.audio,
              type: isMe ? MessageType.USER : MessageType.STRANGER, 
              timestamp: timestamp,
              reactions: data.reactions,
              guardianStatus: data.guardianStatus,
              isReported: data.isReported,
              vanishAt: data.vanishAt
            });
          });
          setMessages(msgs);
        },
        (error) => {
          console.error("Firebase Snapshot Error:", error);
          if (error.code === 'permission-denied') {
            setConnectionError("PERMISSION_DENIED");
          } else {
             setConnectionError(error.message);
          }
        }
      );

      return () => unsubscribe();
    } catch (err: any) {
      console.error("Failed to setup listener:", err);
      setConnectionError(err.message || "Unknown error");
    }
  }, [isConnected, currentUserId]);


  // --- HANDLERS ---
  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleStartChat = () => {
    if (profile.name.trim().length < 2) {
      alert("Please enter a valid name.");
      return;
    }
    setIsProfileSubmitted(true);
    setIsProfileModalOpen(false); // Close the modal
    handleConnect();
  };

  const getRandomName = (location: string): string => {
    let names = REGIONAL_NAMES[location];
    
    if (!names) {
      const key = Object.keys(REGIONAL_NAMES).find(k => location.includes(k));
      if (key) {
        names = REGIONAL_NAMES[key];
      }
    }
    if (!names) {
      names = REGIONAL_NAMES['Other'] || ['Stranger'];
    }
    return names[Math.floor(Math.random() * names.length)];
  };

  const handleConnect = () => {
    setIsConnected(true);
    const newStrangerName = getRandomName(profile.location);
    setStrangerName("Global Chat"); 
  };

  const handleStopChat = () => {
    setIsConnected(false);
    setMessages([]);
  };

  const handleToggleVanishMode = () => {
     setIsVanishMode(prev => !prev);
     // Note: toggling doesn't delete history, just changes future behavior
  };

  const handleSkip = () => {
    setIsConnected(false);
    setTimeout(() => setIsConnected(true), 300); 
  };

  const handleExit = () => {
    setIsConnected(false);
    setIsProfileSubmitted(false);
    setMessages([]);
    setIsSettingsOpen(false);
    setIsReportModalOpen(false);
    setIsProfileModalOpen(false);
    setPendingImage(null);
    setIsVanishMode(false);
  };

  const handleReportSubmit = (reason: string) => {
    setIsReportModalOpen(false);
    alert(`Report submitted for: ${reason}.`);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        let encoded = reader.result?.toString().replace(/^data:(.*,)?/, '') || '';
        resolve(encoded);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        const base64 = await fileToBase64(file);
        e.target.value = ''; 
        setPendingImage(base64); 
        setImageTimer(30); 
      } catch (err) {
        console.error("Image upload failed", err);
      }
    }
  };

  const handleSendImage = async () => {
    if (!pendingImage || !isConnected) return;
    
    try {
        await addDoc(collection(db, "messages"), {
            userId: currentUserId,
            image: pendingImage,
            imageSettings: {
                duration: imageTimer,
                isViewed: false,
                isExpired: false
            },
            timestamp: serverTimestamp(),
            vanishAt: isVanishMode ? Date.now() + 60000 : null
        });
        setPendingImage(null);
    } catch (e) {
        console.error("Error sending image:", e);
    }
  };

  const handleImageExpire = async (msgId: string) => {
    try {
        const msgRef = doc(db, "messages", msgId);
        await updateDoc(msgRef, {
            "imageSettings.isExpired": true
        });
    } catch (e) {
        console.error("Failed to expire image:", e);
    }
  };

  const handleImageView = async (msgId: string) => {
    try {
        const msgRef = doc(db, "messages", msgId);
        // Important: Set viewedAt server-side or trusted client time
        await updateDoc(msgRef, {
            "imageSettings.isViewed": true,
            "imageSettings.viewedAt": Date.now()
        });
    } catch (e) {
        console.error("Failed to view image:", e);
    }
  };

  const handleAudioSend = async (base64Audio: string) => {
    if (!isConnected) return;
    try {
        await addDoc(collection(db, "messages"), {
            userId: currentUserId,
            audio: base64Audio,
            timestamp: serverTimestamp(),
            vanishAt: isVanishMode ? Date.now() + 60000 : null
        });
    } catch (e) {
        console.error("Error sending audio:", e);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || !isConnected) return;

    // --- PII SAFETY CHECK ---
    const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const phonePattern = /\b(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/;
    
    if (emailPattern.test(inputText) || phonePattern.test(inputText)) {
      const proceed = window.confirm(
        "⚠️ Safety Warning\n\nIt looks like you might be sharing a phone number or email address.\n\nSharing personal information with strangers can be risky.\n\nClick OK to Send anyway, or Cancel to edit."
      );
      if (!proceed) return;
    }

    try {
        await addDoc(collection(db, "messages"), {
            text: inputText,
            userId: currentUserId,
            timestamp: serverTimestamp(),
            vanishAt: isVanishMode ? Date.now() + 60000 : null
        });
        setInputText('');
    } catch (e) {
        console.error("Error sending message:", e);
        alert("Failed to send message. Check console.");
    }
  };

  const handleReaction = (msgId: string, emoji: string) => {
    console.log("Reaction sent:", emoji);
  };

  const handleMessageReport = async (msgId: string) => {
     alert("Reported.");
  };

  const renderFormFields = (isLanding = false) => {
    const labelClass = "block text-[10px] font-bold uppercase tracking-widest text-secondary mb-1.5";
    const bgClass = isLanding 
      ? "bg-surface border-border focus:border-accent" 
      : "bg-surface border-border focus:border-accent";
    const inputClass = `w-full ${bgClass} border rounded-lg px-4 py-2.5 text-sm text-primary outline-none transition-all placeholder:text-secondary/50 focus:ring-1 focus:ring-accent/20`;

    return (
      <div className="space-y-4">
        <div>
          <label className={labelClass}>Username</label>
          <input 
            type="text" 
            value={profile.name}
            onChange={e => setProfile({...profile, name: e.target.value})}
            placeholder="Type your name"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Gender</label>
            <div className="relative">
               <select 
                value={profile.gender}
                onChange={e => setProfile({...profile, gender: e.target.value})}
                className={`${inputClass} appearance-none`}
              >
                {GENDER_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Age</label>
            <div className="relative">
              <select 
                value={profile.age}
                onChange={e => setProfile({...profile, age: e.target.value})}
                className={`${inputClass} appearance-none`}
              >
                {AGE_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className={labelClass}>Location</label>
          <div className="relative">
            <select 
              value={profile.location}
              onChange={e => setProfile({...profile, location: e.target.value})}
              className={`${inputClass} appearance-none`}
            >
              {LOCATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <Globe size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
          </div>
        </div>

        <div>
          <label className={labelClass}>Interests</label>
          <input 
            type="text" 
            value={profile.interests}
            onChange={e => setProfile({...profile, interests: e.target.value})}
            placeholder="Coding, Travel, Music..."
            className={inputClass}
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {['Tech', 'Anime', 'Cricket', 'Travel'].map(tag => (
              <button 
                key={tag}
                onClick={() => setProfile(p => ({...p, interests: p.interests ? `${p.interests}, ${tag}` : tag}))}
                className="text-[10px] px-2 py-1 rounded transition-colors bg-surface border border-border text-secondary hover:text-accent hover:border-accent"
              >
                + {tag}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // --- FILTERED MESSAGES ---
  // If Vanish Mode is active, remove expired messages from view locally.
  const displayMessages = messages.filter(msg => {
    if (!msg.vanishAt) return true; // Keep normal messages
    return msg.vanishAt > now; // Keep valid vanish messages
  });

  // 1. LANDING PAGE
  if (!isProfileSubmitted) {
    return (
      <div className="min-h-screen relative bg-background text-primary overflow-hidden transition-colors duration-700 ease-in-out font-sans">
        
        {/* Fixed Background Layer */}
        <div className="fixed inset-0 z-0 transition-all duration-700 ease-in-out dark:opacity-40 opacity-30 dark:invert-0 invert pointer-events-none">
           <DarkVeil />
        </div>

        {/* Header Elements (Theme Toggle) */}
        <div className="absolute top-6 right-6 z-20 animate-fade-in delay-300">
           <button onClick={toggleTheme} className="text-secondary hover:text-primary transition-colors p-2 rounded-full hover:bg-surface border border-transparent hover:border-border">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        {/* Main Content Layout */}
        <div className="relative z-10 flex flex-col lg:flex-row min-h-screen w-full">
          
          {/* Left Column: Hero Text & CTA */}
          <div className="flex-1 flex flex-col justify-center px-6 md:px-12 lg:px-24 pt-16 pb-8 lg:py-0 text-center lg:text-left order-1 lg:order-1">
             <div className="max-w-xl mx-auto lg:mx-0">
               {/* Logo & Brand */}
               <div className="flex items-center justify-center lg:justify-start gap-3 mb-8 animate-slide-up-fade">
                 <ChatzunoLogo size={42} />
                 <span className="font-bold text-2xl tracking-tight">Chatzuno</span>
               </div>
               
               {/* Heading */}
               <h1 className="text-4xl md:text-5xl lg:text-7xl font-normal tracking-wide leading-[1.1] mb-6 drop-shadow-sm animate-slide-up-fade delay-100 font-sans">
                 Instant chats. <br/>
                 <span className="font-bold text-primary">Infinite connections.</span>
               </h1>
               
               <p className="text-base md:text-lg text-secondary leading-relaxed mb-8 lg:border-l-2 lg:border-accent/20 lg:pl-4 animate-slide-up-fade delay-200">
                 Experience the next generation of anonymous chat. AI-enhanced, secure, and designed for meaningful conversations.
               </p>

               {/* Stats */}
               <div className="flex justify-center lg:justify-start gap-12 text-secondary animate-slide-up-fade delay-300 mb-10">
                  <div className="text-center lg:text-left">
                     <span className="block text-2xl font-bold text-primary">24k+</span>
                     <span className="text-xs uppercase tracking-wider opacity-60">Online Now</span>
                  </div>
                  <div className="text-center lg:text-left">
                     <span className="block text-2xl font-bold text-primary">Zero</span>
                     <span className="text-xs uppercase tracking-wider opacity-60">Trace Log</span>
                  </div>
               </div>

               {/* CTA Button */}
               <div className="animate-slide-up-fade delay-400">
                 <button 
                  onClick={() => setIsProfileModalOpen(true)}
                  className="bg-accent hover:bg-accentHover text-white text-lg font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-all transform hover:scale-105 shadow-lg mx-auto lg:mx-0 min-w-[200px]"
                 >
                   Start Chatting <ArrowRight size={20} />
                 </button>
               </div>
             </div>
          </div>

          {/* Right Column: 3D Phone Animation */}
          <div className="flex-1 flex items-center justify-center lg:justify-center px-6 md:px-12 pb-16 lg:py-0 animate-slide-up-fade delay-500 order-2 lg:order-2">
             <PerspectiveChatInterface />
          </div>

        </div>

        {/* Profile Modal */}
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fade-in">
             <div className="bg-surface border border-border w-full max-w-sm rounded-xl p-8 shadow-2xl relative animate-scale-in">
                <button 
                  onClick={() => setIsProfileModalOpen(false)}
                  className="absolute top-4 right-4 text-secondary hover:text-primary transition-colors"
                >
                  <X size={20} />
                </button>

                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold tracking-tight mb-2">Join the network</h2>
                    <p className="text-sm text-secondary">Setup your anonymous profile.</p>
                </div>
                
                {renderFormFields(true)}
                
                <button 
                  onClick={handleStartChat}
                  className="mt-8 w-full bg-accent hover:bg-accentHover text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] shadow-sm"
                >
                  Start Chatting <ArrowRight size={18} />
                </button>
             </div>
          </div>
        )}

      </div>
    );
  }

  // 2. CHAT PAGE
  return (
    <div className={`h-screen flex flex-col bg-background text-primary transition-colors duration-700 ease-in-out ${isVanishMode ? 'bg-black/95' : ''}`}>
      
      {/* --- FIREBASE ERROR OVERLAY --- */}
      {connectionError && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-fade-in">
          <div className="bg-surface border border-red-500/50 rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
             <AlertTriangle size={48} className="text-red-500 mb-4 mx-auto" />
             <h2 className="text-2xl font-bold text-center mb-2">Setup Required</h2>
             
             {connectionError === "PERMISSION_DENIED" ? (
               <div className="text-left mt-4 mb-6">
                  <p className="text-red-400 font-bold mb-3 text-sm">Firestore Rules are blocking access.</p>
                  <p className="text-secondary text-xs mb-3">Your Firebase Project is likely in "Production Mode", which denies all access by default.</p>
                  <ol className="list-decimal list-inside text-secondary space-y-2 text-xs border border-border p-3 rounded bg-black/20">
                    <li>Go to <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="underline text-accent hover:text-white">Firebase Console</a></li>
                    <li>Open <strong>Firestore Database</strong> &gt; <strong>Rules</strong> tab</li>
                    <li>Change <code className="bg-white/10 px-1 rounded text-red-300">allow read, write: if false;</code> to <code className="bg-white/10 px-1 rounded text-green-400">allow read, write: if true;</code></li>
                    <li>Click <strong>Publish</strong></li>
                  </ol>
               </div>
             ) : (
                <div className="bg-background p-4 rounded-lg border border-border mb-6 text-xs font-mono overflow-x-auto">
                   <span className="text-red-400 font-bold block mb-1">Error: {connectionError}</span>
                   <span className="text-secondary/60">
                     Check your <strong>firebase.ts</strong> config or internet connection.
                   </span>
                 </div>
             )}

             <button 
               onClick={() => window.location.reload()}
               className="w-full bg-accent hover:bg-accentHover text-white font-bold py-3 rounded-xl transition-all"
             >
               Reload App
             </button>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="px-6 py-4 flex justify-between items-center border-b border-border z-10 bg-background/80 backdrop-blur-md transition-colors duration-500">
        <div className="flex items-center gap-3">
          <ChatzunoLogo size={28} />
          <div className="hidden sm:block">
             <h1 className="font-bold text-sm">Chatzuno</h1>
             <p className="text-[10px] text-secondary font-medium flex items-center gap-1">
               <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
               {isConnected ? (strangerName || 'Stranger') : 'Offline'}
               {isVanishMode && <span className="text-purple-400 ml-2 animate-pulse flex items-center gap-1"><Ghost size={10} /> Vanish Mode</span>}
             </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          
          <button onClick={toggleTheme} className="text-secondary hover:text-primary transition-colors" title="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button 
            onClick={handleToggleVanishMode} 
            className={`transition-colors ${isVanishMode ? 'text-purple-400 animate-pulse' : 'text-secondary hover:text-primary'}`}
            title="Toggle Vanish Mode"
          >
            <Ghost size={20} />
          </button>

          <button onClick={() => setIsSettingsOpen(true)} className="text-secondary hover:text-primary transition-colors" title="Settings">
            <Settings size={20} />
          </button>

          {isConnected ? (
             <button onClick={handleStopChat} className="text-red-500 hover:text-red-400 font-medium text-sm flex items-center gap-2 transition-colors" title="End Chat">
               <Square size={16} fill="currentColor" /> <span className="hidden sm:inline">End</span>
             </button>
          ) : (
            <button onClick={handleSkip} className="text-accent hover:text-accentHover font-medium text-sm flex items-center gap-2 transition-colors" title="New Match">
              <Play size={16} fill="currentColor" /> <span className="hidden sm:inline">New</span>
            </button>
          )}
          
          <button onClick={handleExit} className="text-secondary hover:text-red-500 transition-colors" title="Exit to Home">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* Main Chat */}
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {isVanishMode && (
          <div className="absolute inset-0 z-0 pointer-events-none opacity-5 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.3)_0,rgba(0,0,0,0)_100%)]"></div>
        )}
        <ChatArea 
          messages={displayMessages} 
          inputValue={inputText} 
          setInputValue={setInputText} 
          onSend={handleSendMessage} 
          onImageSelect={handleImageSelect}
          onAudioSend={handleAudioSend}
          onReaction={handleReaction}
          onReport={handleMessageReport}
          onImageExpire={handleImageExpire}
          onImageView={handleImageView}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          isTyping={isTyping}
          userName={profile.name}
          strangerName={strangerName}
        />
      </main>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface border border-border w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up">
             <div className="p-4 border-b border-border flex justify-between items-center">
                <h2 className="font-bold">Settings</h2>
                <button onClick={() => setIsSettingsOpen(false)}><X size={20} className="text-secondary" /></button>
             </div>
             <div className="p-6 overflow-y-auto">
                {renderFormFields(false)}
             </div>
             <div className="p-4 border-t border-border">
                <button onClick={() => setIsSettingsOpen(false)} className="w-full bg-accent text-background font-bold py-3 rounded-lg">Save</button>
             </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-surface border border-border w-full max-w-sm rounded-xl shadow-2xl overflow-hidden animate-slide-up">
            <div className="p-4 border-b border-border flex justify-between items-center bg-red-500/10">
              <h2 className="font-bold text-red-500 flex items-center gap-2"><AlertTriangle size={18}/> Report User</h2>
              <button onClick={() => setIsReportModalOpen(false)}><X size={20} className="text-secondary" /></button>
            </div>
            <div className="p-6">
              <p className="text-sm text-secondary mb-4">Select a reason. This will end the chat immediately.</p>
              <div className="space-y-2">
                {['Abusive Behavior', 'Inappropriate Content', 'Spam / Bot', 'Underage', 'Other'].map((reason) => (
                  <button 
                    key={reason}
                    onClick={() => handleReportSubmit(reason)}
                    className="w-full text-left px-4 py-3 rounded-lg border border-border hover:bg-red-500/5 hover:border-red-500/30 hover:text-red-500 transition-all text-sm font-medium"
                  >
                    {reason}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

       {/* Image Send/Preview Modal */}
       {pendingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-scale-in">
          <div className="bg-surface border border-border w-full max-w-sm md:max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2"><Timer size={18} /> Set Self-Destruct Timer</h3>
              <button onClick={() => setPendingImage(null)} className="text-secondary hover:text-white"><X size={20} /></button>
            </div>
            
            <div className="p-4 flex flex-col items-center bg-black/20">
              <div className="relative rounded-lg overflow-hidden max-h-[300px] border border-border/20">
                <img src={`data:image/jpeg;base64,${pendingImage}`} alt="Preview" className="max-w-full max-h-[300px] object-contain" />
              </div>
            </div>
            
            <div className="p-4 bg-surface">
              <p className="text-xs text-secondary font-bold uppercase tracking-wider mb-3">Visible Duration</p>
              <div className="flex justify-between gap-2 mb-6">
                {IMAGE_TIMER_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setImageTimer(opt.value)}
                    className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${
                      imageTimer === opt.value 
                        ? 'bg-accent text-background border-accent' 
                        : 'bg-surface border-border text-secondary hover:border-accent/50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={handleSendImage} 
                className="w-full bg-accent hover:bg-accentHover text-background font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                Send Secure Image <Check size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
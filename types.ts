
export enum MessageType {
  USER = 'USER',
  STRANGER = 'STRANGER',
  SYSTEM = 'SYSTEM'
}

export interface GuardianStatus {
  level: 'safe' | 'warning' | 'danger';
  reason?: string;
}

export interface ImageSettings {
  duration: number | null; // null = infinity, number = seconds
  isViewed: boolean;
  viewedAt?: number;
  isExpired: boolean;
}

export interface Message {
  id: string;
  userId?: string; // New field for backend mapping
  text?: string;
  image?: string; // Base64 string (no prefix)
  imageSettings?: ImageSettings;
  audio?: string; // Base64 string for audio
  type: MessageType;
  timestamp: number;
  guardianStatus?: GuardianStatus;
  reactions?: Record<string, number>; // e.g., { '❤️': 1 }
  isReported?: boolean;
  vanishAt?: number; // Timestamp when message should auto-delete
}

export interface UserProfile {
  name: string;
  gender: string;
  age: string;
  location: string;
  interests: string;
}

export interface DiscoveryTask {
  title: string;
  description: string;
  active: boolean;
}

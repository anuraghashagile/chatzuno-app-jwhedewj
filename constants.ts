// Models
export const MODEL_CHAT = 'gemini-2.5-flash';

// Form Options
export const GENDER_OPTIONS = ['Male', 'Female', 'Non-binary', 'Other'];

export const AGE_OPTIONS = [
  '18-21', '22-25', '26-30', '31-40', '41-50', '50+'
];

export const LOCATION_OPTIONS = [
  'Kerala (Malayalam/English)',
  'Tamil Nadu (Tamil/English)',
  'Maharashtra (Mumbai/Pune)',
  'Delhi (NCR)',
  'Karnataka (Bangalore)',
  'Andhra Pradesh / Telangana',
  'West Bengal',
  'Punjab',
  'Uttar Pradesh',
  'India (General)',
  'USA',
  'UK',
  'Canada',
  'UAE',
  'Other'
];

export const REGIONAL_NAMES: Record<string, string[]> = {
  'Kerala': ['Arjun', 'Pranav', 'Karthik', 'Sneha', 'Anjali', 'Malavika', 'Rahul', 'Nithin', 'Vishnu', 'Lakshmi'],
  'Tamil Nadu': ['Vijay', 'Surya', 'Karthik', 'Priya', 'Divya', 'Deepa', 'Ramesh', 'Senthil', 'Lakshmi', 'Sundar'],
  'Maharashtra': ['Rohan', 'Aditya', 'Vikram', 'Neha', 'Pooja', 'Shruti', 'Raj', 'Amit', 'Aniket', 'Siddharth'],
  'Delhi': ['Aryan', 'Kabir', 'Riya', 'Ananya', 'Rohit', 'Simran', 'Karan', 'Priya', 'Vikas', 'Mehak'],
  'Karnataka': ['Darshan', 'Manoj', 'Kavya', 'Vidya', 'Chetan', 'Suresh', 'Varun', 'Deepika'],
  'Andhra Pradesh / Telangana': ['Sai', 'Pavan', 'Kiran', 'Swathi', 'Sravani', 'Raju', 'Harsha', 'Nikhil'],
  'West Bengal': ['Rahul', 'Sourav', 'Priya', 'Deb', 'Ankit', 'Riya', 'Abhik', 'Sneha'],
  'Punjab': ['Manpreet', 'Gurpreet', 'Simran', 'Raj', 'Harpreet', 'Amit', 'Jassi', 'Kiran'],
  'Uttar Pradesh': ['Rahul', 'Amit', 'Priya', 'Neha', 'Ravi', 'Ankit', 'Shubham', 'Pooja'],
  'India (General)': ['Rahul', 'Priya', 'Amit', 'Neha', 'Rohan', 'Sneha', 'Vikram', 'Aditi', 'Kabir', 'Zoya'],
  'USA': ['James', 'John', 'Emily', 'Sarah', 'Michael', 'David', 'Jessica', 'Daniel'],
  'UK': ['Oliver', 'George', 'Harry', 'Amelia', 'Isabella', 'Emily', 'Jack', 'Sophie'],
  'Canada': ['Liam', 'Noah', 'Olivia', 'Emma', 'William', 'James', 'Lucas', 'Charlotte'],
  'UAE': ['Mohammed', 'Ahmed', 'Fatima', 'Maryam', 'Ali', 'Omar', 'Yusuf', 'Aisha'],
  'Other': ['Alex', 'Sam', 'Jordan', 'Taylor', 'Casey', 'Jamie', 'Riley', 'Morgan']
};

export const IMAGE_TIMER_OPTIONS = [
  { label: '30s', value: 30 },
  { label: '50s', value: 50 },
  { label: '1m', value: 60 },
  { label: '2m', value: 120 },
  { label: '∞', value: null },
];

// System Instructions
export const COACH_INSTRUCTION = `
You are an expert Social Interaction Coach designed to help users have better conversations in an anonymous chat setting.
Analyze the last few messages.
If the conversation is flowing well, offer a "Green" status and a subtle compliment.
If it is stalling, offer a "Yellow" status and a specific, relevant "Topic Booster" or open-ended question based on what has been said so far.
If it is awkward or one-sided, offer a "Red" status and a specific "Icebreaker" to reset.
Keep your advice extremely concise (max 15 words).
Output JSON: { "status": "good" | "stalled" | "awkward", "advice": "string" }
`;

export const GUARDIAN_INSTRUCTION = `
You are the AI Guardian, an automated moderator.
Analyze the provided message for toxicity, harassment, PII leakage, or extreme vulgarity.
Strictly categorize into: "safe", "warning" (mild insults, heated debate), "danger" (hate speech, sexual harassment, sharing phone numbers).
Output JSON: { "level": "safe" | "warning" | "danger", "reason": "short string" }
`;

export const DISCOVERY_PROMPT = `
Generate a quick, fun, collaborative micro-game or conversation starter task for two strangers meeting online. 
Examples: "Plan a bank heist together using only emojis", "Debate: Pizza vs Tacos, but you must switch sides every 3 messages".
Keep it short and engaging.
Output JSON: { "title": "string", "description": "string" }
`;
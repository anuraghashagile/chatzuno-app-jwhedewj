// Service disabled - Converted to Real Firebase Backend
// This file is kept empty to avoid breaking old imports during transition
import { UserProfile, GuardianStatus } from "../types";

export const generateStrangerResponse = async (
  history: any[],
  userProfile: UserProfile,
  strangerName: string
): Promise<string> => {
  return "Backend connected.";
};

export const analyzeSafety = async (text: string): Promise<GuardianStatus> => {
  return { level: 'safe' };
};
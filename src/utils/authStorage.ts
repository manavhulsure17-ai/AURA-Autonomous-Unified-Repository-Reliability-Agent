import { AuthUser } from '../types';

const USERS_STORAGE_KEY = 'aura_auth_users';
const CURRENT_SESSION_KEY = 'aura_current_session';

export const DEFAULT_USERS: AuthUser[] = [
  {
    email: 'manavhulsure17@gmail.com',
    name: 'Manav Hulsure',
    pin: '2026',
    role: 'Lead Architect',
    registeredAt: '2026-09-18T10:00:00Z',
  },
  {
    email: 'operator@aura.io',
    name: 'Platform Operator',
    pin: '1234',
    role: 'Principal SRE',
    registeredAt: '2026-09-17T08:30:00Z',
  },
];

export function getStoredUsers(): AuthUser[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    return parsed;
  } catch {
    return DEFAULT_USERS;
  }
}

export function saveUsers(users: AuthUser[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users to storage', err);
  }
}

export function getCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(CURRENT_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: AuthUser | null): void {
  try {
    if (!user) {
      localStorage.removeItem(CURRENT_SESSION_KEY);
    } else {
      localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(user));
    }
  } catch (err) {
    console.error('Failed to update session', err);
  }
}

export interface AuthResult {
  success: boolean;
  message: string;
  user?: AuthUser;
  isNewUser?: boolean;
}

export function registerUser(email: string, pin: string): AuthResult {
  const normalizedEmail = email.trim().toLowerCase();
  const trimmedPin = pin.trim();

  if (!normalizedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return { success: false, message: 'Please provide a valid email address.' };
  }

  if (!/^\d{4}$/.test(trimmedPin)) {
    return { success: false, message: 'PIN must be exactly 4 numeric digits.' };
  }

  const users = getStoredUsers();
  const exists = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (exists) {
    return {
      success: false,
      message: 'An account with this email already exists. Please sign in with your 4-digit PIN.',
    };
  }

  const derivedName = normalizedEmail.split('@')[0]
    .replace(/[._-]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const newUser: AuthUser = {
    email: normalizedEmail,
    name: derivedName,
    pin: trimmedPin,
    role: 'Engineer',
    registeredAt: new Date().toISOString(),
  };

  const updatedUsers = [...users, newUser];
  saveUsers(updatedUsers);
  setCurrentUser(newUser);

  return {
    success: true,
    message: 'Account created successfully! Welcome to AURA.',
    user: newUser,
    isNewUser: true,
  };
}

export function loginUser(email: string, pin: string): AuthResult {
  const normalizedEmail = email.trim().toLowerCase();
  const trimmedPin = pin.trim();

  if (!normalizedEmail) {
    return { success: false, message: 'Please enter your email address.' };
  }

  if (!/^\d{4}$/.test(trimmedPin)) {
    return { success: false, message: 'PIN must be exactly 4 numeric digits.' };
  }

  const users = getStoredUsers();
  const user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return {
      success: false,
      message: 'No account registered with this email. Switch to "Register" to create one in seconds.',
    };
  }

  if (user.pin !== trimmedPin) {
    return {
      success: false,
      message: 'Incorrect 4-digit PIN. Please re-enter or check your credentials.',
    };
  }

  setCurrentUser(user);
  return {
    success: true,
    message: `Welcome back, ${user.name || user.email}!`,
    user,
  };
}

export function logoutUser(): void {
  setCurrentUser(null);
}

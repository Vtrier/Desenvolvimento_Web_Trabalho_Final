export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  emailVerified: boolean;
  provider: "email" | "google" | "github";
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

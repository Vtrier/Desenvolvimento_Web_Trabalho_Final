import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  updateProfile,
  deleteUser,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  EmailAuthProvider,
  User,
  AuthError,
} from "firebase/auth";
import { doc, setDoc, getDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, googleProvider, githubProvider } from "@/lib/firebase";
import { UserProfile } from "@/types/user";

export function mapFirebaseError(error: AuthError): string {
  const map: Record<string, string> = {
    "auth/email-already-in-use": "Este e-mail já está em uso.",
    "auth/invalid-email": "E-mail inválido.",
    "auth/weak-password": "Senha muito fraca. Use ao menos 6 caracteres.",
    "auth/user-not-found": "Usuário não encontrado.",
    "auth/wrong-password": "Senha incorreta.",
    "auth/invalid-credential": "E-mail ou senha incorretos.",
    "auth/too-many-requests": "Muitas tentativas. Tente novamente mais tarde.",
    "auth/popup-closed-by-user": "Login cancelado pelo usuário.",
    "auth/account-exists-with-different-credential":
      "Este e-mail já está cadastrado com outro método de login. Tente entrar com o método original.",
    "auth/network-request-failed": "Erro de conexão. Verifique sua internet.",
    "auth/requires-recent-login":
      "Por segurança, faça login novamente antes de excluir sua conta.",
  };
  return map[error.code] ?? "Ocorreu um erro inesperado. Tente novamente.";
}

async function saveUserToFirestore(
  user: User,
  extra: Partial<UserProfile> = {}
): Promise<void> {
  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, {
      uid: user.uid,
      name: user.displayName ?? extra.name ?? "",
      email: user.email,
      photoURL: user.photoURL ?? null,
      emailVerified: user.emailVerified,
      provider: extra.provider ?? "email",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
}

export async function registerWithEmail(name: string, email: string, password: string): Promise<User> {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName: name });
  await sendEmailVerification(user);
  await saveUserToFirestore(user, { name, provider: "email" });
  return user;
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

export async function loginWithGoogle(): Promise<User> {
  const { user } = await signInWithPopup(auth, googleProvider);
  await saveUserToFirestore(user, { provider: "google" });
  return user;
}

export async function loginWithGithub(): Promise<User> {
  const { user } = await signInWithPopup(auth, githubProvider);
  await saveUserToFirestore(user, { provider: "github" });
  return user;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function resendVerificationEmail(): Promise<void> {
  const user = auth.currentUser;
  if (user) await sendEmailVerification(user);
}

export async function deleteAccount(password?: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("Nenhum usuário autenticado.");

  const providerIds = user.providerData.map((p) => p.providerId);

  if (providerIds.includes("password") && password) {
    const credential = EmailAuthProvider.credential(user.email!, password);
    await reauthenticateWithCredential(user, credential);
  } else if (providerIds.includes("google.com")) {
    await reauthenticateWithPopup(user, googleProvider);
  } else if (providerIds.includes("github.com")) {
    await reauthenticateWithPopup(user, githubProvider);
  }

  await deleteDoc(doc(db, "users", user.uid));
  await deleteUser(user);
}

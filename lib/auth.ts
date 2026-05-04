'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendEmailVerification,
  type ConfirmationResult,
  type User
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

import { auth, db, googleProvider } from '@/lib/firebase/client';
import { COLLECTIONS } from '@/lib/constants';

export const setupRecaptcha = (containerId: string) => {
  if (typeof window === 'undefined') {
    throw new Error('Recaptcha can only be initialized in browser');
  }

  // @ts-expect-error firebase adds the verifier on window at runtime
  if (!window.recaptchaVerifier) {
    // @ts-expect-error firebase adds the verifier on window at runtime
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible'
    });
  }

  // @ts-expect-error firebase adds the verifier on window at runtime
  return window.recaptchaVerifier as RecaptchaVerifier;
};

export const sendPhoneOtp = async (phone: string, containerId: string): Promise<ConfirmationResult> => {
  const verifier = setupRecaptcha(containerId);
  return signInWithPhoneNumber(auth, phone, verifier);
};

export const signUpWithEmail = async (
  name: string,
  email: string,
  password: string,
  phone?: string
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName: name });
  await sendEmailVerification(userCredential.user);

  await setDoc(doc(db, COLLECTIONS.users, userCredential.user.uid), {
    uid: userCredential.user.uid,
    username: name.toLowerCase().replace(/\s+/g, ''),
    fullName: name,
    email,
    phone: phone ?? '',
    role: 'user',
    banned: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastSeenAt: serverTimestamp()
  });

  return userCredential.user;
};

export const loginWithEmail = async (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = async () => {
  const credential = await signInWithPopup(auth, googleProvider);
  const userRef = doc(db, COLLECTIONS.users, credential.user.uid);
  const userSnapshot = await getDoc(userRef);

  if (!userSnapshot.exists()) {
    await setDoc(userRef, {
      uid: credential.user.uid,
      username: (credential.user.displayName || 'user').toLowerCase().replace(/\s+/g, ''),
      fullName: credential.user.displayName || 'User',
      email: credential.user.email,
      phone: credential.user.phoneNumber || '',
      photoURL: credential.user.photoURL || '',
      role: 'user',
      banned: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastSeenAt: serverTimestamp()
    });
  }

  return credential;
};

export const resetPassword = async (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

export const logout = async () => {
  return signOut(auth);
};

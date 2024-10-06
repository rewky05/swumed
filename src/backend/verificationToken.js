import { getAuth, sendEmailVerification, applyActionCode } from 'firebase/auth';
import { ref, set, get, remove } from 'firebase/database';
import { database } from './firebase';

export const sendVerificationEmail = async (user) => {
  const auth = getAuth();
  const token = generateToken(); 
  
  const expiresAt = new Date(Date.now() + 3600000).toISOString();

  console.log("Generating token:", token);
  console.log("Token data to store:", { expiresAt, userId: user.uid });

  try {
    await sendEmailVerification(user, {
      url: `https://swumed-afb7e.firebaseapp.com/verify?token=${token}`,
      handleCodeInApp: true
    });

    await set(ref(database, `emailVerificationTokens/${token}`), {
      expiresAt: expiresAt,
      userId: user.uid
    });

    console.log("Verification email sent and token stored.");
  } catch (error) {
    console.error("Error sending email verification:", error);
  }
};

const generateToken = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const verifyEmail = async (token) => {
  const tokenRef = ref(database, `emailVerificationTokens/${token}`);
  const snapshot = await get(tokenRef);

  if (snapshot.exists()) {
    const tokenData = snapshot.val();
    const auth = getAuth();
    const user = auth.currentUser;

    if (user && tokenData.expiresAt > new Date().toISOString()) {
      try {
        await applyActionCode(auth, token); 
        await remove(tokenRef); 
        console.log("Email verified successfully.");
      } catch (error) {
        console.error("Error verifying email:", error);
      }
    } else {
      console.error("Token is expired or invalid.");
    }
  } else {
    console.error("Token does not exist.");
  }
};

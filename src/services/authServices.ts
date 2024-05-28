import { ath, db } from "../firebase/clientApp";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  email: string;
  password: string;
  role: string;
};

//Login dengan Firebase
export const login = async ({ email, password }: LoginData): Promise<any> => {
  try {
    const userCredential = await signInWithEmailAndPassword(ath, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(error.message || "An error occurred during authentication");
  }  
};

//Register dengan Firebase dan menyimpannya dii Firestore
export const register = async ({ email, password, role }: RegisterData): Promise<any> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(ath, email, password);
    const user = userCredential.user;

    // Menyimpan data pengguna ke Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: role
    });

    return user;
  } catch (error: any) {
    throw new Error(error.message || "An error occurred during authentication");
  }
};

import { useState, useEffect } from 'react';
import { ath, db } from '../firebase/clientApp';
import { doc, getDoc } from 'firebase/firestore';

type Auth = {
  id?: string;
  email?: string;
  role?: string;
}

function useAuthLS() {
  const [auth, setAuth] = useState<Auth>({});

  useEffect(() => {
    const unsubscribe = ath.onAuthStateChanged(async (user) => {
      if (user) {
        console.log(`User is logged in with email: ${user.email}`);
        try {
          // Jika pengguna sudah login, dapatkan informasi peran pengguna dari Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setAuth({
              id: user.uid,
              email: userData.email,
              role: userData.role,
            });
          } else {
            console.log('No such document!');
          }
        } catch (error) {
          console.log('Error getting user document:', error);
        }
      } else {
        // Jika pengguna tidak login, reset state auth
        console.log('No user is logged in');
        setAuth({});
      }
    });

    return () => unsubscribe(); // Membersihkan subscription saat komponen unmount
  }, []);

  // Fungsi untuk logout menggunakan Firebase Authentication
  const removeAuth = async () => {
    await ath.signOut();
  }

  return { auth, setAuth, removeAuth };
}

export default useAuthLS;
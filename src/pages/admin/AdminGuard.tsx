import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import AccessDenied from "./AccessDenied";
import { auth, firestore } from "src/firebase/clientApp";
import { Box } from "@chakra-ui/react";
import { Spinner } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";

const LoadingScreen = () => (
  <Box
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#EEF8F4",
    }}
  >
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      size="xl"
      color="#347357"
    />
    <Box ml={4} fontSize="xl" color="#347357">
      Loading...
    </Box>
  </Box>
);

type AdminGuardProps = {
  children?: React.ReactNode;
};

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const checkAdminStatus = async () => {
      setLoading(true);
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(firestore, "users", user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists() && userDoc.data()?.role === "admin") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    checkAdminStatus();
  }, [user]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAdmin) {
    return <AccessDenied />;
  }

  return <>{children}</>;
};
export default AdminGuard;

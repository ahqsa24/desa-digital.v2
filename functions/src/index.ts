import * as functions from "firebase-functions/v1"; // Use v1 for auth triggers
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

export const createUser = functions.auth.user().onCreate(async (user) => {
  try {
    await db
      .collection("users")
      .doc(user.uid)
      .set(JSON.parse(JSON.stringify(user)));
  } catch (error) {
    console.error("Error creating user document:", error);
  }
});

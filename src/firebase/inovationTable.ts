import { DocumentData, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { firestore } from "./clientApp";


export const getDocuments = async (collectionName: string) : Promise<DocumentData[]> => {
    try {
        const collectionRef = collection(firestore, collectionName);
        const querySnapshot = await getDocs(collectionRef);

        const innovations: DocumentData[] = [];

        querySnapshot.forEach(doc => {
            innovations.push(doc.data());
            innovations[innovations.length - 1].id = doc.id;
        });
        return innovations;
    } catch (error) {
        console.error("Error fetching documents:", error);
        return [];
    }
};

export const getDocumentById = async (collectionName: string, documentId: string | undefined): Promise<DocumentData> => {
    try {
        if (!documentId) {
            console.error("No document ID provided");
            return {};
        }
        const docRef = doc(firestore, collectionName, documentId);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            return docSnapshot.data();
        } else {
            console.error("No document found with the provided ID:", documentId);
            return {};
        }
    } catch (error) {
        console.error("Error fetching document:", error);
        return {};
    }
};
import { DocumentData, collection, getDocs, doc, getDoc } from "firebase/firestore";
import { firestore } from "./clientApp";

export const getDocuments = async (collectionName: string) : Promise<DocumentData[]> => {
    try {
        const collectionRef = collection(firestore, collectionName);
        const querySnapshot = await getDocs(collectionRef);

        const documents: DocumentData[] = [];

        querySnapshot.forEach(doc => {
            const data = doc.data();
            data.id = doc.id;
            documents.push(data);
        });
        return documents;
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
            return { id: docSnapshot.id, ...docSnapshot.data() };
        } else {
            console.error("No document found with the provided ID:", documentId);
            return {};
        }
    } catch (error) {
        console.error("Error fetching document:", error);
        return {};
    }
};

const fetchInnovators = async () => {
    const innovators = await getDocuments("innovators");
    console.log(innovators);
};

const fetchInnovatorById = async (documentId: string) => {
    const innovator = await getDocumentById("innovators", documentId);
    console.log(innovator);
};
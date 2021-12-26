import { app } from '../firebase'
import { getFirestore, doc, getDoc } from "firebase/firestore";

export const fetchInfoAboutUser = async (uid) => {
    const db = getFirestore(app);
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data()
    }
}
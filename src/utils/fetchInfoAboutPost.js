import { app } from "../firebase";
import { getFirestore, doc, getDoc } from "firebase/firestore";

export const fetchInfoAboutPost = async (postId) => {
  const db = getFirestore(app);
  const docRef = doc(db, "posts", postId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data();
  }
};

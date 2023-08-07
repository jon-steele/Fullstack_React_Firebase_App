import { useState, useEffect } from "react";
import { db } from "./firebase";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

export const useFirebase = (collectionName) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchAll = () => {
      const collectionRef = collection(db, collectionName);
      const unsubscribe = onSnapshot(collectionRef, (snapshot) => {
        const data = snapshot.docs.map((docSnapshot) => {
          const docData = docSnapshot.data();
          if (docData.DOB && typeof docData.DOB.toDate === "function") {
            docData.DOB = docData.DOB.toDate().toISOString().split("T")[0];
          }
          return { id: docSnapshot.id, ...docData };
        });
        setData(data);
      });

      return unsubscribe;
    };

    const unsubscribe = fetchAll();
    return () => unsubscribe();
  }, [collectionName]);

  const add = async (newData) => {
    const docRef = await addDoc(collection(db, collectionName), newData);
    return docRef.id;
  };

  const update = async (id, updatedData) => {
    await updateDoc(doc(db, collectionName, id), updatedData);
  };

  const remove = async (id) => {
    await deleteDoc(doc(db, collectionName, id));
  };

  return { data, add, update, remove };
};

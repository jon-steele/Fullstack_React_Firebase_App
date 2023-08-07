// useFirebase.js
import { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

const useFirebase = (collectionName) => {
  const [data, setData] = useState([]);

  const db = firebase.firestore();

  const fetchAll = async () => {
    const snapshot = await db.collection(collectionName).get();
    const fetchedData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setData(fetchedData);
  };

  const add = async (newData) => {
    const docRef = await db.collection(collectionName).add(newData);
    return docRef.id;
  };

  const update = async (id, updatedData) => {
    await db.collection(collectionName).doc(id).set(updatedData);
  };

  const remove = async (id) => {
    await db.collection(collectionName).doc(id).delete();
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return { data, add, update, remove };
};

export default useFirebase;

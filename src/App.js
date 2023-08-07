import "@coreui/coreui/dist/css/coreui.min.css";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  updateDoc,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

import UserTable from "./UserTable";
import UserForm from "./UserForm";

const App = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm();
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [country, setCountry] = useState("Canada");
  const watchCountry = watch("country", "Canada");

  useEffect(() => {
    setCountry(watchCountry);

    const usersCollectionRef = collection(db, "users");
    const unsubscribe = onSnapshot(usersCollectionRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => {
        const data = doc.data();
        if (data.DOB && typeof data.DOB.toDate === "function") {
          data.DOB = data.DOB.toDate().toISOString().split("T")[0];
        }
        return { id: doc.id, ...data };
      });
      setUsers(data);
    });

    return () => unsubscribe();
  }, [watchCountry]);

  const onSubmit = async (data) => {
    try {
      let dob = new Date(`${data.dateOfBirth}T00:00:00Z`);
      if (isNaN(dob.getTime())) {
        throw new Error("Invalid date format");
      }
      dob.setHours(dob.getHours() + 8);
      data.dateOfBirth = Timestamp.fromDate(dob);

      if (typeof data.country === "string") {
        data.country = { value: data.country, label: data.country };
      }
      if (typeof data.city === "string") {
        data.city = { value: data.city, label: data.city };
      }

      const usersCollectionRef = collection(db, "users");

      if (editIndex !== -1) {
        const docRef = doc(db, "users", users[editIndex].id);
        await updateDoc(docRef, data);
      } else {
        await addDoc(usersCollectionRef, data);
      }

      reset();
      setEditIndex(-1);
    } catch (error) {
      console.error("Error submitting form: ", error);
    }
  };

  const handleDelete = async (index) => {
    try {
      const userToDelete = users[index];
      const userDocRef = doc(db, "users", userToDelete.id);
      await deleteDoc(userDocRef);

      const updatedUsers = [...users];
      updatedUsers.splice(index, 1);
      setUsers(updatedUsers);
      reset();

      if (editIndex === index) {
        setEditIndex(-1);
      }
    } catch (error) {
      console.error("Error deleting user: ", error);
    }
  };

  const handleEdit = (index) => {
    setEditIndex(index);
    const userToEdit = users[index];
    const dob = userToEdit.dateOfBirth.toDate().toISOString().split("T")[0];

    const userFormValues = {
      name: userToEdit.name,
      dateOfBirth: dob,
      country: userToEdit.country,
      city: userToEdit.city,
    };

    reset(userFormValues);
  };

  return (
    <div className="d-flex flex-column m-auto col-12 col-md-9">
      <UserForm
        control={control}
        errors={errors}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        setCountry={setCountry}
        country={country}
        setValue={setValue}
        editIndex={editIndex}
      />

      <div className="m-auto mt-5 px-2 w-100">
        <UserTable
          users={users}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default App;

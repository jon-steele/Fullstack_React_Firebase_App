// useUserActions hold the onSubmit, handleDelete, and handleEdit functions for the UserForm component buttons.

import { Timestamp } from "firebase/firestore";
import { useFirebase } from "./useFirebase";

export const useUserActions = (reset, editIndex, setEditIndex) => {
  const { data: users, add, update, remove } = useFirebase("users");

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

      if (editIndex !== -1) {
        await update(users[editIndex].id, data);
      } else {
        await add(data);
      }
      
      setEditIndex(-1);
    } catch (error) {
      console.error("Error submitting form: ", error);
    }
    
    reset({
      name: "", 
      dateOfBirth: "", 
      country: { value: "CA", label: "Canada" },
      city: { value: "OT", label: "Ottawa" }
    });
  };

  const handleDelete = async (index) => {
    try {
      const userToDelete = users[index];
      await remove(userToDelete.id);

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

  return { users, onSubmit, handleDelete, handleEdit };
};

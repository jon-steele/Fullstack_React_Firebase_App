import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import Select from "react-select";

const Form = () => {
  const { handleSubmit, control, errors, reset, watch, setValue } = useForm();
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
        // Convert Firestore Timestamp to JavaScript Date object
        if (data.DOB && typeof data.DOB.toDate === "function") {
          data.DOB = data.DOB.toDate().toISOString().split("T")[0];
        }
        return { id: doc.id, ...data };
      });
      setUsers(data);
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, [watchCountry]);

  // Function that handles submitting new data
  const onSubmit = async (data) => {
    // Convert date string to JavaScript Date, then to Firestore Timestamp
    let dob = new Date(`${data.dateOfBirth}T00:00:00Z`);
    dob.setHours(dob.getHours() + 8); // Conversion buffer for Firestore
    data.dateOfBirth = Timestamp.fromDate(dob);
  
    // Ensure `country` and `city` are objects with `value` and `label` properties
    if (typeof data.country === "string") {
      data.country = { value: data.country, label: data.country };
    }
    if (typeof data.city === "string") {
      data.city = { value: data.city, label: data.city };
    }
  
    const usersCollectionRef = collection(db, "users");
  
    if (editIndex !== -1) {
      // If we are editing an existing user, update the user in Firestore
      const docRef = doc(db, "users", users[editIndex].id);
      await updateDoc(docRef, data);
    } else {
      // If we are not editing, add the new user to Firestore
      await addDoc(usersCollectionRef, data);
    }
  
    reset(); // Reset the form after submission
    setEditIndex(-1); // Reset editIndex after updating
  };
  

  // Function to handle user deletion
  const handleDelete = async (index) => {
    // Delete the user from Firestore
    const userToDelete = users[index];
    const userDocRef = doc(db, "users", userToDelete.id);
    await deleteDoc(userDocRef);

    // Delete the user from the local state
    const updatedUsers = [...users];
    updatedUsers.splice(index, 1);
    setUsers(updatedUsers);
    
    reset(); // Reset the form to prevent association error

    if (editIndex === index) {
        setEditIndex(-1);
      }
  };

  // Function to handle user edit
  const handleEdit = (index) => {
    setEditIndex(index);
    const userToEdit = users[index];
  
    // Convert Firestore Timestamp to JavaScript Date, then format as 'YYYY-MM-DD'
    const dob = userToEdit.dateOfBirth.toDate().toISOString().split('T')[0];
  
    // Create a new object that contains only the fields in your form
    const userFormValues = {
      name: userToEdit.name,
      dateOfBirth: dob,
      country: userToEdit.country,
      city: userToEdit.city,
    };
  
    reset(userFormValues);
  };
  

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          render={({ field }) => <input {...field} placeholder="Name" />}
        />
        {errors !== undefined && errors.name && <p>{errors.name.message}</p>}

        <Controller
          name="dateOfBirth"
          control={control}
          defaultValue=""
          render={({ field }) => <input type="date" {...field} />}
        />
        {errors !== undefined && errors.dateOfBirth && (
          <p>{errors.dateOfBirth.message}</p>
        )}

        <Controller
          name="country"
          control={control}
          defaultValue={{ value: "CA", label: "Canada" }}
          render={({ field }) => (
            <Select
              {...field}
              options={[
                { value: "CA", label: "Canada" },
                { value: "US", label: "USA" },
              ]}
              isSearchable
              onChange={(selectedOption) => {
                setCountry(selectedOption.value);

                // Reset city when country changes
                if (selectedOption.value === "CA") {
                  setValue("city", { value: "OT", label: "Ottawa" });
                } else {
                  setValue("city", { value: "LV", label: "Las Vegas" });
                }

                field.onChange(selectedOption);
              }}
            />
          )}
        />

        <Controller
          name="city"
          control={control}
          defaultValue={{ value: "OT", label: "Ottawa" }}
          render={({ field }) => (
            <Select
              {...field}
              options={
                country.label === "Canada"
                  ? [
                      { value: "OT", label: "Ottawa" },
                      { value: "TO", label: "Toronto" },
                    ]
                  : [
                      { value: "LV", label: "Las Vegas" },
                      { value: "CH", label: "Chicago" },
                    ]
              }
              isSearchable
              onChange={field.onChange}
            />
          )}
        />
        {errors !== undefined && errors.name && <p>{errors.city.message}</p>}

        <button type="submit">
          {editIndex !== -1 ? "Update User" : "Add User"}
        </button>
      </form>

      <h2>Users:</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>DOB</th>
            <th>Country</th>
            <th>City</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.dateOfBirth.toDate().toDateString()}</td>
              <td>{user.country.label}</td>
              <td>{user.city.label}</td>
              <td>
                <button onClick={() => handleEdit(index)}>Edit</button>
              </td>
              <td>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Form;

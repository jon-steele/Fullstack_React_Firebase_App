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
import {
  CFormInput,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButton,
  CForm,
} from "@coreui/react";

const Form = () => {
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
      <CForm
        onSubmit={handleSubmit(onSubmit)}
        className="w-100 m-auto d-flex flex-column mt-3 px-2"
      >
        <Controller
          name="name"
          control={control}
          rules={{ 
            required: "Name is required",
            validate: (value) => {
              const regex = /^[A-Za-z]+$/; // regex for checking if input contains only alphabetic characters
              if (!regex.test(value)) {
                  return "Name must contain only alphabetic characters";
              }
              if (value.length > 128) {
                return "Name cannot be longer than 128 characters"
              }
              if (value.length < 2) {
                return "Name must be at least 2 characters";
              }
            }
          }}
          defaultValue=""
          render={({ field }) => (
            <>
              <label htmlFor="name">Name</label>
              <CFormInput
                className="my-2"
                {...field}
                placeholder="John Smith"
              />
            </>
          )}
        />
        {errors.name && <p>{errors.name.message}</p>}


        <Controller
          name="dateOfBirth"
          control={control}
          rules={{ 
            required: "Date of birth is required",
            validate: (value) => {
              const dob = new Date(`${value}T00:00:00Z`);
              if (dob.getFullYear() < 1900) {
                return "Year must be 1900 or later";
              }
              if (dob > new Date()) {
                return "Date of birth cannot be in the future";
              }
              if (dob.getFullYear > 9999) {
                return "Year cannot be more than 4 digits";
              }
              return true;
            },
          }}
          defaultValue=""
          render={({ field }) => (
            <>
              <label htmlFor="dateOfBirth">Date of Birth</label>
              <CFormInput className="my-2" type="date" {...field} />
            </>
          )}
        />
        {errors.dateOfBirth && <p>{errors.dateOfBirth.message}</p>}


        <Controller
          name="country"
          control={control}
          defaultValue={{ value: "CA", label: "Canada" }}
          render={({ field }) => (
            <>
              <label htmlFor="country">Country</label>
              <Select
                className="my-2 w-100"
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
            </>
          )}
        />

        <Controller
          name="city"
          control={control}
          defaultValue={{ value: "OT", label: "Ottawa" }}
          render={({ field }) => (
            <>
              <label htmlFor="city">City</label>
              <Select
                className="my-2 w-100"
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
            </>
          )}
        />

        <CButton className="my-2 w-100" type="submit">
          {editIndex !== -1 ? "Update User" : "Add User"}
        </CButton>
      </CForm>

      <div className="m-auto mt-5 px-2">
        <h2>Users:</h2>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>DOB</CTableHeaderCell>
              <CTableHeaderCell>Country</CTableHeaderCell>
              <CTableHeaderCell>City</CTableHeaderCell>
              <CTableHeaderCell>Edit</CTableHeaderCell>
              <CTableHeaderCell>Delete</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {users.map((user, index) => (
              <CTableRow key={index}>
                <CTableDataCell>{user.name}</CTableDataCell>
                <CTableDataCell>
                  {user.dateOfBirth.toDate().toDateString()}
                </CTableDataCell>
                <CTableDataCell>{user.country.label}</CTableDataCell>
                <CTableDataCell>{user.city.label}</CTableDataCell>
                <CTableDataCell>
                  <CButton onClick={() => handleEdit(index)}>Edit</CButton>
                </CTableDataCell>
                <CTableDataCell>
                  <CButton onClick={() => handleDelete(index)}>Delete</CButton>
                </CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>
    </div>
  );
};

export default Form;

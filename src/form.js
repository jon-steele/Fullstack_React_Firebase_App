import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";

const Form = () => {
  const { handleSubmit, control, errors, reset } = useForm();
  const [users, setUsers] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);

  const onSubmit = (data) => {
    if (editIndex !== -1) {
      // If we are editing an existing user, update the user in the list
      const updatedUsers = [...users];
      updatedUsers[editIndex] = data;
      setUsers(updatedUsers);
      setEditIndex(-1); // Reset editIndex after updating
    } else {
      // If we are not editing, add the new user to the list
      setUsers((prevUsers) => [...prevUsers, data]);
    }
    reset(); // Reset the form after submission
  };

  // Function to handle user deletion
  const handleDelete = (index) => {
    const updatedUsers = [...users];
    updatedUsers.splice(index, 1);
    setUsers(updatedUsers);
  };

  // Function to handle user edit
  const handleEdit = (index) => {
    setEditIndex(index);
    const userToEdit = users[index];
    reset(userToEdit);
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
          defaultValue=""
          render={({ field }) => (
            <select {...field}>
              <option value="">Select Country</option>
              <option value="Canada">Canada</option>
              <option value="USA">USA</option>
            </select>
          )}
        />
        {errors !== undefined && errors.country && (
          <p>{errors.country.message}</p>
        )}

        <Controller
          name="city"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <select {...field}>
              <option value="">Select City</option>
              {field.value === "Canada" ? (
                <>
                  <option value="Ottawa">Ottawa</option>
                  <option value="Toronto">Toronto</option>
                </>
              ) : (
                <>
                  <option value="Las Vegas">Las Vegas</option>
                  <option value="Chicago">Chicago</option>
                </>
              )}
            </select>
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
              <td>{user.dateOfBirth}</td>
              <td>{user.country}</td>
              <td>{user.city}</td>
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

import "@coreui/coreui/dist/css/coreui.min.css";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useUserActions } from "./useUserActions";

// React Components
import UserTable from "./UserTable";
import UserForm from "./UserForm";

const App = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  const [editIndex, setEditIndex] = useState(-1);
  const { users, onSubmit, handleDelete, handleEdit } = useUserActions(
    reset,
    editIndex,
    setEditIndex
  );

  return (
    <div className="d-flex flex-column m-auto col-12 col-md-9">
      <UserForm
        control={control}
        errors={errors}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        setValue={setValue}
        editIndex={editIndex}
      />
      <UserTable
        className="m-auto mt-5 px-2 w-100"
        users={users}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default App;

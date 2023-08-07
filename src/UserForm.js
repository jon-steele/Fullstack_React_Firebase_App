// UserForm is a react component that holds a form containing Name, DOB, Country, and City inputs. 

import React from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";
import { CFormInput, CButton, CForm } from "@coreui/react";

const UserForm = ({
  control,
  errors,
  handleSubmit,
  onSubmit,
  setCountry,
  country,
  setValue,
  editIndex,
}) => {
  return (
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
            const regex = /^[A-Za-z\s]+$/; // regex for checking if input contains only alphabetic characters and spaces
            if (!regex.test(value)) {
              return "Name must contain only alphabetic characters";
            }
            if (value.length > 128) {
              return "Name cannot be longer than 128 characters";
            }
            if (value.length < 2) {
              return "Name must be at least 2 characters";
            }
          },
        }}
        defaultValue=""
        render={({ field }) => (
          <>
            <label htmlFor="name">Name</label>
            <CFormInput className="my-2" {...field} placeholder="John Smith" />
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
            if (dob.getFullYear() <= 1900) {
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
  );
};

export default UserForm;

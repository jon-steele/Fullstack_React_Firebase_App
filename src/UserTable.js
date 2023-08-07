// UserTable is a React component used to display user information in a table format.

import {
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CButton,
  } from "@coreui/react";

const UserTable = ({ users, handleEdit, handleDelete }) => {
  return (
    <>
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
              <CTableDataCell style={{ wordBreak: "break-all" }}>
                {user.name}
              </CTableDataCell>
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
    </>
  );
};

export default UserTable;

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  GET_ALL_ROLES,
  GET_ALL_USERS,
  CREATE_USER,
  UPDATE_USER,
  DELETE_USER_BY_ID,
} from "../core/constant/Constant.js";
import { deleteData, getData, postData } from "../Service/Service.js";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { VALIDATION_REQUIRED } from "../core/constant/Constant";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { AgGridReact } from "ag-grid-react";
import { FaUser } from "react-icons/fa";
import { FaUserEdit } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";

const User = () => {
  const [userList, setUserList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const pagination = true;
  const paginationPageSize = 10;
  const paginationPageSizeSelector = [10, 20, 30];
  const [userData, setUserData] = useState({
    userId: 0,
    emailId: "",
    password: "",
    role: 0,
    createdDate: "",
    isActive: false,
    userLogo: "",
    technicalStack: "",
    fullName: "",
  });

  const getUsers = () => {
    getData(GET_ALL_USERS).then((result) => {
      setUserList(result);
    });
  };

  const getRoles = () => {
    getData(GET_ALL_ROLES).then((result) => {
      setRolesList(result);
    });
  };

  const resetUserData = () => {
    setUserData({
      userId: 0,
      emailId: "",
      password: "",
      role: 0,
      createdDate: "",
      isActive: false,
      userLogo: "",
      technicalStack: "",
      fullName: "",
    });
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
    setIsFormSubmitted(false);
    resetUserData();
  };

  const updateFormValue = (event, key) => {
    setUserData((prevobj) => ({ ...prevobj, [key]: event.target.value }));
  };

  const updateCheckboxValue = (event, key) => {
    setUserData((prevObj) => ({ ...prevObj, [key]: event.target.checked }));
  };

  useEffect(() => {
    getUsers();
    getRoles();
  }, []);

  const CustomButtonComponent = (props) => {
    return (
      <>
        <Button
          variant="primary"
          className="btn-sm m-1"
          onClick={() => onEdit(props.data)}
        >
          <FaEdit />
        </Button>
        <Button
          variant="danger"
          className="btn-sm"
          onClick={() => onDelete(props.data)}
        >
          <FaTrash />
        </Button>
      </>
    );
  };

  const onEdit = (user) => {
    setUserData(user);
    openModal();
  };

  const onDelete = (user) => {
    deleteData(DELETE_USER_BY_ID, user.userId).then((result) => {
      if (result !== undefined) {
        if (result.result) {
          alert("User deleted successfully");
          getUsers();
        } else {
          alert(result.message);
        }
      }
    });
  };

  const addUser = () => {
    setIsFormSubmitted(true);
    if (
      userData.fullName !== "" &&
      userData.emailId !== "" &&
      userData.createdDate !== "" &&
      userData.password !== "" &&
      userData.technicalStack !== "" &&
      userData.userLogo !== ""
    ) {
      postData(CREATE_USER, userData).then((result) => {
        if (result.result) {
          alert("User created successfully");
          getUsers();
          closeModal();
        } else {
          alert(result.message);
        }
      });
    }
  };

  const editUser = () => {
    setIsFormSubmitted(true);
    if (
      userData.fullName !== "" &&
      userData.emailId !== "" &&
      userData.createdDate !== "" &&
      userData.password !== "" &&
      userData.technicalStack !== "" &&
      userData.userLogo !== ""
    ) {
      postData(UPDATE_USER, userData).then((result) => {
        if (result.result) {
          alert("User updated successfully");
          getUsers();
          closeModal();
        } else {
          alert(result.message);
        }
      });
    }
  };

  const [colDefs, setColDefs] = useState([
    { field: "fullName", flex: 1 },
    { field: "emailId", flex: 1 },
    { field: "roleName", flex: 1 },
    { field: "technicalStack", flex: 1 },
    { field: "userLogo", flex: 1 },
    { field: "Action", cellRenderer: CustomButtonComponent, flex: 0.5 },
  ]);

  return (
    <div>
      <div className="row mt-3">
        <div className="col-md-12">
          <div className="card bg-light my-2 mx-4">
            <div className="card-header bg-light">
              <div className="row">
                <div className="col-9 text-start">
                  <h4>User List</h4>
                </div>
                <div className="col-3 text-end">
                  <button className="btn btn-primary" onClick={openModal}>
                    <FaUser /> Add User
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div
                className="ag-theme-quartz"
                style={{ height: 450, width: "100%" }}
              >
                <AgGridReact
                  rowData={userList}
                  columnDefs={colDefs}
                  pagination={pagination}
                  paginationPageSize={paginationPageSize}
                  paginationPageSizeSelector={paginationPageSizeSelector}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add User Modal */}

        <Modal
          show={modalIsOpen}
          onHide={closeModal}
          backdrop="static"
          keyboard="false"
        >
          <Modal.Header closeButton className="bg-light">
            <Modal.Title>
              {userData.userId === 0 ? "Add User" : "Update User"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="col-12">
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-2">
                    <label>Full Name:</label>
                    <input
                      type="text"
                      placeholder="Enter Full Name"
                      className="form-control"
                      onChange={(event) => {
                        updateFormValue(event, "fullName");
                      }}
                      value={userData.fullName}
                    />
                    {isFormSubmitted && userData.fullName === "" && (
                      <div className="text-danger">{VALIDATION_REQUIRED}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-2">
                    <label>Email:</label>
                    <input
                      type="email"
                      placeholder="Enter Email"
                      className="form-control"
                      onChange={(event) => {
                        updateFormValue(event, "emailId");
                      }}
                      value={userData.emailId}
                    />
                    {isFormSubmitted && userData.emailId === "" && (
                      <div className="text-danger">{VALIDATION_REQUIRED}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-2">
                    <label>Password:</label>
                    <input
                      type="text"
                      placeholder="Enter Password"
                      className="form-control"
                      onChange={(event) => {
                        updateFormValue(event, "password");
                      }}
                      value={userData.password}
                    />
                    {isFormSubmitted && userData.password === "" && (
                      <div className="text-danger">{VALIDATION_REQUIRED}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-2">
                    <label>Role:</label>
                    <select
                      className="form-select"
                      value={userData.role}
                      onChange={(event) => updateFormValue(event, "role")}
                    >
                      <option>Select Role</option>
                      {rolesList.map((role, index) => {
                        return (
                          <option key={index} value={role.roleId}>
                            {role.role}
                          </option>
                        );
                      })}
                    </select>
                    {isFormSubmitted && userData.role === 0 && (
                      <div className="text-danger">{VALIDATION_REQUIRED}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-2">
                    <label>Create Date:</label>
                    <input
                      type="date"
                      placeholder="Enter Email"
                      className="form-control"
                      onChange={(event) => {
                        updateFormValue(event, "createdDate");
                      }}
                      value={userData.createdDate.split("T")[0]}
                    />
                    {isFormSubmitted && userData.createdDate === "" && (
                      <div className="text-danger">{VALIDATION_REQUIRED}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-2">
                    <label>Technical Stack:</label>
                    <input
                      type="text"
                      placeholder="Enter Technical Stack"
                      className="form-control"
                      onChange={(event) => {
                        updateFormValue(event, "technicalStack");
                      }}
                      value={userData.technicalStack}
                    />
                    {isFormSubmitted && userData.technicalStack === "" && (
                      <div className="text-danger">{VALIDATION_REQUIRED}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label>User Logo:</label>
                    <input
                      type="text"
                      placeholder="Enter User Logo"
                      className="form-control"
                      onChange={(event) => {
                        updateFormValue(event, "userLogo");
                      }}
                      value={userData.userLogo}
                    />
                    {isFormSubmitted && userData.userLogo === "" && (
                      <div className="text-danger">{VALIDATION_REQUIRED}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label>Is Active:</label>
                    <br></br>
                    <input
                      type="checkbox"
                      placeholder="Enter Is Active"
                      className=""
                      onChange={(event) => {
                        updateCheckboxValue(event, "isActive");
                      }}
                      checked={userData.isActive}
                    />
                    {isFormSubmitted && userData.isActive === "" && (
                      <div className="text-danger">{VALIDATION_REQUIRED}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            {userData.userId === 0 ? (
              <Button variant="primary" onClick={addUser}>
                Add
              </Button>
            ) : (
              <Button variant="primary" onClick={editUser}>
                Update
              </Button>
            )}
            <Button variant="secondary" onClick={closeModal}>
              Reset
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default User;

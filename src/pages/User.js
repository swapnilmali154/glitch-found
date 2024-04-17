import React, { useEffect, useState } from "react";
import {
  createUser,
  deleteUserById,
  getAllRoles,
  getAllUsers,
  updateUser,
} from "../core/services/UserService";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { VALIDATION_REQUIRED } from "../core/constant/Constant";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";

const User = () => {
  const [userList, setUserList] = useState([]);
  const [rolesList, setRolesList] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

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

  useEffect(() => {
    getUsers();
    getRoles();
  }, []);

  const getUsers = () => {
    getAllUsers().then((result) => {
      setUserList(result);
    });
  };

  const getRoles = () => {
    getAllRoles().then((result) => {
      setRolesList(result);
    });
  };

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => {
    setModalIsOpen(false);
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
  }

  const updateFormValue = (event, key) => {
    setUserData((prevobj) => ({ ...prevobj, [key]: event.target.value }));
  };

  const updateCheckboxValue = (event, key) => {
    setUserData((prevObj) => ({ ...prevObj, [key]: event.target.checked }));
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
      createUser(userData).then((result) => {
        if (result.result) {
          alert("User created successfully");
          getUsers();
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
          closeModal();
          setIsFormSubmitted(false);
        } else {
          alert(result.message);
        }
      });
    }
  };

  const onEdit = (user) => {
    setUserData(user);
    openModal()
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
      updateUser(userData).then((result) => {
        if (result.result) {
          alert("User updated successfully");
          getUsers();
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
          closeModal();
          setIsFormSubmitted(false);
        } else {
          alert(result.message);
        }
      });
    }
  };

  const onDelete = (userId) => {
    debugger;
    deleteUserById(userId).then((result) => {
      debugger;
      if (result.result) {
        alert("User deleted successfully");
      } else {
        alert(result.message);
      }
      getAllUsers();
    });
  };

  return (
    <div>
      <div className="row mt-3">
        <div className="col-md-12">
          <div className="card bg-light my-2 mx-4">
            <div className="card-header bg-light">
              <div className="row mt-3">
                <div className="col-9">
                  <h4>User List</h4>
                </div>
                <div className="col-3">
                  <button className="btn btn-primary" onClick={openModal}>
                    Add User
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-12 table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Full Name</th>
                        <th>Email Id</th>
                        <th>password</th>
                        <th>Role Name</th>
                        <th>created Date</th>
                        <th>Technical Stack</th>
                        <th>Is Active</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userList.map((user, index) => {
                        return (
                          <tr key={index}>
                            <td>{user.fullName}</td>
                            <td>{user.emailId}</td>
                            <td>{user.password}</td>
                            <td>{user.roleName}</td>
                            <td>{user.createdDate}</td>
                            <td>{user.technicalStack}</td>
                            <td>{user.isActive ? "Yes" : "No"}</td>
                            <td>
                              <Button
                                variant="primary"
                                className="btn-sm m-1"
                                onClick={() => onEdit(user)}
                              >
                                <FaEdit />
                              </Button>
                              <Button
                                variant="danger"
                                className="btn-sm"
                                onClick={() => onDelete(user.userId)}
                              >
                                <FaTrash />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Add User Modal */}

        <Modal show={modalIsOpen} onHide={closeModal}>
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
            <Button variant="danger" onClick={closeModal}>
              Cancel
            </Button>
            {userData.userId === 0 ? (
              <Button variant="primary" onClick={addUser}>
                Add
              </Button>
            ) : (
              <Button variant="primary" onClick={editUser}>
                Update
              </Button>
            )}
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default User;

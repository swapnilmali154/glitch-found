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
import { FaTrash,FaSyncAlt } from "react-icons/fa";
import { AgGridReact } from "ag-grid-react";
import { FaPenSquare,FaPlus, FaUser,FaEdit } from 'react-icons/fa';
import {  toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Spinner from 'react-bootstrap/Spinner';

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

  const notify = (message, classN) => {
    return new Promise((resolve) => {
        const className = `toast-${classN}`;
        toast(message, {
            className: className,
            autoClose: 2000,
            position: "top-center",
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            onClose: () => resolve(), // Resolve the promise when the toast is closed
        });
    });
};
const[isLoading,setisLoading]=useState(false);
  const getUsers = () => {
    setisLoading(true);
    getData(GET_ALL_USERS).then((result) => {
      setUserList(result);
      const userWithSerialNumbers = addSerialNumbers(result);
      setUserList(userWithSerialNumbers);
      setisLoading(false);
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

  const addSerialNumbers = (data) => {
    return data.map((user, index) => {
      return { ...user, Srno: index + 1 };
    });
  };

  const CustomButtonComponent = (props) => {
    return (
      <>
        <Button
          variant="success"
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
        //  notify("User deleted successfully");
          toast.success("User deleted successfully")
          // getUsers();
        } else {
          notify(result.message);
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
         // notify("User created successfully");
          toast.success(result.message, {
            onClose: () => {
                setTimeout(() => {
                  closeModal();

                }, 1000); // Adjust the delay as needed
            },
        });
          // getUsers();
          // closeModal();
        } else {
         // notify(result.message);
          toast.error(result.message)
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
        //  notify("User updated successfully");
          toast.success(result.message, {
            onClose: () => {
                setTimeout(() => {
                  closeModal();

                }, 1000); // Adjust the delay as needed
            },
        });
          // getUsers();
         
        } else {
          toast.error(result.message);
        }
      });
    }
  };

  const [colDefs, setColDefs] = useState([
    {
      field: "Srno",
      flex: 0.5,
      headerName: "Sr No",
      cellStyle: { textAlign: "center" },
    },
    { field: "fullName", flex: 1 },
    { field: "emailId", flex: 1 },
    { field: "roleName", flex: 1 },
    { field: "technicalStack", flex: 1 },
    { field: "Action", cellRenderer: CustomButtonComponent, flex: 0.5 },
  ]);

  return (
    <div>
       <div className='row mt-5'></div>

      <div className="row">
        <div className="col-md-12">
          <div className="card bg-light my-2 mx-4">
            <div className="card-header bg-light">
              <div className="row">
                <div className="col-9 text-start">
                  <h4>User List</h4>
                </div>
                <div className="col-3 text-end">
                  <button className="btn btn-primary" onClick={openModal}>
                    <FaPlus/> Add User
                  </button>
                </div>
              </div>
            </div>
            <div className="card-body">
            {
          isLoading ? (<div className="d-flex justify-content-center align-items-center" style={{ height: 500 }}>
            <Button variant="primary" disabled>
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
          Loading...
        </Button>
            </div>) :( <div
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
              </div>)
        }
             
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
              <>
               <Button variant="primary" onClick={addUser}><FaPlus/>
                Add
              </Button>
               <Button variant="secondary" onClick={closeModal}><FaSyncAlt />
               Reset
             </Button>
              </>
             
            ) : (
              <Button variant="primary" onClick={editUser}><FaPenSquare />
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

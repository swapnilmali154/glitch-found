import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Row, Col, Modal } from "react-bootstrap";
import { getData, postData, deleteData } from '../Service/Service.js';
import '../Service/Main.css'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import Spinner from 'react-bootstrap/Spinner';
import { FaPenSquare, FaPlus, FaSyncAlt, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';


const ProjectUser = () => {
    const [ProjectUserList, setProjectUserList] = useState([]);

    const [ProjectUserobj, setProjectUserobj] = useState({
        "projectUserId": 0,
        "userId": 0,
        "projectId": 0,
        "roleInProject": "",
        "AddedDate": "",
        "isActive": false,
        "technicalStack": ""
    })


    const [isLoading, setisLoading] = useState(false);
    const [projectList, setprojectList] = useState([]);
    const [UserList, setUserList] = useState([]);
    const [Roles, setAllRoles] = useState([]);
    const [validationerror, setvalidationerror] = useState(false);
    const pagination = true;
    const paginationPageSize = 10;
    const paginationPageSizeSelector = [10, 20, 30];
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        resetProjectUserobj();
    };
    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const openConfirmationModal = (projectUser) => {
        setProjectUserToDelete(projectUser);
        setConfirmationModalOpen(true);
    };
    const closeConfirmationModal = () => setConfirmationModalOpen(false);
    const [projectUserToDelete, setProjectUserToDelete] = useState(null);


    const getAllProjectUserList = async () => {
        setisLoading(true);
        getData('GetAllProjectUsers').then(result => {
            setProjectUserList(result);
            const projectsWithSerialNumbers = addSerialNumbers(result);
            setProjectUserList(projectsWithSerialNumbers);
            setisLoading(false);
        })
    }
    const getAllProjectList = async () => {
        getData('GetAllProject').then(result => {
            setprojectList(result);
        })
    }
    const getAllRoleList = async () => {
        getData('GetAllRoles').then(result => {
            setAllRoles(result);
        })
    }

    const getAllUsersList = async () => {
        getData('GetAllUsers').then(result => {
            try {
                if (result != undefined) {
                    setUserList(result);
                }
                else {
                    alert(result.message)
                }
            } catch (error) {
                alert(error);
            }

        })
    }
    const updateCheckboxValue = () => {

    }
    useEffect(() => {

        getAllProjectUserList();
        getAllProjectList();
        getAllUsersList();
        getAllRoleList();
    }, []);
    const addSerialNumbers = (data) => {
        return data.map((projectList, index) => {
            return { ...projectList, Srno: index + 1 };
        });
    };
    const CustomButtonComponent = (props) => {
        return (
            <React.Fragment>
                <button style={{ marginRight: '10px' }} className='btn btn-sm btn-success ' onClick={() => onEdit(props.data)} ><FontAwesomeIcon icon={faEdit} /></button>
                <button className='btn btn-sm btn-danger' onClick={() => openConfirmationModal(props.data)} ><FontAwesomeIcon icon={faTrash} /></button>
            </React.Fragment>
        );
    };

    const onEdit = (obj) => {
        setProjectUserobj(obj);
        setShow(true);

    }

    const UpdateProjectUser = () => {

    }


    const onDelete = () => {
        if (projectUserToDelete) {
          
            deleteData('DeleteUserFromProjectByUserId?id=', projectUserToDelete.userId).then((result) => {
                if (result !== undefined) {
                    if (result.result) {
                        toast.success("Project User deleted successfully");
                        getAllProjectUserList();
                    } else {
                     toast.error(result.message);
                    }
                }
            });
        }
        closeConfirmationModal();
    };



    const AddUsers = () => {

        try {
            setvalidationerror(true)
            debugger;
            if (ProjectUserobj.userId !== 0 && ProjectUserobj.roleInProject !== 0 && ProjectUserobj.technicalStack !== "" && ProjectUserobj.isActive !== false) {
                postData('AddUserToProject', ProjectUserobj).then(result => {

                    if (result.result) {
                        toast.success(result.message, {
                            onClose: () => {
                                setTimeout(() => {
                                    getAllProjectUserList();
                                    resetProjectUserobj();
                                    setShow(false);

                                }, 0);
                            },
                        });
                    } else {
                        toast.error(result.message);
                    }
                })
                setvalidationerror(false);
            }

        } catch (error) {
            toast.error(error);
        }



    }
    const resetProjectUserobj = () => {

        setProjectUserobj({
            "projectUserId": 0,
            "userId": 0,
            "projectId": 0,
            "roleInProject": "",
            "AddedDate": "",
            "isActive":false,
            "technicalStack": ""
        })
        setvalidationerror(false)
    };

    const [colDefs, setColDefs] = useState([
        {
            field: "Srno",
            flex: 0.5,
            headerName: "Sr No",
            cellStyle: { textAlign: "center" },
        },
        { field: "fullName" },
        { field: "userEmail" },
        { field: "roleInProject" },
        { field: "isActive" },
        { field: "technicalStack" },
        { field: "Action", cellRenderer: CustomButtonComponent }

    ]);
    const handleChange = (event, key) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setProjectUserobj((prevObj) => ({ ...prevObj, [key]: value }));
    }
    return (
        <>
            <div className=' mt-5'></div>
            <div className='container-fluid'>
                <div>
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <h4> Project User List</h4>
                            <Button onClick={handleShow}><FaPlus />Add New</Button>
                        </Card.Header>
                        <Card.Body>
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
                                </div>) : (<div
                                    className="ag-theme-quartz" style={{ height: 500, width: '100%' }}
                                >
                                    <AgGridReact
                                        rowData={ProjectUserList}
                                        columnDefs={colDefs}
                                        pagination={pagination}
                                        paginationPageSize={paginationPageSize}
                                        paginationPageSizeSelector={paginationPageSizeSelector}
                                    />
                                </div>)
                            }



                        </Card.Body>
                        <Card.Footer>

                        </Card.Footer>
                    </Card>
                    <div className='col-md-12'>
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton className=' custom-card-header'>
                                <Modal.Title>
                                    {
                                        ProjectUserobj.projectUserId == 0 && <h4>Add Project User</h4>
                                    }
                                    {
                                        ProjectUserobj.projectUserId != 0 && <h4>Update Project User</h4>
                                    }</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>

                                <div >
                                    <div >
                                        <div className='card-body'>


                                            <div className='row'>
                                                <div className='col-6'>
                                                    <label>Project Id</label>
                                                    <select className='form-select' value={ProjectUserobj.projectId}
                                                        onChange={(event) => handleChange(event, 'projectId')}>
                                                        <option>Select Project Name</option>
                                                        {
                                                            projectList.map((project, index) => {
                                                                return (
                                                                    <option value={project.projectId}>{project.fullName}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    {
                                                        validationerror && ProjectUserobj.projectId == 0 && <div className='text-danger'>
                                                            Select Project
                                                        </div>
                                                    }
                                                </div>
                                                <div className='col-6'>
                                                    <label>Name</label>
                                                    <select className='form-select' value={ProjectUserobj.userId} onChange={(event) => handleChange(event, 'userId')}>
                                                        <option>Select User </option>
                                                        {
                                                            UserList.map((user, index) => {
                                                                return (
                                                                    <option key={user.userId} value={user.userId}>{user.fullName}</option>

                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    {
                                                        validationerror && ProjectUserobj.userId == 0 && <div className='text-danger'>
                                                            Select User
                                                        </div>
                                                    }
                                                </div>


                                            </div>

                                            <div className='row'>
                                                <div className='col-6'>
                                                    <label>Role In Project</label>

                                                    <select className='form-select' value={ProjectUserobj.roleInProject} onChange={(event) => handleChange(event, 'roleInProject')}>
                                                        <option>Select Role </option>
                                                        {
                                                            Roles.map((roll, index) => {
                                                                return (
                                                                    <option key={roll.role} value={roll.role}>{roll.role}</option>

                                                                )
                                                            })
                                                        }
                                                    </select>
                                                    {
                                                        validationerror && ProjectUserobj.roleInProject == 0 && <div className='text-danger'>
                                                            Select Role
                                                        </div>
                                                    }

                                                </div>
                                                <div className='col-6'>
                                                    <label>Technical Stack</label>
                                                    <input type="text" className='form-control' value={ProjectUserobj.technicalStack}
                                                        placeholder='Enter technical Stack' onChange={(event) => handleChange(event, 'technicalStack')}></input>
                                                    {
                                                        validationerror && ProjectUserobj.technicalStack == "" && <div className='text-danger'>
                                                            Enter Technical Stack
                                                        </div>
                                                    }
                                                </div>

                                            </div>

                                            <div className='row'>
                                                <div className='col-6'>
                                                    <input type="checkbox" placeholder="Enter Is Active"
                                                        onChange={(event) => { handleChange(event, "isActive"); }} checked={ProjectUser.isActive}
                                                    />
                                                    <label>Is Active</label>
                                                    {
                                                        validationerror && ProjectUserobj.isActive == "" && <div className='text-danger'>
                                                            Check Is active
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer >
                                <div>
                                    {
                                        ProjectUserobj.projectUserId == 0 &&
                                        <>
                                            <Button variant='primary' className='m-2' onClick={AddUsers}><FaPlus />Add</Button>

                                            <Button variant="secondary"><FaSyncAlt />
                                                Reset
                                            </Button></>

                                    }
                                    {
                                        ProjectUserobj.projectUserId != 0 &&
                                        <Button variant='primary' onClick={UpdateProjectUser}><FaPenSquare />Update</Button>

                                    }

                                </div>
                            </Modal.Footer>
                        </Modal>
                        <Modal
                            show={confirmationModalOpen} onHide={closeConfirmationModal} backdrop="static"
                        >
                            <Modal.Header closeButton className="bg-light">
                                <Modal.Title>Confirmation</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Are you sure you want to delete this project?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={closeConfirmationModal}>
                                    No
                                </Button>
                                <Button variant="primary" onClick={onDelete}>
                                    Yes
                                </Button>
                            </Modal.Footer>
                        </Modal>

                    </div>
                </div>
            </div>
        </>

    );
};

export default ProjectUser;
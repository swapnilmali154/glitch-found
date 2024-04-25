import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Row, Col, Modal } from "react-bootstrap";
import { deleteData, getData, postData } from '../Service/Service.js';
import '../Service/Main.css'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import Spinner from 'react-bootstrap/Spinner';
import { FaPenSquare, FaPlus, FaSyncAlt, FaEdit } from 'react-icons/fa';
const ProjectUser = () => {
    const [ProjectUserList, setProjectUserList] = useState([]);
    const [ProjectUserobj, setProjectUserobj] = useState({
        "projectId": 0,
        "fullName": "",
        "userLogo": "",
        "projectLogo": "",
        "userId": 0,
        "userEmail": "",
        "projectName": "",
        "projectUserId": 0,
        "roleInProject": "",
        "addedDate": "",
        "isActive": "",
        "technicalStack": ""
    })
    const [isLoading, setisLoading] = useState(false);
    const [projectList, setprojectList] = useState([]);
    const [UserList, setUserList] = useState([]);
    const pagination = true;
    const paginationPageSize = 10;
    const paginationPageSizeSelector = [10, 20, 30];
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        resetProjectUserobj();
    };

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
                <button className='btn btn-sm btn-danger' onClick={() => onDelete(props.data)} ><FontAwesomeIcon icon={faTrash} /></button>
            </React.Fragment>
        );
    };

    const onEdit = (obj) => {
        setProjectUserobj(obj);
        setShow(true);

    }

    const UpdateProjectUser = () => {

    }

    const onDelete = (Project) => {
        try {
            getData('DeleteUserFromProjectByUserId?id=', Project.userId).then((result) => {
                if (result != undefined) {
                    alert(result.message);
                    getAllProjectList();
                }
            })
        } catch (error) {
            alert(error);
        }
    }
    const AddUsers = () => {

        try {
            postData('AddUserToProject', ProjectUserobj).then(result => {
                if (result != undefined) {
                    alert(result.message);
                    getAllProjectUserList();
                }
            })
        } catch (error) {
            alert(error);
        }
        resetProjectUserobj();
        setShow(false);

    }
    const resetProjectUserobj = () => {
        setProjectUserobj({
            "projectId": 0,
            "fullName": "",
            "userLogo": "",
            "projectLogo": "",
            "userId": 0,
            "userEmail": "",
            "projectName": "",
            "projectUserId": 0,
            "roleInProject": "",
            "addedDate": "",
            "isActive": "",
            "technicalStack": ""
        });
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

        setProjectUserobj((prevObj) => ({ ...prevObj, [key]: event.target.value }));
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
                                                <div className='col-md-6'>
                                                    <label>FullName</label>
                                                    <input type="text" className='form-control' value={ProjectUserobj.fullName}
                                                        placeholder='Enter full Name' onChange={(event) => handleChange(event, 'fullName')}></input>
                                                </div>
                                                <div className='col-md-6'>
                                                    <label>UserEmail</label>
                                                    <input type="Email" className='form-control' value={ProjectUserobj.userEmail}
                                                        placeholder='Enter user Email' onChange={(event) => handleChange(event, 'userEmail')} ></input>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-md-6'>
                                                    <label>User Id</label>
                                                    <select className='form-select' value={ProjectUserobj.projectUserId}
                                                        onChange={(event) => handleChange(event, 'projectUserId')}>
                                                        <option>Select User Id</option>
                                                        {
                                                            ProjectUserList.map((ProjectUser, index) => {
                                                                return (
                                                                    <option key={ProjectUser.projectUserId} value={ProjectUser.projectUserId}>{ProjectUser.projectName}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                                <div className='col-md-6'>
                                                    <label> Added Date </label>
                                                    <input type='Date' className='form-control' value={ProjectUserobj.addedDate}
                                                        placeholder='Select Date' onChange={(event) => handleChange(event, 'addedDate')}></input>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-md-6'>
                                                    <label>Project Id</label>
                                                    <select className='form-select' value={ProjectUserobj.projectId}
                                                        onChange={(event) => handleChange(event, 'projectId')}>
                                                        <option>Select Project Id</option>
                                                        {
                                                            projectList.map((project, index) => {
                                                                return (
                                                                    <option value={project.projectId}>{project.projectName}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                                <div className='col-md-6'>
                                                    <label>Email</label>
                                                    <select className='form-select' value={ProjectUserobj.userEmail} onChange={(event) => handleChange(event, 'userEmail')}>
                                                        <option>Select User Email</option>
                                                        {
                                                            UserList.map((user, index) => {
                                                                return (
                                                                    <option key={user.userId} value={user.userId}>{user.fullname}</option>

                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>


                                            </div>

                                            <div className='row'>
                                                <div className='col-md-6'>
                                                    <label>Role In Project</label>
                                                    <input type="text" className='form-control' value={ProjectUserobj.roleInProject}
                                                        placeholder='Enter Role In Project' onChange={(event) => handleChange(event, 'roleInProject')}></input>
                                                </div>
                                                <div className='col-md-6'>
                                                    <label>technicalStack</label>
                                                    <input type="text" className='form-control' value={ProjectUserobj.technicalStack}
                                                        placeholder='Enter technical Stack' onChange={(event) => handleChange(event, 'technicalStack')}></input>
                                                </div>
                                            </div>

                                            <div className='row'>
                                                <div className='col-md-6'>
                                                    <label>userLogo</label>
                                                    <input type="text" className='form-control' value={ProjectUserobj.userLogo}
                                                        placeholder='Enter user Logo' onChange={(event) => handleChange(event, 'userLogo')}></input>
                                                </div>
                                                <div className='col-md-6'>
                                                    <label>ProjectLogo</label>
                                                    <input type="text" className='form-control' value={ProjectUserobj.projectLogo}
                                                        placeholder='Enter Project Logo' onChange={(event) => handleChange(event, 'projectLogo')} ></input>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-md-6'>
                                                    <input type="checkbox" placeholder="Enter Is Active"
                                                        onChange={(event) => { updateCheckboxValue(event, "isActive"); }} checked={ProjectUser.isActive}
                                                    />
                                                    <label>Is Active</label>
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
                    </div>
                </div>
            </div>
        </>

    );
};

export default ProjectUser;
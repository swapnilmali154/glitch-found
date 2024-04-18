import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Row, Col, Modal } from "react-bootstrap";
import { deleteData, getData, postData } from '../Service/Service.js';
import '../Service/Main.css'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

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
        getData('GetAllProjectUsers').then(result => {
            setProjectUserList(result);
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
    useEffect(() => {

        getAllProjectUserList();
        getAllProjectList();
        getAllUsersList();
    }, []);

    const CustomButtonComponent = (props) => {
        return (
            <React.Fragment>
                <button className='btn btn-sm btn-success' onClick={() => onEdit(props.data)} ><FontAwesomeIcon icon={faEdit} /></button>
                <button className='btn btn-sm btn-danger' onClick={() => onDelete(props.data)} ><FontAwesomeIcon icon={faTrash} /></button>
            </React.Fragment>
        );
    };

    const onEdit = (obj) => {
        setProjectUserobj(obj);
        setShow(true);

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
        { field: "fullName" },
        { field: "addedDate" },
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
        <div className='main-container'>
            <div className='mt-10'>
                <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <h4> ProjectUser List</h4>
                        <Button onClick={handleShow}>Add New</Button>
                    </Card.Header>
                    <Card.Body>
                        <div
                            className="ag-theme-quartz" style={{ height: 500, width: '100%' }}
                        >
                            <AgGridReact
                                rowData={ProjectUserList}
                                columnDefs={colDefs}
                                pagination={pagination}
                                paginationPageSize={paginationPageSize}
                                paginationPageSizeSelector={paginationPageSizeSelector}
                            />
                        </div>
                    </Card.Body>
                    <Card.Footer>

                    </Card.Footer>
                </Card>
                <div className='col-md-12'>
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton className=' custom-card-header'>
                            <Modal.Title>
                                {
                                    ProjectUserobj.projectUserId == 0 && <h4>Add ProjectUser</h4>
                                }
                                {
                                    ProjectUserobj.projectUserId != 0 && <h4>Update ProjectUser</h4>
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
                                                    placeholder='Enter fullName' onChange={(event) => handleChange(event, 'fullName')}></input>
                                            </div>
                                            <div className='col-md-6'>
                                                <label>UserEmail</label>
                                                <input type="Email" className='form-control' value={ProjectUserobj.userEmail}
                                                    placeholder='Enter userEmail' onChange={(event) => handleChange(event, 'userEmail')} ></input>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <label>ProjectUser Id</label>
                                                <select className='form-select' value={ProjectUserobj.projectUserId}
                                                    onChange={(event) => handleChange(event, 'projectUserId')}>
                                                    <option>ProjectUser Id</option>
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
                                                <label>userEmail</label>
                                                <select className='form-select' value={ProjectUserobj.userEmail} onChange={(event) => handleChange(event, 'userEmail')}>
                                                    <option>UserEmail</option>
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
                                                <label>RoleInProject</label>
                                                <input type="text" className='form-control' value={ProjectUserobj.roleInProject}
                                                    placeholder='Enter roleInProject' onChange={(event) => handleChange(event, 'roleInProject')}></input>
                                            </div>
                                            <div className='col-md-6'>
                                                <label>technicalStack</label>
                                                <input type="text" className='form-control' value={ProjectUserobj.technicalStack}
                                                    placeholder='Enter technicalStack' onChange={(event) => handleChange(event, 'technicalStack')}></input>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <label>userLogo</label>
                                                <input type="text" className='form-control' value={ProjectUserobj.userLogo}
                                                    placeholder='Enter userLogo' onChange={(event) => handleChange(event, 'userLogo')}></input>
                                            </div>
                                            <div className='col-md-6'>
                                                <label>ProjectLogo</label>
                                                <input type="text" className='form-control' value={ProjectUserobj.projectLogo}
                                                    placeholder='Enter Time ProjectLogo' onChange={(event) => handleChange(event, 'projectLogo')} ></input>
                                            </div>
                                        </div>

                                        <div className="col-md-6">
                                            <label>Is Active:</label>
                                            <br></br>
                                            <input type="checkbox" placeholder="Enter Is Active" className="form-control"
                                                onChange={(event) => { updateCheckboxValue(event, "isActive"); }} checked={ProjectUser.isActive}
                                            />
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
                            <div>
                                {
                                    ProjectUserobj.projectUserId == 0 &&
                                    <Button variant='success' onClick={AddUsers}>Add</Button>


                                }
                                {
                                    ProjectUserobj.projectUserId != 0 &&
                                    <Button variant='success' onClick={UpdateProjectUser}>Update</Button>

                                }
                                <Button variant='danger' className='m-2' onClick={() => setShow(false)}>Cancel</Button>

                            </div>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
};

export default ProjectUser;
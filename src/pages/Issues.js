import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Row, Col, Modal } from "react-bootstrap";
import { deleteData, getData, postData } from '../Service/Service.js';
import '../Service/Main.css'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
const Issues = () => {
    const [issueList, setissueList] = useState([]);
    const [issueObj, setissueObj] = useState({
        issueId: 0,
        issueType: 0,
        createdDate: "",
        projectId: 0,
        statusId: 0,
        assignedTo: 0,
        summary: "",
        description: "",
        reporter: 0,
        timeSpan: "",
        parentId: 0,
        priority: "",
        storyPoint: 0,
        issueGuid: ""
    })
    const [projectList, setprojectList] = useState([]);
    const [statusList, setstatusList] = useState([]);
    const [UserList, setUserList] = useState([]);
    const [issueTypeList, setissueTypeList] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => 
    {
        setShow(true);
        resetIssueObj();
    };
    const getIssueList = async () => {
        getData('GetAllIssues').then(result => {
            try {
                if (result != undefined) {
                    setissueList(result);
                }
                else {
                    alert('Something went wrong');
                }
            } catch (error) {
                alert(error);
            }

        })
    }
    const getAllProject = async () => {
        getData('GetAllProject').then(result => {
            try {

                if (result != undefined) {
                    setprojectList(result);
                }
            } catch (error) {

            }
        })
    }
    const getAllUsers = async () => {
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
    const getAllStatus = async () => {
        getData('GetAllIssueStatus').then(result => {
            try {
                if (result != undefined) {
                    setstatusList(result);
                }
                else {
                    alert(result.message);
                }
            } catch (error) {
                alert(error);
            }

        })
    }
    const getIssueType = async () => {
        try {
            getData('GetAllIssueTypes').then(result => {
                if (result != undefined) {
                    setissueTypeList(result);
                }
                else {
                    alert('in issue list');
                }
            })
        } catch (error) {
            alert(error);
        }

    }
    useEffect(() => {

        getIssueList();
        getAllProject();
        getAllUsers();
        getAllStatus();
        getIssueType();
    }, []);
    const CustomButtonComponent = (props) => {
        return (
            <React.Fragment>
                <button className='btn btn-sm btn-success' onClick={() => onEdit(props.data)} ><FontAwesomeIcon icon={faEdit} /></button>
                <button className='btn btn-sm btn-danger' onClick={() => onDelete(props.data)} ><FontAwesomeIcon icon={faTrash} /></button>
            </React.Fragment>
        );
    };
    const onEdit = (issueData) => {
        const formattedDate = issueData.createdDate.split('T')[0];
        setissueObj({
            ...issueData,
            createdDate: formattedDate
        });
        setShow(true);
        getIssueList();
    }
    const onDelete = (issueData) => {
        try {
            debugger
            deleteData('DeleteIssueById?id=', issueData.issueId).then(result => {
                debugger
                if (result != undefined) {
                    alert(result.message);
                    getIssueList();
                }
            })
        } catch (error) {
            alert(error);
        }

    }
    const [colDefs, setColDefs] = useState([
        { field: "issueTypeName" },
        { field: "status" },
        { field: "assignedTo" },
        { field: "summary" },
        { field: "reporter" },
        { field: "Action", cellRenderer: CustomButtonComponent }

    ]);
    const handleChange = (event, key) => {

        setissueObj((prevObj) => ({ ...prevObj, [key]: event.target.value }));
    }
    const saveIssue = () => {

        try {
            postData('CreateIssue', issueObj).then(result => {
                if (result != undefined) {
                    alert(result.message);
                    getIssueList();
                }
            })
        } catch (error) {
            alert(error);
        }
        resetIssueObj();
        setShow(false);
        
    }
    const UpdateIssue = () => {
        try {
            postData('UpdateIssue', issueObj).then(result => {
                if (result != undefined) {
                    alert(result.message);
                    getIssueList();
                }
            })
        } catch (error) {
            alert(error);
        }
        resetIssueObj();
        setShow(false);
    }
    const resetIssueObj = () => {
        setissueObj({
            issueId: 0,
            issueType: 0,
            createdDate: "",
            projectId: 0,
            statusId: 0,
            assignedTo: 0,
            summary: "",
            description: "",
            reporter: 0,
            timeSpan: "",
            parentId: 0,
            priority: "",
            storyPoint: 0,
            issueGuid: ""
        });
    };
    
   
    
    return (
        <div className='main-container'>
            <div className='mt-10'>
                <Card>
                    <Card.Header className="d-flex justify-content-between align-items-center">
                        <h4>Issue List</h4>
                        <Button onClick={handleShow}>Add New</Button>
                    </Card.Header>
                    <Card.Body>
                        <div
                            className="ag-theme-quartz" style={{ height: 500, width: '100%' }}
                            >
                            <AgGridReact
                                rowData={issueList}
                                columnDefs={colDefs}
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
                                    issueObj.issueId == 0 && <h4>Add Issue</h4>
                                }
                                {
                                    issueObj.issueId != 0 && <h4>Update Issue</h4>
                                }</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>

                            <div >
                                <div >
                                    <div className='card-body'>
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <label>Type</label>
                                                <select className='form-select' value={issueObj.issueType} onChange={(event) => handleChange(event, 'issueType')}>
                                                    <option>Select Type</option>
                                                    {
                                                        issueTypeList.map((issueType, index) => {
                                                            return (
                                                                <option key={issueType.issueTypeId} value={issueType.issueTypeId}>{issueType.issueType}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div className='col-md-6'>
                                                <label>Created Date </label>
                                                <input type='Date' className='form-control' value={issueObj.createdDate} placeholder='Select date' onChange={(event) => handleChange(event, 'createdDate')}></input>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <label>Project</label>
                                                <select className='form-select' value={issueObj.projectId} onChange={(event) => handleChange(event, 'projectId')}>
                                                    <option>Select Project</option>
                                                    {
                                                        projectList.map((project, index) => {
                                                            return (
                                                                <option key={project.projectId} value={project.projectId}>{project.fullName}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div className='col-md-6'>
                                                <label>Status</label>
                                                <select className='form-select' value={issueObj.statusId} onChange={(event) => handleChange(event, 'statusId')}>
                                                    <option>Select Status</option>
                                                    {
                                                        statusList.map((status, index) => {
                                                            return (
                                                                <option key={status.statusId} value={status.statusId}>{status.status}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <label>Assigned To</label>
                                                <select className='form-select' value={issueObj.assignedTo} onChange={(event) => handleChange(event, 'assignedTo')}>
                                                    <option>Assigned To</option>
                                                    {
                                                        UserList.map((user, index) => {
                                                            return (
                                                                <option key={user.userId} value={user.userId}>{user.fullName}</option>

                                                            )
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div className='col-md-6'>
                                                <label>Reporter</label>
                                                <select className='form-select' value={issueObj.reporter} onChange={(event) => handleChange(event, 'reporter')}>
                                                    <option>Report To</option>
                                                    {
                                                        UserList.map((user, index) => {
                                                            return (
                                                                <option key={user.userId} value={user.userId}>{user.fullName}</option>

                                                            )
                                                        })
                                                    }
                                                </select>

                                            </div>
                                        </div>

                                        <div className='row'>
                                            <div className='col-md-6'>
                                                <label>Summary</label>
                                                <input type="text" className='form-control' value={issueObj.summary} placeholder='Enter Summery' onChange={(event) => handleChange(event, 'summary')}></input>
                                            </div>
                                            <div className='col-md-6'>
                                                <label>Time Span</label>
                                                <input type="text" className='form-control' value={issueObj.timeSpan} placeholder='Enter Time Span' onChange={(event) => handleChange(event, 'timeSpan')} ></input>
                                            </div>
                                        </div>



                                        <div className='row'>

                                            <div className='col-md-6'>
                                                <label>Parent</label>
                                                <select className='form-select' value={issueObj.parentId} onChange={(event) => handleChange(event, 'parentId')}>
                                                    <option>Report To</option>
                                                    {
                                                        UserList.map((user, index) => {
                                                            return (
                                                                <option key={user.userId} value={user.userId}>{user.fullName}</option>

                                                            )
                                                        })
                                                    }
                                                </select>

                                            </div>
                                            <div className='col-md-6'>
                                                <label>Priority</label>
                                                <input type="text" className='form-control' value={issueObj.priority} placeholder='Enter Priority' onChange={(event) => handleChange(event, 'priority')}></input>
                                            </div>
                                        </div>
                                        <div className='row'>

                                            <div className='col-md-6'>
                                                <label>Story Point</label>
                                                <input type="text" className='form-control' value={issueObj.storyPoint} placeholder='Enter Story Point' onChange={(event) => handleChange(event, 'storyPoint')}></input>
                                            </div>
                                            <div className='col-md-6'>
                                                <label>Issue Guide</label>
                                                <input type="text" className='form-control' value={issueObj.issueGuid} placeholder='Enter Issue Guid' onChange={(event) => handleChange(event, 'issueGuid')}></input>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-12'>
                                                <label>Description</label>
                                                <textarea className='form-control' value={issueObj.description} onChange={(event) => handleChange(event, 'description')}></textarea>
                                            </div>

                                        </div>
                                    </div>

                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
                            <div>
                                {
                                    issueObj.issueId == 0 &&
                                    <Button variant='success' onClick={saveIssue}>Add</Button>


                                }
                                {
                                    issueObj.issueId != 0 &&
                                    <Button variant='success' onClick={UpdateIssue}>Update</Button>

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

export default Issues;
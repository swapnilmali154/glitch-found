import React, { useContext, useEffect, useState } from 'react';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { Card, Form, Row, Col, CardHeader, CardBody } from 'react-bootstrap';
import { Modal, Button } from "react-bootstrap";
import { getData, getDataById, postData } from '../Service/Service.js';
import { MyContext } from '../MyContextProvider';
import { useParams } from 'react-router-dom';
const Board = (props) => {
     const {projectId,shortName} = useParams();
     console.log(projectId);
    const { loggedUserData, updateLoggedUserData } = useContext(MyContext);
    const [getAllIssues, setgetAllIssues] = useState([]);
    const [issulistByIssueId, setissulistByIssueId] = useState([]);
    const [projectList, setprojectList] = useState([]);
    const [IssueTypeList, setIssueTypeList] = useState([]);
    const [statusList, setstatusList] = useState([]);
    const [userList, setuserList] = useState([]); 
    const [projectAssignee, setprojectAssignee] = useState([]);
    const [show, setShow] = useState(false);
    const[toDoissueCount,settoDoissueCount]=useState(0);
    const[inProgressissueCount,setinProgressissueCount]=useState(0);
    const[doneissueCount,setdoneissueCount]=useState(0);
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

    });
    const getProjectList = () => {
        try {
            getData('GetAllProject').then(result => {
                if (result != undefined) {
                    setprojectList(result);
                }
                else {
                    alert('Error in fetching project list');
                }
            })
        } catch (error) {
            alert(error);
        }

    }
    const getIssueTypeList = () => {

        try {
            getDataById(`GetAllIssueTypes`).then(result => {
                if (result != undefined) {

                    setIssueTypeList(result);
                }
                else {
                    alert('Error in fetching issueTypes');
                }
            })
        } catch (error) {
            alert(error);
        }
    }
    const getStatusList = () => {
        try {
            getData('GetAllIssueStatus').then(result => {
                if (result != undefined) {
                    setstatusList(result);
                }
                else {
                    alert('Error in fetching status list');
                }
            })
        } catch (error) {
            alert(error);
        }
    }
    const getUserList = () => {
        try {
           
            getData('GetAllUsers').then(result => {
                if (result != undefined) {
                   
                    setuserList(result);
                }
                else {
                    alert('Error in fetching user List');
                }
            })
        } catch (error) {
            alert(error);
        }
    }
    const handleChange = (event, key) => {
        setissueObj((prevObj) => ({ ...prevObj, [key]: event.target.value }));
    }
    const getAllIssuesbyProjectId = () => {
        try {
            getDataById(`GetAllIssuesByProjectId?id=${projectId}`).then(result => {
               
                if (result !== undefined) {
                    setgetAllIssues(result);
                } else {
                    alert('in board component');
                }
            });
        } catch (error) {
            alert(error);
        }
    };
    const getIssueListbyissueId = (issueId) => {
       
        try {
            getDataById(`GetIssueById?id=${issueId}`).then(result => {
                if (result != undefined) {
                   
                    setShow(true);
                    setissueObj(result);
                    //setissulistByIssueId(result);
                }
                else {
                    alert('Error in fetching issues by issueId')
                }
            })

        } catch (error) {
            alert(error);
        }


    }
    useEffect(() => {
        console.log('projectId',projectId);
        getAllIssuesbyProjectId();
        getProjectList();
        getIssueTypeList();
        getStatusList();
        getUserList();
      
    }, []);
    useEffect(() => {
       
        const todoIssue = getAllIssues.filter(issue=>issue.status =='To do');
        settoDoissueCount(todoIssue.length);
        const inProgressissues = getAllIssues.filter(issue=>issue.status =='In Progress');
        setinProgressissueCount(inProgressissues.length);
        const doneIssues = getAllIssues.filter(issue=>issue.status=='Done');
        setdoneissueCount(doneIssues.length);
    }, [projectId,getAllIssues]);
   
    const updateIssue = (e) => {
        e.preventDefault();
       
        try {
            postData('UpdateIssue', issueObj).then(result => {
                if (result != undefined) {
                   
                    alert('Issue Updated Successfully...!');
                    setShow(false);
                }
                else {
                    alert('Error in updateing issue')
                }
            })
        } catch (error) {
            alert(error);
        }
    }
    return (
        <div>
            <div className='mt-5'></div>
            <div className='row mt-3'>
            <h5 className='text-start mb-2'>{shortName}</h5>
                <div className='col-md-4 mt-3'>
                    <Card>
                        <CardHeader className='text-start ' style={{padding:1}}>
                            <p className='mx-3'>To Do <span>{toDoissueCount}</span>&nbsp;Issue </p>
                        </CardHeader>
                        <CardBody style={{padding:10}}>
                            {getAllIssues.map((issue, index) => {
                                return issue.status === 'To do' && (
                                    <Card key={index} className='mb-2'>
                                        <Card.Body>
                                            <div className="my-1 fw-bold text-start"> {issue.summary.slice(0,16)} </div>
                                            <div className="row">
                                                <div className="col-4">
                                                    <p className="text-muted space-font m-0 pointer">{issue.issueGuid}</p>
                                                </div>
                                                <div className="col-8 text-end">
                                                    <p className="text-muted space-font m-0">{issue.assignedToUser}&nbsp;<span><FaEdit onClick={() => getIssueListbyissueId(issue.issueId)}></FaEdit></span>
                                                    </p>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                );
                            })}
                        </CardBody>
                    </Card>
                </div>
                <div className='col-md-4 mt-3'>
                    <Card>
                        <CardHeader className='text-start' style={{padding:1}}>
                            <p className='mx-3'>In Progress <span>{inProgressissueCount}</span>&nbsp;Issue</p>
                        </CardHeader>
                        <CardBody>
                            {getAllIssues.map((issue, index) => {
                                return issue.status === 'In Progress' && (
                                    <Card key={index} className='mb-2' >
                                        <Card.Body style={{padding:10}}>
                                            
                                            <div className="my-1 fw-bold text-start"> {issue.summary.slice(0,16)} </div>
                                            <div className="row">
                                                <div className="col-4">
                                                    <p className="text-muted space-font m-0 pointer">{issue.issueGuid}</p>
                                                </div>
                                                <div className="col-8 text-end">
                                                    <p className="text-muted space-font m-0">{issue.assignedToUser}&nbsp;<span><FaEdit onClick={() => getIssueListbyissueId(issue.issueId)}></FaEdit></span>
                                                    </p>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                );
                            })}
                        </CardBody>
                    </Card>
                </div>
                <div className='col-md-4 mt-3'>
                    <Card>
                        <CardHeader className='text-start' style={{padding:1}}>
                            <p className='mx-3'>Done <span>{doneissueCount}</span>&nbsp;Issue</p>
                        </CardHeader>
                        <CardBody>
                            {getAllIssues.map((issue, index) => {
                                return issue.status === 'Done' && (
                                    <Card key={index} className='mb-2'>
                                        <Card.Body style={{padding:10}}>
                                            <div className="my-1 fw-bold text-start"> {issue.summary.slice(0,16)} </div>
                                            <div className="row">
                                                <div className="col-4">
                                                    <p className="text-muted space-font m-0 pointer">{issue.issueGuid}</p>
                                                </div>
                                                <div className="col-8 text-end">
                                                    <p className="text-muted space-font m-0">{issue.assignedToUser}&nbsp;<span><FaEdit></FaEdit></span>
                                                    </p>
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                );
                            })}
                        </CardBody>
                    </Card>


                </div>

            </div>
            <div className="col-md-12">
                <Modal show={show} onHide={() => setShow(false)} size="lg">
                    <Modal.Header closeButton className="bg-white custom-card-header">
                        <Modal.Title>Update Issue</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <form onSubmit={updateIssue}>
                                <div className="row">
                                    <div className="col-md-4">
                                        <label>Project</label>
                                        <select className='form-select' name='projectId' value={issueObj.projectId} onChange={(event) => handleChange(event, 'projectId')}>
                                            <option>Select Project</option>
                                            {
                                                projectList.map((project, index) => {
                                                    return (
                                                        <option key={project.projectId} value={project.projectId}>{project.shortName}</option>
                                                    )
                                                })
                                            }
                                        </select>

                                    </div>
                                    <div className="col-md-4">
                                        <label>Issue Type</label>
                                        <select className='form-select' name="issueTypeId" value={issueObj.issueType} onChange={(event) => handleChange(event, 'issueType')}>
                                            <option>Select Issue Type</option>
                                            {
                                                IssueTypeList.map((issueType, index) => {
                                                    return (
                                                        <option key={issueType.issueTypeId} value={issueType.issueTypeId}>{issueType.issueType}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label>Status</label>
                                        <select className='form-select' name="statusId" value={issueObj.statusId} onChange={(event) => handleChange(event, 'statusId')}>
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
                                <hr />

                                <div className='row'>
                                    <div className='.col-md-12'>
                                        <label>Summary</label>
                                        <input type='text' className='form-control' name="summary" value={issueObj.summary} placeholder='Enter Summary' onChange={(event) => handleChange(event, 'summary')} />

                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='.col-md-12'>
                                        <label>Description</label>
                                        <textarea className='form-control' name="description" value={issueObj.description} onChange={(event) => handleChange(event, 'description')} />

                                    </div>
                                </div>
                                <div className="row">
                                    <div className='col-md-6'>
                                        <label>Assignee</label>
                                        <select className="form-select" name="assignedTo" value={issueObj.assignedTo} onChange={(event) => handleChange(event, 'assignedTo')}>
                                            <option>Select Assignee</option>
                                            {
                                                userList.map((user, index) => {
                                                    return (
                                                        <option key={user.userId} value={user.userId}>{user.fullName}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className='col-md-6'>
                                        <label>Reporter</label>
                                        <input type="text" className='form-control' disabled value={loggedUserData.fullName} />
                                    </div>
                                </div>
                                <div className='row'>
                                    <label>Attachment</label>
                                    <div className="border border-dotted text-center p-5">
                                        <span><i className="fa fa-cloud-arrow-up"></i>Drop files to attach or <a href="#" className="text-decoration-none">
                                            <label className="custom-file-upload">
                                                <input type="file" />
                                                <i className="fa fa-cloud-arrow-up"></i>
                                                Browse
                                            </label>
                                        </a></span>
                                    </div>
                                </div>
                                <div className="modal-footer justify-content-between">
                                    <div>
                                        <input type="checkbox" name="" id="" /><span>Create another issue</span>
                                    </div>
                                    <div>
                                        <button type="button" className="btn btn-light" data-bs-dismiss="modal" onClick={() => setShow(false)} >Cancel</button>
                                        <button type="submit" className="btn btn-primary" >Update</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        </div>
    );
};

export default Board;
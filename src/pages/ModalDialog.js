import React, { useContext, useEffect, useState } from 'react';
import { Modal, Button } from "react-bootstrap";
import axios from 'axios';
import { getData, getDataById, postData } from '../Service/Service.js';
import { MyContext } from '../MyContextProvider';
import { FaPenSquare,FaPlus, FaUser,FaEdit,FaSyncAlt } from 'react-icons/fa';
const ModalDialog = ({ Show, hide }) => {
    const {loggedUserData ,updateLoggedUserData} = useContext(MyContext);
    const [errors, setErrors] = useState({});
    const [showModal, setShowModal] = useState(true);
    const handleClose = () => setShowModal(false);
    const [projectList, setprojectList] = useState([]);
    const [IssueTypeList, setIssueTypeList] = useState([]);
    const [statusList, setstatusList] = useState([]);
    const [userList, setuserList] = useState([]);
    const [projectId, setprojectId] = useState(0);
    const[projectAssignee,setprojectAssignee]=useState([]);
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
    });
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
    const handleChange = (event, key) => {
        setissueObj((prevObj) => ({ ...prevObj, [key]: event.target.value }));
        setissueObj((prevObj)=>({
            ...prevObj,
            reporter:loggedUserData.userId
        }))
         
    }
    const ValidateForm = () => {
        let newErrors = {};
        if (!issueObj.projectId) {
            newErrors.projectId = 'Project is required';
        }
        if (!issueObj.issueType) {
            newErrors.issueType = 'Issue Type is required';
        }
        if (!issueObj.statusId) {
            newErrors.statusId = 'Status is Required';
        }
        if (!issueObj.summary) {
            newErrors.summary = 'Summary is required';
        }
        if (!issueObj.description) {
            newErrors.description = 'Description is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }
    
    
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
  
const projectChange=(event)=>{
    try {
        
        const projectIdValue = event.target.value;
        getDataById(`GetProjectUsersByProjectId?id=${projectIdValue}`).then(result=>{
            if(result!=undefined){
                
                setprojectAssignee(result);
                setissueObj((prevObj)=>({
                    ...prevObj,
                    projectId : projectIdValue
                }))
            }
            else{
                alert('Error in fetching assigned user');

            }

        })
    } catch (error) {
        alert(error);
    }
}
    useEffect(() => {
        getProjectList();
         getIssueTypeList();
        getStatusList();
        getUserList();
    }, []);
    const saveIssue = (e) => {
        e.preventDefault();
        if(ValidateForm){
            try {
                
                postData('CreateIssue', issueObj).then(result => {
                    
                    if (result != undefined) {
                        alert(result.message);
                    }
                })
            } catch (error) {
                alert(error);
            }
            resetIssueObj();
            hide(false);
    
        }
       
    }
    return (
        <div>
            <div className="col-md-12">
               
                <Modal show={Show} onHide={() => hide(false)} size="lg">
                    <Modal.Header closeButton className="bg-white custom-card-header">
                        <Modal.Title>Create Issue</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <form onSubmit={saveIssue}>
                            <div className="row">
                                <div className="col-md-4">
                                    <label>Project</label>
                                    <select className='form-select' name='projectId' onChange={(event) => projectChange(event)}>
                                        <option>Select Project</option>
                                        {
                                            projectList.map((project, index) => {
                                                return (
                                                    <option key={project.projectId} value={project.projectId}>{project.shortName}</option>
                                                )
                                            })
                                        }
                                    </select>
                                    {errors.projectId && <p className="error">{errors.projectId}</p>}
                                </div>
                                <div className="col-md-4">
                                    <label>Issue Type</label>
                                    <select className='form-select' name="issueType"  onChange={(event) => handleChange(event,'issueType')}>
                                        <option>Select Issue Type</option>
                                        {
                                            IssueTypeList.map((issueType, index) => {
                                                return (
                                                    <option value={issueType.issueTypeId}>{issueType.issueType}</option>
                                                )
                                            })
                                        }

                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label>Status</label>
                                    <select className='form-select'  name="statusId" value={issueObj.statusId} onChange={(event) => handleChange(event, 'statusId')}>
                                        <option>Select Status</option>
                                        {
                                            statusList.map((status, index) => {
                                                return (
                                                    <option value={status.statusId}>{status.status}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                            </div>
                            <hr />
                            <div className='row'>
                                <div className='.col-md-12' >
                                    <label>Summary</label>
                                    <input type='text' className='form-control' name="summary" value={issueObj.summary} placeholder='Enter Summery' onChange={(event) => handleChange(event, 'summary')} />
                                </div>
                            </div>

                            <div className='row'>
                                <div className='.col-md-12' >
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
                                            projectAssignee.map((user, index) => {
                                                return (
                                                    <option value={user.userId}>{user.userEmail}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='col-md-6'>
                                    <label>Reporter</label>
                                    <input type="text" className='form-control'  disabled value={loggedUserData.fullName}/>
                                    {/* <select className="form-select" value={loggedUserData.emailId} onChange={(event) => handleChange(event, 'reporter')}>
                                        <option>Select Reporter</option>
                                        {
                                            userList.map((user, index) => {
                                                return (
                                                    <option value={user.userId}>{user.fullName}</option>
                                                )
                                            })
                                        }
                                    </select> */}
                                </div>
                            </div>
                            <div className='row'>
                                <label for="">Attachment</label>
                                <div className="border border-dotted text-center p-5">

                                    <span><i className="fa fa-cloud-arrow-up"></i>Drop files to attach or <a href="#"
                                        className="text-decoration-none">
                                        <label className="custom-file-upload">
                                            <input type="file" />
                                            <i className="fa fa-cloud-arrow-up"></i>
                                            browse
                                        </label>
                                    </a></span>
                                </div>
                            </div>
                            <div className="modal-footer justify-content-between">

                                <div>
                                    <input type="checkbox" name="" id="" /><span>
                                        Create another issue</span>
                                </div>
                                <div>
                                <button type="submit" className="btn btn-primary m-2" ><FaPlus/>Create</button>

                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => hide(false)}>Cancel</button>
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

export default ModalDialog;
import React, { useContext, useEffect, useState } from 'react';
import { FaEdit, FaCheck, FaTimes, FaTrash } from 'react-icons/fa';
import { Card, Form, Row, Col, CardHeader, CardBody } from 'react-bootstrap';
import { Modal, Button } from "react-bootstrap";
import { getData, getDataById, postData } from '../Service/Service.js';
import { MyContext } from '../MyContextProvider';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
const Board = (props) => {
    const { projectId, shortName } = useParams();
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
    const [toDoissueCount, settoDoissueCount] = useState(0);
    const [inProgressissueCount, setinProgressissueCount] = useState(0);
    const [doneissueCount, setdoneissueCount] = useState(0);
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
    const [files, setFiles] = useState(null);
    const [msg, setMsg] = useState(null);
    const imgUrl = 'http://storeapi.gerasim.in/customer/';
    const [attachObj, setAttachObj] = useState({
        "assueAttachmentId": 0,
        "attachmentFileName": "",
        "FileType": "",
        "issueId": 0
    })
    const closeAttachObj = () => {
        setAttachObj({
            "assueAttachmentId": 0,
            "attachmentFileName": "",
            "FileType": "",
            "issueId": 0
        })
    }

    const [modalOpen, setModalOpen] = useState(false);
    const [currentAttachment, setCurrentAttachment] = useState('');

    const handleOpenAttach = (attachmentFileName) => {

        setCurrentAttachment(attachmentFileName);
        setModalOpen(true);
    };

    const closeModal = () => {
        setCurrentAttachment('');
        setModalOpen(false);
    };
    const getProjectList = () => {
        try {
            getData('GetAllProject').then(result => {
                if (result != undefined) {
                    setprojectList(result);
                }
                else {
                    toast.error('Error in fetching project list');
                }
            })
        } catch (error) {
            toast.error(error);
        }

    }
    const getIssueTypeList = () => {

        try {
            getDataById(`GetAllIssueTypes`).then(result => {
                if (result != undefined) {

                    setIssueTypeList(result);
                }
                else {
                    toast.error('Error in fetching issueTypes');
                }
            })
        } catch (error) {
            toast.error(error);
        }
    }
    const getStatusList = () => {
        try {
            getData('GetAllIssueStatus').then(result => {
                if (result != undefined) {
                    setstatusList(result);
                }
                else {
                    toast.error('Error in fetching status list');
                }
            })
        } catch (error) {
            toast.error(error);
        }
    }
    const getUserList = () => {
        try {

            getData('GetAllUsers').then(result => {
                if (result != undefined) {

                    setuserList(result);
                }
                else {
                    toast.error('Error in fetching user List');
                }
            })
        } catch (error) {
            toast.error(error);
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
                    toast.error('in board component');
                }
            });
        } catch (error) {
            toast.error(error);
        }
    };
    /*******  Get All Attachement by Issue ID,and GetIssueBy IssueId */

    const [attachmentall, setAttachement] = useState([]);
    const getIssueListbyissueId = async (issueId) => {

        try {
            setAttachObj((prev) => ({ ...prev, "issueId": issueId }));

            const result = await axios.get("https://onlinetestapi.gerasim.in/api/Glitch/GetAllAttachmentByIssueId?id=" + issueId);
            if (result != undefined) {
                setAttachement(result.data.data);
            }
            else {
                toast.success(result.data.message);
            }
            getDataById(`GetIssueById?id=${issueId}`).then(result => {
                if (result != undefined) {

                    setShow(true);
                    setissueObj(result);
                    //setissulistByIssueId(result);

                }
                else {
                    toast.error('Error in fetching issues by issueId')
                }
            })

        } catch (error) {
            toast.error(error);
        }


    }
    useEffect(() => {
        console.log('projectId', projectId);
        getAllIssuesbyProjectId();
        getProjectList();
        getIssueTypeList();
        getStatusList();
        getUserList();



    }, [projectId, getAllIssues]);

    /*********** Modal Close */

    const handleModelclose = () => {
        setShow(false);
        setMsg(null);
        setFiles(null);
        closeAttachObj();

    }
    /************ Update Issue and Add Attachement */

    const updateIssue = async (e) => {
        e.preventDefault();
        try {

            const Attachementresponse = await axios.post("https://onlinetestapi.gerasim.in/api/Glitch/AddAttachment", attachObj);
            if (Attachementresponse.data.result) {
                setMsg(" Added Successfuly")
            }
        }
        catch (error) {
            toast.error(error);
        }

        try {
            postData('UpdateIssue', issueObj).then(result => {
                if (result != undefined) {

                    toast.success('Issue Updated Successfully...!', {
                        onClose: () => {
                            setTimeout(() => {

                                handleModelclose();

                            }, 0); // Adjust the delay as needed
                        },
                    });


                }
                else {
                    toast.error('Error in updateing issue')
                }
            })
        } catch (error) {
            alert(error);
        }
    }
    /************************* Select And Uplod File  */

    const handleUload = async (event) => {

        setFiles(event.target.files[0]);
        if (!event.target.files[0]) {
            setMsg("No files Selected");
            return;
        }
        else {
            const fd = new FormData();
            fd.append('file', event.target.files[0])
            setMsg("Uploding...........");
            try {
                const response = await axios.post("https://storeapi.gerasim.in/api/Customer/Upload", fd, {

                    headers: {
                        'Custom-Header': 'value',
                    }
                })
                const fileName = response.data;
                if (fileName != undefined) {
                    const fname = fileName;
                    setAttachObj((prev) => ({ ...prev, "attachmentFileName": fname }));
                    setMsg("Upload Successfull")
                }
                else {
                    setMsg("Upload failed")
                }
            }
            catch (err) {
                setMsg("Upload failed")
                toast.error(err)
            };
        }

    }
    return (
        <div>
            <div className='mt-5'></div>
            <div className='row mt-3'>
                <h5 className='text-start mb-2'>{shortName}</h5>

                <div className='container-fluid'>
                    <div className='row mt-3'>
                        {statusList.map(status => (
                            <div key={status.statusId} className='col-md-2 col-sm-4 col-6 mt-2' style={{ width: "20%" }}>
                                <Card>
                                    <Card.Header className='text-start bg-secondary text-white' style={{ padding: 1 }}>
                                        <p className='mx-3'>{status.status} <span>{getAllIssues.filter(issue => issue.status === status.status).length}</span>&nbsp;Issues</p>
                                    </Card.Header>
                                    <CardBody>
                                        {getAllIssues.filter(issue => issue.status === status.status).length > 0 ? (
                                            getAllIssues.map((issue, index) => {
                                                return issue.status === status.status && (
                                                    <Card key={index} className='mb-2'>
                                                        <Card.Body style={{ padding: 10 }}>
                                                            <div className="my-1 fw-bold text-start">{issue.summary.slice(0, 16)}</div>
                                                            <div className="row">
                                                                <div className="col-4">
                                                                    <p className="text-muted space-font m-0 pointer">{issue.issueGuid}</p>
                                                                </div>
                                                                <div className="col-8 text-end">
                                                                    <p className="text-muted space-font m-0">{issue.assignedToUser}&nbsp;
                                                                        <span>
                                                                            <FaEdit onClick={() => getIssueListbyissueId(issue.issueId)} />
                                                                        </span>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center text-muted mt-3">Issue not found</div>
                                        )}
                                    </CardBody>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>



            </div>
            <div className="col-md-12">
                <Modal show={show} onHide={() => handleModelclose()} size="lg" backdrop="static" keyboard={false}>
                    <Modal.Header closeButton className="bg-white custom-card-header">
                        <Modal.Title>Update Issue</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <form>
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
                                    <div className='col-12'>
                                        <label> Added Attachment</label>
                                        <div className="row">
                                            {attachmentall.length === 0 ? (
                                                <div className="col-12 text-center">
                                                    <div className="pt-2 pb-2" style={{ backgroundColor: 'lightgray' }}>
                                                        <p>No Attachment Present</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                attachmentall.map(item => (
                                                    <div className="col-3" key={item.attachmentFileName}>
                                                        <div className="card" onClick={() => handleOpenAttach(item.attachmentFileName)}>
                                                            <img src={imgUrl + item.attachmentFileName} style={{ height: '90px' }} className="card-img-top" alt="..." />
                                                            <div className="card-footer">
                                                                <div className="row">
                                                                    <div className="col-8">
                                                                       <small>{item.attachmentFileName}</small>
                                                                       </div>
                                                                        <div className='col-4'>
                                                                        <Button variant="danger" className="btn-sm" >
                                                                            <FaTrash />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                    </div>
                                    <div className='col-12'>
                                        <label>Attachment</label>
                                        <div className="border border-dotted text-center p-5">
                                            <label className="custom-file-upload">  </label>
                                            <label for="file">Select a file:</label>
                                            <input type="file" id="file" name="file" onChange={(e) => { handleUload(e) }} />


                                            {msg != null && <span>{msg}</span>}
                                            {
                                                files != null && <span> {files.length} File Selected</span>
                                            }
                                        </div>
                                    </div>

                                </div>
                                <div className="modal-footer justify-content-between">

                                    <div>
                                        <input type="checkbox" name="" id="" /><span>Create another issue</span>
                                    </div>
                                    <div>
                                        <button type="submit" className="btn btn-primary" onClick={updateIssue} >Update</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </Modal.Body>
                </Modal>
                {modalOpen && (

                    <Modal show={modalOpen}>
                        <Modal.Header>
                            <h5 className="modal-title">Attachment </h5>
                            <button type="button" className="btn-close" aria-label="Close" onClick={closeModal}></button>

                        </Modal.Header>
                        <Modal.Body>
                            <img src={imgUrl + currentAttachment} alt={currentAttachment} style={{ width: "300px" }} />
                        </Modal.Body>
                        {/* <Modal.Footer>
                            <Button variant="danger" className="btn-sm" >
                                <FaTrash />
                            </Button>
                        </Modal.Footer> */}

                    </Modal>

                )}

            </div>
        </div >
    );
};

export default Board;
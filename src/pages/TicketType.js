
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { FaTrash } from 'react-icons/fa';
import { FaEdit } from 'react-icons/fa';
import Issues from "./Issues";


const TicketType = () => {

    const url = "https://onlinetestapi.gerasim.in/api/Glitch/";

    const [issueTypeList, setIssueTypeList] = useState([]);
    const [issueTypeObj, setIssueTypeObj] = useState({
        "issueTypeId": 0,
        "issueType": ""
    });

    const getIssueTypeList = async () => {
        const result = await axios.get(`${url}GetAllIssueTypes`);
        setIssueTypeList(result.data.data);
    };

    useEffect(() => {
        getIssueTypeList();
    }, []);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [validationerror, setvalidationerror] = useState(false);

    const handleChange = (event, key) => {
        setIssueTypeObj((prevObj) => ({ ...prevObj, [key]: event.target.value }));

    };
    const saveIssueType = async () => {
        debugger
        setvalidationerror(true);
        try {
            const result = await axios.post(`${url}AddNewType`, issueTypeObj);
            if (result.data.data) {
                alert(result.data.message);
                setIssueTypeObj({
                    issueTypeId: 0,
                    issueType: ""
                });
                getIssueTypeList();
            } else {
                alert(result.data.message);
            }
        } catch (error) {
            console.error('Error occurred while saving issuetype:', error);
        }
        setShow(false);
    };

    const editIssueType = (IssueType) => {
        setIssueTypeObj(IssueType);
        setShow(true);
        
    };


    const updateIssueType = async () => {
        debugger
        try {
            const result = await axios.post(`${url}UpdateIssueType`, issueTypeObj);
            if (result.data.result) {
                alert('Record Updated..!');
            }
            else {
                alert(result.data.message);
            }
        }
        catch (error) {
            console.error("An error occurred while updating the employee:", error);
        }
        getIssueTypeList();
        setIssueTypeObj({
            issueTypeId: 0,
            issueType: ""
        });
        setShow(false);
    }

    // const removeIssueType = (issueTypeId) => {
    //     setIssueTypeObj(Issues.issueTypeId);
    //     setShow(true);
        
    // };

    const deleteIssueType = async (issueTypeId) => {
        debugger
        const result = await axios.get(`${url}DeleteIssueTypeById?IssueTypeId=` + issueTypeId);
        if (result.data.result) {
            alert("Record deleted");
        }
        else {
            alert(result.data.message);
        }
        getIssueTypeList();
       
    }

    return (
        <div>
            {/* {JSON.stringify({ attendanceObj })} */}
            <div className="row mt-3">
                <div className="col-md-1"></div>
                <div className="col-md-10 ">
                    <div className="card bg-light">
                        <div className="card-header bg-light">
                            <div className="row  mt-3">
                                <div className="col-md-9">
                                    <h4>Issue Type List</h4>
                                </div>
                                <div className="col-md-3">
                                    <button className='btn btn-primary' onClick={handleShow}>Add New</button>
                                </div>
                            </div>
                        </div>
                        <div className="card-body bg-light ">
                            <table className="table table-bordered ">
                                <thead>
                                    <tr>
                                        <th>Sr.No</th>
                                        <th>Issue Type</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {issueTypeList.map((issue, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{issue.issueType}</td>

                                                <td>
                                                    <button className="btn btn-sm btn-success m-2 " onClick={() => editIssueType(issue)}>
                                                        <FaEdit />
                                                    </button>
                                                    <button className="btn btn-sm btn-danger " onClick={() => deleteIssueType(issue.issueTypeId)}>
                                                        <FaTrash 
                                                        />
                                                         
                                                    </button>
                                                  
                                                    
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
            <div className="col-md-12">
                <Modal show={show} onHide={handleClose}>
                    {/* <Modal.Header closeButton className="bg-light">
                        <Modal.Title>Issue Type</Modal.Title>
                    </Modal.Header> */}
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title>
                        {issueTypeObj.issueTypeId === 0 && 'Add Issue Type'}
                        {issueTypeObj.issueTypeId !== 0 && 'Update Issue Type'}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <div className="row my-2">
                                <div className='col-md-6'>
                                    <label>Issue Type </label>
                                    <input type="text" className='form-control' placeholder='Enter Issue Type'
                                        value={issueTypeObj.issueType} onChange={(event) => handleChange(event, 'issueType')} />
                                    {
                                        validationerror && issueTypeObj.issueType == '' && <div className='text-danger'>
                                            This field is required
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        {issueTypeObj.issueTypeId === 0 && (
                            <button className="btn btn-sm btn-primary m-2" onClick={saveIssueType}>Add</button>
                        )}
                        {issueTypeObj.issueTypeId !== 0 && (
                            <button className="btn btn-sm btn-primary m-2" onClick={updateIssueType}>Update</button>
                        )}
                        <button
                            className="btn btn-sm btn-danger"
                            onClick={() => setShow(false)}>
                            Cancel
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default TicketType;
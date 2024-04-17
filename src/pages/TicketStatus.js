import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaEdit } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
//import { Modal } from 'react-bootstrap';
import { Modal } from "react-bootstrap";

const TicketStatus = () => {
    const [issueStatusList, setIssueStatus] = useState([]);
    const url = "https://onlinetestapi.gerasim.in/api/Glitch/";

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [validationerror, setvalidationerror] = useState(false);

    const [issueObj, setissueObj] = useState({
        "statusId": 0,
        "status": "",
        "isActive": false,
        "orderNo": 0
    });
    /****** Get Status ID from GetAllIssue */
    // const[statusid,setStatusID]=useState([]);
    // const getStatusId=async()=>{
    //     const result=await axios.get(`${url}`)
    // }
    /***** Get All Issue Status */
    const getissueSatusList = async () => {
        const result = await axios.get(`${url}GetAllIssueStatus`);
        setIssueStatus(result.data.data);
    }



    const handleChange = (event, key) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setissueObj((prevObj) => ({ ...prevObj, [key]: value }));
    };
    /******* Save Issue */
    const saveIssueStatus = async () => {
        setvalidationerror(true);
        try {
            const result = await axios.post(`${url}AddNewStatus`, issueObj);
            if (result.data.data) {
                alert(result.data.message);
                setissueObj({
                    "statusId": 0,
                    "status": "",
                    "isActive": false,
                    "orderNo": 0
                });
                getissueSatusList();
                 handleClose();
            } else {
                alert(result.data.message);
                debugger;
               handleShow();
            }
        } catch (error) {
            console.error('Error occurred while saving Issue:', error);
        }
      
    };
    //**************8 Edit issue */
    const editIssue = (obj) => {
        setissueObj(obj);
        setShow(true);

    }
    const updateIssueStatus = async () => {
        const response = await axios.post(`${url}UpdateStatus`, issueObj);
        if (response.data.result) {
            getissueSatusList();
            alert(response.data.message);
            setissueObj({
                "statusId": 0,
                "status": "",
                "isActive": false,
                "orderNo": 0
            })
            setShow(false);
        }
        else
        {
            alert(response.data.message);
            debugger;
            setShow(true);
        }

    }
    //************ Delete Issue Status by Id */

    const deleteIssueStatus=async(statusid)=>{
        debugger;
        const response=await axios.get(`${url}DeleteStatusById?id=`+statusid);
        if (response.data.result) {
            alert(response.data.message);
            getissueSatusList();
        }
        else{
            alert(response.data.message);
        }
    }
    useEffect(() => {
        getissueSatusList();
    }, [])
    return (
        <div>

            <div className="row mt-3">
                {/* {JSON.stringify(issueStatusList)} */}
                <div className="col-md-1"></div>
                <div className="col-md-10 ">
                    <div className="card bg-light">
                        <div className="card-header bg-light">
                            <div className="row  mt-3">
                                <div className="col-md-9">
                                    <h4>Issue Status List</h4>
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
                                        {/* <th>Status ID</th> */}
                                        <th>Status</th>
                                        <th>Active</th>
                                        <th>Order No</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        issueStatusList.map((issue, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{index + 1}</td>
                                                    {/* <td>{issue.statusId}</td> */}
                                                    <td>{issue.status}</td>
                                                    <td>{issue.isActive ? 'True' : 'False'}</td>
                                                    <td>{issue.orderNo}</td>

                                                    <td>
                                                        <button className="btn btn-sm btn-success m-2" onClick={() => editIssue(issue)} >
                                                            <FaEdit />
                                                        </button>
                                                        <button className="btn btn-sm btn-danger"  onClick={()=>{deleteIssueStatus(issue.statusId)}}>
                                                            <FaTrash />
                                                        </button>
                                                    </td>
                                                </tr>)
                                        })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-12">
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title>Issue</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div>
                            <div>
                                <div>
                                    <div className="row">
                                     
                                        <div className='col-md-6'>
                                            <label>Status</label>
                                            <input type="text" className='form-control' value={issueObj.status} onChange={(event) => handleChange(event, "status")} />
                                            {
                                                validationerror && issueObj.status == '' && <div className='text-danger'>
                                                    This field is required
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="row my-2">
                                        <div className="col-md-6">
                                            <label>Order</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={issueObj.orderNo}
                                                onChange={(event) => handleChange(event, "orderNo")}
                                             />
                                            {
                                                validationerror && issueObj.orderNo == '' && <div className='text-danger'>
                                                    This field is required
                                                </div>
                                            }
                                        </div>

                                    </div>
                                    <div className="row my-3">
                                        <div className="col-md-6">
                                            <label className="mx-1">Is Active</label>
                                            <input
                                                type="checkbox"
                                                checked={issueObj.isActive}
                                                onChange={(event) => handleChange(event, "isActive")}
                                           required />
                                            {
                                                validationerror && issueObj.isActive == '' && <div className='text-danger'>
                                                    This field is required
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        {issueObj.statusId === 0 && (
                            <button className="btn btn-sm btn-primary m-2" onClick={saveIssueStatus}>Add</button>
                        )}
                        {issueObj.statusId !== 0 && (
                            <button className="btn btn-sm btn-primary m-2" onClick={updateIssueStatus}>Update</button>
                        )}
                        <button
                            className="btn btn-sm btn-danger"
                            onClick={() => setShow(false)}
                        >
                            Cancel
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default TicketStatus;
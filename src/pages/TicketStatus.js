import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Row, Col, Modal } from "react-bootstrap";
import { deleteData, getData, postData } from '../Service/Service.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { AgGridReact } from 'ag-grid-react';
import '../Service/Main.css'


const TicketStatus = () => {
    const [issueStatusList, setIssueStatus] = useState([]);
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
    const resetIssueObj = () => {
        setissueObj({
            "statusId": 0,
            "status": "",
            "isActive": false,
            "orderNo": 0
        })
    }

    /***** Get All Issue Status */
    const getissueSatusList = () => {
        try {
            getData('GetAllIssueStatus').then(result => {
                if (result != undefined) {
                    setIssueStatus(result);
                }
                else {
                    alert('in issue Status List');
                }
            })
        } catch (error) {
            alert(error);
        }

    }



    const handleChange = (event, key) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setissueObj((prevObj) => ({ ...prevObj, [key]: value }));
    };
    /******* Save Issue Status */
    const saveIssueStatus = () => {
        
        setvalidationerror(true);
        if (issueObj.status !== '' && issueObj.orderNo !== 0 && issueObj.isActive != false) {
            try {
                postData('AddNewStatus', issueObj).then(result => {
                    if (result != undefined) {
                        alert(result.message);
                        getissueSatusList();
                        setvalidationerror(false);
                    }
                })
            } catch (error) {
                alert(error);
            }
            resetIssueObj();
            setShow(false);
        }



    };
    //************** Edit issue Status */
    const editIssue = (obj) => {
        setissueObj(obj);
        setShow(true);

    }
    const updateIssueStatus = () => {
        try {
            postData('UpdateStatus', issueObj).then(result => {
                if (result != undefined) {
                    alert(result.message);
                    getissueSatusList();
                }
            })
        } catch (error) {
            alert(error);
        }
        resetIssueObj();
        setShow(false);


    }
    //************ Delete Issue Status by Id */

    const deleteIssueStatus = (statusdata) => {
        
        try {
            debugger
            deleteData('DeleteStatusById?id=', statusdata.statusid).then(result => {
                debugger
                if (result != undefined) {
                    alert(result.message);
                    getissueSatusList();
                }
            })
        } catch (error) {
            alert(error);
        }

    }


    useEffect(() => {
        getissueSatusList();
    }, [])
    const CustomButtonComponent = (props) => {
        return (
            <React.Fragment>
                <button className='btn btn-sm btn-success' onClick={() => editIssue(props.data)} ><FontAwesomeIcon icon={faEdit} /></button>
                <button className='btn btn-sm btn-danger' onClick={() => deleteIssueStatus(props.data)} ><FontAwesomeIcon icon={faTrash} /></button>
            </React.Fragment>
        );
    };

    const [colDefs, setColDefs] = useState([
        { field: "status" },
        { field: "isActive" },
        { field: "orderNo" },
        { field: "Action", cellRenderer: CustomButtonComponent }

    ]);

    return (
        <>
        <div className='row mt-5'></div>
        <div>

<div className="row mt-3 container-fluid">
    <div className="row mt-3">
        <div className="col-md-12">
            <Card>
                <Card.Header className="d-flex justify-content-between">
                    <h4> Issue Status List</h4>
                    <Button onClick={handleShow}>Add New</Button>
                </Card.Header>
                <Card.Body className="d-flex justify-content-center align-items-center">
                    <div
                        className="ag-theme-quartz" style={{ height: 500, width: '65%' }}
                    >
                        <AgGridReact
                            rowData={issueStatusList}
                            columnDefs={colDefs}
                            pagination={true}
                            paginationPageSize={5}
                            paginationPageSizeSelector={[5, 10, 25]}
                        />
                    </div>
                </Card.Body>
                <Card.Footer>

                </Card.Footer>
            </Card>
        </div></div>
</div>
<div className="col-md-12">
    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="bg-light">
            <Modal.Title>
                {issueObj.statusId === 0 ? "Add Issue Status" : "Update Issue Status"}
            </Modal.Title>

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
                <Button className="btn btn-sm btn-primary m-2" onClick={saveIssueStatus}>Add</Button>
            )}
            {issueObj.statusId !== 0 && (
                <Button className="btn btn-sm btn-primary m-2" onClick={updateIssueStatus}>Update</Button>
            )}
            <Button
                className="btn btn-sm btn-danger"
                onClick={() => setShow(false)}
            >
                Cancel
            </Button>
        </Modal.Footer>
    </Modal>
</div>
</div>
        </>
       
    );
};

export default TicketStatus;
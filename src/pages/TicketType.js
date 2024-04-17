import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Row, Col, Modal } from "react-bootstrap";
import { deleteData, getData, postData } from '../Service/Service.js';
import '../Service/Main.css'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';

const TicketType = () => {
    const [issueTypeList, setIssueTypeList] = useState([]);
    const [issueTypeObj, setIssueTypeObj] = useState({
        "issueTypeId": 0,
        "issueType": ""
    });

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        resetIssueObj();
    };
    const [validationerror, setvalidationerror] = useState(false);

    const getIssueTypeList = async () => {
        getData('GetAllIssueTypes').then(result => {
            try {
                if (result != undefined) {
                    setIssueTypeList(result);
                }
                else {
                    alert('Something went wrong');
                }
            } catch (error) {
                alert(error);
            }

        })
    }


    useEffect(() => {
        getIssueTypeList();
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
        setIssueTypeObj(issueData);
        setShow(true);
        getIssueTypeList();
    }
   

    const onDelete = (issueData) => {
        try {
            debugger
            deleteData('DeleteIssueTypeById?id=', issueData.issueTypeId).then(result => {
                debugger
                if (result != undefined) {
                    alert(result.message);
                    getIssueTypeList();
                }
            })
        } catch (error) {
            alert(error);
        }

    }

    const [colDefs, setColDefs] = useState([
        { field: "issueTypeId" },
        { field: "issueType" },
        { field: "Action", cellRenderer: CustomButtonComponent }

    ]);

    const handleChange = (event, key) => {
        setIssueTypeObj((prevObj) => ({ ...prevObj, [key]: event.target.value }));
    }

    const saveIssueType = () => {
        debugger
        try {
            postData('AddNewType', issueTypeObj).then(result => {
                if (result != undefined) {
                    alert(result.message);
                    setIssueTypeObj({
                        issueTypeId: 0,
                        issueType: ""
                    });
                    getIssueTypeList();
                }
            })
        } catch (error) {
            alert(error);
        }
        resetIssueObj();
        setShow(false);

    }
    const UpdateIssueType = () => {
        debugger
        try {
            postData('UpdateIssueType', issueTypeObj).then(result => {
                if (result != undefined) {
                    alert(result.message);
                    getIssueTypeList();
                }
            })
        } catch (error) {
            alert(error);
        }
        resetIssueObj();
        setShow(false);
    }

    const resetIssueObj = () => {
        setIssueTypeObj({
            issueTypeId: 0,
            issueType: "",

        });
    };



    return (
        <div className='main-container '>
            <div className='mt-10'>
                <Card>
                    <Card.Header className=" d-flex justify-content-between align-items-center">
                        <h4 >Issue Type List</h4>
                        <Button onClick={handleShow}>Add New</Button>
                    </Card.Header>
                  
                    <Card.Body>
                        <div
                            className="ag-theme-quartz " style={{textAlign: 'center', height: 500, width: '100%' }}
                        >
                            <AgGridReact
                                rowData={issueTypeList }
                                columnDefs={colDefs}
                                pagination={true}
                                paginationPageSize={10}
                                paginationPageSizeSelector={[10, 25, 50]}
                                onGridReady={(props) => props.api.sizeColumnsToFit()}
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
                                    issueTypeObj.issueTypeId == 0 && <h4>Add Issue Type</h4>
                                }
                                {
                                    issueTypeObj.issueTypeId != 0 && <h4>Update Issue Type</h4>
                                }</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <div className="row my-2">
                                    <div className='col-md-6'>
                                        <label>Issue Type </label>
                                        <input type="text" className='form-control my-2' placeholder='Enter Issue Type'
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
                        <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
                            <div>
                                {
                                    issueTypeObj.issueTypeId == 0 &&
                                    <Button variant='success' onClick={saveIssueType}>Add</Button>

                                }
                                {
                                    issueTypeObj.issueTypeId !== 0 &&
                                    <Button variant='success' onClick={UpdateIssueType}>Update</Button>

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


export default TicketType;
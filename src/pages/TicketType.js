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
                <button style={{ marginRight: '10px' }} className='btn btn-sm btn-success' onClick={() => onEdit(props.data)} ><FontAwesomeIcon icon={faEdit} /></button>
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
        { field: "issueTypeId" ,headerClass: 'header-center'},
        { field: "issueType" ,headerClass: 'header-center'},
        { field: "Action", cellRenderer: CustomButtonComponent ,headerClass: 'header-center'}

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
        <>
        <div className='mt-5'></div>
         <div>
<div className="row mt-3 container-fluid">
    <div className="row mt-3">
        <div className="col-md-12">
            <Card>
                <Card.Header className="d-flex justify-content-between">
                    <h4> Issue Type List</h4>
                    <Button onClick={handleShow}>Add New</Button>
                </Card.Header>
                <Card.Body className="d-flex justify-content-center align-items-center">
                    <div
                        className="ag-theme-quartz" style={{ height: 450, width: '60%' ,justifyContent: 'center',textAlign: 'center' }}  
                    >
                        <AgGridReact
                            rowData={issueTypeList}
                            columnDefs={colDefs}
                            headerClass="header-center"
                            pagination={true}
                            paginationPageSize={7}
                            paginationPageSizeSelector={[7,10, 20, 25]}
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
                {issueTypeObj.issueTypeId === 0 ? "Add Issue Type" : "Update Issue Type"}
            </Modal.Title>

        </Modal.Header>
        <Modal.Body>
            <div>
                <div>
                    <div>
                        <div className="row">

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
                </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
            {issueTypeObj.issueTypeId === 0 && (
                <Button className="btn btn-sm btn-primary m-2" onClick={saveIssueType}>Add</Button>
            )}
            {issueTypeObj.issueTypeId !== 0 && (
                <Button className="btn btn-sm btn-primary m-2" onClick={UpdateIssueType}>Update</Button>
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


export default TicketType;
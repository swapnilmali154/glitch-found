import React, { useEffect, useState } from 'react';
import { ButtonGroup, Button, Card, Modal } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';
import { deleteData, getData, postData } from '../Service/Service.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { GET_ALL_ISSUE_TYPE, ADD_NEW_STATUS, GET_ALL_ISSUE_STATUS, UPDATE_STATUS, DELETE_STATUS_BY_ID, ADD_NEW_TYPE, DELETE_ISSUE_TYPE_BY_ID, UPDATE_ISSUE_TYPE, VALIDATION_REQUIRED } from '../core/constant/Constant.js'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import '../index.css';
import Spinner from 'react-bootstrap/Spinner';

const Master = () => {

    const [confirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const openConfirmationModal = (projectUser) => {
        setTicketTypeToDelete(projectUser);
        setConfirmationModalOpen(true);
    };
    const closeConfirmationModal = () => setConfirmationModalOpen(false);
    const [TicketTypeToDelete, setTicketTypeToDelete] = useState(null);


    const [activeButton, setActiveButton] = useState(null);
    const [rowData, setRowData] = useState([]);
    const [columnDefs, setColumnDefs] = useState([]);
    const [issueStatusList, setIssueStatus] = useState([]);
    const [issueTypeList, setIssueTypeList] = useState([]);
    const [loading, setLoading] = useState(false);

    const [issueTypeObj, setIssueTypeObj] = useState({
        "issueTypeId": 0,
        "issueType": ""
    });
    const [issueObj, setissueObj] = useState({
        "statusId": 0,
        "status": "",
        "isActive": false,
        "orderNo": 0
    });

    const [showModal1, setShowModal1] = useState(false);
    const [showModal2, setShowModal2] = useState(false);
    const handleModal1Open = () => {
        resetIssueType();
        setShowModal1(true);

    };

    const handleModal1Close = () => {
        resetIssueType();
        setShowModal1(false);
    };

    const handleModal2Open = () => {

        resetIssueObj();
        setShowModal2(true);
    };

    const handleModal2Close = () => {
        resetIssueObj();
        setShowModal2(false);
    };


    const [validationerror, setvalidationerror] = useState(false);


    const resetIssueType = () => {
        setIssueTypeObj({
            issueTypeId: 0,
            issueType: ""
        });
        setvalidationerror(false)
    }
    const resetIssueObj = () => {
        setissueObj({
            "statusId": 0,
            "status": "",
            "isActive": false,
            "orderNo": 0
        })
        setvalidationerror(false)
    }
    const handleChange = (event, key) => {
        setIssueTypeObj((prevObj) => ({ ...prevObj, [key]: event.target.value }));
    }

    const handleChangeStatus = (event, key) => {
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
        setissueObj((prevObj) => ({ ...prevObj, [key]: value }));
    };

    /************8 Get All issue Type */
    const getIssueTypeList = async () => {
        setLoading(true);
        getData(GET_ALL_ISSUE_TYPE).then(result => {
            try {
                if (result != undefined) {

                    setIssueTypeList(result);
                    setLoading(false);
                }
                else {

                    toast.error("Something Wrong");
                }
            } catch (error) {

                toast.error(error);
            }

        })
    }

    /***** Get All Issue Status */
    const getissueSatusList = () => {
        try {
            setLoading(true);
            getData(GET_ALL_ISSUE_STATUS).then(result => {
                if (result != undefined) {
                    setIssueStatus(result);
                    setLoading(false);
                }
                else {

                    toast.error("Something Wrong");
                }
            })
        } catch (error) {

            toast.error(error);
        }

    }
    //****** For ADD Button */
    const displayModal = () => {
        if (activeButton == 1) {

            handleModal1Open();
        }
        else if (activeButton == 2) {

            handleModal2Open();
        }
    }
    /************* Save ***********************/
    const save = async () => {

        if (activeButton === 1) {
            try {
                setvalidationerror(true);
                if (issueTypeObj.issueType !== "") {
                    setLoading(true);
                    const existingIssueType = issueTypeList.find(type => type.issueType.toLowerCase() === issueTypeObj.issueType.toLowerCase());
                    if (existingIssueType) {
                        toast.error("Issue type already exists");
                        setLoading(false);
                        return;
                    }
                    else 
                    {
                        postData(ADD_NEW_TYPE, issueTypeObj).then(result => {
                            if (result != undefined) {
    
                                toast.success(result.message, {
                                    onClose: () => {
                                        setTimeout(() => {
    
                                            getIssueTypeList();
                                            handleModal1Close();
                                            setLoading(false);
    
                                        }, 500); // Adjust the delay as needed
                                    },
                                });
    
                            }
                        })
                    }
                  
                }

            } catch (error) {
                toast.error(error);
            }
        }
        else if (activeButton === 2) {

            setvalidationerror(true);
            if (issueObj.status !== '' && issueObj.orderNo !== 0 && issueObj.isActive != false) {
                try {
                    setLoading(true)
                    const existingStatus = issueStatusList.find(status => status.status.toLowerCase() === issueObj.status.toLowerCase());
                    if (existingStatus) {
                        toast.error("Status already exists");
                        setLoading(false);
                        return;
                    }
                    else
                    {
                        postData(ADD_NEW_STATUS, issueObj).then(result => {
                            if (result !== undefined) {
                                setLoading(false);
                                toast.success(result.message, {
                                    onClose: () => {
                                        setTimeout(() => {
                                            getissueSatusList();
                                            setRowData(issueStatusList);
    
                                            handleModal2Close();
                                            setLoading(false);
    
                                        }, 500); // Adjust the delay as needed
                                    },
                                });
                            }
                        });
                    }
    
                } catch (error) {
                    toast.error(error);
                }
            }
        }

    }

    //************** Edit ********** */
    const editIssue = (obj) => {
        if (obj.issueTypeId) {
            setIssueTypeObj(obj);
            setShowModal1(true);
        }
        else if (obj.statusId) {
            setissueObj(obj);
            setShowModal2(true);
        }
    }
    const update = async () => {
        if (activeButton === 1) {
            try {
                setLoading(true);
                const result = postData(UPDATE_ISSUE_TYPE, issueTypeObj).then(result => {
                    if (result !== undefined) {
                        setLoading(false);

                        toast.success(result.message, {
                            onClose: () => {
                                setTimeout(() => {
                                    getIssueTypeList();
                                    handleModal1Close();

                                }, 500); // Adjust the delay as needed
                            },
                        });
                    }
                });
            } catch (error) {

                toast.error(error);
            } finally {
                //setLoading(false)
            }

        }
        else if (activeButton === 2) {
            try {
                setLoading(true);
                const result = postData(UPDATE_STATUS, issueObj).then(result => {
                    if (result !== undefined) {
                        setLoading(false);
                        toast.success(result.message, {
                            onClose: () => {
                                setTimeout(() => {
                                    getissueSatusList();
                                    handleModal2Close();
                                }, 500); // Adjust the delay as needed
                            },
                        });
                    }
                });

            } catch (error) {
                toast.error(error);
            } finally {
                //setLoading(false);
            }

        }
    }
    //************ Delete Issue Status by Id */

    const onDelete = async () => {
        //
        if (TicketTypeToDelete.statusId) {
            try {

                const result = await deleteData(DELETE_STATUS_BY_ID, TicketTypeToDelete.statusId).then(result => {
                    if (result !== undefined) {

                        toast.success(result.message)
                    }
                });
            } catch (error) {

                toast.error(error);
            }
            closeConfirmationModal();

        }
        else if (TicketTypeToDelete.issueTypeId) {

            try {

                const result = deleteData(DELETE_ISSUE_TYPE_BY_ID, TicketTypeToDelete.issueTypeId).then(result => {
                    if (result !== undefined) {
                        toast.success(result.message)
                        getIssueTypeList();

                    }
                })
            } catch (error) {
                toast.error(error);
            }
            closeConfirmationModal();
        }


    }
    useEffect(() => {
        // Trigger button click for Ticket Type upon page load
        handleButtonClick(2);
    }, []);
    useEffect(() => {
        getissueSatusList();
        getIssueTypeList();
    }, [])
    useEffect(() => {
        // Set updated data to AgGrid when issueTypeList changes
        setRowData(issueTypeList);
    }, [issueTypeList]);

    useEffect(() => {
        // Set updated data to AgGrid when issueStatusList changes
        setRowData(issueStatusList);
    }, [issueStatusList]);
    const CustomButtonComponent = (props) => {
        if (props.data.statusId) {
            return (
                <React.Fragment>
                    <Button
                        variant="success"
                        className="btn-sm m-1"
                        onClick={() => editIssue(props.data)}
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() =>  openConfirmationModal(props.data)}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>

                </React.Fragment>
            );
        }
        else if (props.data.issueTypeId) {

            return (
                <React.Fragment>
                    <Button
                        variant="success"
                        className="btn-sm m-1"
                        onClick={() => editIssue(props.data)}
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </Button>
                    <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => openConfirmationModal(props.data)}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </Button>

                </React.Fragment>
            );
        }
    };
    const defaultColDef = {
        flex: 1,
    };
    const CustomHeaderComponent = params => {
        return (
            <div style={{ textAlign: 'center', fontWeight: 'bold' }}>{params.displayName}</div>
        );
    };

    // Load Data To AgGrid
    const handleButtonClick = async (buttonId) => {

        setLoading(true);
        setActiveButton(buttonId);
        switch (buttonId) {
            case 1:
                try {

                    setColumnDefs([
                        {
                            headerName: "Sr.No",
                            field: 'serialNumber',
                            valueGetter: (params) => params.node.rowIndex + 1,
                            width: 100, // adjust width as needed
                            suppressSizeToFit: true,
                        },
                        { headerName: "Issue Type", field: "issueType" },
                        { field: "Action", cellRenderer: CustomButtonComponent }

                    ]);
                    setRowData(issueTypeList);
                }
                catch (error) {

                }
                finally {
                    setLoading(false)
                }

                break;
            case 2:

                try {

                    setColumnDefs([
                        {
                            headerName: "Sr.No",
                            field: 'serialNumber',
                            valueGetter: (params) => params.node.rowIndex + 1,
                            width: 100, // adjust width as needed
                            suppressSizeToFit: true,

                        },
                        { headerName: 'Status', field: 'status' },
                        { headerName: 'Order No', field: 'orderNo' },
                        { field: "Action", cellRenderer: CustomButtonComponent }

                    ]);
                    setRowData(issueStatusList);

                } catch (error) {
                    toast.error(error)
                } finally {
                    setLoading(false)
                }
                break;

            default:
                setColumnDefs([]);
                setRowData(issueStatusList);
                setLoading(false);
        }
    };

    return (
        <>
            <div className='mt-5'></div>
            <div>
                <ButtonGroup>
                    <Button
                        variant={activeButton === 1 ? 'primary' : 'secondary'}
                        onClick={() => handleButtonClick(1)}
                    >
                        Ticket Type
                    </Button>
                    <Button
                        variant={activeButton === 2 ? 'primary' : 'secondary'}
                        onClick={() => handleButtonClick(2)}
                    >
                        Ticket Status
                    </Button>
                </ButtonGroup>
                <div>
                    <div className='row'>
                        <div className='col-md'>
                            <div className="row mt-3 container-fluid">
                                <div className="row mt-3">
                                    <div className="col-6" style={{ marginLeft: '23%' }}>
                                        <Card>
                                            <Card.Header className="d-flex justify-content-between">
                                                <Card.Title>
                                                    {activeButton === 1 ? "Issue Type List" : "Issue Status List"}
                                                </Card.Title>
                                                <Button onClick={displayModal}><FontAwesomeIcon icon={faPlus} />Add New  </Button>
                                            </Card.Header>
                                            <Card.Body className="d-flex justify-content-center">
                                                {
                                                    loading ? (<div className="d-flex justify-content-center align-items-center" style={{ height: 500 }}>
                                                        <Button variant="primary" disabled>
                                                            <Spinner
                                                                as="span"
                                                                animation="grow"
                                                                size="sm"
                                                                role="status"
                                                                aria-hidden="true"
                                                            />
                                                            Loading...
                                                        </Button>
                                                    </div>) : (<div
                                                        className="ag-theme-quartz align-item-center " style={{ height: 500, width: '100%' }}
                                                    >
                                                        <AgGridReact
                                                            columnDefs={columnDefs}
                                                            rowData={rowData}
                                                            pagination={true}
                                                            paginationPageSize={5}
                                                            paginationPageSizeSelector={[5, 10, 25]}
                                                            defaultColDef={defaultColDef}
                                                            overlayLoadingTemplate={loading ? <div className="ag-overlay-loading-center">Loading...</div> : null}
                                                            overlayNoRowsTemplate={loading ? <div className="ag-overlay-loading-center">No data available</div> : null}
                                                            frameworkComponents={{ CustomHeaderComponent }}

                                                        />
                                                    </div>)
                                                }

                                            </Card.Body>
                                            <Card.Footer>

                                            </Card.Footer>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>

                </div>
                <div className='col-md-12'>
                    <Modal show={showModal1} onHide={handleModal1Close} backdrop="static" keyboard={false}>

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
                                                Issue Type is Required
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
                                    <Button variant='success' onClick={save}>
                                        {loading ? 'Saving...' : 'ADD'}
                                    </Button>

                                }
                                {
                                    issueTypeObj.issueTypeId == 0 && <Button variant='secondary' className='m-2' onClick={() => { resetIssueType() }}>Reset</Button>
                                }
                                {
                                    issueTypeObj.issueTypeId !== 0 &&
                                    <Button variant='success' onClick={update}> {loading ? 'Updating...' : 'Update'}</Button>

                                }


                            </div>
                        </Modal.Footer>
                    </Modal>
                </div>

                <div className="col-md-12">
                    <Modal show={showModal2} onHide={handleModal2Close} backdrop="static" keyboard={false}>
                        <Modal.Header closeButton className="bg-light">

                            <Modal.Title>
                                {/* {JSON.stringify(issueObj)} */}
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
                                                <input type="text" className='form-control' value={issueObj.status} onChange={(event) => handleChangeStatus(event, "status")} />
                                                {
                                                    validationerror && issueObj.status == '' && <div className='text-danger'>
                                                        Status name is required
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
                                                    onChange={(event) => handleChangeStatus(event, "orderNo")}
                                                />
                                                {
                                                    validationerror && issueObj.orderNo == '' && <div className='text-danger'>
                                                        Order No is required
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
                                                    onChange={(event) => handleChangeStatus(event, "isActive")}
                                                    required />
                                                {
                                                    validationerror && issueObj.isActive == '' && <div className='text-danger'>
                                                        click on checkbox
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer style={{ display: 'flex', justifyContent: 'center' }}>
                            {issueObj.statusId === 0 && (
                                <Button className="btn btn-sm btn-primary m-2" onClick={save}> {loading ? 'Saving...' : 'ADD'}</Button>
                            )}
                            {issueObj.statusId === 0 && (<Button className="btn btn-sm btn-secondary" onClick={() => resetIssueObj()} >
                                Reset
                            </Button>)

                            }
                            {issueObj.statusId !== 0 && (
                                <Button variant='success' onClick={update}> {loading ? 'Updating...' : 'Update'}</Button>
                            )}

                        </Modal.Footer>
                    </Modal>

                    <Modal
                            show={confirmationModalOpen} onHide={closeConfirmationModal} backdrop="static"
                        >
                            <Modal.Header closeButton className="bg-light">
                                <Modal.Title>Confirmation</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Are you sure you want to delete this ?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={closeConfirmationModal}>
                                    No
                                </Button>
                                <Button variant="primary" onClick={onDelete}>
                                    Yes
                                </Button>
                            </Modal.Footer>
                        </Modal>
                </div>

            </div>
        </>

    );
}

export default Master;

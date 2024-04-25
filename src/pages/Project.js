import React, { useEffect, useState, useContext } from 'react';
import { Table, Button, Card, Row, Col, Modal, Toast } from "react-bootstrap";
import { deleteData, getData, postData } from '../Service/Service.js';
import '../Service/Main.css'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Spinner from 'react-bootstrap/Spinner';
import { MyContext } from '../MyContextProvider.js';

const Project = () => {
    const { loggedUserData, updateLoggedUserData } = useContext(MyContext);
    const [projectList, setprojectList] = useState([]);
    const [userList, setUserList] = useState([]);
    const [projectObj, setprojectObj] = useState({
        projectId: 0,
        projectLogo: "",
        shortName: "",
        fullName: "",
        startDate: "",
        leadBy: 0,
        leadingByUserName: "",
        teamSize: 0,
        expectedEndDate: "",
        technologyStack: "",
        createdDate: "",
        createdBy: 0,
        createdByUserName: ""
    })

    const notify = (message, classN) => {
        return new Promise((resolve) => {
            const className = `toast-${classN}`;
            toast(message, {
                className: className,
                autoClose: 2000,
                position: "top-center",
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                onClose: () => resolve(), // Resolve the promise when the toast is closed
            });
        });
    };

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        resetProjectObj();
    };

    const [isLoading, setIsLoading] = useState(true);

    const handleModalClick = (e) => {
        e.stopPropagation();
    };
    const getUserList = () => {
        try {
            getData('GetAllUsers').then(result => {
                if (result != undefined) {
                    setUserList(result);
                }
                else {
                    alert('Error in fetching user List');
                }
            })
        } catch (error) {
            alert(error);
        }
    }
    const [validationerror, setvalidationerror] = useState(false);

    useEffect(() => {
        getProjectList();
        getUserList();

    }, []);

    const getProjectList = async () => {
        setIsLoading(true);
        getData('GetAllProject').then(result => {
            try {
                if (result != undefined) {
                    setprojectList(result);
                    setIsLoading(false);
                }
                else {
                    notify('Something went wrong');
                    setIsLoading(false);
                }
            } catch (error) {
                notify(error);
            }

            const projectsWithSerialNumbers = addSerialNumbers(result);
            setprojectList(projectsWithSerialNumbers);
        })
    }


    const addSerialNumbers = (data) => {
        return data.map((project, index) => {
            return { ...project, Srno: index + 1 };
        });
    };

    const CustomButtonComponent = (props) => {
        return (
            <React.Fragment>
                <button style={{ marginRight: '10px' }} className='btn btn-sm btn-success' onClick={() => onEdit(props.data)} ><FontAwesomeIcon icon={faEdit} /></button>
                <button className='btn btn-sm btn-danger' onClick={() => onDelete(props.data)} ><FontAwesomeIcon icon={faTrash} /></button>
            </React.Fragment>
        );
    };

    const onEdit = (projectData) => {
        const formattedDate = projectData.startDate.split('T')[0];
        const formattedDate1 = projectData.expectedEndDate.split('T')[0];
        const formattedDate2 = projectData.createdDate.split('T')[0];

        setprojectObj({
            ...projectData,
            startDate: formattedDate,
            expectedEndDate: formattedDate1,
            createdDate: formattedDate2,
        });
        setShow(true);
        getProjectList();
    }

    const onDelete = (projectData) => {
        try {
            debugger
            deleteData('DeleteProjectById?id=', projectData.projectId).then(result => {
                debugger
                if (result != undefined) {
                    notify(result.message);
                    // getProjectList();
                }
            })
        } catch (error) {
            notify(error);
        }
    }

    // const [colDefs, setColDefs] = useState([
    //     { field: "Srno", headerName: "Sr No", cellStyle: { textAlign: 'center' } },
    //     { field: "fullName", headerName: "Full Name", cellStyle: { textAlign: 'center' } },
    //     { field: "leadingByUserName", headerName: "Leading By User Name", cellStyle: { textAlign: 'center' } },
    //     { field: "technologyStack", headerName: "Technology Stack", cellStyle: { textAlign: 'center' } },
    //     { field: "createdByUserName", headerName: "Created By User Name", cellStyle: { textAlign: 'center' } },
    //     { field: "Action", headerName: "Action", cellRenderer: CustomButtonComponent }

    // ]);
    const [colDefs, setColDefs] = useState([
        {
            field: "Srno",
            flex: 0.5,
            headerName: "Sr No",
            cellStyle: { textAlign: "center" },
        },
        { field: "fullName", flex: 1 },
        { field: "leadingByUserName", flex: 1 },
        { field: "technologyStack", flex: 1 },
        { field: "createdByUserName", flex: 1 },
        { field: "Action", cellRenderer: CustomButtonComponent, flex: 0.5 },
    ]);


    const handleChange = (event, key) => {
        setprojectObj((prevObj) => ({ ...prevObj, [key]: event.target.value }));
    }

    const saveProject = () => {
        try {
            postData('CreateProject', projectObj).then(result => {
                if (result !== undefined) {
                    // toast.success('Project Saved Successfully...!');
                    getProjectList();
                }
            });
        } catch (error) {
            notify(error);
        }
        resetProjectObj();
        setShow(false);
    }

    const UpdateProject = () => {
        try {
            postData('UpdateProject', projectObj).then(result => {
                if (result != undefined) {
                    notify(result.message);
                    // getProjectList();
                }
            })
        } catch (error) {
            notify(error);
        }
        resetProjectObj();
        setShow(false);
    }

    const resetProjectObj = () => {
        setprojectObj({
            projectId: 0,
            projectLogo: "",
            shortName: "",
            fullName: "",
            startDate: "",
            leadBy: 0,
            leadingByUserName: "",
            teamSize: 0,
            expectedEndDate: "",
            technologyStack: "",
            createdDate: "",
            createdBy: 0,
            createdByUserName: ""
        });
    };


    return (
        <>
            <div className='mt-5'></div>
            <div className='container-fluid'>
                {/* =  {loggedUserData.emailId} */}
                <div >
                    <Card >

                        <Card.Header className="d-flex justify-content-between ">
                            <h4>Project List</h4>
                            <Button onClick={handleShow}>Add New <FontAwesomeIcon icon={faPlus} /></Button>
                        </Card.Header>
                        <Card.Body>{
                            isLoading ?
                                <div className="d-flex justify-content-center align-items-center" style={{ height: 500 }}>

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
                                </div> : <div
                                    className="ag-theme-quartz" style={{ height: 500, width: '100%' }}
                                >
                                    <AgGridReact
                                        rowData={projectList}
                                        columnDefs={colDefs}
                                        pagination={true}
                                        paginationPageSize={7}
                                        paginationPageSizeSelector={[7, 10, 20, 25]}

                                    />
                                </div>}
                        </Card.Body>
                        <Card.Footer>

                        </Card.Footer>
                    </Card>

                    <div className='col-md-12'>
                        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}
                            style={{ boxShadow: '8px 8px 8px rgba(0, 0, 0, 0.5)' }} >
                            <Modal.Header closeButton className=' custom-card-header bg-light' >
                                <Modal.Title>
                                    {
                                        projectObj.projectId == 0 && <h4>Add Project</h4>
                                    }
                                    {
                                        projectObj.projectId != 0 && <h4>Update Project</h4>
                                    }
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div >
                                    <div>
                                        <div className='card-body'>
                                            <div className='row'>
                                                <div className='col-md-6'>
                                                    <label>Short Name</label>
                                                    <input type="text" className='form-control'
                                                        value={projectObj.shortName} placeholder='Enter Short Name'
                                                        onChange={(event) => handleChange(event, 'shortName')}>
                                                    </input>
                                                    {
                                                        validationerror && projectObj.shortName == '' && <div className='text-danger'>
                                                            This field is required
                                                        </div>
                                                    }
                                                </div>

                                                <div className='col-md-6'>
                                                    <label>Full Name </label>
                                                    <input type="text" className='form-control'
                                                        value={projectObj.fullName} placeholder='Enter Full Name'
                                                        onChange={(event) => handleChange(event, 'fullName')}>
                                                    </input>
                                                    {
                                                        validationerror && projectObj.fullName == '' && <div className='text-danger'>
                                                            This field is required
                                                        </div>
                                                    }
                                                </div>
                                            </div>

                                            <div className='row my-2'>
                                                <div className='col-md-6'>
                                                    <label>Start Date</label>
                                                    <input type='Date' className='form-control'
                                                        value={projectObj.startDate} placeholder='Select Start date'
                                                        onChange={(event) => handleChange(event, 'startDate')}>
                                                    </input>
                                                    {
                                                        validationerror && projectObj.startDate == '' && <div className='text-danger'>
                                                            This field is required
                                                        </div>
                                                    }
                                                </div>

                                                <div className='col-md-6'>
                                                    <label>Lead By</label>
                                                    <select className="form-select" onChange={(event) => handleChange(event, 'LeadBy')}>
                                                        <option>Select User</option>
                                                        {
                                                            userList.map((user, index) => {
                                                                return (
                                                                    <option value={user.userId}>{user.fullName}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>

                                            <div className='row my-2'>
                                                <div className='col-md-6'>
                                                    <label>Team Size</label>
                                                    <input type="text" className='form-control'
                                                        value={projectObj.teamSize} placeholder='Enter Team Size'
                                                        onChange={(event) => handleChange(event, 'teamSize')}>
                                                    </input>
                                                    {
                                                        validationerror && projectObj.teamSize == '' && <div className='text-danger'>
                                                            This field is required
                                                        </div>
                                                    }
                                                </div>

                                                <div className='col-md-6'>
                                                    <label>Expected End Date</label>
                                                    <input type='Date' className='form-control'
                                                        value={projectObj.expectedEndDate} placeholder='Select Expected End Date'
                                                        onChange={(event) => handleChange(event, 'expectedEndDate')}>
                                                    </input>
                                                    {
                                                        validationerror && projectObj.expectedEndDate == '' && <div className='text-danger'>
                                                            This field is required
                                                        </div>
                                                    }
                                                </div>
                                            </div>

                                            <div className='row my-2'>
                                                <div className='col-md-6'>
                                                    <label>Technology Stack</label>
                                                    <input type="text" className='form-control'
                                                        value={projectObj.technologyStack} placeholder='Enter Technology Stack'
                                                        onChange={(event) => handleChange(event, 'technologyStack')}>
                                                    </input>
                                                    {
                                                        validationerror && projectObj.technologyStack == '' && <div className='text-danger'>
                                                            This field is required
                                                        </div>
                                                    }
                                                </div>

                                                <div className='col-md-6'>
                                                    <label>Created Date</label>
                                                    <input type='Date' className='form-control'
                                                        value={projectObj.createdDate} placeholder='Select Created Date'
                                                        onChange={(event) => handleChange(event, 'createdDate')}>
                                                    </input>
                                                    {
                                                        validationerror && projectObj.createdDate == '' && <div className='text-danger'>
                                                            This field is required
                                                        </div>
                                                    }
                                                </div>
                                            </div>


                                            <div className='row my-2'>
                                                <div className='col-md-6'>
                                                    <label>CreatedBy</label>
                                                    <select className="form-select" onChange={(event) => handleChange(event, 'CreatedBy')}>
                                                        <option>Select User</option>
                                                        {
                                                            userList.map((user, index) => {
                                                                return (
                                                                    <option value={user.userId}>{user.fullName}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>

                                                <div className='col-md-6'>
                                                    <label>Project Logo</label>
                                                    <input type="text" className='form-control'
                                                        value={projectObj.projectLogo} placeholder='Enter Project Logo'
                                                        onChange={(event) => handleChange(event, 'projectLogo')}>
                                                    </input>
                                                    {
                                                        validationerror && projectObj.projectLogo == '' && <div className='text-danger'>
                                                            This field is required
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer >
                                <div>
                                    {
                                        projectObj.projectId == 0 &&
                                        <Button variant='success' onClick={saveProject}>Add</Button>
                                    }
                                    {
                                        projectObj.projectId != 0 &&
                                        <Button variant='success' onClick={UpdateProject}>Update</Button>

                                    }
                                    {/* <Button variant='danger' className='m-2' onClick={() => setShow(false)}>Cancel</Button> */}
                                    <Button variant='secondary' className='m-2' onClick={resetProjectObj}>Reset</Button>

                                </div>
                            </Modal.Footer>
                        </Modal>
                        {/* <ToastContainer
                        position="top-right"
                        autoClose={1000}
                        closeButton={false}
                        theme="light"

                    />

                    <ToastContainer /> */}


                    </div>
                </div>

            </div>
        </>


    );
};

export default Project;
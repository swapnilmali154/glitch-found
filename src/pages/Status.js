import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, ModalBody, ModalFooter } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import { Modal } from "react-bootstrap";

const Status = () => {

 const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //Get All Isuuses
    const [issuelist, setIssueList] = useState([]);
    const [todolist, setTodolist] = useState([]);
    const [inprogrss, setInprogress] = useState([]);
    const [completed, setCompleted] = useState([]);
    const getIssueList = async () => {
        debugger;
        const result = await axios.get("https://onlinetestapi.gerasim.in/api/Glitch/GetAllIssues");
        // const result = await axios.get("https://onlinetestapi.gerasim.in/api/Glitch/GetAllIssueStatus");
        setIssueList(result.data.data);
        debugger;
       // getToDoList();
        // setInprogress([]);
        // setCompleted([]);
        // setTodolist([]);

       
         for (let index = 0; index < issuelist.length; index++) {
            const issue = issuelist[index];
            if (issue.statusId === 2) {
                
                setInprogress(prev => [...prev, issuelist[index]])
            } else if (issue.statusId === 3) {
               
                setCompleted(prev => [...prev, issuelist[index]])
            } else if (issue.statusId === 49) {
            
                setTodolist(prev => [...prev, issuelist[index]])
            }
        }


    }


 const changeStatus = (obj) => {

       handleShow();
    }
 
    
const getChange=(event)=>{

    }
    useEffect(() => {
       getIssueList();
    }, []);
   
    return (
        <div>
            <div className='container-fluid'>
                {/* <button className='btn btn-success' onClick={getToDoList}>Show status</button> */}
                <div className='row'>

                    <div className='col-4'>
                        <div className='card'>
                            <div className='card-header'>
                                <h5>TO DO({todolist.length})</h5>
                            </div>
                            <div className='card-body'>
                                {

                                    todolist.map((issue, index) => {
                                        return (
                                            <Card>
                                                <CardHeader> {issue.summary}</CardHeader>

                                                <CardBody>Type-{issue.issueTypeName}<br></br>
                                                    <div className='row'>
                                                        <div className='col-6'>
                                                            Date-{issue.createdDate}
                                                        </div>
                                                        <div className='col-6'>
                                                            <button className="btn btn-sm btn-success m-2" onClick={()=>{changeStatus(issue)}}> <FaEdit /></button>
                                                        </div>
                                                    </div>


                                                </CardBody>

                                            </Card>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className='col-4'>
                        <div className='card'>
                            <div className='card-header'>
                                In progress({inprogrss.length})
                            </div>
                            <div className='card-body'>
                                {

                                    inprogrss.map((issue, index) => {
                                        return (
                                            <Card>
                                                <CardHeader> {issue.summary}</CardHeader>
                                            </Card>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className='col-4'>
                        <div className='card'>
                            <div className='card-header'>
                                Completed({completed.length})
                            </div>
                            <div className='card-body'>
                                {

                                    completed.map((issue, index) => {
                                        return (
                                            <Card>
                                                <CardHeader> {issue.summary}</CardHeader>
                                            </Card>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-12">
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton className="bg-light">
                        <Modal.Title>Change Status</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            <div>
                                <div className='row'>
                                    <div className='col-6'>
                                        <label>Change Status</label>
                                        <select onChange={(event)=>getChange(event)}>
                                            <option>In-Progress</option>
                                            <option>Completed</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-secondary" onClick={handleClose}>
                            Close
                        </button>
                        <button className="btn btn-primary" onClick={handleClose}>
                            Save Changes
                        </button>
                    </Modal.Footer>

                </Modal>
            </div>

        </div>
    );
};

export default Status;
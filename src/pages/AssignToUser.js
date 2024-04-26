import React, { useContext, useEffect, useState } from 'react';
import { MyContext } from '../MyContextProvider';
import axios from 'axios';
import { getData, getDataById, postData } from '../Service/Service.js';
import { Card, Form, Row, Col, CardHeader, CardBody } from 'react-bootstrap';
import Board from './Board.js';

const AssignToUser = () => {
    const { loggedUserData, updateLoggedUserData } = useContext(MyContext);
    const [userIssues, setuserIssues] = useState([]);
    const [statusList, setstatusList] = useState([]);
    const getUserIssues = () => {
        try {
            getDataById(`GetAllAssignedIssuesByUserId?id=${loggedUserData.userId}`).then(result => {
                if (result != undefined) {
                    setuserIssues(result)
                }
                else {
                    alert('Error in getting user issues');
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
    useEffect(() => {
        getUserIssues();
        getStatusList();
    }, []);
    return (
        <div>
 <div className='mt-5'></div>
        <div className='mt-3'>
            <div className='row mt-3'>
                <div className='container-fluid'>
                    <div className='row mt-3'>
                        {statusList.map(status => (
                            <div key={status.statusId} className='col-md-2 col-sm-4 col-6 mt-2' style={{ width: "20%" }}>
                                <Card>
                                    <Card.Header className='text-start bg-secondary text-white' style={{ padding: 1 }}>
                                        <p className='mx-3'>{status.status} <span>{userIssues.filter(issue => issue.status === status.status).length}</span>&nbsp;Issues</p>
                                    </Card.Header>
                                    <CardBody>
                                        {userIssues.filter(issue => issue.status === status.status).length > 0 ? (
                                            userIssues.map((issue, index) => {
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
                                                                        {/* <span>
                                                        <FaEdit onClick={() => getIssueListbyissueId(issue.issueId)} />
                                                    </span> */}
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
        </div>
        </div>
       
    );
};

export default AssignToUser;
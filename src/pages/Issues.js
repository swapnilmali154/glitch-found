import React, { useEffect, useState } from 'react';
import { deleteData, getData, postData } from '../Service/Service.js';
import '../Service/Main.css'
import { AgGridReact } from 'ag-grid-react';
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Card, Form, Row, Col, CardHeader, CardBody } from 'react-bootstrap';
import { FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
const Issues = () => {
    const [issueList, setissueList] = useState([]);

    const getIssueList = async () => {
        getData('GetAllIssues').then(result => {
            try {
                if (result != undefined) {
                    setissueList(result);
                } else {
                    alert('Something went wrong');
                }
            } catch (error) {
                alert(error);
            }
        })
    }

    useEffect(() => {
        getIssueList();
    }, []);

    const handleEdit = (index) => {
        
        const updatedIssueList = [...issueList];
        updatedIssueList[index].isEditing = true;
        setissueList(updatedIssueList);
    }

    const handleInputChange = (e, index) => {
        
        const { name, value } = e.target;
        const updatedIssueList = [...issueList];
        updatedIssueList[index][name] = value;
        setissueList(updatedIssueList);
    }

    const handleSave = (index) => {
        
        const updatedIssueList = [...issueList];
        updatedIssueList[index].isEditing = false;
        setissueList(updatedIssueList);
    }

    const handleCancel = (index) => {
        const updatedIssueList = [...issueList];
        updatedIssueList[index].isEditing = false;
        setissueList(updatedIssueList);
    }

    return (
        <div>
            <div className='row mt-3'>
                <div className='col-md-4'>
                    <Card>
                        <CardHeader>
                        <h4>To Do</h4>
                        </CardHeader>
                        <CardBody>
                        {issueList.map((issue, index) => {
                        return issue.status === 'To Do' && (
                            <Card key={index} className='mb-2'>
                                <Card.Header>
                                    {issue.isEditing ? (
                                        <Form.Control
                                            type="text"
                                            name="issueTypeName"
                                            value={issue.issueTypeName}
                                            onChange={(e) => handleInputChange(e, index)}
                                        />
                                    ) : (
                                        <h5 className="hover-container">{issue.issueTypeName} &nbsp;<FaEdit className="edit-icon" onClick={() => handleEdit(index)} style={{ cursor: 'pointer' }} /></h5>
                                    )}

                                    {issue.isEditing ? (
                                        <>
                                            <FaCheck onClick={() => handleSave(index)} style={{ cursor: 'pointer' }} />
                                            <FaTimes className='ml-2' onClick={() => handleCancel(index)} style={{ cursor: 'pointer' }} />
                                        </>
                                    ) : ''}

                                </Card.Header>

                            </Card>
                        );
                    })}
                        </CardBody>
                    </Card>
                    
                  
                </div>
                <div className='col-md-4'>
                    <Card>
                        <CardHeader>
                        <h4>In Progress</h4>
                        </CardHeader>
                        <CardBody>
                        {issueList.map((issue, index) => {
                        return issue.status === 'In Progress' && (
                            <Card key={index} className='mb-2'>
                                <Card.Header>
                                    {issue.isEditing ? (
                                        <Form.Control
                                            type="text"
                                            name="issueTypeName"
                                            value={issue.issueTypeName}
                                            onChange={(e) => handleInputChange(e, index)}
                                        />
                                    ) : (
                                        <h5 className="hover-container">{issue.issueTypeName} &nbsp;<FaEdit className="edit-icon" onClick={() => handleEdit(index)} style={{ cursor: 'pointer' }} /></h5>
                                    )}

                                    {issue.isEditing ? (
                                        <>
                                            <FaCheck onClick={() => handleSave(index)} style={{ cursor: 'pointer' }} />
                                            <FaTimes className='ml-2' onClick={() => handleCancel(index)} style={{ cursor: 'pointer' }} />
                                        </>
                                    ) : ''}

                                </Card.Header>

                            </Card>
                        );
                    })}
                        </CardBody>
                    </Card>
                    
                  
                </div>
                <div className='col-md-4'>
                    <Card>
                        <CardHeader>
                        <h4>Done</h4>
                        </CardHeader>
                        <CardBody>
                        {issueList.map((issue, index) => {
                        return issue.status === 'done' && (
                            <Card key={index} className='mb-2'>
                                <Card.Header>
                                    {issue.isEditing ? (
                                        <Form.Control
                                            type="text"
                                            name="issueTypeName"
                                            value={issue.issueTypeName}
                                            onChange={(e) => handleInputChange(e, index)}
                                        />
                                    ) : (
                                        <h5 className="hover-container">{issue.issueTypeName} &nbsp;<FaEdit className="edit-icon" onClick={() => handleEdit(index)} style={{ cursor: 'pointer' }} /></h5>
                                    )}

                                    {issue.isEditing ? (
                                        <>
                                            <FaCheck onClick={() => handleSave(index)} style={{ cursor: 'pointer' }} />
                                            <FaTimes className='ml-2' onClick={() => handleCancel(index)} style={{ cursor: 'pointer' }} />
                                        </>
                                    ) : ''}

                                </Card.Header>

                            </Card>
                        );
                    })}
                        </CardBody>
                    </Card>
                    
                  
                </div>
            </div>
        </div>
    );
};

export default Issues;
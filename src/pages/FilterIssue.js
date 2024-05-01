import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { Card, Button } from "react-bootstrap";
import Spinner from 'react-bootstrap/Spinner';
import { toast } from 'react-toastify';
const FilterIssue = () => {
    const [IssueList, setIssueList] = useState([]);
    const [projectuser, setProjectUser] = useState([]);
    const [issuetype, setissueType] = useState([]);
    const [issueStatus, setIssueStatus] = useState([]);
    const [alluser, setalluser] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const [filterobj, setFilterObj] = useState({
        "reporter": null,
        "assignedTo": null,
        "statusId": null,
        "projectId": null,
        "issueTypeId": null,
        "searchText": null
    })

    const onCangeSelect = (event, key) => {
        setFilterObj({ [key]: event.target.value });
    }
    /**************************  Filter Logic ***********8 */
    const getfilter = async () => {
        setisLoading(true);
        try {
            const response = await axios.post("https://onlinetestapi.gerasim.in/api/Glitch/GetIssuesByFilter", filterobj);
            if (response.data.result) {
                debugger;
                const data = await response.json();
                setFilteredData(data);
            } else {
                toast.error('Failed to fetch issues');
            }
        }
        catch (error) {
            toast.error(error);
        }
        setisLoading(false);
    }
    /************ Get ALL API */
    const fetchData = async () => {
        setisLoading(true);
        const issueResponse = await axios.get("https://onlinetestapi.gerasim.in/api/Glitch/GetAllIssues");
        const issueStatus = await axios.get("https://onlinetestapi.gerasim.in/api/Glitch/GetAllIssueStatus");
        const projectUserResponse = await axios.get("https://onlinetestapi.gerasim.in/api/Glitch/GetAllProject");
        const issueTypeResponse = await axios.get("https://onlinetestapi.gerasim.in/api/Glitch/GetAllIssueTypes");
        const allUserResponse = await axios.get("https://onlinetestapi.gerasim.in/api/Glitch/GetAllUsers");
        setIssueList(issueResponse.data.data);
        setIssueStatus(issueStatus.data.data);
        setProjectUser(projectUserResponse.data.data);
        setissueType(issueTypeResponse.data.data);
        setalluser(allUserResponse.data.data);
        setFilteredData(issueResponse.data.data);
        setisLoading(false)
    };
    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        getfilter();
      }, [filteredData]);
    /************ For large Data in Summary and Description filed */
    const summaryCellRenderer = (params) => {
        return <div className="scrollable-cell">{params.value}</div>;
    };

    const descriptionCellRenderer = (params) => {
        return <div className="scrollable-cell">{params.value}</div>;
    };
    /*******  Set Column *****************/
    const colDefs = [
        {
            headerName: "Sr.No",
            field: 'serialNumber',
            valueGetter: (params) => params.node.rowIndex + 1,
            width: 100,
            suppressSizeToFit: true,
        },
        { headerName: "Status", field: "status" },
        { headerName: "Created By UserName", field: "createdByUserName" },
        { headerName: "Summary", field: "summary", width: 150, cellRenderer: 'summaryCellRenderer' },
        { headerName: "Description", field: "description", width: 150, cellRenderer: 'descriptionCellRenderer' }
    ];
    /****** for full sidth of table  */
    const defaultColDef = {
        flex: 1,
    };

    /*************** Reset Completet form */
    const resetform = () => {
        setFilterObj({
            "reporter": 0,
            "assignedTo": 0,
            "statusId": 0,
            "projectId": 0,
            "issueTypeId": 0,
            "searchText": ""
        })
        setFilteredData(IssueList);
    }
    return (
        <>
            <div className='row mt-5'></div>
            <div className="container-fluid">
                <Card>
                    <Card.Header className="d-flex justify-content-between">
                        <div className='row'>

                            {/* Other select options */}
                            <div className='row'>
                                <div className='col-2'>
                                    <label><strong>StatusID</strong></label>

                                    <select className='form-select' value={filterobj.statusId} onChange={(event) => { onCangeSelect(event, 'statusId') }}>
                                        <option>Select status</option>                                                    {
                                            issueStatus.map((sid) => {
                                                return (<option value={sid.statusId}>{sid.status}</option>)
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='col-2'>
                                    <label><strong>Issue Type</strong></label>

                                    <select className='form-select' value={filterobj.issueTypeId} onChange={(event) => { onCangeSelect(event, 'issueTypeId') }}>
                                        <option>Select Type</option>
                                        {
                                            issuetype.map((issue) => {
                                                return (<option value={issue.issueTypeId}>{issue.issueType}</option>)
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='col-2'>
                                    <label><strong>Assigned To</strong></label>
                                    <select className='form-select' value={filterobj.assignedTo} onChange={(event) => { onCangeSelect(event, 'assignedTo') }}>
                                        <option>Select Assigned</option>
                                        {
                                            alluser.map((sid) => {
                                                return (<option value={sid.userId}>{sid.fullName}</option>)
                                            })
                                        }
                                    </select>
                                </div>

                                <div className='col-2'>
                                    <label><strong>Project Name</strong></label>
                                    <select className='form-select' value={filterobj.projectId} onChange={(event) => { onCangeSelect(event, 'projectId') }}>
                                        <option>Select Project</option>
                                        {
                                            projectuser.map((project) => {
                                                return (<option value={project.projectId}>{project.shortName}</option>)
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='col-2'>
                                    <label><strong>Reporter</strong></label>
                                    <select className='form-select' value={filterobj.reporter} onChange={(event) => { onCangeSelect(event, 'reporter') }}>
                                        <option>Select Reporter</option>
                                        {
                                            alluser.map((sid) => {
                                                return (<option value={sid.userId}>{sid.fullName}</option>)
                                            })
                                        }
                                    </select>
                                </div>
                                <div className='col-2'>
                                    <label><strong>Enter Text</strong> </label>
                                    <input type="search" placeholder='Enter text' value={filterobj.searchText} className='form-control' onChange={(event) => { onCangeSelect(event, 'searchText') }} />
                                </div>

                            </div>

                        </div>
                        <div className='row'>
                            <div className='col-6 d-flex justify-content-end'>
                                <button className="btn btn-success mt-3" onClick={getfilter} style={{ height: 40 }}>Search</button>
                            </div>
                            <div className='col-6 d-flex justify-content-end'>
                                <button className="btn btn-secondary  mt-3" onClick={resetform} style={{ height: 40 }}>Reset</button>
                            </div>
                        </div>
                    </Card.Header>
                    <Card.Body className="d-flex justify-content-center align-items-center">
                        {
                            isLoading ? (<div className="d-flex justify-content-center align-items-center" style={{ height: 500 }}>

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
                            </div>) : (<div className="ag-theme-quartz" style={{ height: 500, width: '100%' }}>

                                {filteredData.length > 0 ? (
                                    <AgGridReact
                                        rowData={filteredData}
                                        columnDefs={colDefs}
                                        defaultColDef={defaultColDef}
                                        pagination={true}
                                        paginationPageSize={5}
                                        paginationPageSizeSelector={[5, 10, 25]}
                                        frameworkComponents={{ summaryCellRenderer, descriptionCellRenderer }}
                                    />
                                ) : (
                                    <div style={{ textAlign: 'center', marginTop: '15%', fontSize: '30px', color: 'gray' }}>
                                        Issue Not found
                                    </div>
                                )}
                            </div>)
                        }

                    </Card.Body>
                    <Card.Footer></Card.Footer>
                </Card>
            </div>
        </>

    );
};

export default FilterIssue;

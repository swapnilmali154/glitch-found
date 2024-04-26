import React, { useContext, useEffect, useState } from 'react';
import '../Service/Main.css'
import { getData } from '../Service/Service.js';
import { Link, useNavigate } from 'react-router-dom';
import Board from '../pages/Board.js';
import ModalDialog from '../pages/ModalDialog.js';
import { MyContext } from '../MyContextProvider';

const Navbar = () => {
const {loggedUserData ,updateLoggedUserData} = useContext(MyContext);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [allProject, setallProject] = useState([]);
    const [selectedProject, setSelectedProject] = useState({});
    const [showDropdown, setShowDropdown] = useState(false);
    const getAllProjects = () => {
        try {
            getData('GetAllProject').then(result => {
                if (result != undefined) {
                    setallProject(result);
                }
                else {
                    alert('error in get all projects');
                }
            })
        } catch (error) {
            alert(error);
        }

    }
    useEffect(() => {
        getAllProjects();
    }, []);
    const handleProjectSelect = (projectId, shortName) => {
        
        setSelectedProject({ projectId, shortName });
        navigate(`/board/${projectId}/${encodeURIComponent(shortName)}`);
       // navigate(`/board:/${projectId}`);
        setShowDropdown(false);
    };
    const toggleDropdown = () => {
        setShowDropdown(!showDropdown); // Toggle dropdown visibility
    };
    const OpenModal = () => {
        
        setShowModal(!showModal);

        // navigate('/modalDialogue');

    }
    const resetLoggedData =()=>{
        updateLoggedUserData('');
        sessionStorage.removeItem('loginUserData');
        navigate('/');
    }
    return (
        <>
{
    loggedUserData  &&  loggedUserData.emailId != undefined &&  (  <nav className="navbar navbar-expand-lg bg-primary fixed-top mynav  pb-2 pt-2 mb-10">
    <div className="container-fluid">
        <a className="navbar-brand align-self-baseline" href="#"><i className="fa-solid fa-bars me-3"></i>Jira Software</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02"
            aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0 text-dark">
            <li className="nav-item">
                                    <Link className="nav-link" to="/user">
                                        User
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/project">
                                        Project
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/projectUser">
                                        Project User
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/master">
                                        Master
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/filterIssue">
                                        Filter Data
                                    </Link>
                                </li>
                                
                               
                                <li className="nav-item">
                                    <Link className="nav-link" onClick={()=>setShowModal(true)}>
                                        Create
                                    </Link>
                                </li>

                <li className="nav-item dropdown">
                    <a
                        className="nav-link dropdown-toggle text-dark content-hover text-white"
                        href="#"
                        role="button"
                        onMouseOver={toggleDropdown}
                        onMouseEnter={toggleDropdown} // Show dropdown on hover
                        onClick={toggleDropdown} // Toggle dropdown when Projects is clicked
                        aria-expanded={showDropdown ? 'true' : 'false'}
                    >
                        Projects
                    </a>
                    {showDropdown && (
                        <ul className="dropdown-menu" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {allProject.map((project, index) => (
                                <li key={project.projectId}>
                                    <a
                                        className="dropdown-item"
                                        href="#"
                                        onClick={() => {
                                            handleProjectSelect(project.projectId, project.shortName);
                                            setShowDropdown(false);
                                        }}
                                    >
                                        {project.shortName}
                                    </a>
                                    <hr className="dropdown-divider" />
                                </li>
                            ))}
                            <li>
                                <a
                                    className="dropdown-item"
                                    href="#"
                                    onClick={()=>setShowModal(true)}
                                >
                                    Create Project
                                </a>
                            </li>
                            {/* Add more items as needed */}
                        </ul>
                    )}
                </li>
            </ul>
            {/* Search Form */}
            <form className="d-flex" role="search">
                <input className="form-control" type="search" placeholder="Search" aria-label="Search" />
                {/* User Dropdown */}
                <ul className="navbar-nav me-auto mb-2 mb-lg-0 text-dark">
                    <li className="nav-item dropdown">
                        <a className="nav-link dropdown-toggle text-dark content-hover" href="#" role="button"
                            data-bs-toggle="dropdown" aria-expanded="false">
                            user -{loggedUserData.emailId}
                        </a>
                        <ul className="dropdown-menu logUser">
                            <li><a className="dropdown-item" href="#">Profile</a></li>
                            <li><a className="dropdown-item" href="#">Logo</a></li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                            <Link className="dropdown-item" to="/login" onClick={resetLoggedData}>
                                      Log-off
                                    </Link>
                                    </li>
                        </ul>
                    </li>
                </ul>
            </form>
        </div>
    </div>
</nav>) 
}
          
            {/* {selectedProject && (
                <div className='text-start mt-3'>
                    <p> {selectedProject.projectId}</p>
                    <h5>{selectedProject.shortName}</h5>
                </div>
            )} */}

            
            <ModalDialog Show={showModal} hide={setShowModal} />


        </>



    );
};

export default Navbar;



import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import User from './pages/User'
import Project from './pages/Project'
import Issues from './pages/Issues';
import ProjectUser from './pages/ProjectUser';
import TicketStatus from './pages/TicketStatus';
import TicketType from './pages/TicketType';

function App() {
  const url = "https://onlinetestapi.gerasim.in/api/Glitch/";
  return (
    <div className="App">
       <BrowserRouter>
          <div classNameName="App">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
              <div className="container-fluid">
                <a className="navbar-brand" href="#">GlitchFound</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  
                    <li className="nav-item">
                      <Link className='nav-link' to="/user">User</Link>
                    </li>
                    <li className="nav-item">
                      <Link className='nav-link' to="/project">Project</Link>
                    </li>
                    <li className="nav-item">
                      <Link className='nav-link' to="/issues">Issues</Link>
                    </li>
                    <li className="nav-item">
                      <Link className='nav-link' to="/projectUser">ProjectUser</Link>
                    </li>
                    <li className="nav-item">
                      <Link className='nav-link' to="/ticketType">TicketType</Link>
                    </li>
                    <li className="nav-item">
                      <Link className='nav-link' to="/tickeStatus">TickeStatus</Link>
                    </li>
                    
                   
                    

                  </ul>
                </div>
              </div>
            </nav>

            <Routes>
              <Route path="user" element={<User></User>}></Route>
              <Route path="/project" element={<Project></Project>}></Route>
              <Route path="/issues" element={<Issues></Issues>}></Route>
              <Route path="/projectUser" element={<ProjectUser></ProjectUser>}></Route>
              <Route path="/ticketStatus" element={<TicketStatus></TicketStatus>}></Route>
              <Route path="/ticketType" element={<TicketType></TicketType>}></Route>
               
            </Routes>
          </div>
        </BrowserRouter>
    </div>
  );
}

export default App;

import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Link, Route, Routes, useLocation } from 'react-router-dom';
import User from './pages/User'
import Project from './pages/Project'
import Issues from './pages/Issues';
import ProjectUser from './pages/ProjectUser';
import TicketStatus from './pages/TicketStatus';
import TicketType from './pages/TicketType';
import Master from './pages/Master';

import { NavDropdown } from 'react-bootstrap'
export function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
   
    <nav aria-label="breadcrumb">
    <ol className="breadcrumb">
      <li className="breadcrumb-item"><Link to="/">GlitchFound</Link></li>
      {pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const isLast = index === pathnames.length - 1;
        return (
          <li key={name} className={`breadcrumb-item ${isLast ? 'active' : ''}`} aria-current={isLast ? 'page' : undefined}>
            {isLast ? (
              name
            ) : (
              <Link to={routeTo}>{name}</Link>
            )}
          </li>
        );
      })}
    </ol>
  </nav>

  );
}
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
                  </li>
                
                  <li>
                    <NavDropdown title="Master" id="basic-nav-dropdown">
                      <NavDropdown.Item as={Link} to="/master/TicketType">TicketType</NavDropdown.Item>
                      <NavDropdown.Item as={Link} to="/master/TicketStatus">TicketStatus</NavDropdown.Item>
                     
                    </NavDropdown>
                  </li>

                  <li className="nav-item">
                    <Link className='nav-link' to="/Master1">Master</Link>
                  </li>

                </ul>

              </div>
            </div>
          </nav>
          <Breadcrumbs />
          <Routes>
            <Route path="user" element={<User></User>}></Route>
            <Route path="/project" element={<Project></Project>}></Route>
            <Route path="/issues" element={<Issues></Issues>}></Route>
            <Route path="/projectUser" element={<ProjectUser></ProjectUser>}></Route>
            <Route path="/master/TicketType" element={<TicketType></TicketType>}></Route>
            <Route path="/master/TicketStatus" element={<TicketStatus></TicketStatus>}></Route>
            {/* <Route path="/ticketType" element={<TicketType></TicketType>}></Route>
            <Route path="/ticketStatus" element={<TicketStatus></TicketStatus>}></Route> */}
            <Route path="/Master1" element={<Master />}></Route>
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;

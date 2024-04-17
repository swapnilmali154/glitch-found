import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import User from './Components/User';
import Project from './Components/Project';
import Issues from './Components/Issues';

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
                      <Link className='nav-link' to="/Issues">Issues</Link>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>

            <Routes>
              <Route path="user" element={<User></User>}></Route>
              <Route path="/project" element={<Project></Project>}></Route>
              <Route path="/Issues" element={<Issues></Issues>}></Route>
               
            </Routes>
          </div>
        </BrowserRouter>
    </div>
  );
}

export default App;

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
import {MyContextProvider, MyContext} from './MyContextProvider'
import Navbar from './Navbar/Navbar';
import Board from './pages/Board';
import ModalDialog from './pages/ModalDialog';
import Login from './pages/Login';
import FilterIssue from './pages/FilterIssue';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
      <MyContextProvider>
        <BrowserRouter>
        <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      
      <Navbar/>
       
         
          {/* <Breadcrumbs /> */}
          <Routes>
          <Route path="/" element={<Login/>}></Route>
            <Route path="/user" element={<User></User>}></Route>
            <Route path="/project" element={<Project></Project>}></Route>
            <Route path="/issues" element={<Issues></Issues>}></Route>
            <Route path="/projectUser" element={<ProjectUser></ProjectUser>}></Route>
            <Route path="/master/TicketType" element={<TicketType></TicketType>}></Route>
            <Route path="/master/TicketStatus" element={<TicketStatus></TicketStatus>}></Route>
            {/* <Route path="/ticketType" element={<TicketType></TicketType>}></Route>
            <Route path="/ticketStatus" element={<TicketStatus></TicketStatus>}></Route> */}
            <Route path="/master" element={<Master />}></Route> 
            {/* <Route path="/board" element={<Board/>}></Route> */}
            <Route path="/board/:projectId/:shortName" element={<Board />} />
            <Route path="/modalDialogue" element={<ModalDialog/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/filterIssue" element={<FilterIssue/>}></Route>
          </Routes>
      
      </BrowserRouter>
      </MyContextProvider>
     
    </div>
  );
}

export default App;

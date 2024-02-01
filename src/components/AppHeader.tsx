import {Navbar, NavDropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faUser, faBars, faBell, faAddressCard, faArrowRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from 'react';
import SideBarApp from './Sidebar';
import LogOutModal from './LogOutModal';

const Topbar: React.FC = () => {
  const [showSideBar, setShowSideBar] = useState(false);
  const [logOutModalShow, setLogOutModalShow] = useState(false);
  const name = localStorage.getItem('name');

  return (
    <>
      <Navbar expand="lg" className=" bg-light topbar px-3 py-2 mb-4 static-top shadow">
        <div className="row header-row align-items-center">
          <div className="col col-md-9">
            <button className="btn btn-primary primary-button-small" type="button" onClick={() => setShowSideBar(true)}>
              <FontAwesomeIcon icon={faBars} />
            </button>
          </div>
          <div className="col">
            <div className="row justify-content-end">
              <div className="col text-end">
                <NavDropdown title={<span><FontAwesomeIcon icon={faBell} /><span className="badge badge-danger badge-counter header-dropdown"></span></span>} id="alertsDropdown">
                  <NavDropdown.Item>
                    <div className="d-flex align-items-center">
                    </div>
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#">Show All Alerts</NavDropdown.Item>
                </NavDropdown>
              </div>
              <div className="col text-end">
                <NavDropdown title={<span><span className="pe-2 d-none d-lg-inline text-gray-600 small">{name}</span><FontAwesomeIcon icon={faUser} /></span>} className='text-end header-dropdown' id="userDropdown">
                  <NavDropdown.Item href="/profile">
                    <FontAwesomeIcon icon={faAddressCard} className='px-2' />
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={() => setLogOutModalShow(true)} >
                    <FontAwesomeIcon icon={faArrowRightFromBracket} className='px-2' />
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            </div>
          </div>
        </div>
      </Navbar>
      <SideBarApp show={showSideBar} handleClose={() => setShowSideBar(false)}/>
      <LogOutModal 
        show={logOutModalShow}
        onHide={() => setLogOutModalShow(false)}
      />
    </>
  );
}

export default Topbar;

import React from 'react';
import Offcanvas from 'react-bootstrap/Offcanvas';
import ListGroup from 'react-bootstrap/ListGroup';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHome, faUsers} from "@fortawesome/free-solid-svg-icons";
import { Link } from 'react-router-dom';
import SkyExploreLogo from "../assets/images/Brand_Logo.svg";

interface OffcanvasContentProps {
  show: boolean;
  handleClose: () => void;
}

const SideBarApp: React.FC<OffcanvasContentProps> = ({ show, handleClose }) => {
  return (
      <Offcanvas show={show} onHide={handleClose}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title><img src={SkyExploreLogo} alt="Logo" /></Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body className='sidebar-list'>
            <ListGroup>
            <Link to="/dashboard">
              <ListGroup.Item action as="div">
                <span className="badge"><FontAwesomeIcon icon={faHome} /></span> Dashboard
              </ListGroup.Item>
            </Link>
              <Link to="/account">
                <ListGroup.Item action as="div">
                  <span className="badge"><FontAwesomeIcon icon={faUsers} /></span> Manage Account
                </ListGroup.Item>
              </Link>
            </ListGroup>
          </Offcanvas.Body>
      </Offcanvas>
  );
}

export default SideBarApp;

import React from 'react';
import {Offcanvas, ListGroup, Accordion} from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCalendarDay, faHome, faMapLocation, faPlane, faUsers} from "@fortawesome/free-solid-svg-icons";
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
              <Accordion>
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
                <Accordion.Item eventKey="0">
                  <Accordion.Header>Data</Accordion.Header>
                  <Accordion.Body>
                    <Link to="/airport">
                      <ListGroup.Item action as="div"><span className="badge"><FontAwesomeIcon icon={faMapLocation} /></span>Airports</ListGroup.Item>
                    </Link>
                    <Link to="/airplane">
                      <ListGroup.Item action as="div"><span className="badge"><FontAwesomeIcon icon={faPlane} /></span>Airplane</ListGroup.Item>
                    </Link>
                    <Link to="/schedule">
                      <ListGroup.Item action as="div"><span className="badge"><FontAwesomeIcon icon={faCalendarDay} /></span>Schedule</ListGroup.Item>
                    </Link>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </ListGroup>
          </Offcanvas.Body>
      </Offcanvas>
  );
}

export default SideBarApp;

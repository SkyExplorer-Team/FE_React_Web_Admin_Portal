import {  Container, Button, Row } from "react-bootstrap";
import NotFoundPage from '..//../assets/images/404.svg';
import { Link } from "react-router-dom";
import "../styles/NotFoundPage.css";


function PageNotFound() {
return (
    <div className="wrapper-white">    
        <Container>
                <Row className="justify-content-center">
                    <div className="notfound-container col-12 p-0 align-self-center text-center"> 
                        <img src={NotFoundPage} alt="Logo" width={"100%"} height={"100%"}/>
                    </div>
                </Row>
                <Row className="justify-content-center my-4">
                    <div className="col-12 notfound-text text-center my-1">
                        <h1 className="pb-1">Page Not Found</h1>
                        <p>We couldn't find the page you're looking for. It might have been moved or doesn't exist. Return to the homepage or contact support for help.</p>
                    </div>
                </Row>
                <Row className="justify-content-center">
                    <div className="col-12 notfound-text text-center">
                        <Link to="/"><Button className="primary-button">Return to Homepage</Button></Link>
                    </div>
                </Row>
        </Container>
    </div>
)
}

export default PageNotFound;
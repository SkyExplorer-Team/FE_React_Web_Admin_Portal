import { Container, Row } from "react-bootstrap";
import ForbiddenImage from "..//../assets/images/403.svg";
import "../styles/ForbiddenStyle.css";

export default function Forbidden() {
  return (
    <div className="wrapper-white">
      <Container id="forbidden-container">
        <Row className="justify-content-center">
          <div
            className="col-12 p-0 align-self-center text-center"
            id="forbidden-box"
          >
            <img
              src={ForbiddenImage}
              alt="forbidden-image"
              width={"100%"}
              height={"100%"}
            />
          </div>
        </Row>
        <Row className="justify-content-center my-4">
          <div className="col-12  text-center my-1" id="caution-title">
            <h1 className="pb-1">Access Forbidden</h1>
            <p className="mt-4" id="caution-subtitle">
              Oops! It seems you don't have permission to access this page.
              Please contact the administrator for assistance.
            </p>
          </div>
        </Row>
      </Container>
    </div>
  );
}

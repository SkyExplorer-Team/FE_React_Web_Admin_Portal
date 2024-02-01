import { useState } from "react";
import { Card, Button, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../styles/ForgotPasswordStyle.css";
import UnregisteredEmailModal from "../../components/UnregisteredEmailModal";
import Spinner from 'react-bootstrap/Spinner';
import handleBlurUsernameInput from "../utils/HandleBlurUsernameInput";
import domainApi from "../config/domainApi";
import SkyExploreLogo from "../../assets/images/Brand_Logo.svg";

export default function ForgotPassword() {
  const [username, setUsername] = useState("");
  const [inputBorderEmail, setInputBorderEmail] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isEmailNotFound, setIsEmailNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleReqResetPassword = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    try {
      setIsLoading(true)
      const response = await fetch(`${domainApi}/api/v1/forget-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          email: username
        }),
      });

      if (response.ok) {
        localStorage.setItem('emailAkunToReset', username);
        navigate('/check-email');
        setIsLoading(false)
      } else {
        const statusCode = response.status;
        const errorMessage = await response.json()
        setIsLoading(false)
        switch (statusCode) {
          case 404:
            setIsEmailNotFound(true)
            console.log('Wrong Email:', errorMessage);
            break;
          default:
            console.log('Unexpected Error:', errorMessage);
            break;
        }
      }
    } catch (error) {
      setIsLoading(false)
      console.error('Error during login:', error);
    }
  };
  return (
    <div className="wrapper">
      <Container>
        <Card className="card-box">
          <div className="card-body">
            <div className="row">
              <div className="col img-col">
                <img
                  src="https://i.ibb.co/xMPCMJZ/Frame-427320746.png"
                  alt=""
                  className="imageLoginFirstColumn img-fluid"
                  style={{ backgroundSize: "cover", width: "100%" }}
                />
              </div>
              <div className="col body-col">
                <div className="row">
                  <div className="col-12 pb-3 text-end logoContainer" >
                    <img src={SkyExploreLogo} alt="Logo" />
                  </div>
                  {isLoading ?
                    <div className="col-12 pb-5 mb-5 align-self-center text-center">
                      <Spinner animation="border" variant="success" />
                    </div> : 
                    <div className="col-12 py-2 align-self-end">
                      <Card.Title className="fw-semibold fs-2 mb-4">Forgot Password</Card.Title>
                      <Card.Subtitle className="subtitle-card">
                        Enter your email address below, and we'll send you a link to
                        reset your password.
                      </Card.Subtitle>
                      <Form className="form">
                        <Form.Group controlId="formUsername" className="my-1">
                          <label className="label-email">Email</label>
                          <Form.Control
                            type="email"
                            placeholder="Enter Your Email"
                            className={`input-email my-1 ${username ? inputBorderEmail : ''}`}
                            onBlur={(e) => handleBlurUsernameInput(e.target.value, setUsername, setInputBorderEmail, setIsEmailValid)}
                          />
                        </Form.Group>
                        <p style={(username === '' || isEmailValid) ? { visibility: 'hidden' } : { display: 'block' }} className="invalid-information fw-normal lh-1 mb-2">Please enter a valid email address.</p>
                        <div className="my-5"></div>
                        <Button
                            variant="primary"
                            type="button"
                            onClick={handleReqResetPassword}
                            className="btn btn success mt-5"
                            disabled={!isEmailValid}
                          >
                            Send Instruction
                          </Button>
                      </Form>
                    </div>
                  }
                </div>
              </div>
            </div>
          </div>
        </Card>
      </Container>
      <UnregisteredEmailModal
        show={isEmailNotFound}
        onHide={() => setIsEmailNotFound(false)}
      />
    </div>
  );
}

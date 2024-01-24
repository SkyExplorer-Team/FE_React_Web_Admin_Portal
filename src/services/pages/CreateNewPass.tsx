import React, { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useParams, Link } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import SkyExploreLogo from "../../assets/images/Brand_Logo.svg";
import domainApi from "../config/domainApi";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/CreateNewPassStyle.css";

interface CreateNewPassProps {}

const CreateNewPass: React.FC<CreateNewPassProps> = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setConfirmPasswordVisible] = useState<boolean>(false);
  const [passwordMismatchError, setPasswordMismatchError] = useState<boolean>(false);
  const [passwordLengthError, setPasswordLengthError] = useState<boolean>(false);
  const [isResetPasswordSuccess, setIsResetPasswordSuccess] = useState(false);
  const { token } = useParams();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordLengthError(newPassword.length < 8 && newPassword.length > 0);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newConfirmPassword = e.target.value;
    setConfirmPassword(newConfirmPassword);
    if (password !== newConfirmPassword) {
      setPasswordMismatchError(true);
    } else {
      setPasswordMismatchError(false);
    }
  };

  const handleSaveNewPass = async () => {
    if (password !== confirmPassword || password.length < 8) {
      setPasswordMismatchError(password !== confirmPassword);
      setPasswordLengthError(password.length < 8);
    } else {
      setPasswordMismatchError(false);
      setPasswordLengthError(false);
      try {
        const response = await fetch(`${domainApi}/api/v1/set-password/${token}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            password: password,
            confirmPassowrd: confirmPassword,
          }),
        });
  
        if (response.ok) {
          setIsResetPasswordSuccess(true)
        } else {
          const statusCode = response.status;
          const errorMessage = await response.json()
          switch (statusCode) {
            case 404:
              console.log('Wrong Email:', errorMessage);
              break;
            case 401:
              console.log('Wrong Password:', errorMessage);
              break;
            default:
              console.log('Unexpected Error:', errorMessage);
              break;
          }
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    }
  };

  return (
    <div className="wrapper">
      <Container>
        <Card className="card-box">
          <Card.Body className="p-0">
            <div className="row">
              <div className="col firstColumnCardLogin">
                <img
                  src="https://i.ibb.co/xMPCMJZ/Frame-427320746.png"
                  alt=""
                  className="imageLoginFirstColumn img-fluid"
                  style={{ backgroundSize: "cover", width: "100%" }}
                />
              </div>
              <div className="col secondColumnCardLogin">
                <div className="row">
                  <div className="col-12 pb-3 text-end logoContainer">
                    <img src={SkyExploreLogo} alt="Logo"/>
                  </div>
                  {isResetPasswordSuccess ?
                  <>
                    <div className="col-12 py-2 align-self-start">
                      <Card.Title className="fw-semibold fs-2 mb-4">Successful Password Reset</Card.Title>
                      <Card.Subtitle className="subtitle-card">
                        You're all set! Let's get you back in.
                      </Card.Subtitle>
                    </div>
                    <div className="col-12 py-2 align-self-end">
                      <Link
                          to={'/'}
                        >
                          <Button
                            variant="primary"
                            type="button"
                            className="btn btn-success primary-button my-2"
                          >
                            Sign In
                          </Button>
                        </Link>
                    </div>
                  </> :
                  <>
                  <div className="col-12 py-2 align-self-end">
                    <Card.Title className="fw-semibold fs-2">
                      Create New Password
                    </Card.Title>
                    <Card.Subtitle
                      className="my-2 fw-normal mt-2"
                      style={{
                        color: "var(--Neutral-500, #677084)",
                      }}
                    >
                      Create a strong password to keep your information safe.
                    </Card.Subtitle>
                    <Form className="form">
                      <Form.Group
                        controlId="formPassword"
                        className="passwordInput py-2"
                      >
                        <Form.Label>Password</Form.Label>
                        <div className="input-group">
                          <Form.Control
                            className={`my-1 ${
                               passwordLengthError
                                ? "is-invalid"
                                : ""
                            }`}
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder="Enter Your Password"
                            value={password}
                            onChange={handlePasswordChange}
                          />
                          <div
                            className={`input-group-append my-1 ${
                               passwordLengthError
                                ? "wrong-input"
                                : ""
                            }`}
                          >
                            <span
                              onClick={togglePasswordVisibility}
                              style={{ cursor: "pointer" }}
                            >
                              {isPasswordVisible ? (
                                <FontAwesomeIcon icon={faEyeSlash} />
                              ) : (
                                <FontAwesomeIcon icon={faEye} />
                              )}
                            </span>
                          </div>
                        </div>
                        <p style={passwordLengthError ? { display: 'block' } : { visibility: 'hidden' }} className="invalid-information fw-normal mb-0">Password too short. Please use at least 8 characters.</p>
                      </Form.Group>
                      <Form.Group
                        controlId="formConfirmPassword"
                        className="passwordInput py-2"
                      >
                        <Form.Label>Confirm Your Password</Form.Label>
                        <div className="input-group">
                          <Form.Control
                            className={`my-1 ${
                              passwordMismatchError ? "is-invalid" : ""
                            }`}
                            type={
                              isConfirmPasswordVisible ? "text" : "password"
                            }
                            placeholder="Confirm Your Password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                          />
                          <div
                            className={`input-group-append my-1 ${
                              passwordMismatchError ? "wrong-input" : ""
                            }`}
                          >
                            <span
                              onClick={toggleConfirmPasswordVisibility}
                              style={{ cursor: "pointer" }}
                            >
                              {isConfirmPasswordVisible ? (
                                <FontAwesomeIcon icon={faEyeSlash} />
                              ) : (
                                <FontAwesomeIcon icon={faEye} />
                              )}
                            </span>
                          </div>
                        </div>
                        <p style={passwordMismatchError ? { display: 'block' } : { visibility: 'hidden' }} className="invalid-information fw-normal lh-1 mb-0">Please make sure your password match.</p>
                      </Form.Group>
                      <Button
                        variant="success"
                        type="button"
                        onClick={handleSaveNewPass}
                        className="btn btn-primary"
                        disabled={passwordMismatchError || passwordLengthError}
                      >
                        Save
                      </Button>
                    </Form>
                  </div>
                  </>
                  }
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default CreateNewPass;
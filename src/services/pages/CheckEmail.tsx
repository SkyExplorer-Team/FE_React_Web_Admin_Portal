import { Card, Button, Container, Alert, Spinner } from "react-bootstrap";
import "../styles/CheckEmailStyle.css";
import SkyExploreLogo from "../../assets/images/Brand_Logo.svg";
import { useState, useEffect } from 'react';
import domainApi from "../config/domainApi";
import UnregisteredEmailModal from "../../components/UnregisteredEmailModal";

export default function CheckEmail() {
  const [seconds, setSeconds] = useState(60);
  const [show, setShow] = useState(false);
  const email = localStorage.getItem('emailAkunToReset');
  const [isEmailNotFound, setIsEmailNotFound] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
          email: email ?? '',  
        }),
      });

      if (response.ok) {
        setIsLoading(false)
        setShow(true)
        setSeconds(60)
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

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
    }, 1000);

    // Membersihkan interval setelah komponen dibongkar
    return () => clearInterval(intervalId);
  }, [seconds]);

  const formatTime = (time : number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const isCounterActive = seconds > 0;

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
                  <div className="col-12 pb-3 text-end logoContainer">
                    <img src={SkyExploreLogo} alt="Logo" />
                  </div>
                  {isLoading ?
                    <div className="col-12 pb-5 mb-5 align-self-center text-center">
                      <Spinner animation="border" variant="success" />
                    </div> : 
                    <>
                    <div className="col-12">
                    <Alert show={show} variant="success" onClose={() => setShow(false)} dismissible>
                      <Alert.Heading className="fs-6 fw-600">Password Reset Link Resent Successfully</Alert.Heading>
                      <p>
                        We've resent the password reset link to your email. Please check your inbox.
                      </p>
                    </Alert>
                    <Card.Title className="fw-semibold fs-2 mb-4">Check Email</Card.Title>
                    <Card.Subtitle className="subtitle-card">
                      Great! We've sent a password reset link to your email,
                      follow the step given.
                    </Card.Subtitle>
                  </div>
                  <div className="col-12 py-2 align-self-end">
                    <div className="text-center">
                      <p id="counter-number">{formatTime(seconds)}</p>
                      <a
                        href="https://mail.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="primary"
                          type="button"
                          className="btn btn-success primary-button my-2"
                        >
                          Open Email
                        </Button>
                      </a>
                      <Button
                        variant="primary"
                        type="button"
                        className="btn btn success secondary-button mt-2"
                        disabled={isCounterActive}
                        onClick={handleReqResetPassword}
                      >
                        Request Again
                      </Button>
                    </div>
                  </div>
                    </>
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

import Card from 'react-bootstrap/Card';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import domainApi from '../../services/config/domainApi';
import Alert from 'react-bootstrap/Alert';

function EditAccount() {
    const navigate = useNavigate();
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(false);
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [formData, setFormData]= useState({name:"", password: "", confirmPassword: "", email: "" })
    const [show, setShow] = useState(false);
    const { id } = useParams();
    const token = localStorage.getItem('token');
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    console.log(id)

    const handleChange = (event: { target: {name: string, value: string }; }) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value })

        if (name === "password") {
          setIsPasswordValid(value.length <= 7);
        }
    
        if (name === "confirmPassword") {
          setIsConfirmPasswordValid(value !== formData.password);
        }
    
        if (name === "email") {
          const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
          setIsEmailValid(!emailPattern.test(value));
        }

    }
    const isSubmitDisabled = !isPasswordValid && !isConfirmPasswordValid && !isEmailValid;

    const handleRegister = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
    
        try {
            if (!token) {
                navigate('/login');
              return;
            }

          const response = await fetch(`${domainApi}/api/v1/users/${id}`, {
            method: 'PUT',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(formData),
          });
    
          if (response.ok) {
            const data = await response.json();
            setMessage(data.message)
            navigate('/account');
          } else {
            const data = await response.json()
            setMessage(data.message)
            setShow(true)
          }
        } catch (error) {
          console.error('Error during login:', error);
        }
      };

      useEffect(() => {

        const fetchData = async () => {
            try {
              const aparResponse = await fetch(`${domainApi}/api/v1/users/${id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
          
              if (aparResponse.ok) {
                const accountData = await aparResponse.json();
                setFormData({
                  email: accountData.data.email,
                  name: accountData.data.name,
                  password: "",
                  confirmPassword: ""
                });
              } else {
                console.error('Error fetching Apar data:', aparResponse.status);
                navigate('/not-found');
              }
            } catch (error) {
              console.error('Error during fetch:', error);
              navigate('/not-found');
            } finally {
              setLoading(false);
            }
          };
          
        fetchData();          
            
      }, [navigate, message, id, token]);

  return (
    <>
      <div className="container">
        <Alert show={show} variant="danger">
          <Alert.Heading>Kesalahan</Alert.Heading>
          <p>
            {message}
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={() => setShow(false)} variant="outline-success">
              Close
            </Button>
          </div>
        </Alert>
      <Card
          bg={"light"}
          key={"secondary"}
          text={'dark'}
          style={{ width: '100%', minHeight: "75vh" }}
          className="mb-4"
      >
          <Card.Header>Manajemen Akun</Card.Header>
          <Card.Body className='p-4'>
          <Breadcrumb>
              <Breadcrumb.Item href="/dashboard">Home</Breadcrumb.Item>
              <Breadcrumb.Item href="/account">Manajemen Akun</Breadcrumb.Item>
              <Breadcrumb.Item active>Tambah</Breadcrumb.Item>
          </Breadcrumb>
          <Card.Title> Tambah Akun </Card.Title>
          <div className="row my-3 align-items-center">
              <div className="col">
                  <Form onSubmit={handleRegister}>
                      <Row className="mb-3">
                          <Form.Group as={Col} md="4" controlId="validationCustom01">
                              <Form.Label>Nama Pengguna</Form.Label>
                              <Form.Control
                                  required
                                  type="text"
                                  name='name'
                                  placeholder="Nama Pengguna"
                                  value={formData.name}
                                  onChange={handleChange}
                              />
                          </Form.Group>
                          <Form.Group as={Col} md="4" controlId="validationCustom02">
                              <Form.Label>Email</Form.Label>
                              <Form.Control
                                  required
                                  type="email"
                                  name='email'
                                  placeholder="Email"
                                  onChange={handleChange}
                                  value={formData.email}
                                  isInvalid={isEmailValid}
                              />
                              <Form.Control.Feedback type='invalid'>Format Email Tidak Sesuai</Form.Control.Feedback>
                          </Form.Group>
                      </Row>
                      <Row className="mb-3">
                          <Form.Group as={Col} md="4" controlId="validationCustom03">
                              <Form.Label>Password</Form.Label>
                              <Form.Control type="password" name='password' placeholder="Password" onChange={handleChange} isInvalid={isPasswordValid} />
                              <Form.Control.Feedback type="invalid">
                                  Masukan setidaknya 8 Karakter
                              </Form.Control.Feedback>
                              <div className="small form-text text-muted">Kosongkan jika tidak ingin mengubah password!</div>
                          </Form.Group>
                          <Form.Group as={Col} md="4" controlId="validationCustom03">
                              <Form.Label>Konfirmasi Password</Form.Label>
                              <Form.Control type="password" name='confirmPassword' placeholder="Konfirmasi Password" onChange={handleChange} isInvalid={isConfirmPasswordValid} />
                              <Form.Control.Feedback type="invalid">
                                  Password tidak cocok
                              </Form.Control.Feedback>
                          </Form.Group>
                      </Row>
                      <Link to={"/account"}><Button type="submit" className='btn-secondary mx-2'>Kembali</Button></Link>
                      <Button type="submit" disabled={!isSubmitDisabled}>Ubah</Button>
                  </Form>      
              </div>
          </div>
          </Card.Body>
      </Card>
      </div>
    </>
  );
}

export default EditAccount;
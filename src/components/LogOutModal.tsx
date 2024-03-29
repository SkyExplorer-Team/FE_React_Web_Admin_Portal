import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

interface Props {
show: boolean
onHide: () => void
}

function LogOutModal(props : Props) {
    const navigate = useNavigate(); 
    const handleLogout = () => {
      localStorage.removeItem('token');
      localStorage.removeItem('name');
      navigate('/');
    };
  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Modal heading
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>Keluar</h4>
        <p>
          Yakin ingin Keluar? Anda akan dialihkan ke Halaman Log in
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Batal</Button>
        <Button onClick={handleLogout}>Keluar</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LogOutModal
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

type MyVerticallyCenteredModalProps = {
    show: boolean;
    onHide: () => void;
  };
  
  const UnregisteredEmailModal: React.FC<MyVerticallyCenteredModalProps> = (props) => {
  return (
    <Modal
      {...props}
      dialogClassName="modal-unregisteredEmail"
      backdrop="static"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <h4 className='fs-5'>Admin Account Issue</h4>
        <p className='fs-6'>
            We encountered an issue with your login credentials. It appears that the provided email is not registered. Please check your email or contact the super admin for assistance.
        </p>
        <Button className='primary-button' onClick={props.onHide}>I Understand</Button>
      </Modal.Body>

    </Modal>
  );
}

export default UnregisteredEmailModal;
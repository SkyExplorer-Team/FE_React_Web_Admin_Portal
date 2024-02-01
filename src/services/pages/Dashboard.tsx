import { Button } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const navigate = useNavigate();
    const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('/');
    };
  return (
    <div className="wrapper">
      <h1 className="d-block p-2">Halaman Dashboard</h1>
      <Button className="d-block p-2" onClick={handleLogout}>LogOut</Button>
    </div>
  );
}

export default Dashboard;
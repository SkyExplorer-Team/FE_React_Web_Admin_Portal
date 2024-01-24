import Card from 'react-bootstrap/Card';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import DataTable, { TableColumn } from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import domainApi from '../../services/config/domainApi';
import DeleteModal from '../../components/DeleteModal';

type DataRow = {
    name: string;
    email: string
    id_role: string;
    id:string;
    role: {id: string, name:string}
};
type UserData = {
    name: string;
    email: string
    id_role: string;
    id: string,
    role: {id: string, name:string}
};

function ManageAccount() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [record, setRecord] = useState(userData);
    const [infoDeleteData, setInfoDeleteData] = useState({id:"", name:""});
    const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
    const token = localStorage.getItem('token');
    const [message, setMessage] = useState('');

    function handleFilter(event: { target: { value: string; }; }){
        const newData = userData.filter( row => {
            const searchTerm = event.target.value.toLowerCase();
            return  (
                row.name.toLowerCase().includes(searchTerm) ||
                row.email.toLowerCase().includes(searchTerm) ||
                row.id_role.toLowerCase().includes(searchTerm)
            );
        })
        setRecord(newData)

    }

    const handleDeleteUser = async (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      try {

        const response = await fetch(`${domainApi}/api/v1/users/${infoDeleteData.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setMessage(data.message)
          setIsDeleteModalShow(false)
        } else {
          const data = await response.json()
          setMessage(data.message)
          setIsDeleteModalShow(false)
        }
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error during Delete:', error);
      }
    };

    useEffect(() => {
        const fetchUserDsata = async () => {
          try {
    
            const response = await fetch(`${domainApi}/api/v1/users`,{
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
    
            if (response.ok) {
              const data = await response.json();
              setUserData(data.data);
              setRecord(data.data)
            } else {
              console.error('Error fetching users data:', response.status);
              setError("Error fetching users data");
            }
          } catch (error) {
            console.error('Error during fetch:', error);
            setError("Error fetching users data");
          } finally {
            setLoading(false);
          }
        };
    
        fetchUserDsata();
      }, [navigate, message, token]);
    
    const columns: TableColumn<DataRow>[] = [
        {
            name: 'Nama',
            selector: row => row.name,
            sortable: true
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true
        },
        {
            name: 'Role',
            selector: row => row.role.name,
            sortable: true
        },
        {
            name: 'Aksi',
            cell: row => <>
                          <Link to={`/account/update/${row.id}`}><Button variant="success" className='mx-1'><FontAwesomeIcon icon={faPenToSquare} /></Button></Link>
                          <Button variant="danger" onClick={() => {setIsDeleteModalShow(true); setInfoDeleteData({id: row.id, name: row.name})}} ><FontAwesomeIcon icon={faTrash} /></Button>
                        </>,
            width: "20%"
                        
        },
    ];

  return (
    <>
        <div className="container">
            <Card
                bg={"light"}
                key={"secondary"}
                text={'dark'}
                style={{ width: '100%', height: "75vh" }}
                className="mb-4"
            >
                <Card.Header>Manajemen Akun</Card.Header>
                <Card.Body className='p-4'>
                <Breadcrumb>
                    <Breadcrumb.Item href="/dashboard">Home</Breadcrumb.Item>
                    <Breadcrumb.Item active>Manajemen Akun</Breadcrumb.Item>
                </Breadcrumb>
                <Card.Title> Data Akun </Card.Title>
                <div className="row my-3 align-items-center">
                    <div className="col col-md-3">      
                        <div className="input-group">
                            <span className="input-group-text"><FontAwesomeIcon icon={faSearch} /></span>
                            <input type="text" className="form-control" onChange={handleFilter}></input>
                        </div>
                    </div>
                    <div className="col text-end">
                    <Link to={"/account/add"}><Button variant="primary" className='primary-button-small'>Tambah User</Button></Link>
                    </div>
                </div>
                <DataTable
                    columns={columns}
                    data={record}
                    fixedHeader
                    pagination
                />
                </Card.Body>
            </Card>
            <DeleteModal show={isDeleteModalShow} onHide={() => setIsDeleteModalShow(false)} onDelete={handleDeleteUser} infoData={infoDeleteData}/>
        </div>
    </>
  );
}

export default ManageAccount;
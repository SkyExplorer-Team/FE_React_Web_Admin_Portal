import {Card, Breadcrumb, Button, Modal, Form, Row, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useForm, FieldValues } from "react-hook-form";
import Select, { SingleValue } from 'react-select';
import domainApi from '../config/domainApi';

type AirplaneData = {
  id: string
  name: string
  code: string
  speed: number
};

interface ManageAirplanesProps {
  basicProps: {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    fetchAllData: () => Promise<void>;
  };
  airplanesData:  AirplaneData[];
}

const ManageAirplanes: React.FC<ManageAirplanesProps> = ({basicProps, airplanesData }) => {
    const [record, setRecord] = useState<AirplaneData[]|undefined>(undefined);
    const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
    const [isAddModalShow, setIsAddModalShow] = useState(false);
    const [isUpdateModalShow, setIsUpdateModalShow] = useState(false);
    const token = localStorage.getItem('token');
    const [message, setMessage] = useState('');
    const { register, reset, setValue, getValues, handleSubmit } = useForm({
      defaultValues: {
          id: "",
          name: "",
          code: "",
          speed: 0,
      },
  });

    function handleFilter(event: { target: { value: string; }; }){
        const newData = airplanesData.filter( row => {
            const searchTerm = event.target.value.toLowerCase();
            return  (
                row.name.toLowerCase().includes(searchTerm) ||
                row.code.toLowerCase().includes(searchTerm)
            );
        })
        setRecord(newData)

    }

    const handleAddAirplane = async (data: FieldValues) =>  {
      try {
        setMessage("")
        basicProps.setIsLoading(true)
        setRecord(undefined)
        setIsAddModalShow(false)
        const response = await fetch(`${domainApi}/api/v1/airplanes`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(data),
        });
        if (response.ok) {
          const data = await response.json();
          setMessage(data.message)
          basicProps.fetchAllData()
        } else {
          const data = await response.json()
          setMessage(data.message)
          basicProps.setIsLoading(false)
        }
        reset({ id: "", name: "", code: "",speed: 0 })
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error during Delete:', error);
      }
    }

    const handleEditAirplane = async (data: FieldValues) =>  {
      try {
        basicProps.setIsLoading(true)
        setMessage("")
        setRecord(undefined)
        setIsUpdateModalShow(false)
        const response = await fetch(`${domainApi}/api/v1/airplanes/${data.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(data),
        });
        if (response.ok) {
          const data = await response.json();
          setMessage(data.message)
          basicProps.fetchAllData()
        } else {
          const data = await response.json()
          setMessage(data.message)
          basicProps.setIsLoading(false)
        }
        reset({ id: "", name: "", code: "",speed: 0 })
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error during Delete:', error);
      }
    }

    const handleDeleteAirplane = async (data: FieldValues) => {
      try {
        basicProps.setIsLoading(true)
        setMessage("")
        setRecord(undefined)
        setIsDeleteModalShow(false)
        const response = await fetch(`${domainApi}/api/v1/airplanes/${data.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setMessage(data.message)
          basicProps.fetchAllData()
        } else {
          const data = await response.json()
          setMessage(data.message)
          basicProps.setIsLoading(false)
        }
        reset({ id: "", name: "", code: "",speed: 0 })
        window.scrollTo(0, 0);
        setIsDeleteModalShow(false)
      } catch (error) {
        console.error('Error during Delete:', error);
      }
    };
    
    const columns: TableColumn<AirplaneData>[] = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
            width: "20%"
        },
        {
            name: 'Code',
            selector: row => row.code,
            sortable: true
        },
        {
          name: 'Speed',
          selector: row => row.speed,
          sortable: true
      },
        {
            name: 'Aksi',
            cell: row => <>
                          <Button variant="success" className='mx-1' onClick={() => {setIsUpdateModalShow(true);  reset({ id: row.id, name: row.name, code: row.code, speed: row.speed })}}><FontAwesomeIcon icon={faPenToSquare} /></Button>
                          <Button variant="danger" onClick={() => {setIsDeleteModalShow(true); reset({ id: row.id, name: row.name, code: row.code, speed: row.speed })}} ><FontAwesomeIcon icon={faTrash} /></Button>
                        </>,
                        
        },
    ];

    useEffect(() => {  
      setRecord(airplanesData);
    }, [airplanesData]);

  return (
    <>
        <div className="container">
            <Card
                bg={"light"}
                key={"secondary"}
                text={'dark'}
                style={{ width: '100%' }}
                className="mb-4"
            >
                <Card.Header>Airplanes Management</Card.Header>
                <Card.Body className='p-4'>
                {basicProps.isLoading ?
                        <div className="col-12 pb-5 mb-5 align-self-center text-center">
                            <Spinner animation="border" variant="success" />
                        </div> : 
                        <>
                        <Breadcrumb>
                          <Breadcrumb.Item href="/dashboard">Home</Breadcrumb.Item>
                          <Breadcrumb.Item active>Airplanes Management</Breadcrumb.Item>
                      </Breadcrumb>
                      <Card.Title> Airplanes Data </Card.Title>
                      <div className="row my-3 align-items-center">
                          <div className="col col-md-3">      
                              <div className="input-group">
                                  <span className="input-group-text"><FontAwesomeIcon icon={faSearch} /></span>
                                  <input type="text" className="form-control" onChange={handleFilter}></input>
                              </div>
                          </div>
                          <div className="col text-end">
                              <Button variant="primary" className='primary-button-small' onClick={() => {setIsAddModalShow(true);  reset({ id: "", name: "", code: "",speed: 0 })}}>Add Airplane</Button>
                          </div>
                      </div>
                      <DataTable
                          columns={columns}
                          data={record ? record : []}
                          fixedHeader
                          pagination
                      />
                        </>}
                </Card.Body>
            </Card>
        </div>
        <Modal
          size="lg"
          show={isAddModalShow}
          onHide={() => setIsAddModalShow(false)}
          scrollable
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Add Airplane
            </Modal.Title>
          </Modal.Header>
              <Modal.Body>
                <Form id="formAddAirplane" onSubmit={handleSubmit((data) => handleAddAirplane(data))}>
                  <Row className='my-3'>
                      <Form.Group className='my-2'>
                          <Form.Label>Airplane Name</Form.Label>
                          <Form.Control
                          required
                          type="text"
                          placeholder={`Airplane Name`}
                          {...register(`name`)}
                          />
                      </Form.Group>
                      <Form.Group className='my-2'>
                          <Form.Label>Airplane Code</Form.Label>
                          <Form.Control
                          required
                          type="text"
                          placeholder={`Airplane Code`}
                          {...register(`code`)}
                          />
                      </Form.Group>
                      <Form.Group className='my-2'>
                          <Form.Label>Airplane Speed</Form.Label>
                          <Form.Control
                          required
                          type="number"
                          placeholder={`Airplane Speed`}
                          {...register(`speed`)}
                          />
                      </Form.Group>
                  </Row>
                </Form>    
              </Modal.Body>
              <Modal.Footer>
                  <Button variant='secondary' onClick={()=>setIsAddModalShow(false)}>Batal</Button>
                  <Button type="submit" form="formAddAirplane">Add</Button>
              </Modal.Footer>
        </Modal>
        <Modal
          size="lg"
          show={isUpdateModalShow}
          onHide={() => {setIsUpdateModalShow(false)}}
          scrollable
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Edit Airplane
            </Modal.Title>
          </Modal.Header>
              <Modal.Body>
                <Form id="formEditAirplane" onSubmit={handleSubmit((data) => handleEditAirplane(data))}>
                  <Row className='my-3'>
                      <Form.Group className='my-2'>
                          <Form.Label>Airplane Name</Form.Label>
                          <Form.Control
                          required
                          type="text"
                          placeholder={`Airplane Name`}
                          {...register(`name`)}
                          />
                      </Form.Group>
                      <Form.Group className='my-2'>
                          <Form.Label>Airplane Code</Form.Label>
                          <Form.Control
                          required
                          type="text"
                          placeholder={`Airplane Code`}
                          {...register(`code`)}
                          />
                      </Form.Group>
                      <Form.Group className='my-2'>
                          <Form.Label>Airplane City</Form.Label>
                          <Form.Control
                          required
                          type="number"
                          placeholder={`Airplane City`}
                          {...register(`speed`)}
                          />
                      </Form.Group>
                  </Row>
                </Form>    
              </Modal.Body>
              <Modal.Footer>
                  <Button variant='secondary' onClick={()=>setIsUpdateModalShow(false)}>Batal</Button>
                  <Button type="submit" form="formEditAirplane">Edit</Button>
              </Modal.Footer>
        </Modal>
        <Modal
          show={isDeleteModalShow}
          onHide={() => {setIsDeleteModalShow(false)}}
          scrollable
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Delete Airplane
            </Modal.Title>
          </Modal.Header>
              <Modal.Body>
                <p>
                  Apakah Anda yakin akan menghapus data {getValues('name')}
                </p>   
              </Modal.Body>
              <Modal.Footer>
                  <Button variant='secondary' onClick={()=>setIsDeleteModalShow(false)}>Batal</Button>
                  <Button type="submit" onClick={handleSubmit((data) => handleDeleteAirplane(data))} form="formDeleteAirplane">Delete</Button>
              </Modal.Footer>
        </Modal>
    </>
  );
}

export default ManageAirplanes;
import {Card, Breadcrumb, Button, Modal, Form, Row, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useForm, FieldValues } from "react-hook-form";
import Select, { SingleValue } from 'react-select';
import domainApi from '../config/domainApi';

type National = {
  id: string
  name: string
}

type AirportData = {
  id: string
  name: string
  abv: string
  national_id: string
  city: string
  lat: number
  lng: number
  national: National
};

interface NationalData {
  readonly value: string;
  readonly label: string;
}

interface ManageAirportsProps {
  basicProps: {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    fetchAllData: () => Promise<void>;
  };
  airportsData:  AirportData[];
  nationalSelect:  readonly NationalData[];
}

type FormFieldName = "id" | "name" | "abv" | "national_id" | "city" | "lat" | "lng";

const ManageAirports: React.FC<ManageAirportsProps> = ({basicProps, airportsData, nationalSelect }) => {
    const [record, setRecord] = useState<AirportData[]|undefined>(undefined);
    const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
    const [isAddModalShow, setIsAddModalShow] = useState(false);
    const [isUpdateModalShow, setIsUpdateModalShow] = useState(false);
    const token = localStorage.getItem('token');
    const [message, setMessage] = useState('');
    const { register, reset, setValue, getValues, handleSubmit } = useForm({
      defaultValues: {
          id: "",
          name: "",
          abv: "",
          national_id:"",
          city: "",
          lat: 0.0,
          lng: 0.0,
      },
  });

    function handleFilter(event: { target: { value: string; }; }){
        const newData = airportsData.filter( row => {
            const searchTerm = event.target.value.toLowerCase();
            return  (
                row.name.toLowerCase().includes(searchTerm) ||
                row.abv.toLowerCase().includes(searchTerm)
            );
        })
        setRecord(newData)

    }

    const handleSelectChange = (selectedOption: SingleValue<NationalData>, name: FormFieldName) => {
      setValue(name, selectedOption?.value || '');
      };

    const handleAddAirport = async (data: FieldValues) =>  {
      try {
        setMessage("")
        basicProps.setIsLoading(true)
        setRecord(undefined)
        setIsAddModalShow(false)
        const response = await fetch(`${domainApi}/api/v1/airports`, {
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
        reset({ id: "", name: "", abv: "", national_id:"", city: "",lat: 0.0, lng: 0.0 });
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error during Delete:', error);
      }
    }

    const handleEditAirport = async (data: FieldValues) =>  {
      try {
        basicProps.setIsLoading(true)
        setMessage("")
        setRecord(undefined)
        setIsUpdateModalShow(false)
        const response = await fetch(`${domainApi}/api/v1/airports/${data.id}`, {
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
        reset({ id: "", name: "", abv: "", national_id:"", city: "",lat: 0.0, lng: 0.0 });
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error during Delete:', error);
      }
    }

    const handleDeleteAirport = async (data: FieldValues) => {
      try {
        basicProps.setIsLoading(true)
        setMessage("")
        setRecord(undefined)
        setIsDeleteModalShow(false)
        const response = await fetch(`${domainApi}/api/v1/airports/${data.id}`, {
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
        reset({ id: "", name: "", abv: "", national_id:"", city: "",lat: 0.0, lng: 0.0 });
        window.scrollTo(0, 0);
        setIsDeleteModalShow(false)
      } catch (error) {
        console.error('Error during Delete:', error);
      }
    };
    
    const columns: TableColumn<AirportData>[] = [
        {
            name: 'Airports',
            selector: row => row.name,
            sortable: true,
            width: "20%"
        },
        {
            name: 'Code',
            selector: row => row.abv,
            sortable: true
        },
        {
            name: 'Country',
            selector: row => row.national.name,
            sortable: true
        },
        {
          name: 'City',
          selector: row => row.city,
          sortable: true
        },
        {
          name: 'Longitude',
          selector: row => row.lng,
          sortable: true
        },
        {
          name: 'Latitude',
          selector: row => row.lat,
          sortable: true
        },
        {
            name: 'Aksi',
            cell: row => <>
                          <Button variant="success" className='mx-1' onClick={() => {setIsUpdateModalShow(true);  reset({ id: row.id, name: row.name, abv: row.abv, national_id: row.national_id, city: row.city, lat: row.lat, lng: row.lng })}}><FontAwesomeIcon icon={faPenToSquare} /></Button>
                          <Button variant="danger" onClick={() => {setIsDeleteModalShow(true);  reset({ id: row.id , name: row.name, abv: row.abv, national_id: row.national_id, city: row.city, lat: row.lat, lng: row.lng })}} ><FontAwesomeIcon icon={faTrash} /></Button>
                        </>,
                        
        },
    ];

    useEffect(() => {  
      setRecord(airportsData);
    }, [airportsData]);

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
                <Card.Header>Airports Management</Card.Header>
                <Card.Body className='p-4'>
                {basicProps.isLoading ?
                        <div className="col-12 pb-5 mb-5 align-self-center text-center">
                            <Spinner animation="border" variant="success" />
                        </div> : 
                        <>
                        <Breadcrumb>
                          <Breadcrumb.Item href="/dashboard">Home</Breadcrumb.Item>
                          <Breadcrumb.Item active>Airports Management</Breadcrumb.Item>
                      </Breadcrumb>
                      <Card.Title> Airports Data </Card.Title>
                      <div className="row my-3 align-items-center">
                          <div className="col col-md-3">      
                              <div className="input-group">
                                  <span className="input-group-text"><FontAwesomeIcon icon={faSearch} /></span>
                                  <input type="text" className="form-control" onChange={handleFilter}></input>
                              </div>
                          </div>
                          <div className="col text-end">
                              <Button variant="primary" className='primary-button-small' onClick={() => {setIsAddModalShow(true);  reset({ id: "", name: "", abv: "", national_id:"", city: "",lat: 0.0, lng: 0.0 })}}>Add Airport</Button>
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
              Add Airport
            </Modal.Title>
          </Modal.Header>
              <Modal.Body>
                <Form id="formAddAirport" onSubmit={handleSubmit((data) => handleAddAirport(data))}>
                  <Row className='my-3'>
                      <Form.Group className='my-2'>
                          <Form.Label>Airport Name</Form.Label>
                          <Form.Control
                          required
                          type="text"
                          placeholder={`Airport Name`}
                          {...register(`name`)}
                          />
                      </Form.Group>
                      <Form.Group className='my-2'>
                          <Form.Label>Airport Code</Form.Label>
                          <Form.Control
                          required
                          type="text"
                          placeholder={`Airport Code`}
                          {...register(`abv`)}
                          />
                      </Form.Group>
                      <Form.Group className='my-2'>
                          <Form.Label>Airport Country</Form.Label>
                          <Select
                              placeholder="Choose country"
                              className="basic-single"
                              isClearable={true}
                              isSearchable={true}
                              options={nationalSelect}
                              {...register('national_id')}
                              onChange={(selectedOption) =>
                                handleSelectChange(selectedOption, 'national_id')
                                }
                              />
                      </Form.Group>
                      <Form.Group className='my-2'>
                          <Form.Label>Airport City</Form.Label>
                          <Form.Control
                          required
                          type="text"
                          placeholder={`Airport City`}
                          {...register(`city`)}
                          />
                      </Form.Group>
                  </Row>
                  <Row className='my-3'>
                    <Form.Group className='my-2'>
                          <Form.Label>Longitude</Form.Label>
                          <Form.Control
                          required
                          type="text"
                          placeholder={`Longitude`}
                          {...register(`lat`)}
                          />
                      </Form.Group>
                      <Form.Group className='my-2'>
                          <Form.Label>Latitude</Form.Label>
                          <Form.Control
                          required
                          type="text"
                          placeholder={`Latitude`}
                          {...register(`lng`)}
                          />
                      </Form.Group>
                  </Row>
                </Form>    
              </Modal.Body>
              <Modal.Footer>
                  <Button variant='secondary' onClick={()=>setIsAddModalShow(false)}>Batal</Button>
                  <Button type="submit" form="formAddAirport">Add</Button>
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
              Edit Airport
            </Modal.Title>
          </Modal.Header>
              <Modal.Body>
                <Form id="formEditAirport" onSubmit={handleSubmit((data) => handleEditAirport(data))}>
                  <Row className='my-3'>
                      <Form.Group className='my-2'>
                          <Form.Label>Airport Name</Form.Label>
                          <Form.Control
                          required
                          type="text"
                          placeholder={`Airport Name`}
                          {...register(`name`)}
                          />
                      </Form.Group>
                      <Form.Group className='my-2'>
                          <Form.Label>Airport Code</Form.Label>
                          <Form.Control
                          required
                          type="text"
                          placeholder={`Airport Code`}
                          {...register(`abv`)}
                          />
                      </Form.Group>
                      <Form.Group className='my-2'>
                          <Form.Label>Airport Country</Form.Label>
                          <Select
                              placeholder="Choose country"
                              className="basic-single"
                              isClearable={true}
                              isSearchable={true}
                              options={nationalSelect}
                              {...register('national_id')}
                              defaultValue={nationalSelect.find(option => option.value === getValues('national_id'))}
                              onChange={(selectedOption) =>
                                handleSelectChange(selectedOption, 'national_id')
                                }
                              />
                      </Form.Group>
                      <Form.Group className='my-2'>
                          <Form.Label>Airport City</Form.Label>
                          <Form.Control
                          required
                          type="text"
                          placeholder={`Airport City`}
                          {...register(`city`)}
                          />
                      </Form.Group>
                  </Row>
                  <Row className='my-3'>
                    <Form.Group className='my-2'>
                          <Form.Label>Longitude</Form.Label>
                          <Form.Control
                          required
                          type="text"
                          placeholder={`Longitude`}
                          {...register(`lat`)}
                          />
                      </Form.Group>
                      <Form.Group className='my-2'>
                          <Form.Label>Latitude</Form.Label>
                          <Form.Control
                          required
                          type="text"
                          placeholder={`Latitude`}
                          {...register(`lng`)}
                          />
                      </Form.Group>
                  </Row>
                </Form>    
              </Modal.Body>
              <Modal.Footer>
                  <Button variant='secondary' onClick={()=>setIsUpdateModalShow(false)}>Batal</Button>
                  <Button type="submit" form="formEditAirport">Edit</Button>
              </Modal.Footer>
        </Modal>
        <Modal
          show={isDeleteModalShow}
          onHide={() => {setIsDeleteModalShow(false)}}
          scrollable
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Delete Airport
            </Modal.Title>
          </Modal.Header>
              <Modal.Body>
                <p>
                  Apakah Anda yakin akan menghapus data {getValues('name')}
                </p>   
              </Modal.Body>
              <Modal.Footer>
                  <Button variant='secondary' onClick={()=>setIsDeleteModalShow(false)}>Batal</Button>
                  <Button type="submit" onClick={handleSubmit((data) => handleDeleteAirport(data))} form="formDeleteAirport">Delete</Button>
              </Modal.Footer>
        </Modal>
    </>
  );
}

export default ManageAirports;
import {Card, Breadcrumb, Button, Modal, Form, Row, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useForm, FieldValues } from "react-hook-form";
import Select, { SingleValue } from 'react-select';
import 'react-datetime/css/react-datetime.css';
import domainApi from '../config/domainApi';

type RelationData = {
  id: string
  name: string
}

type ScheduleData = {
  id: string
  airplane_id: string
  from_id: string
  to_id: string
  price: number
  time_departure: string
  time_arrive: string
  airplane : RelationData
  fromData: RelationData
  toData: RelationData
}


interface SelectInput {
  readonly value: string;
  readonly label: string;
}

interface ManageSchedulesProps {
  basicProps: {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    fetchAllData: () => Promise<void>;
  };
  schedulesData:  ScheduleData[];
  airportSelect:  readonly SelectInput[];
  airplaneSelect:  readonly SelectInput[];
}

type FormFieldName = "id" | "airplane_id" | "from_id" | "to_id" | "price" | "time_departure" | "time_arrive";

const ManageSchedules: React.FC<ManageSchedulesProps> = ({basicProps, schedulesData, airportSelect, airplaneSelect }) => {
    const [record, setRecord] = useState<ScheduleData[]|undefined>(undefined);
    const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
    const [isAddModalShow, setIsAddModalShow] = useState(false);
    const [isUpdateModalShow, setIsUpdateModalShow] = useState(false);
    const token = localStorage.getItem('token');
    const [message, setMessage] = useState('');
    const { register, reset, setValue, getValues, handleSubmit } = useForm({
      defaultValues: {
          id: "",
          airplane_id: "",
          from_id: "",
          to_id:"",
          price: 0,
          time_departure: "",
          time_arrive: "",
      },
  });

    function handleFilter(event: { target: { value: string; }; }){
        const newData = schedulesData.filter( row => {
            const searchTerm = event.target.value.toLowerCase();
            return  (
                row.airplane.name.toLowerCase().includes(searchTerm) ||
                row.fromData.name.toLowerCase().includes(searchTerm) ||
                row.toData.name.toLowerCase().includes(searchTerm)
            );
        })
        setRecord(newData)
    }

    const handleSelectChange = (selectedOption: SingleValue<SelectInput>, name: FormFieldName) => {
      setValue(name, selectedOption?.value || '');
      };

    const handleAddSchedule = async (data: FieldValues) =>  {
      try {
        setMessage("")
        basicProps.setIsLoading(true)
        setRecord(undefined)
        setIsAddModalShow(false)
        const response = await fetch(`${domainApi}/api/v1/schedules`, {
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
        } else {
          const data = await response.json()
          setMessage(data.message)
        }
        basicProps.fetchAllData()
        reset({ id: "", airplane_id: "", from_id: "", to_id:"", price: 0, time_departure: "", time_arrive: ""});
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error during Delete:', error);
      }
    }

    const handleEditSchedule = async (data: FieldValues) =>  {
      try {
        basicProps.setIsLoading(true)
        setMessage("")
        setRecord(undefined)
        setIsUpdateModalShow(false)
        const response = await fetch(`${domainApi}/api/v1/schedules/${data.id}`, {
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
        } else {
          const data = await response.json()
          setMessage(data.message)
        }
        basicProps.fetchAllData()
        reset({ id: "", airplane_id: "", from_id: "", to_id:"", price: 0, time_departure: "", time_arrive: ""});
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error during Delete:', error);
      }
    }

    const handleDeleteSchedule = async (data: FieldValues) => {
      try {
        basicProps.setIsLoading(true)
        setMessage("")
        setRecord(undefined)
        setIsDeleteModalShow(false)
        const response = await fetch(`${domainApi}/api/v1/schedules/${data.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setMessage(data.message)
        } else {
          const data = await response.json()
          setMessage(data.message)
        }
        basicProps.fetchAllData()
        reset({ id: "", airplane_id: "", from_id: "", to_id:"", price: 0, time_departure: "", time_arrive: ""});
        window.scrollTo(0, 0);
        setIsDeleteModalShow(false)
      } catch (error) {
        console.error('Error during Delete:', error);
      }
    };
    
    const columns: TableColumn<ScheduleData>[] = [
        {
            name: 'Airplane',
            selector: row => row.airplane.name,
            sortable: true,
            width: "20%"
        },
        {
          name: 'Departure',
          cell: (row) => (
            <div>
              <div>{row.fromData.name}</div>
              <div>
                {new Date(row.time_departure).toLocaleDateString('en-US', { 
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    second: 'numeric',
                  })}
              </div>
            </div>
          ),
          sortable: true,
        },
        {
          name: 'Arrival',
          cell: (row) => (
            <div>
              <div>{row.toData.name}</div>
                <div>
                  {new Date(row.time_arrive).toLocaleDateString('en-US', { 
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                })}
                </div>
            </div>
          ),
          sortable: true,
        }
         , 
        {
            name: 'Price',
            selector: row => row.price,
            sortable: true
        },
        {
            name: 'Aksi',
            cell: row => <>
                          <Button variant="success" className='mx-1' onClick={() => {setIsUpdateModalShow(true);  reset({ id: row.id, airplane_id: row.airplane_id, from_id: row.from_id, to_id: row.to_id, price: row.price, time_departure: row.time_arrive.toString().slice(0, 16), time_arrive: row.time_departure.toString().slice(0, 16)})}}><FontAwesomeIcon icon={faPenToSquare} /></Button>
                          <Button variant="danger" onClick={() => {setIsDeleteModalShow(true);  reset({ id: row.id, airplane_id: row.airplane_id, from_id: row.from_id, to_id: row.to_id, price: row.price, time_departure: row.time_arrive, time_arrive: row.time_departure})}} ><FontAwesomeIcon icon={faTrash} /></Button>
                        </>,
                        
        },
    ];

    useEffect(() => {  
      setRecord(schedulesData);
    }, [schedulesData]);

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
                <Card.Header>Schedules Management</Card.Header>
                <Card.Body className='p-4'>
                {basicProps.isLoading ?
                        <div className="col-12 pb-5 mb-5 align-self-center text-center">
                            <Spinner animation="border" variant="success" />
                        </div> : 
                        <>
                        <Breadcrumb>
                          <Breadcrumb.Item href="/dashboard">Home</Breadcrumb.Item>
                          <Breadcrumb.Item active>Schedules Management</Breadcrumb.Item>
                      </Breadcrumb>
                      <Card.Title> Schedules Data </Card.Title>
                      <div className="row my-3 align-items-center">
                          <div className="col col-md-3">      
                              <div className="input-group">
                                  <span className="input-group-text"><FontAwesomeIcon icon={faSearch} /></span>
                                  <input type="text" className="form-control" onChange={handleFilter}></input>
                              </div>
                          </div>
                          <div className="col text-end">
                              <Button variant="primary" className='primary-button-small' onClick={() => {setIsAddModalShow(true);  reset({ id: "", airplane_id: "", from_id: "", to_id:"", price: 0, time_departure: "", time_arrive: ""})}}>Add Schedule</Button>
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
              Add Schedule
            </Modal.Title>
          </Modal.Header>
              <Modal.Body>
                <Form id="formAddSchedule" onSubmit={handleSubmit((data) => handleAddSchedule(data))}>
                  <Row className='my-3'>
                      <Form.Group className='my-2'>
                          <Form.Label>Airplane</Form.Label>
                          <Select
                              placeholder="Choose airplane"
                              className="basic-single"
                              isClearable={true}
                              isSearchable={true}
                              options={airplaneSelect}
                              {...register('airplane_id')}
                              onChange={(selectedOption) =>
                                handleSelectChange(selectedOption, 'airplane_id')
                                }
                              />
                      </Form.Group>
                      <Form.Group className='my-2'>
                          <Form.Label>From</Form.Label>
                          <Select
                              placeholder="Choose Departure Airport"
                              className="basic-single"
                              isClearable={true}
                              isSearchable={true}
                              options={airportSelect}
                              {...register('from_id')}
                              onChange={(selectedOption) =>
                                handleSelectChange(selectedOption, 'from_id')
                                }
                              />
                      </Form.Group>
                      <Form.Group className='my-2'>
                          <Form.Label>To</Form.Label>
                          <Select
                              placeholder="Choose Arrival Airport"
                              className="basic-single"
                              isClearable={true}
                              isSearchable={true}
                              options={airportSelect}
                              {...register('to_id')}
                              onChange={(selectedOption) =>
                                handleSelectChange(selectedOption, 'to_id')
                                }
                              />
                      </Form.Group>
                      <Form.Group className='my-2'>
                          <Form.Label>Price</Form.Label>
                          <Form.Control
                          required
                          type="number"
                          placeholder={`Price`}
                          {...register(`price`)}
                          />
                      </Form.Group>
                  </Row>
                  <Row className='my-3'>
                      <Form.Group className='my-2'>
                          <Form.Label>Departure Time</Form.Label>
                          <Form.Control
                          required
                          type="datetime-local"
                          placeholder={`Price`}
                          {...register(`time_departure`)}
                          />
                      </Form.Group>
                      <Form.Group className='my-2'>
                          <Form.Label>Departure Time</Form.Label>
                          <Form.Control
                          required
                          type="datetime-local"
                          placeholder={`Price`}
                          {...register(`time_arrive`)}
                          />
                      </Form.Group>
                  </Row>
                </Form>    
              </Modal.Body>
              <Modal.Footer>
                  <Button variant='secondary' onClick={()=>setIsAddModalShow(false)}>Batal</Button>
                  <Button type="submit" form="formAddSchedule">Add</Button>
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
              Edit Schedule
            </Modal.Title>
          </Modal.Header>
              <Modal.Body>
                <Form id="formEditSchedule" onSubmit={handleSubmit((data) => handleEditSchedule(data))}>
                  <Row className='my-3'>
                      <Form.Group className='my-2'>
                          <Form.Label>Airplane</Form.Label>
                          <Select
                              placeholder="Choose airplane"
                              className="basic-single"
                              isClearable={true}
                              isSearchable={true}
                              options={airplaneSelect}
                              defaultValue={airplaneSelect.find(option => option.value === getValues('airplane_id'))}
                              {...register('airplane_id')}
                              onChange={(selectedOption) =>
                                handleSelectChange(selectedOption, 'airplane_id')
                                }
                              />
                      </Form.Group>
                      <Form.Group className='my-2'>
                          <Form.Label>From</Form.Label>
                          <Select
                              placeholder="Choose departure"
                              className="basic-single"
                              isClearable={true}
                              isSearchable={true}
                              options={airportSelect}
                              {...register('from_id')}
                              defaultValue={airportSelect.find(option => option.value === getValues('from_id'))}
                              onChange={(selectedOption) =>
                                handleSelectChange(selectedOption, 'from_id')
                                }
                              />
                      </Form.Group>
                      <Form.Group className='my-2'>
                          <Form.Label>To</Form.Label>
                          <Select
                              placeholder="Choose arrival"
                              className="basic-single"
                              isClearable={true}
                              isSearchable={true}
                              options={airportSelect}
                              {...register('to_id')}
                              defaultValue={airportSelect.find(option => option.value === getValues('to_id'))}
                              onChange={(selectedOption) =>
                                handleSelectChange(selectedOption, 'to_id')
                                }
                              />
                      </Form.Group>
                      <Form.Group className='my-2'>
                          <Form.Label>Price</Form.Label>
                          <Form.Control
                          required
                          type="number"
                          placeholder={`Price`}
                          {...register(`price`)}
                          />
                      </Form.Group>
                  </Row>
                  <Row className='my-3'>
                      <Form.Group className='my-2'>
                          <Form.Label>Departure Time</Form.Label>
                          <Form.Control
                          required
                          type="datetime-local"
                          {...register('time_departure')}
                          />
                      </Form.Group>
                      <Form.Group className='my-2'>
                        <Form.Label>Departure Time</Form.Label>
                        <Form.Control
                          required
                          type="datetime-local"
                          {...register('time_arrive')}
                        />
                      </Form.Group>
                  </Row>
                </Form>    
              </Modal.Body>
              <Modal.Footer>
                  <Button variant='secondary' onClick={()=>setIsUpdateModalShow(false)}>Batal</Button>
                  <Button type="submit" form="formEditSchedule">Edit</Button>
              </Modal.Footer>
        </Modal>
        <Modal
          show={isDeleteModalShow}
          onHide={() => {setIsDeleteModalShow(false)}}
          scrollable
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Delete Schedule
            </Modal.Title>
          </Modal.Header>
              <Modal.Body>
                <p>
                  Apakah Anda yakin akan menghapus data {getValues('id')}
                </p>   
              </Modal.Body>
              <Modal.Footer>
                  <Button variant='secondary' onClick={()=>setIsDeleteModalShow(false)}>Batal</Button>
                  <Button type="submit" onClick={handleSubmit((data) => handleDeleteSchedule(data))} form="formDeleteSchedule">Delete</Button>
              </Modal.Footer>
        </Modal>
    </>
  );
}

export default ManageSchedules;
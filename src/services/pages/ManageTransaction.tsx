import {Card, Breadcrumb, Button, Modal, Form, Row, Spinner } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTrash, faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import { useForm, FieldValues } from "react-hook-form";
import domainApi from '../config/domainApi';

type TransactionData = {
id: string
amount: number
description: string
payment_method: string
status: string
transaction_date: string
booking_id: string
};

interface ManageTransactionsProps {
  basicProps: {
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    fetchAllData: () => Promise<void>;
  };
  transactionData:  TransactionData[];
}

const ManageTransactions: React.FC<ManageTransactionsProps> = ({basicProps, transactionData }) => {
    const [record, setRecord] = useState<TransactionData[]|undefined>(undefined);
    const [isDeleteModalShow, setIsDeleteModalShow] = useState(false);
    const [isUpdateModalShow, setIsUpdateModalShow] = useState(false);
    const token = localStorage.getItem('token');
    const { register, reset, getValues, handleSubmit } = useForm({
      defaultValues: {
          id: "",
          amount: 0,
        description: '',
        payment_method: '',
        status: '',
        transaction_date: '',
        booking_id: '',
      },
  });

    function handleFilter(event: { target: { value: string; }; }){
        const newData = transactionData.filter( row => {
            const searchTerm = event.target.value.toLowerCase();
            return  (
                row.description.toLowerCase().includes(searchTerm) ||
                row.payment_method.toLowerCase().includes(searchTerm) ||
                row.status.toLowerCase().includes(searchTerm) 
            );
        })
        setRecord(newData)

    }

    const handleEditTransaction = async (data: FieldValues) =>  {
      try {
        basicProps.setIsLoading(true)
        setRecord(undefined)
        setIsUpdateModalShow(false)
        const response = await fetch(`${domainApi}/api/v1/transactions/confirm/${data.id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams(data),
        });
        if (response.ok) {
          await response.json();
          basicProps.fetchAllData()
        } else {
          await response.json()
          basicProps.setIsLoading(false)
        }
        reset({ id: "", amount: 0, description: '', payment_method: '', status: '', transaction_date: '', booking_id: '' })
        window.scrollTo(0, 0);
      } catch (error) {
        console.error('Error during Delete:', error);
      }
    }

    const handleDeleteTransaction = async (data: FieldValues) => {
      try {
        basicProps.setIsLoading(true)
        setRecord(undefined)
        setIsDeleteModalShow(false)
        const response = await fetch(`${domainApi}/api/v1/transactions/${data.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
        if (response.ok) {
          await response.json();
          basicProps.fetchAllData()
        } else {
          await response.json()
          basicProps.setIsLoading(false)
        }
        reset({ id: "", amount: 0, description: '', payment_method: '', status: '', transaction_date: '', booking_id: ''})
        window.scrollTo(0, 0);
        setIsDeleteModalShow(false)
      } catch (error) {
        console.error('Error during Delete:', error);
      }
    };
    
    const columns: TableColumn<TransactionData>[] = [
        {
            name: 'Amount',
            selector: row => row.amount,
            sortable: true,
            width: "20%"
        },
        {
            name: 'Description',
            selector: row => row.description,
            sortable: true
        },
        {
          name: 'Payment Method',
          selector: row => row.payment_method,
          sortable: true
      },
      {
        name: 'Status',
        selector: row => row.status,
        sortable: true,
        conditionalCellStyles: [
            {
              when: row => {
                return row.status === "Confirmed";
              },
              style: {
                backgroundColor: 'rgba(63, 195, 128, 0.9)',
                color: 'white',
                '&:hover': {
                  cursor: 'pointer',
                },
              },
            },
            {
              when: row => {return row.status === "Pending" },
              style: {
                backgroundColor: 'rgba(242, 38, 19, 0.9)',
                color: 'white',
                '&:hover': {
                  cursor: 'not-allowed',
                },
              },
            },
          ],
    },{
        name: 'Transaction Date',
        cell: (row) => (
              <div>
                {new Date(row.transaction_date).toLocaleDateString('en-US', { 
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                second: 'numeric',
              })}
              </div>
        ),
        sortable: true,
      },
        {
            name: 'Aksi',
            cell: row => <>
                          <Button variant="success" className='mx-1' onClick={() => {setIsUpdateModalShow(true);  reset({ id: row.id, amount: row.amount, description: row.description, payment_method: row.payment_method, status: row.status, transaction_date: row.transaction_date, booking_id: row.booking_id })}}><FontAwesomeIcon icon={faSquareCheck} /></Button>
                          <Button variant="danger" onClick={() => {setIsDeleteModalShow(true); reset({ id: row.id, amount: row.amount, description: row.description, payment_method: row.payment_method, status: row.status, transaction_date: row.transaction_date, booking_id: row.booking_id})}} ><FontAwesomeIcon icon={faTrash} /></Button>
                        </>,
                        
        },
    ];

    useEffect(() => {  
      setRecord(transactionData);
    }, [transactionData]);

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
                <Card.Header>Transactions Management</Card.Header>
                <Card.Body className='p-4'>
                {basicProps.isLoading ?
                        <div className="col-12 pb-5 mb-5 align-self-center text-center">
                            <Spinner animation="border" variant="success" />
                        </div> : 
                        <>
                        <Breadcrumb>
                          <Breadcrumb.Item href="/dashboard">Home</Breadcrumb.Item>
                          <Breadcrumb.Item active>Transactions Management</Breadcrumb.Item>
                      </Breadcrumb>
                      <Card.Title> Transactions Data </Card.Title>
                      <div className="row my-3 align-items-center">
                          <div className="col col-md-3">      
                              <div className="input-group">
                                  <span className="input-group-text"><FontAwesomeIcon icon={faSearch} /></span>
                                  <input type="text" className="form-control" onChange={handleFilter}></input>
                              </div>
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
          show={isUpdateModalShow}
          onHide={() => {setIsUpdateModalShow(false)}}
          scrollable
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Confirm Transaction
            </Modal.Title>
          </Modal.Header>
              <Modal.Body>
                <Form id="formEditTransaction" onSubmit={handleSubmit((data) => handleEditTransaction(data))}>
                  <Row className='my-3'>
                      <Form.Group className='my-2'>
                          <Form.Label>Amount</Form.Label>
                          <Form.Control
                          required
                          type="number"
                          placeholder={`Amount`}
                          disabled
                          {...register(`amount`)}
                          />
                      </Form.Group>
                      <Form.Group className='my-2'>
                          <Form.Label>Description</Form.Label>
                          <Form.Control
                          required
                          type="text"
                          disabled
                          placeholder={`Description`}
                          {...register(`description`)}
                          />
                      </Form.Group>
                      <Form.Group className='my-2'>
                          <Form.Label>Payment Method</Form.Label>
                          <Form.Control
                          required
                          disabled
                          type="text"
                          placeholder={`Payment Method`}
                          {...register(`payment_method`)}
                          />
                      </Form.Group>
                  </Row>
                </Form>    
              </Modal.Body>
              <Modal.Footer>
                  <Button variant='secondary' onClick={()=>setIsUpdateModalShow(false)}>Batal</Button>
                  <Button type="submit" form="formEditTransaction">Konfirmasi</Button>
              </Modal.Footer>
        </Modal>
        <Modal
          show={isDeleteModalShow}
          onHide={() => {setIsDeleteModalShow(false)}}
          scrollable
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-modal-sizes-title-lg">
              Delete Transaction
            </Modal.Title>
          </Modal.Header>
              <Modal.Body>
                <p>
                  Apakah Anda yakin akan menghapus data {getValues('description')}
                </p>   
              </Modal.Body>
              <Modal.Footer>
                  <Button variant='secondary' onClick={()=>setIsDeleteModalShow(false)}>Batal</Button>
                  <Button type="submit" onClick={handleSubmit((data) => handleDeleteTransaction(data))} form="formDeleteTransaction">Delete</Button>
              </Modal.Footer>
        </Modal>
    </>
  );
}

export default ManageTransactions;
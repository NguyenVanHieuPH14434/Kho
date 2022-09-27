import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from 'react-paginate';
import './Management.scss';
import ModalCreateManagement from './ModalCreateManagement';
import ModalUpdateManagement from './ModalUpdateManagement';
import ModalImportManagement from './ModalImportManagement';
import Moment from 'moment';

const Management = () => {
    // Get
    const [shelf, setShelf] = useState([]);
    useEffect(() => {
        axios.get('http://localhost:4000/api/shelf/list').then((res) => setShelf(res.data.docs));
    }, [shelf]);

    // Change
    const [id, setId] = useState('');
    const [nameUpdate, setNameUpdate] = useState('');
    const [descUpdate, setDescUpdate] = useState('');

    const handleChange = (id) => {
        setId(id);
        axios.get(`http://localhost:4000/api/shelf/edit/${id}`).then((res) => {
            setNameUpdate(res.data.shelf_name);
            setDescUpdate(res.data.shelf_desc);
            setShowModalUpdateManagement(true);
        });
    };

    // Modal box delete
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Show modal box delete
    const [idDelete, setIdDelete] = useState('');
    const handleShowDelete = (id) => {
        handleShow();
        setIdDelete(id);
    };

    // Delete
    const handleDelete = (id) => {
        axios.delete(`http://localhost:4000/api/shelf/delete/${id}`).then((res) => {
            toast.success('Xóa Kệ Thành Công');
            setIdDelete('');
            handleClose();
        });
    };

    // Search
    const [search, setsearch] = useState('');

    // Pagination
    const [pageNumber, setPageNumber] = useState(0);
    const userPerPage = 7;
    const pagesVisited = pageNumber * userPerPage;
    const pageCount = Math.ceil(shelf.length / userPerPage);
    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    // Modal box add
    const [showModalCreateManagement, setShowModalCreateManagement] = useState(false);

    // Modal box change
    const [showModalUpdateManagement, setShowModalUpdateManagement] = useState(false);
    const [showModalImportManagement, setShowModalImportManagement] = useState(false);

    // Sort
    const [count, setCount] = useState(0);
    const handleSort = () => {
        setCount(count + 1);
    };
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const handleExport = () => {
        const newFromDate = Moment(fromDate).format('DD/MM/YYYY');
        const newToDate = Moment(toDate).format('DD/MM/YYYY');
        const url = 'http://localhost:4000/api/shelf/export';
        if (fromDate && toDate) {
            window.location.href = `${url}?fromDate=${newFromDate}&toDate=${newToDate}`;
        } else if (fromDate && !toDate) {
            window.location.href = `${url}?fromDate=${newFromDate}`;
        } else if (!fromDate && !toDate) {
            window.location.href = url;
        }

        alert('ok');
    };
    return (
        <div className="management">
            <p className="title">Danh sách kệ</p>
            <Form>
                <Form.Group className="mb-3 fcontainer" controlId="exampleForm.ControlInput1">
                    <Form.Label className="ftext">Tìm Kiếm Kệ</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nhập tên kệ"
                        className="fip"
                        value={search}
                        onChange={(e) => setsearch(e.target.value)}
                    />
                    <Button variant="success" onClick={() => setShowModalCreateManagement(true)}>
                        THÊM MỚI
                    </Button>
                    <Button variant="success" onClick={() => handleSort()}>
                        SẮP XẾP
                    </Button>
                </Form.Group>
            </Form>
            <Form>
                <Form.Group className="mb-3 fcontainer" controlId="exampleForm.ControlInput1">
                    <Form.Control type="date" name="fromDate" onChange={(e) => setFromDate(e.target.value)} /> &nbsp;
                    &nbsp; &nbsp;
                    <Form.Control type="date" name="toDate" onChange={(e) => setToDate(e.target.value)} /> &nbsp; &nbsp;
                    &nbsp;
                    <Button variant="success" onClick={handleExport} style={{ marginRight: '8px' }}>
                        Export
                    </Button>
                    <Button variant="success" onClick={() => setShowModalImportManagement(true)}>
                        Import
                    </Button>
                </Form.Group>
            </Form>
            <Table striped bordered hover size="md">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>ID</th>
                        <th>Tên kệ</th>
                        <th>Ghi chú</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {shelf
                        .sort((a, b) =>
                            count % 2 !== 0
                                ? Number(b.shelf_name.slice(2)) - Number(a.shelf_name.slice(2))
                                : Number(a.shelf_name.slice(2)) - Number(b.shelf_name.slice(2)),
                        )
                        .filter((element) => {
                            if (element.shelf_name.toLowerCase().includes(search)) {
                                return element;
                            }
                        })
                        .map((element, index) => {
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{element._id}</td>
                                    <td>{element.shelf_name}</td>
                                    <td>{element.shelf_desc}</td>
                                    <td>
                                        <Button
                                            variant="primary"
                                            className="btn"
                                            onClick={() => handleChange(element._id)}
                                        >
                                            Sửa
                                        </Button>
                                        <Button variant="danger" onClick={() => handleShowDelete(element._id)}>
                                            Xóa
                                        </Button>
                                    </td>
                                </tr>
                            );
                        })
                        .slice(pagesVisited, pagesVisited + userPerPage)}
                </tbody>
                {<ModalCreateManagement show={showModalCreateManagement} setShow={setShowModalCreateManagement} />}
                {
                    <ModalUpdateManagement
                        show={showModalUpdateManagement}
                        setShow={setShowModalUpdateManagement}
                        id={id}
                        nameUpdate={nameUpdate}
                        setName={setNameUpdate}
                        descUpdate={descUpdate}
                        setDesc={setDescUpdate}
                    />
                }
                {<ModalImportManagement show={showModalImportManagement} setShow={setShowModalImportManagement} />}
            </Table>
            <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel="..."
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={'paginationBttns'}
                previousLinkClassName={'previousBttn'}
                nextLinkClassName={'nextBttn'}
                disabledClassName={'paginationDisabled'}
                activeClassName={'paginationActive'}
            />

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="total">Xác nhận</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có chắc chắn muốn xóa !!</Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => handleDelete(idDelete)}>
                        XÓA
                    </Button>
                    <Button variant="danger" onClick={handleClose}>
                        HỦY
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default Management;

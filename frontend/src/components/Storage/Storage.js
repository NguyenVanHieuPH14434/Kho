/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { FaSearch } from 'react-icons/fa';
import './Storage.scss';
import ReactPaginate from 'react-paginate';
import ModalCreateStorage from './ModalCreateStorage';
import Axios from 'axios';
import Notification from './Notification';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Moment from 'moment';

import 'react-toastify/dist/ReactToastify.css';
import ModalImportStorage from './ModalImportStorage';
function Storage() {
    const [show, setShow] = useState(false);
    const [showModalCreateStorage, setShowModalCreateStorage] = useState(false);
    const [showModalImportStorage, setShowModalImportStorage] = useState(false);
    const [checked, setChecked] = useState(false);
    const [medicine, setMedicine] = useState([]);
    const [tabIndex, setTabIndex] = useState('');
    const [search, setSearch] = useState('');
    const [handleCheck, setHandleCheck] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [sortName, setSortName] = useState(false);
    console.log(sortName);
    const [data, setData] = useState({
        shelf_number: '',
        lot_number: '',
        product_name: '',
        type: '',
        quantity: '',
        nsx: '',
        hsd: '',
    });
    const [currentItems, setCurrentItems] = useState(medicine);
    useEffect(() => {
        console.log('1');
        Axios.get('http://localhost:4000/api/storage/list')
            .then((res, req) => {
                setMedicine(res.data.docs);
            })
            .catch(() => {
                console.log('error');
            });
    }, [handleCheck]);
    const [pageNumber, setPageNumber] = useState(0);
    const usersPerPage = 10;
    const pagesVisited = pageNumber * usersPerPage;
    const pageCount = Math.ceil(currentItems.length / usersPerPage);
    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };
    const searchIn = useMemo(() => {
        setCurrentItems(
            medicine.filter((el) => {
                return (
                    el.product_name.toLowerCase().includes(search.toLowerCase()) ||
                    el._id.toLowerCase().includes(search.toLowerCase()) ||
                    el.ctime.includes(search)
                );
            }),
        );
    }, [search, medicine]);
    // Invoke when user click to request another page.

    const getValue = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setData({ ...data, [name]: value });
    };
    let getKey = useRef();
    //sort name
    function inCrea(a, b) {
        // Dùng toUpperCase() để không phân biệt ký tự hoa thường
        const product_nameA = a.product_name.toUpperCase();
        const product_nameB = b.product_name.toUpperCase();
        let comparison = 0;
        if (product_nameA > product_nameB) {
            comparison = 1;
        } else if (product_nameA < product_nameB) {
            comparison = -1;
        }
        return comparison;
    }
    function deCrea(a, b) {
        // Dùng toUpperCase() để không phân biệt ký tự hoa thường
        const product_nameA = a.product_name.toUpperCase();
        const product_nameB = b.product_name.toUpperCase();
        let comparison = 0;
        if (product_nameA < product_nameB) {
            comparison = 1;
        } else if (product_nameA > product_nameB) {
            comparison = -1;
        }
        return comparison;
    }

    const handleSort = () => {
        if (sortName === false) {
            medicine.sort(inCrea);
        }
        if (sortName === true) {
            medicine.sort(deCrea);
        }
        setSortName(!sortName);
        setCurrentItems(medicine);
    };
    const checkValidate = (n) => {
        //create
        if (tabIndex === '1') {
            if (
                n.shelf_number !== '' &&
                n.lot_number !== '' &&
                n.product_name &&
                n.type !== '' &&
                n.quantity !== '' &&
                n.nsx !== '' &&
                n.hsd !== ''
            ) {
                axios
                    .post('http://localhost:4000/api/storage/create', n)
                    .then(() => {
                        setHandleCheck(!handleCheck);
                        setCurrentItems(currentItems);
                        setShowModalCreateStorage(false);
                        setData({});
                        toast.success('Thêm Thành Công!');
                        console.log('success!');
                    })
                    .catch(() => {
                        console.log('error');
                    });
            } else {
                setShowModalCreateStorage(true);
                toast.warn('Vui lòng nhập đầy đủ Thông Tin !');
            }
        }
        //update
        if (tabIndex === '2') {
            if (
                n.shelf_number !== '' &&
                n.lot_number !== '' &&
                n.product_name &&
                n.type !== '' &&
                n.quantity !== '' &&
                n.nsx !== '' &&
                n.hsd !== ''
            ) {
                axios
                    .post(`http://localhost:4000/api/storage/update/${data._id}`, data)
                    .then(() => {
                        // setMedicine(medicine)
                        setHandleCheck(!handleCheck);
                        setChecked(false);
                        setShowModalCreateStorage(!setShowModalCreateStorage);
                        setData({});
                        toast.success('Update Thành Công!');
                        console.log('success!');
                    })
                    .catch(() => {
                        console.log('error');
                    });
            } else {
                setShowModalCreateStorage(true);
                toast.warn('Vui lòng nhập đầy đủ Thông Tin !');
            }
        }
    };
    const handleData = (i) => {
        setData(i);
        setTabIndex('2');
        setChecked(true);
        setShowModalCreateStorage(true);
    };
    const handleDelete = (i) => {
        getKey.current = i;
        setShow(true);
        console.log(i);
    };
    console.log(getKey.current);
    const handleShowCreate = () => {
        setShowModalCreateStorage(true);
        setTabIndex('1');
    };
    const handleCreate = () => {
        checkValidate(data);
        setTabIndex('1');
    };
    console.log('warn');
    const handleUpdate = () => {
        checkValidate(data);
        setTabIndex('2');
    };

    const [file, setFile] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    // useEffect(()=>{
    //   Axios.get('http://localhost:4000/api/storage/list')
    //     .then((res,req)=> setSupplies(res.data))
    //     .catch(()=>{
    //       console.log('error');
    //     })
    // },[])

    const handleImport = () => {
        const data = new FormData();
        data.append('File', file);
        console.log(file);
        alert('ok');
        setShowModalImportStorage(false);
    };
    const handleExport = () => {
        const newFromDate = Moment(fromDate).format('DD/MM/YYYY');
        const newToDate = Moment(toDate).format('DD/MM/YYYY');
        const url = 'http://localhost:4000/api/storage/export';
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
        <div className="lot">
            <Tabs defaultActiveKey="first">
                <Tab eventKey="first" title="Thuốc">
                    <Form>
                        <Form.Group className="mb-3 fcontainer" controlId="exampleForm.ControlInput1">
                            <Form.Label className="ftext">
                                <FaSearch className="fs-6 text-success" /> &nbsp;
                                <b className="text-success">Tìm Kiếm Lô</b>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Search Something..."
                                className="fip"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button variant="success" onClick={() => handleShowCreate()}>
                                THÊM MỚI
                            </Button>
                            <Button variant="success" onClick={() => handleSort()}>
                                Sắp Xếp
                            </Button>
                        </Form.Group>
                    </Form>
                    <Form>
                        <Form.Group className="mb-3 fcontainer" controlId="exampleForm.ControlInput1">
                            <Form.Control type="date" name="fromDate" onChange={(e) => setFromDate(e.target.value)} />{' '}
                            &nbsp; &nbsp; &nbsp;
                            <Form.Control type="date" name="toDate" onChange={(e) => setToDate(e.target.value)} />{' '}
                            &nbsp; &nbsp; &nbsp;
                            <Button variant="success" style={{ marginRight: '8px' }} onClick={handleExport}>
                                Export
                            </Button>
                            <Button variant="success" onClick={() => setShowModalImportStorage(true)}>
                                Import
                            </Button>
                        </Form.Group>
                    </Form>
                    <Table striped bordered hover size="md">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Id</th>
                                <th>Số Lô</th>
                                <th>Tên Hàng Hóa</th>
                                <th>Kệ</th>
                                <th>Loại</th>
                                <th>SL</th>
                                <th>NSX</th>
                                <th>HSD</th>
                                <th>Ngày Nhập</th>
                                <th>Mã QR</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems &&
                                currentItems
                                    .map((el, i) => {
                                        return (
                                            <tr key={i + 1}>
                                                <td>{i + 1}</td>
                                                <td>{el._id}</td>
                                                <td>{el.lot_number}</td>
                                                <td>{el.product_name}</td>
                                                <td>{el.shelf_number}</td>
                                                <td>{el.type}</td>
                                                <td>{el.quantity}</td>
                                                <td>{el.nsx}</td>
                                                <td>{el.hsd}</td>
                                                <td>{el.ctime}</td>
                                                <td>
                                                    <img className="qr_code" alt="" src={el.qr_code} />{' '}
                                                </td>
                                                <td>
                                                    <Button
                                                        variant="primary"
                                                        className="btn"
                                                        onClick={() => handleData(el)}
                                                    >
                                                        Sửa
                                                    </Button>
                                                    <Button variant="danger" onClick={() => handleDelete(el._id)}>
                                                        Xóa
                                                    </Button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                    .slice(pagesVisited, pagesVisited + usersPerPage)}
                        </tbody>
                    </Table>
                </Tab>

                <Tab eventKey="second" title="Vật Tự">
                    <Form>
                        <Form.Group className="mb-3 fcontainer" controlId="exampleForm.ControlInput1">
                            <Form.Label className="ftext">Tìm Kiếm Lô</Form.Label>
                            <Form.Control type="text" placeholder="Nhập tên lô" className="fip" />
                            <Button variant="success" onClick={() => setShowModalCreateStorage(true)}>
                                THÊM MỚI
                            </Button>
                        </Form.Group>
                    </Form>

                    <Table striped bordered hover size="md">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Số Lô</th>
                                <th>Tên Hàng Hóa</th>
                                <th>Kệ</th>
                                <th>Loại</th>
                                <th>SL</th>
                                <th>Mã QR</th>
                                <th>NSX</th>
                                <th>HSD</th>
                                <th>Ngày Nhập</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody></tbody>
                    </Table>
                </Tab>
            </Tabs>
            {searchIn}
            <div className="d-flex justify-content-center">
                <ReactPaginate
                    nextLabel="next >"
                    onPageChange={changePage}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={pageCount}
                    previousLabel="< previous"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                    renderOnZeroPageCount={null}
                    // forcePage={currentPage - 1}
                />
            </div>
            {
                <ModalCreateStorage
                    checked={checked}
                    data={data}
                    handleCreate={handleCreate}
                    getValue={getValue}
                    handleUpdate={handleUpdate}
                    show={showModalCreateStorage}
                    setShow={setShowModalCreateStorage}
                    setData={setData}
                    setChecked={setChecked}
                />
            }
            {
                <ModalImportStorage
                    handleImport={handleImport}
                    show={showModalImportStorage}
                    setShow={setShowModalImportStorage}
                    setFile={setFile}
                />
            }
            {
                <Notification
                    index={getKey.current}
                    setShow={setShow}
                    title="Thông Báo Xóa"
                    description="Bạn có chắc chắn muốn xóa không"
                    show={show}
                    setCurrentItems={setCurrentItems}
                    medicine={medicine}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    setHandleCheck={setHandleCheck}
                    handleCheck={handleCheck}
                />
            }
            {
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
            }
        </div>
    );
}

export default Storage;

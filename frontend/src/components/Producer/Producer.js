import React, { useState, useEffect, useRef } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { Row, Col } from 'react-bootstrap';
import './Producer.scss';
import ModalCreateProducer from './ModalCreateProducer';
import ModalUpdateProducer from './ModalUpdateProducer';
import Axios from 'axios';
import axios from 'axios';
import ReactPaginate from 'react-paginate';
import ModalImportProducer from './ModalImportProducer';
import Moment from 'moment';

const Producer = () => {
    const [showModalCreateProducer, setShowModalCreateProducer] = useState(false);
    const [showModalUpdateProducer, setShowModalUpdateProducer] = useState(false);
    const [showModalImportProducer, setShowModalImportProducer] = useState(false);
    const [handelCheck, setHandleCheck] = useState(false);
    const [isChecked, setIsChecked] = useState(true);
    const [dataSearch, setDataSearch] = useState('');
    const [checkSort, setCheckSort] = useState(true);
    let getKey = useRef();

    //call api 1 lần
    useEffect(() => {
        Axios.get('http://localhost:4000/api/producer/list')
            .then((response) => {
                setListInfoProducer(response.data.docs);
            })
            .catch(function (error) {});
    }, [handelCheck]);

    // lấy dữ liệu ở thêm
    const [infoProducer, setInfoProducer] = useState({
        _id: '',
        producer_name: '',
        producer_address: '',
        producer_phone: '',
        producer_email: '',
    });
    const [listInfoProducer, setListInfoProducer] = useState([]);
    const [ListData, setListData] = useState([listInfoProducer]);

    const [file, setFile] = useState('');

    // phan trang
    const [pageNumber, setPageNumber] = useState(0);
    const usersPerPage = 5;
    const pagesVisited = pageNumber * usersPerPage;
    const pageCount = Math.ceil(ListData.length / usersPerPage);
    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    // call api 1 lan
    useEffect(() => {
        Axios.get('http://localhost:4000/api/producer/list')
            .then((response) => {
                setListInfoProducer(response.data.docs);
            })
            .catch(function (error) {});
    }, []);

    const onChangeInfoProducer = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setInfoProducer({ ...infoProducer, [name]: value });
    };

    // create
    const handleCreate = () => {
        let { producer_name, producer_address, producer_email, producer_phone } = infoProducer;
        let vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        if (
            producer_name != '' &&
            producer_address != '' &&
            producer_email != ''
            //  && producer_phone != ""
        ) {
            if (producer_phone != '') {
                if (vnf_regex.test(producer_phone) == false) {
                    alert('Số điện thoại của bạn không đúng định dạng!');
                } else {
                    Axios.post('http://localhost:4000/api/producer/create', infoProducer)
                        .then(() => {
                            setListInfoProducer([infoProducer, ...listInfoProducer]);
                            setInfoProducer({
                                _id: '',
                                producer_name: '',
                                producer_address: '',
                                producer_phone: '',
                                producer_email: '',
                            });
                            setHandleCheck(!handelCheck);
                        })
                        .catch(function (error) {});

                    setShowModalCreateProducer(!showModalCreateProducer);
                }
            } else {
                alert('Bạn chưa điền số điện thoại!');
            }
        } else {
            return alert('vui lòng điền đầy đủ thông tin');
        }
    };
    // delete
    const onclickDelete = (id) => {
        // setInfoProducer(post)
        getKey.current = id;
        setShowModalUpdateProducer(!showModalUpdateProducer);
    };

    // update
    const onclickUpdate = (post) => {
        setShowModalCreateProducer(!showModalCreateProducer);
        setInfoProducer(post);
        setIsChecked(!isChecked);
    };
    const handleUpdate = (id) => {
        let { producer_name, producer_address, producer_email, producer_phone } = infoProducer;
        let vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        if (
            producer_name != '' &&
            producer_address != '' &&
            producer_email != ''
            //  && producer_phone != ""
        ) {
            if (producer_phone != '') {
                if (vnf_regex.test(producer_phone) == false) {
                    alert('Số điện thoại của bạn không đúng định dạng!');
                } else {
                    setInfoProducer({ ...infoProducer, _id: id });
                    axios
                        .post(`http://localhost:4000/api/producer/update/${infoProducer._id}`, infoProducer)
                        .then((res) => {
                            setInfoProducer({
                                _id: '',
                                producer_name: '',
                                producer_address: '',
                                producer_phone: '',
                                producer_email: '',
                            });
                            setHandleCheck(!handelCheck);
                            setIsChecked(!isChecked);
                        })
                        .catch((err) => console.log(err));

                    setShowModalCreateProducer(!showModalCreateProducer);
                }
            } else {
                alert('Bạn chưa điền số điện thoại!');
            }
        } else {
            return alert('vui lòng điền đầy đủ thông tin');
        }
    };

    // get dataSearch
    const onChangeSearch = (e) => {
        let value = e.target.value;
        setDataSearch(value);
    };
    useEffect(() => {
        setListData(
            listInfoProducer.filter((item) => {
                return (
                    item.producer_name.toLowerCase().includes(dataSearch.toLowerCase()) ||
                    item._id.toLowerCase().includes(dataSearch.toLowerCase())
                );
            }),
        );
    }, [dataSearch, listInfoProducer]);

    //sort
    function compare(a, b) {
        // Dùng toUpperCase() để không phân biệt ký tự hoa thường
        const producer_nameA = a.producer_name.toUpperCase();
        const producer_nameB = b.producer_name.toUpperCase();
        setCheckSort(!checkSort);

        let comparison = 0;

        if (producer_nameA > producer_nameB) {
            comparison = 1;
        } else if (producer_nameA < producer_nameB) {
            comparison = -1;
        }
        if (checkSort == true) {
            return comparison;
        } else {
            return comparison * -1;
        }
    }

    const handleSort = () => {
        listInfoProducer.sort(compare);

        setListData(listInfoProducer);
    };

    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');

    const handleImport = () => {
        const data = new FormData();
        data.append('File', file);
        console.log(file);
        axios.post('http://localhost:4000/api/producer/import', data);
        setShowModalImportProducer(!showModalImportProducer);
        alert('ok');
    };

    const handleExport = () => {
        const newFromDate = Moment(fromDate).format('DD/MM/YYYY');
        const newToDate = Moment(toDate).format('DD/MM/YYYY');
        const url = 'http://localhost:4000/api/producer/export';
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
        <div className="producer">
            <p className="title"> Danh sách nhà cung cấp </p>{' '}
            <Form>
                <Form.Group className="mb-3 fcontainer" controlId="exampleForm.ControlInput1">
                    <Form.Label className="ftext"> Tìm Kiếm Nhà Cung Cấp </Form.Label>{' '}
                    <Form.Control
                        type="text"
                        placeholder="Nhập tên nhà cung cấp"
                        className="fip"
                        value={dataSearch}
                        onChange={(e) => onChangeSearch(e)}
                    />{' '}
                    <Button variant="success" onClick={() => setShowModalCreateProducer(!showModalCreateProducer)}>
                        THÊM MỚI{' '}
                    </Button>{' '}
                    <Button variant="success" onClick={() => handleSort()}>
                        Sắp xếp⬆⬇{' '}
                    </Button>{' '}
                </Form.Group>{' '}
            </Form>{' '}
            <Form>
                <Form.Group className="mb-3 fcontainer" controlId="exampleForm.ControlInput1">
                    <Form.Control type="date" name="fromDate" onChange={(e) => setFromDate(e.target.value)} /> &nbsp;
                    &nbsp; &nbsp;
                    <Form.Control type="date" name="toDate" onChange={(e) => setToDate(e.target.value)} /> &nbsp; &nbsp;
                    &nbsp;
                    <Button variant="success" style={{ marginRight: '8px' }} onClick={handleExport}>
                        EXPORT
                    </Button>
                    <Button variant="success" onClick={() => setShowModalImportProducer(!showModalImportProducer)}>
                        IMPORT
                    </Button>
                </Form.Group>
            </Form>
            <Table striped bordered hover size="md">
                <thead>
                    <tr>
                        <th> STT </th> <th> ID </th> <th> Tên </th> <th> Địa Chỉ </th> <th> Số Điện Thoại </th>{' '}
                        <th> Email </th> <th> Action </th>{' '}
                    </tr>{' '}
                </thead>{' '}
                <tbody>
                    {' '}
                    {ListData.map((post, key) => {
                        return (
                            <tr key={key}>
                                <td> {key + 1} </td> <td> {post._id} </td> <td> {post.producer_name} </td>{' '}
                                <td> {post.producer_address} </td> <td> {post.producer_phone} </td>{' '}
                                <td> {post.producer_email} </td>{' '}
                                <td>
                                    <Button variant="primary" className="btn" onClick={() => onclickUpdate(post)}>
                                        Sửa{' '}
                                    </Button>{' '}
                                    <Button variant="danger" onClick={() => onclickDelete(post._id)}>
                                        {' '}
                                        Xóa{' '}
                                    </Button>{' '}
                                </td>{' '}
                            </tr>
                        );
                    }).slice(pagesVisited, pagesVisited + usersPerPage)}{' '}
                </tbody>{' '}
            </Table>{' '}
            <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                // onClick = {(e) => onclickPage(e)}
                pageCount={pageCount}
                onPageChange={changePage}
                containerClassName={'paginationBtns'}
                previousLinkClassName={'previousBtn'}
                nextLinkClassName={'nextBtn'}
                disabledClassName={'paginationDisabled'}
                activeClassName={'paginationActive'}
            />{' '}
            <ModalCreateProducer
                show={showModalCreateProducer}
                setShow={setShowModalCreateProducer}
                infoProducer={infoProducer}
                setInfoProducer={setInfoProducer}
                isChecked={isChecked}
                setIsChecked={setIsChecked}
                onChangeInfoProducer={onChangeInfoProducer}
                handleCreate={handleCreate}
                handleUpdate={handleUpdate}
                handelCheck={handelCheck}
                setHandleCheck={setHandleCheck}
            />
            <ModalUpdateProducer
                show={showModalUpdateProducer}
                setShow={setShowModalUpdateProducer}
                setIsChecked={setIsChecked}
                isChecked={isChecked}
                setInfoProducer={setInfoProducer}
                infoProducer={infoProducer}
                index={getKey.current}
                setHandleCheck={setHandleCheck}
                handelCheck={handelCheck}
            />
            <ModalImportProducer
                show={showModalImportProducer}
                setShow={setShowModalImportProducer}
                file={file}
                setFile={setFile}
                onChangeInfoProducer={onChangeInfoProducer}
                handleImport={handleImport}
            />
        </div>
    );
};

export default Producer;

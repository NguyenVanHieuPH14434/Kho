import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './Management.scss';

const ModalCreateManagement = (props) => {
    // Close modal add new
    const { show, setShow } = props;
    const handleClose = () => {
        setShow(false);
    };

    // Add
    const [nameAdd, setNameAdd] = useState('');
    const [descAdd, setDescAdd] = useState('');
    const handleAdd = () => {
        if (nameAdd !== '' && descAdd !== '') {
            const add = {
                shelf_name: nameAdd,
                shelf_desc: descAdd,
            };
            axios.post('http://localhost:4000/api/shelf/create', add).then((res) => {
                // showToastMessageSucess();
                toast.success('Thêm Mới Kệ Thành Công');
                setNameAdd('');
                setDescAdd('');
                handleClose();
            });
        } else {
            toast.warning('Thông Tin Không Được Để Trống');
        }
    };

    return (
        <>
            <Modal size="lg" show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title className="total">Thêm Mới Kệ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Tên Kệ</Form.Label>
                            <Form.Control type="text" value={nameAdd} onChange={(e) => setNameAdd(e.target.value)} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Ghi Chú</Form.Label>
                            <Form.Control type="text" value={descAdd} onChange={(e) => setDescAdd(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => handleAdd()}>
                        THÊM MỚI
                    </Button>
                    <Button variant="danger" onClick={handleClose}>
                        QUAY LẠI
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalCreateManagement;

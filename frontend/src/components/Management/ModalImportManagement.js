import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './Management.scss';

const ModalImportManagement = (props) => {
    // Close modal add new
    const { show, setShow } = props;
    const handleClose = () => {
        setShow(false);
    };

    const [file, setFile] = useState('');

    const handleImport = async () => {
        const data = new FormData();
        data.append('File', file);
        console.log(file);
        await axios.post('http://localhost:4000/api/shelf/import', data);
        alert('ok');
        handleClose();
    };

    return (
        <>
            <Modal size="lg" show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title className="total">Import</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Choose file</Form.Label>
                            <Form.Control type="file" name="file" onChange={(e) => setFile(e.target.files[0])} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => handleImport()}>
                        Import
                    </Button>
                    <Button variant="danger" onClick={handleClose}>
                        QUAY LẠI
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ModalImportManagement;

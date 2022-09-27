import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import { Row, Col } from 'react-bootstrap';
import axios from 'axios';
import './Storage.scss';

const ModalImportStorage = (props) => {
    const { show, setShow, handleImport, setFile } = props;
    const handleClose = () => {
        setShow(false);
    };

    return (
        <>
            <Modal size="lg" show={show} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title className="total">Import</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col>
                            <Row>
                                <Form.Label>Choose file</Form.Label>
                                <Form.Control type="file" name="file" onChange={(e) => setFile(e.target.files[0])} />
                            </Row>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={handleImport}>
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

export default ModalImportStorage;

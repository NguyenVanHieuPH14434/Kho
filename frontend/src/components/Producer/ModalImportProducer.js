import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Row, Col } from 'react-bootstrap';
import './Producer.scss';
import axios from 'axios';
const ModalImportProducer = (props) => {
    const { show, setShow, handleImport, setFile, setIsChecked } = props;

    const handleClose = () => {
        setShow(false);
        setIsChecked(true);
    };

    return (
        <>
            <Modal size="lg" backdrop="static" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="total">Import Nhà Cung Cấp</Modal.Title>
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

export default ModalImportProducer;

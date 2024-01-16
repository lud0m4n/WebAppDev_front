import React, { useState } from 'react'
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';


interface CreatePeriodsModalProps {
    show: boolean;
    handleClose: () => void;
    fetchData: () => void;
}

const CreatePeriodsModal: React.FC<CreatePeriodsModalProps> = ({ show, handleClose, fetchData }) => {
    const [name, setName] = useState("")
    const [desc, setDesc] = useState("");
    const [age, setAge] = useState("");
    const [error, setError] = useState<string | null>(null);


    const handleEdit = async (name: string, desc: string, age: string) => {
        try {
            await axios.post(
                `/api/period/create`,
                {
                    "age": age,
                    "description": desc,
                    "name": name,
                },
                {
                    headers: {
                        Authorization: `${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            handleClose()
            fetchData()
        } catch (error) {
            setError('Ошибка в вводе данных')
            console.error('Error fetching data:', error);
        }
    }



    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Создание нового периода</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    {/* Добавьте дополнительные поля ввода здесь */}
                    <Form.Group className="mb-3" controlId="formAdditionalField1">
                        <Form.Label>Название периода</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Название"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formAdditionalField2">
                        <Form.Label>Описание периода</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Описание"
                            name="desc"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formAdditionalField3">
                        <Form.Label>Временной промежуток</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Временной промежуток"
                            name="age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                        />
                    </Form.Group>
                </Form>
                {error && <div className="error-message">{error}</div>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрыть
                </Button>
                <Button variant="primary" onClick={() => handleEdit(name, desc, age)}>
                    Отправить
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default CreatePeriodsModal;
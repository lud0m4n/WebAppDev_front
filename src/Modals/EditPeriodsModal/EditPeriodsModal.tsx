import React, { useState } from 'react'
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';


interface EditPeriodsModalProps {
    show: boolean;
    handleClose: () => void;
    periodId: number;
    fetchData: () => void;
    periodName : string;
    periodDesc : string;
    periodAge : string;
}

const EditPeriodsModal: React.FC<EditPeriodsModalProps> = ({ show, handleClose, periodId, fetchData, periodName, periodDesc, periodAge }) => {
    const [name, setName] = useState(periodName)
    const [desc, setDesc] = useState(periodDesc);
    const [age, setAge] = useState(periodAge);
    const [img, setImg] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const handleEdit = async (name: string, desc: string, age: string, img: File | null) => {
        try {
            await axios.put(
                `/api/period/${periodId}/update`,
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
            if (img) {
                let formData = new FormData();
                formData.append('image', img)
                try {
                    await axios.post(`/api/consultations/${periodId}/image`, 
                        formData,
                         {
                        headers: {
                            Authorization: `${localStorage.getItem("accessToken")}`,
                        },
                    });
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
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
                <Modal.Title>Редактирование периода</Modal.Title>
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
                            placeholder="ВРеменной промежуток"
                            name="age"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formAdditionalField3">
                        <Form.Label>Изображение периода</Form.Label>
                        <Form.Control
                            type="file"
                            name="img"
                            onChange={(e) => setImg((e.target as HTMLInputElement).files?.[0] || null)}
                        />
                    </Form.Group>
                </Form>
                {error && <div className="error-message">{error}</div>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Закрыть
                </Button>
                <Button variant="primary" onClick={() => handleEdit(name, desc, age, img)}>
                    Отправить
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default EditPeriodsModal;
import { useState, useEffect } from 'react'
import {validateAge, validateDesc, validateName} from '../../functions/validate/validate'
import Navbar from '../../widgets/Navbar/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./styles.css"
import { Link, useNavigate} from 'react-router-dom';
import axios from 'axios';



const CreatePeriodsModal = () => {
    const [name, setName] = useState("")
    const [desc, setDesc] = useState("");
    const [age, setAge] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();


    const handleEdit = async (name: string, desc: string, age: string) => {
        if (!validateAge(age)) {
            setError('Введите временной промежуток!')
            return
        }
        if (!validateDesc(desc)) {
            setError('Введите описание!')
            return
        }
        if (!validateName(name)) {
            setError('Введите название!')
            return
        }
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
            navigate('/WebAppDev_front')
        } catch (error) {
            setError('Уже есть период с таким названием!')
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {

    }, [error])



    return (
        <div>
            <Navbar />
            <div style={{ marginLeft: "5%", marginTop: "1%" }}>
                <Link to="/WebAppDev_front/main-page/admin" style={{ textDecoration: 'none' }}>Главная </Link>
                <Link to="#" style={{ textDecoration: 'none', color: 'grey' }}>
                    / Создание периода
                </Link>
            </div>
            <div className='container create-page'>
                <h1 className='small-h1'>Создание Периода</h1>
                <Form>
                    {/* Добавьте дополнительные поля ввода здесь */}
                    <Form.Group className="mb-3 create-form" controlId="formAdditionalField1">
                        <Form.Label>Название периода</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Название"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3 create-form" controlId="formAdditionalField2">
                        <Form.Label>Описание периода</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Описание"
                            name="desc"
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3 create-form" controlId="formAdditionalField3">
                        <Form.Label>Временной промежуток периода</Form.Label>
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
                <Button style={{borderColor: "forestgreen", backgroundColor: "forestgreen"}} variant="primary" onClick={() => handleEdit(name, desc, age)}>
                    Создать
                </Button>
            </div>
        </div>
    )
}

export default CreatePeriodsModal;
import { useState, useEffect } from 'react'
import { validateAge } from '../../functions/validate/validate'
import Navbar from '../../widgets/Navbar/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./styles.css"
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

interface Data {
    id_fossil: number;
    periods: {
        id_period: number;
        name: string;
        description: string;
        age: string;
        status: string;
        photo: string;
    }[];

}

const EditPage = () => {
    const [data, setData] = useState<Data | null>({ id_fossil: 0, periods: [] });
    const { periodId } = useParams();
    const parsedId = periodId ? parseInt(periodId) : 0;
    const [name, setName] = useState("")
    const [desc, setDesc] = useState("");
    const [age, setAge] = useState("");
    const [img, setImg] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            const url = '/api/period/';
            let response;
            if (!localStorage.getItem("accessToken")) {
                response = await axios.get(url);
            } else {
                response = await axios.get(url, {
                    headers: {
                        Authorization: `${localStorage.getItem("accessToken")}`,
                    },
                });
            }
            const result = response?.data;
            console.log(result);
            setData(result);
        } catch (error) {
            console.error('ошибка при выполнении запроса:', error);
        } finally {
            setLoading(false);
        }
    };


    const handleEdit = async (name: string, desc: string, age: string, img: File | null) => {
        if (age) {
            if (!validateAge(age)) {
                setError('Неправильный ввод!')
                return
            }
        }

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
                    await axios.post(`/api/period/${periodId}/image`,
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
            navigate('/WebAppDev_front')
        } catch (error) {
            setError('Ошибка в вводе данных')
            console.error('Error fetching data:', error);
        }
    }
    
    useEffect(() => {
        if (loading) {
            setName("");
            setDesc("");
            setAge("");
            fetchData();
        } else {
            const period = data?.periods.find(item => item.id_period === parsedId);
            console.log(period)
            console.log(parsedId)
            if (period) {
                setName(period.name || "");
                setDesc(period.description || "");
                setAge(period.age || "");
            }
        }
    }, [error, data ]);

console.log(name, desc, age)

    return (
        <div>
            <Navbar />
            <div style={{ marginLeft: "5%", marginTop: "1%" }}>
                <Link to="/main-page/admin" style={{ textDecoration: 'none' }}>Главная </Link>
                <Link to="#" style={{ textDecoration: 'none', color: 'grey' }}>
                    / Редактирование периода
                </Link>
            </div>
            <div className='container create-page'>
                <h1 className='small-h1'>Редактирование периода</h1>
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
                <Button className='butt' variant="primary" onClick={() => handleEdit(name, desc, age, img)}>
                    Редактировать
                </Button>
            </div>
        </div>
    )
}

export default EditPage;
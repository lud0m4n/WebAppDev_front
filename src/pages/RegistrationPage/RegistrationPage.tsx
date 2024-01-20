import Navbar from '../../widgets/Navbar/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { register } from "../../redux/auth/authActions";
import "./styles.css"


const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const RegistrationPage = () => {
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleRegister = async (userName: string, email: string, password: string, repeatPassword: string) => {
        if (!isValidEmail(email)) {
            console.error("Error during registration:", error);
            setError("Неверно указан email!");
            return
        }
        if (password != repeatPassword) {
            console.error("Error during registration:", error);
            setError("Пароли не совпадают!");
            return
        }
        if (password.length < 8) {
            // Обработка ошибки, если пароль слишком короткий
            setError("Пароль должен содержать не менее 8 символов");
            return
        }
        try {
            await dispatch(register({ userName, email, password }));
            navigate("/WebAppDev_front");
            localStorage.setItem("name", email);
        } catch (error) {
            console.error("Error during registration:", error);
            setError("Пользователь с таким email уже зарегистрирован");
        }
    };
    return (
        <div>
            <Navbar />
            <div className='container registration-page'>
                <h1 className='small-h1'>Регистрация</h1>
                <Form className='registration-form'>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Полное имя</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Имя"
                            name="name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </Form.Group>


                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>


                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Введите пароль"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Подтвердите пароль</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Повторите пароль"
                            name="repeatPassword"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                        />
                    </Form.Group>
                    {error && <div className="error-message">{error}</div>}
                    <Button
                        variant="primary"
                        type="button"
                        className = "butt"
                        onClick={() => handleRegister(userName, email, password, repeatPassword)}>
                        Зарегистрироваться
                    </Button>
                </Form>
            </div>
        </div>
    )
}

export default RegistrationPage;
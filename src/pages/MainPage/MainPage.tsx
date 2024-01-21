import './MainPage.css'
import Navbar from '../../widgets/Navbar/Navbar.tsx'
import Card from '../../widgets/Card/Card.tsx'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import testData from '../../data.tsx';
import Breadcrumb from 'react-bootstrap/Breadcrumb';

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
const MainPage: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<Data | null>({ id_fossil: 0, periods: [] });
    const [searchName, setSearchName] = useState<string | null>(null);

    const fetchData = async (searchName?: string) => {
        try {
            const url = `/api/period/?searchName=${searchName}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Ошибка при выполнении запроса: ${response.statusText}`);
            }

            const result = await response.json();
            console.log(result);
            setData(result);
        } catch (error) {
            console.log(testData)
            let result = { ...testData }; // Создаем копию оригинальных данных
            if (searchName) {
                result.periods = testData.periods.filter((periods) => periods.name.toLowerCase().includes(searchName.toLowerCase()));
            }
            setData(result)
            console.log(searchName);
            console.error('ошибка при выполннении запроса:', error);
        }
    };

    const handleSearchNameChange = (value: string) => {
        setSearchName(value !== '' ? value : null);

        // Обновляем URL с использованием navigate
        const searchNameSring = value !== '' ? value : '';
        navigate(`?searchName=${searchNameSring}`, { replace: true });

        fetchData(searchNameSring); // Вызывайте fetchData при изменении searchName
    };

    useEffect(() => {
        // Получаем значение searchName из URL при монтировании компонента
        const urlSearchParams = new URLSearchParams(window.location.search);
        const searchNameParam = urlSearchParams.get('searchName') || '';
        const parsedSearchName = searchNameParam !== null ? searchNameParam : null;

        if (parsedSearchName !== searchName) {
            setSearchName(parsedSearchName);
            fetchData(searchNameParam);
        }
    }, [searchName]);
    return (
        <div>
            <Navbar onSearchNameChange={handleSearchNameChange} />
            <div className="container">
                <Breadcrumb>
                    <Breadcrumb.Item href="/" active>Главная</Breadcrumb.Item>
                </Breadcrumb>
                <div className="row">
                    {data?.periods?.map((item) => (
                        <div key={item.id_period} className="col-lg-4 col-md-6 col-sm-12">
                            <Card
                                id={item.id_period}
                                name={item.name}
                                description={item.description}
                                image={item.photo}
                                age={item.age}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )

}

export default MainPage 
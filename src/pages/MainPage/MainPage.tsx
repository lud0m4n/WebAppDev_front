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
    const [maxPrice, setMaxPrice] = useState<string | null>(null);

    const fetchData = async (maxPrice?: string) => {
        try {
            const url = `http://localhost:8081/period/?searchName=${maxPrice}`;
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
            if (maxPrice) {
                result.periods = testData.periods.filter((periods) => periods.id_period <= parseInt(maxPrice));
            }
            setData(result)
            console.error('ошибка при выполннении запроса:', error);
        }
    };

    const handleMaxPriceChange = (value: string) => {
        setMaxPrice(value !== '' ? value : null);

        // Обновляем URL с использованием navigate
        const maxPriceString = value !== '' ? value : '';
        navigate(`?searchName=${maxPriceString}`, { replace: true });

        fetchData(maxPriceString); // Вызывайте fetchData при изменении maxPrice
    };

    useEffect(() => {
        // Получаем значение maxPrice из URL при монтировании компонента
        const urlSearchParams = new URLSearchParams(window.location.search);
        const maxPriceParam = urlSearchParams.get('searchName') || '';
        const parsedMaxPrice = maxPriceParam !== null ? maxPriceParam : null;

        if (parsedMaxPrice !== maxPrice) {
            setMaxPrice(parsedMaxPrice);
            fetchData(maxPriceParam);
        }
    }, [maxPrice]);
    return (
        <div>
            <Navbar onMaxPriceChange={handleMaxPriceChange} />
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
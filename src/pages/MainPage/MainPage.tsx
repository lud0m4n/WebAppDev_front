import './MainPage.css'
import Navbar from '../../widgets/Navbar/Navbar'
import Card from '../../widgets/Card/Card'
import { Link, useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { useState, useEffect } from 'react'
import { ChangeEvent } from 'react';
import testData from '../../data';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveRequestID, setMaxPriceFilter, setNumOfProdInReq } from '../../redux/filterAndActiveRequestID/actions';
import { loginSuccess, loginFailure } from '../../redux/auth/authSlice';
import { RootState } from '../../redux/store';
import CartImg from '../../assets/cart-check-svgrepo-com.svg';
import EmptyCartImg from '../../assets/cart-cross-svgrepo-com.svg'
import Loader from '../../widgets/Loader/Loader';

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
    const maxPriceFilter = useSelector((state: RootState) => state.filterAndActiveId.maxPriceFilter);
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const activeRequest = useSelector((state: RootState) => state.filterAndActiveId.activeRequestID);
    const numOfCons = useSelector((state: RootState) => state.filterAndActiveId.numOfCons);
    const [data, setData] = useState<Data | null>({ id_fossil: 0, periods: [] });

    const fetchData = async () => {
        console.log(maxPriceFilter)
        try {
            const url = maxPriceFilter ? `/api/period/?searchName=${maxPriceFilter}` : '/api/period/';
            let response
            if (!localStorage.getItem("accessToken")) {
                response = await fetch(url);
            } else {
                response = await fetch(url, {
                    headers: {
                        Authorization: `${localStorage.getItem("accessToken")}`,
                    },
                });
            }
            if (!response.ok) {
                throw new Error(`Ошибка при выполнении запроса: ${response.statusText}`);
            }


            const result = await response.json();
            localStorage.setItem("ActiveRequestId", result?.ActiveRequestId?.toString() || '');
            dispatch(setActiveRequestID(result?.ActiveRequestId));
            console.log(result);
            setData(result);
        } catch (error) {
            console.log(testData)
            let result = { ...testData }; // Создаем копию оригинальных данных
            if (maxPriceFilter) {
                result.periods = testData.periods.filter((periods) => periods.id_period <= maxPriceFilter);
            }
            setData(result)
            console.error('ошибка при выполннении запроса:', error);
        }
    };

    const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const maxPriceString = e.target.value !== '' ? (e.target.value).toString() : '';
        dispatch(setMaxPriceFilter(maxPriceString));
    };
    const buttonAddClicked = () => {
        if (!activeRequest) {
            fetchData()
        }
    }

    useEffect(() => {
        fetchData()
        if (window.localStorage.getItem("accessToken")) {
            dispatch(loginSuccess())
        }
        const currentNumOfCons = localStorage.getItem('numOfCons');
        const currentNum = currentNumOfCons ? parseInt(currentNumOfCons, 10) : 0;
        const updatedNumOfCons = currentNum;
        localStorage.setItem('numOfCons', updatedNumOfCons.toString());
        if (updatedNumOfCons != numOfCons) {
            dispatch(setNumOfProdInReq(updatedNumOfCons));
        }
    }, [dispatch, maxPriceFilter]);
    return (
        <div>
            <Navbar />
            <div className="container">
                <Breadcrumb>
                    <Breadcrumb.Item href="/WebAppDev_front" active>Главная</Breadcrumb.Item>
                </Breadcrumb>
                <Form
                    className="d-flex"
                    id="search"
                    style={{ width: "20%", minWidth: "250px", marginTop: "0.7%" }}
                >
                    <Form.Control
                        type="search"
                        placeholder="Поиск по максимальной цене"
                        className="me-2"
                        aria-label="Search"
                        value={maxPriceFilter}
                        onChange={handleMaxPriceChange}
                    />
                </Form>
                {/* || data?.periods.length === 0 */}
                {!data  ?
                    <Loader />
                    : <>
                <div className="row">
                    {data?.periods?.map((item) => (
                        <div key={item.id_period} className="col-lg-4 col-md-6 col-sm-12">
                            <Card
                                id={item.id_period}
                                name={item.name}
                                description={item.description}
                                image={item.photo}
                                age={item.age}
                                buttonAddClicked={buttonAddClicked}
                            />
                        </div>
                    ))}
                </div>
                {isAuthenticated ?
                            (activeRequest && numOfCons > 0) ?
                                <Link className='cart' to='/shopping-cart'>
                                    <img src={CartImg} />
                                </Link> :
                                <Link className='cart empty' to='/shopping-cart' >
                                    <img src={EmptyCartImg} />
                                </Link>
                            : null
                        } </>}
            </div>
        </div>
    )

}

export default MainPage 
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
import { setActiveFossilID, setSearchNameFilter, setNumOfProdInReq } from '../../redux/filterAndActiveFossilID/actions';
import { loginSuccess, setRole } from '../../redux/auth/authSlice';
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
    const searchNameFilter = useSelector((state: RootState) => state.filterAndActiveId.searchNameFilter);
    const dispatch = useDispatch();
    const role = useSelector((state: RootState) => state.auth.role);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const activeFossil = useSelector((state: RootState) => state.filterAndActiveId.activeFossilID);
    const numOfPeriods = useSelector((state: RootState) => state.filterAndActiveId.numOfPeriods);
    const [data, setData] = useState<Data | null>({ id_fossil: 0, periods: [] });
    const fetchData = async () => {
        console.log(searchNameFilter)
        try {
            const url = searchNameFilter ? `/api/period/?searchName=${searchNameFilter}` : '/api/period/';
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
            const idFossil = result?.id_fossil || '';
            localStorage.setItem("ActiveFossilId", idFossil);
            dispatch(setActiveFossilID(idFossil));
            console.log(idFossil);
            setData(result);
        } catch (error) {
            console.log(testData)
            let result = { ...testData }; // Создаем копию оригинальных данных
            if (searchNameFilter) {
                result.periods = testData.periods.filter((periods) => periods.id_period <= searchNameFilter);
            }
            setData(result)
            console.error('ошибка при выполннении запроса:', error);
        }
    };

    const handleSearchNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const searchNameString = e.target.value !== '' ? (e.target.value).toString() : '';
        dispatch(setSearchNameFilter(searchNameString));
    };
    const buttonAddClicked = () => {
        if (!activeFossil) {
            fetchData()
        }
    }

    useEffect(() => {
        fetchData()
        if (window.localStorage.getItem("accessToken")) {
            dispatch(loginSuccess())
        }
        const currentNumOfPeriods = localStorage.getItem('numOfPeriods');
        const currentNum = currentNumOfPeriods ? parseInt(currentNumOfPeriods, 10) : 0;
        const updatedNumOfPeriods = currentNum;
        localStorage.setItem('numOfPeriods', updatedNumOfPeriods.toString());
        if (updatedNumOfPeriods != numOfPeriods) {
            dispatch(setNumOfProdInReq(updatedNumOfPeriods));
        }
        if (window.localStorage.getItem("role")) {
            const role = window.localStorage.getItem("role");
            // const role = roleString ? parseInt(roleString) : 0;
            dispatch(setRole(role))
        }
    }, [dispatch, searchNameFilter]);
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
                    style={{ color: "#d1f1d7", width: "20%", minWidth: "250px", marginTop: "0.7%" }}
                >
                    <Form.Control
                        type="search"
                        placeholder="Поиск по названию"
                        className="me-2"
                        aria-label="Search"
                        value={searchNameFilter}
                        style={{ color: "#d1f1d7", width: "20%", minWidth: "250px", marginTop: "0.7%"} }
                        onChange={handleSearchNameChange}
                    />
                </Form>
                {/* || data?.periods.length === 0 */}
                {!data  ?
                    <Loader />
                    : <>
                <div className="row">
                    {data?.periods?.map((item) => (
                        <div key={item.id_period} style={{textDecoration: 'none'}} className="col-lg-4 col-md-6 col-sm-12">
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
                            ((localStorage.getItem("ActiveFossilId") != '0') && (numOfPeriods > 0)) ?
                                <Link className='cart' to={`/WebAppDev_front/fossil/${localStorage.getItem("ActiveFossilId")}`}>
                                    <img src={CartImg} />
                                </Link> :
                                <Link className='cart empty' to='/WebAppDev_front/shopping-cart' >
                                    <img src={EmptyCartImg} />
                                </Link>
                            : null
                        } </>}
            </div>
        </div>
    )

}

export default MainPage 
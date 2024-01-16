import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import Navbar from '../../widgets/Navbar/Navbar';
import Loader from '../../widgets/Loader/Loader';
import Table from 'react-bootstrap/Table';
import { Form, Button, Modal } from 'react-bootstrap';
import { ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { setSearchNameFilter } from '../../redux/filterAndActiveRequestID/actions';
import { loginSuccess, setRole } from '../../redux/auth/authSlice';
import axios from 'axios';
import addImg from '../../assets/add-square-svgrepo-com.svg'
import EditPeriodsModal from '../../Modals/EditPeriodsModal/EditPeriodsModal';
import './styles.css'
import CreatePeriodsModal from '../../Modals/CreatePeriodsModal/CreatePeriodsModal';

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

const TableMainPage: React.FC = () => {
    const [data, setData] = useState<Data | null>({ id_fossil: 0, periods: [] });
    const dispatch = useDispatch();
    const searchNameFilter = useSelector((state: RootState) => state.filterAndActiveId.searchNameFilter);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const role = useSelector((state: RootState) => state.auth.role);

    const fetchData = async () => {
        console.log(searchNameFilter)
        try {
            const url = searchNameFilter ? `/api/period/?searchName=${searchNameFilter}` : '/api/period/';
            let response
            if (!localStorage.getItem("accessToken")) {
                response = await axios.get(url)
            }
            else {
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
        }
    };

    const handleDelete = async (periodId: number) => {
        try {
            await axios.delete(
                `/api/period/${periodId}/delete`,
                {
                    headers: {
                        Authorization: `${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            fetchData()
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleSearchNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        const searchNameString = e.target.value !== '' ? (e.target.value).toString() : '';
        dispatch(setSearchNameFilter(searchNameString));
    };

    useMemo(() => {
        console.log('MainPage useEffect is triggered');
        fetchData()
        if (window.localStorage.getItem("accessToken")) {
            dispatch(loginSuccess())
        }
        if (window.localStorage.getItem("role")) {
            const role = window.localStorage.getItem("role");
            console.log(role);
            // const role = roleString ? parseInt(roleString) : 0;
            dispatch(setRole(role));
        }
    }, [dispatch, searchNameFilter]);

    return (
        <div>
            <Navbar />
            <div style={{ marginLeft: "5%", marginTop: "1%" }}>
                <Link to="/WebAppDev_front" style={{ textDecoration: 'none', color: 'grey' }}>
                    <p>Главная</p>
                </Link>
               <Link to="/WebAppDev_front">Сменить режим просмотра</Link>
                <Form
                    className="d-flex"
                    id="search"
                    style={{ width: "20%", minWidth: "250px", marginTop: "0.7%" }}
                >
                    <Form.Control
                        type="search"
                        placeholder="Поиск по названию"
                        className="me-2"
                        aria-label="Search"
                        value={searchNameFilter}
                        onChange={handleSearchNameChange}
                    />
                </Form>
            </div>
            {!data || data?.periods.length === 0 ? <Loader />
                : <div style={{ margin: '5% 10% 0 10%' }}>
                    <div className='table-responsive'>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th key={'name'}>Название</th>
                                <th key={'description'}>Описание</th>
                                <th key={'age'}>Период времени</th>
                                <th key={'photo'}>Изображение</th>
                                <th key={'Edit'}>Редактирование</th>
                                <th key={'Delete'}>Удаление</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.periods.map((item, index) => (
                                <tr key={index}>
                                    {Object.values(item).map((value, index) => {
                                        const excludedIndices = [0, 4];
                                        return excludedIndices.includes(index) ? null :
                                            <td key={index}>{value as React.ReactNode}</td>;
                                    }
                                    )}
                                    <td>
                                        <Link to={`/WebAppDev_front/period/${item.id_period}/edit`}>
                                        <Button variant="primary">
                                            Редактировать
                                        </Button>
                                        </Link>
                                    </td>
                                    <td><Button variant="danger" onClick={() => { handleDelete(item.id_period) }}>
                                        Удалить
                                    </Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    </div>
                    <Link className='add-pers' to={"/WebAppDev_front/period/create"}>
                        <img src={addImg} />
                    </Link>
                </div>}
        </div>
    );
}

export default TableMainPage;

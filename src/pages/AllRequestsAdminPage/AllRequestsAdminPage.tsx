import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setStartDateFilter, setEndDateFilter, setStatusFilter, setUserFilter } from '../../redux/requestFilters/actions';
import { RootState } from '../../redux/store';
import Navbar from '../../widgets/Navbar/Navbar';
import Loader from '../../widgets/Loader/Loader';
import { Table, Button, Form } from 'react-bootstrap';
import { statusDictionary } from '../../status/status';
import { Link } from 'react-router-dom';
import axios from 'axios'
import './styles.css'

interface Request {
    id_fossil: number;
    Species: string;
    StartDate: string;
    FormationDate: string;
    EndDate: string;
    status: string;
    FullName: string;
}

const AllRequestsAdminPage = () => {
    const dispatch = useDispatch();
    const startDate = useSelector((state: RootState) => state.requestFilters.startDate);
    const endDate = useSelector((state: RootState) => state.requestFilters.endDate);
    const status = useSelector((state: RootState) => state.requestFilters.status);
    const user = useSelector((state: RootState) => state.requestFilters.user);
    const [localUser, setLocalUser] = useState(user);
    const [requests, setRequests] = useState<Request[] | null>(null);


    useEffect(() => {
        setLocalUser(user)
        console.log(localUser)
    }, [user])


    const formattedTime = (timestamp: string) => {
        if (timestamp.includes('0001-01-01')) {
            return "Не установлено";
        }
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        };
        const formattedDate = new Date(timestamp).toLocaleDateString('ru-RU', options);


        return formattedDate
    };

    const fetchData = async (startDate: string, endDate: string, status: string) => {
        try {
            const url = `/api/fossil/?startFormationDate=${startDate}&endFormationDate=${endDate}&fossilStatus=${status}`;
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


            const result_1 = await response.json();
            let result = result_1.fossils;
            console.log(result)
            console.log(user)
            console.log(localUser)
            let filteredResult = result
            if (localUser != '') {
                console.log('123321')
                filteredResult = result?.filter((item: Request) => item.FullName.includes(localUser)) || result
            }
            console.log(filteredResult)
            setRequests(filteredResult);
        } catch (error) {
            console.error('ошибка при выполнении запроса:', error);
        }
    };

    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setStartDateFilter(e.target.value));
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setEndDateFilter(e.target.value));
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setStatusFilter(e.target.value));
    };



    const handleChangeStatus = async (requestId: number, Newstatus: string) => {
        try {
            await axios.put(
                `/api/fossil/${requestId}/status/moderator`,
                {
                    "status": Newstatus,
                },
                {
                    headers: {
                        Authorization: `${localStorage.getItem("accessToken")}`,
                    },
                }
            );
            fetchData(startDate, endDate, status)
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const handleResetFilter = () => {
        dispatch(setStartDateFilter(''));
        dispatch(setEndDateFilter(''));
        dispatch(setStatusFilter(''));
        dispatch(setUserFilter(''));
        setLocalUser('')
        fetchData(startDate, endDate, status)
    }

    const fetchDataWithPolling = async () => {
        try {
            fetchData(startDate, endDate, status);
        } catch (error) {
            console.error('Error fetching data with polling:', error);
        }
    };



    useEffect(() => {
        fetchData(startDate, endDate, status);
    }, [startDate, endDate, status])

    useEffect(() => {
        if (localUser != "") {
            const previos = requests
            setRequests(requests?.filter((item: Request) => item.FullName.includes(localUser)) || previos);
        }
    }, [localUser])

    useEffect(() => {
        const pollingInterval = setInterval(() => {
            fetchDataWithPolling();
        }, 2000);
        return () => clearInterval(pollingInterval);

    }, [startDate, endDate, status, localUser]);

    if (!requests) {
        return <div><Navbar /> <Loader /></div>
    }

    return (
        <div>
            <Navbar />
            <div style={{ marginLeft: "5%", marginTop: "1%" }}>
                <Link to="/WebAppDev_front" style={{ textDecoration: 'none' }}>Главная </Link>
                <Link to="#" style={{ textDecoration: 'none', color: 'grey' }}>
                    / Заявки
                </Link>
            </div>
            <div style={{ margin: '3% 7% 0 7%' }}>
                <div className='filter-container'>
                    <div className='filter'>
                        <label>Дата формирования (начало):</label>
                        <input type="date" value={startDate} onChange={handleStartDateChange} />
                    </div>
                    <div className='filter'>
                        <label>Дата формирования (конец):</label>
                        <input type="date" value={endDate} onChange={handleEndDateChange} />
                    </div>
                    <div className='filter options'>
                        <select value={status} onChange={handleStatusChange}>
                            <option value="">Статус (все)</option>
                            <option key={"в работе"} value={"в работе"}>
                                В работе
                            </option>
                            <option key={"завершен"} value={"завершен"}>
                                Завершен
                            </option>
                            <option key={"отклонен"} value={"отклонен"}>
                                Отклонен
                            </option>
                        </select>
                    </div>
                    
                    <Button className='filter-button' variant="primary" onClick={() => { handleResetFilter() }}>
                        Сбросить фильтры
                    </Button>
                </div>
                {(requests?.length == 0) ? <h1 className='small-h1' style={{ marginTop: '5%' }}>Нет данных, которые соответствуют фильтрам</h1> :
                    <div className='table-responsive'>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th key={'species'}>Название</th>
                                    <th key={'startDate'}>Создана</th>
                                    <th key={'formDate'}>Сформирована</th>
                                    <th key={'endDate'}>Закончена</th>
                                    <th key={'status'}>Статус</th>
                                    <th key={'fullName'}>Пользователь</th>
                                    <th key={'end'}>Закончить</th>
                                    <th key={'decline'}>Отменить</th>
                                    <th key={'more'}>Подробнее</th>
                                    {/* 1 3 4 7 8 9  0 2 5 6 */}
                                </tr>
                            </thead>
                            <tbody>
                                {requests?.map((request, index) => (
                                    <tr key={index}>
                                        {Object.values(request).map((value, index) => {
                                            const excludedIndices = [0];
                                            const timeRows = [2, 3, 4]
                                            console.log(request.status);
                                            return excludedIndices.includes(index) ? null :
                                                timeRows.includes(index) ? <td key={index}>{formattedTime(value as string) as React.ReactNode}</td> :
                                                    <td key={index}>{value as React.ReactNode}</td>;
                                        })}
                                        {request.status === 'завершен' || request.status === "отклонен" ?
                                            <>
                                                <td>Заявка закончена</td>
                                                <td>Заявка закончена</td>
                                                <td><Link to={`/WebAppDev_front/request/${request.id_fossil}`}>Подробнее</Link></td>
                                            </> :
                                            <>
                                                <td><Button variant="primary" onClick={() => { handleChangeStatus(request.id_fossil, 'завершен') }}>
                                                    Закончить
                                                </Button></td>
                                                <td><Button variant="danger" onClick={() => { handleChangeStatus(request.id_fossil, 'отклонен') }}>
                                                    Отменить
                                                </Button></td>
                                                <td><Link to={`/WebAppDev_front/request/${request.id_fossil}`}>Подробнее</Link></td>

                                            </>}
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>}
            </div>
        </div>
    );
}

export default AllRequestsAdminPage;

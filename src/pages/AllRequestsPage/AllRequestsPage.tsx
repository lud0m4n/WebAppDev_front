import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllRequests } from '../../redux/request/requestActions';
import { RootState } from '../../redux/store';
import Navbar from '../../widgets/Navbar/Navbar';
import Loader from '../../widgets/Loader/Loader';
import Table from 'react-bootstrap/Table';



const AllRequestsPage = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state: RootState) => state.request.fossils);
  // const status = useSelector((state: RootState) => state.request.status);
  console.log(requests)
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
  useEffect(() => {
    dispatch(getAllRequests());
  }, [dispatch]);

  if (!requests || requests.length === 0) {
    return (
      <>
      <Navbar/>
      <Loader />
      </>
    );
  }
  
  return (
    <div>
      <Navbar />
      <div style={{ margin: '10% 10% 0 10%' }}>
        <Table striped bordered hover>
          <thead>
            {/* <tr>
              {Object.keys(requests[0]).map((key) => (
                <th key={key}>{key}</th>
              ))} */}
            <tr>
              <th key={'species'}>Вид</th>
              <th key={'creation_date'}>Создана</th>
              <th key={'formation_date'}>Сформирована</th>
              <th key={'completion_date'}>Завершена</th>
              <th key={'status'}>Статус</th>
              {/* 1 3 4 7 8 9  0 2 5 6 */}
            </tr>
          </thead>
          <tbody>
          {requests.map((request, index) => (
  <tr key={index}>
    {Object.values(request).map((value, columnIndex) => {
      const excludedIndices = [0, 6];
      const timeRows = [2, 3, 4];

      if (excludedIndices.includes(columnIndex)) {
        return null;
      } else if (timeRows.includes(columnIndex)) {
        return <td key={columnIndex}>{formattedTime(value as string) as React.ReactNode}</td>;
      } else {
        return <td key={columnIndex}>{value as React.ReactNode}</td>;
      }
    })}
  </tr>
))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default AllRequestsPage;
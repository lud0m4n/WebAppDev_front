import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllFossils } from '../../redux/fossil/fossilActions';
import { RootState } from '../../redux/store';
import Navbar from '../../widgets/Navbar/Navbar';
import Loader from '../../widgets/Loader/Loader';
import Table from 'react-bootstrap/Table';



const AllFossilsPage = () => {
  const dispatch = useDispatch();
  const fossils = useSelector((state: RootState) => state.fossil.fossils);
  // const status = useSelector((state: RootState) => state.fossil.status);
  console.log(fossils)
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
    dispatch(getAllFossils());
  }, [dispatch]);

  if (!fossils || fossils.length === 0) {
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
              {Object.keys(fossils[0]).map((key) => (
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
          {fossils.map((fossil, index) => (
  <tr key={index}>
    {Object.values(fossil).map((value, columnIndex) => {
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

export default AllFossilsPage;
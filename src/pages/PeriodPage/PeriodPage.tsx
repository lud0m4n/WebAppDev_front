import './PeriodPage.css';
import Navbar from '../../widgets/Navbar/Navbar.tsx';
// import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import testData from '../../data.tsx';

interface PeriodData { 
  id_period: number;
  name: string;
  description: string;
  age: string;
  status: string;
  photo: string;
  }

  const PeriodPage: React.FC = () => {
    const { id } = useParams();
    console.log(id)

    const [data, setData] = useState<PeriodData | null>(null);

    useEffect(() => {
      // Выполняем запрос при монтировании компонента
      fetchData();
    }, []);
  
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8081/period/${id}`);
        if (!response.ok) {
          throw new Error(`Ошибка при выполнении запроса: ${response.statusText}`);
        }
  
        const result = await response.json();
        setData(result);
      } catch (error) {
        setData(testData.periods[parseInt(id || '0', 10)-1])
        console.error('ошибка при выполннении запроса:', error);
      }
    };
    console.log(data?.name);

    return (
        <div>
            <Navbar />
            <div className="container">
            <Breadcrumb>
                    <Breadcrumb.Item href="/WebAppDev_front">Главная</Breadcrumb.Item>
                    <Breadcrumb.Item href="#" active>
                        {data?.name}
                    </Breadcrumb.Item>
                </Breadcrumb>
            <Container className="body_period" style={{marginTop: '10%'}}>
                <Row>
                    <Col xs={12} md={6}>
                        <img src={data?.photo} className="card-img-selected" alt={data?.name}  style={{ borderRadius: '20px' }} />
                    </Col>
                    <Col xs={12} md={6}>
                    <h1 className="text card-name-selected" style={{fontSize: '150%',fontWeight: 'bold' }}>{data?.name}</h1>
                        <p className="text card-description-selected">{data?.description}</p>
                        <div className="bottom-part">
                            <p className="text card-price-selected">{data?.age}</p>
                            {/* <Button variant="primary" style={{ borderColor: '#537459', borderRadius: '10px' ,backgroundColor: '#537459', color: '#d1e2d4' }}>Провести</Button> */}
                        </div>
                    </Col>
                </Row>
            </Container>
            </div>
        </div>
    )
}

export default PeriodPage;
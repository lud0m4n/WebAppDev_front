import React, { useState, useEffect } from 'react';
import Navbar from '../../widgets/Navbar/Navbar';
import Table from 'react-bootstrap/Table';
import CartItem from '../../widgets/CardItem/CartItem';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Loader from '../../widgets/Loader/Loader';
import { RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setNumOfProdInReq } from '../../redux/filterAndActiveRequestID/actions';
import axios from 'axios';

interface CartItem {
  id_fossil: number;
  species: string;
  creation_date: string;
  formation_date: string;
  completion_date: string;
  status: string;
  periods: {
    id_period: number;
    name: string;
    description: string;
    age: string;
    status: string;
    photo: string;
  }[];
}


const ShoppingCartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem>({ id_fossil: 0, species: 'string', creation_date: 'string', formation_date: 'string', completion_date: 'string', status: 'string', periods: [] });
  const [showModal, setShowModal] = useState(false);
  const [species, setSpecies] = useState("");

  const [error, setError] = useState<string | null>(null);
  const numOfCons = useSelector((state: RootState) => state.filterAndActiveId.numOfCons);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/fossil/${localStorage.getItem("ActiveRequestId")}`, {
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
      });
      console.log(response.data)
      setCartItems(response.data);
      console.log(Object.keys(cartItems).length)
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const removeFromCart = async (removedItem: {
    id_period: number;
    name: string;
    description: string;
    age: string;
    status: string;
    photo: string;
}) => {
    try {
      await axios.delete(`/api/period/${removedItem.id_period}/fossil/delete`, {
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
      });
      dispatch(setNumOfProdInReq(numOfCons-1));
      const currentNumOfCons = localStorage.getItem('numOfCons');
      const currentNum = currentNumOfCons ? parseInt(currentNumOfCons, 10) : 0;
      const updatedNumOfCons = currentNum - 1;
      localStorage.setItem('numOfCons', updatedNumOfCons.toString());
      if (updatedNumOfCons != numOfCons) {
          dispatch(setNumOfProdInReq(updatedNumOfCons));
      }
      fetchData();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDeleteCart = async () => {
    try {
      await axios.delete(`/api/fossil/${localStorage.getItem("ActiveRequestId")}/delete`, {
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
      });
      dispatch(setNumOfProdInReq(0));
      const updatedNumOfCons = 0;
      localStorage.setItem('numOfCons', updatedNumOfCons.toString());
      navigate("/WebAppDev_front")
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }

  const handleSend = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleFormRequest = async (species: string) => {

    if (!species) {
      setError('Заполните поля.');
      return;
    }

    try {
      await axios.put(
        `/api/fossil/${localStorage.getItem("ActiveRequestId")}/update`,
        {
          "species": species,
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("accessToken")}`,
          },
        }
      );
      try {
        await axios.put(
          `/api/fossil/${localStorage.getItem("ActiveRequestId")}/status/user`,
          null,
          {
            headers: {
              Authorization: `${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setShowModal(false);
        dispatch(setNumOfProdInReq(0));
        const updatedNumOfCons = 0;
        localStorage.setItem('numOfCons', updatedNumOfCons.toString());
        navigate("/WebAppDev_front")
      } catch (error) {
        setError('Ошибка при отправке формы. Попробуйте позже')
        console.error('Error fetching data:', error);
      }

    } catch (error) {
      setError('Ошибка в вводе данных')
      console.error('Error fetching data:', error);
    }
  }

  const renderAdditionalFields = () => {
    return (
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Формирование заявки</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Добавьте дополнительные поля ввода здесь */}
            <Form.Group className="mb-3" controlId="formAdditionalField1">
              <Form.Label>Название вида ископаемого</Form.Label>
              <Form.Control
                type="text"
                placeholder="Название вида"
                name="species"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
              />
            </Form.Group>
          </Form>
          {error && <div className="error-message">{error}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Закрыть
          </Button>
          <Button variant="primary" onClick={() => handleFormRequest(species)}>
            Отправить
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const renderCart = () => {
    return (
      <>
        <h2>Корзина</h2>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Название</th>
              <th>Действие</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.periods.map((item) => (
              <CartItem key={item.name} item={item} onRemove={() => removeFromCart(item)} />
            ))}
              {/* <CartItem key={cartItems.id_fossil} item={cartItems.species} onRemove={() => removeFromCart(cartItems.id_fossil)} /> */}

          </tbody>
        </Table>
        <Button variant="primary" onClick={handleSend}>
          Отправить
        </Button>
        <Button style={{ marginLeft: '80%' }} variant="danger" onClick={handleDeleteCart}>
          Очистить корзину
        </Button>
        {renderAdditionalFields()}
      </>
    );
  };

  const renderLoading = () => {
    return (
      <>
      <Navbar/>
      <Loader />
      </>
    );
  };



  return (
    <div>
      {Object.keys(cartItems).length > 0 ? <> <Navbar /> <div style={{ 'marginTop': '5%', 'marginLeft': '5%', 'marginRight': '5%' }}>
        {renderCart()}
      </div> </> : <> {renderLoading()} 
      <h2 style={{marginTop: "-20%", marginLeft: "5%"}}>Корзина пуста</h2></>}
    </div>
  );
};

export default ShoppingCartPage;

import React, { useState, useEffect } from 'react';
import Navbar from '../../widgets/Navbar/Navbar';
import Table from 'react-bootstrap/Table';
import CartItem from '../../widgets/CardItem/CartItem';
import { Button, Modal, Form } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from '../../widgets/Loader/Loader';
import { RootState } from '../../redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveFossilID, setSearchNameFilter, setNumOfProdInReq } from '../../redux/filterAndActiveFossilID/actions';
import axios from 'axios';
import { loginSuccess, loginFailure, setRole } from '../../redux/auth/authSlice';

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
  const ActiveFossilId = useSelector((state: RootState) => state.filterAndActiveId.activeFossilID);

  const [error, setError] = useState<string | null>(null);
  const numOfPeriods = useSelector((state: RootState) => state.filterAndActiveId.numOfPeriods);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const checkFossilId = async () => {
    if (window.localStorage.getItem("ActiveFossilId")) {
      const idstr = window.localStorage.getItem("ActiveFossilId");
      const id = idstr ? parseInt(idstr) : 0;
      console.log(id)
      await dispatch(setActiveFossilID(id));
    }
  }
  const fetchDataAndCheckFossilId = async () => {
    await checkFossilId();
    fetchData();
  };
  useEffect(() => {
    console.log('Cart useEffect is triggered');
    const initializePage = async () => {
      await fetchDataAndCheckFossilId();
    };

    initializePage();

    if (window.localStorage.getItem("accessToken")) {
      dispatch(loginSuccess())
    }
    if (window.localStorage.getItem("role")) {
      const role = window.localStorage.getItem("role");
      dispatch(setRole(role))
    }
    const currentNumOfPeriods = localStorage.getItem('numOfPeriods');
    const currentNum = currentNumOfPeriods ? parseInt(currentNumOfPeriods, 10) : 0;
    const updatedNumOfPeriods = currentNum;
    localStorage.setItem('numOfPeriods', updatedNumOfPeriods.toString());
    if (updatedNumOfPeriods != numOfPeriods) {
      dispatch(setNumOfProdInReq(updatedNumOfPeriods));
    }
  }, [ActiveFossilId, numOfPeriods]);

  const fetchData = async () => {
    if (ActiveFossilId != null) {
    try {
      const response = await axios.get(`/api/fossil/${id}`, {
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
      dispatch(setNumOfProdInReq(numOfPeriods-1));
      const currentNumOfPeriods = localStorage.getItem('numOfPeriods');
      const currentNum = currentNumOfPeriods ? parseInt(currentNumOfPeriods, 10) : 0;
      const updatedNumOfPeriods = currentNum - 1;
      localStorage.setItem('numOfPeriods', updatedNumOfPeriods.toString());
      if (updatedNumOfPeriods != numOfPeriods) {
          dispatch(setNumOfProdInReq(updatedNumOfPeriods));
      }
      if (numOfPeriods == 0) {
        navigate('/WebAppDev_front')
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleDeleteCart = async () => {
    try {
      await axios.delete(`/api/fossil/${localStorage.getItem("ActiveFossilId")}/delete`, {
        headers: {
          Authorization: `${localStorage.getItem("accessToken")}`,
        },
      });
      dispatch(setNumOfProdInReq(0));
      const updatedNumOfPeriods = 0;
      localStorage.setItem('numOfPeriods', updatedNumOfPeriods.toString());
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

  const handleFormFossil = async (species: string) => {

    if (!species) {
      setError('Заполните поля.');
      return;
    }

    try {
      await axios.put(
        `/api/fossil/${localStorage.getItem("ActiveFossilId")}/update`,
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
          `/api/fossil/${localStorage.getItem("ActiveFossilId")}/status/user`,
          null,
          {
            headers: {
              Authorization: `${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setShowModal(false);
        dispatch(setNumOfProdInReq(0));
        const updatedNumOfPeriods = 0;
        localStorage.setItem('numOfPeriods', updatedNumOfPeriods.toString());
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
          <Button className = "butt" variant="primary" onClick={() => handleFormFossil(species)}>
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

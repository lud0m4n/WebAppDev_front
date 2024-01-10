import './Navbar.css'
import { ChangeEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import { Navbar as NavB } from 'react-bootstrap';
import { useState } from 'react';

interface NavbarProps {
  onMaxPriceChange?: (value: string) => void; // Define the prop type
}

const Navbar: React.FC<NavbarProps> = ({ onMaxPriceChange }) => {
  const [maxPrice, setMaxPrice] = useState('');

  const handleMaxPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const value = e.target.value;
    setMaxPrice(value);

    // Check if onMaxPriceChange is defined before calling it
    if (onMaxPriceChange !== undefined) {
      onMaxPriceChange(value);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Вызываем onMaxPriceChange при отправке формы
    if (onMaxPriceChange && maxPrice.trim() !== '') {
      onMaxPriceChange(maxPrice);
    }
  };

  return (
    <NavB expand="lg" bg="dark" data-bs-theme="dark" className="bg-body-tertiary">
      <Container fluid style={{ marginLeft: '5%' }}>
        <NavB.Brand href="/WebAppDev_front">Палеонтология</NavB.Brand>
        <NavB.Toggle aria-controls="navbarScroll" />
        <NavB.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="/WebAppDev_front">Главная</Nav.Link>
            <Nav.Link href="#action2">Корзина</Nav.Link>
          </Nav>
          <Form
            className="d-flex"
            id="search"
            onSubmit={handleSearchSubmit} // Добавляем обработчик отправки формы
          >
            <Form.Control
              type="search"
              placeholder="Поиск по названию"
              className="me-2"
              aria-label="Search"
              value={maxPrice}
              onChange={handleMaxPriceChange}
            />
            <Button
              variant="outline-success"
              onClick={(e) => {
                e.preventDefault();
                if (onMaxPriceChange !== undefined) {
                  onMaxPriceChange(maxPrice);
                }
              }}
              className="me-3"
            >
              Искать
            </Button>
          </Form>
        </NavB.Collapse>
      </Container>
    </NavB>
  );
};

export default Navbar;

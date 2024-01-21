import './Navbar.css'
import { ChangeEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import { Navbar as NavB } from 'react-bootstrap';
import { useState } from 'react';

interface NavbarProps {
  onSearchNameChange?: (value: string) => void; // Define the prop type
}

const Navbar: React.FC<NavbarProps> = ({ onSearchNameChange }) => {
  const [searchName, setSearchName] = useState('');

  const handleSearchNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const value = e.target.value;
    setSearchName(value);

    // Check if onSearchNameChange is defined before calling it
    // if (onSearchNameChange !== undefined) {
    //   onSearchNameChange(value);
    // }
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Вызываем onSearchNameChange при отправке формы
    if (onSearchNameChange && searchName.trim() !== '') {
      onSearchNameChange(searchName);
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
              value={searchName}
              onChange={handleSearchNameChange}
              
            />
            <Button
              variant="outline-success"
              onClick={(e) => {
                e.preventDefault();
                if (onSearchNameChange !== undefined) {
                  onSearchNameChange(searchName);
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

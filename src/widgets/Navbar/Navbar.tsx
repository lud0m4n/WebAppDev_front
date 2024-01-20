import './Navbar.css'
import { ChangeEvent } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import { Navbar as NavB } from 'react-bootstrap';
import { useState } from 'react';
import { logout } from '../../redux/auth/authActions';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { loginSuccess, setRole } from '../../redux/auth/authSlice';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const role = useSelector((state: RootState) => state.auth.role);
  const dispatch = useDispatch();
  const searchNameFilter = useSelector((state: RootState) => state.filterAndActiveId.searchNameFilter);


  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      await dispatch(logout());
      window.location.reload();
      if (window.localStorage.getItem("role")) {
        const role = window.localStorage.getItem("role");
        // const role = roleString ? parseInt(roleString) : 0;
        dispatch(setRole(role))
    }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <NavB expand="lg" bg="dark" data-bs-theme="dark" className="bg-body-tertiary">
      <Container fluid style={{ marginLeft: '5%' }}>
        <Link className='navbar-link logo' to="/WebAppDev_front"><NavB.Brand>Палеонтология</NavB.Brand></Link>
        <NavB.Toggle aria-controls="navbarScroll" />
        <NavB.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Link className='navbar-link' to="/WebAppDev_front">Главная</Link>
            {window.localStorage.getItem("accessToken") ? (
              <Link className='navbar-link' to="/WebAppDev_front/fossils">
                Ископаемые
              </Link>
            ) : null}
          {role === "модератор" ? <Link className='navbar-link' to="/WebAppDev_front/main-page/admin">Таблица периодов</Link> : null}
          </Nav>
          <Nav>
            <div className='right-side'>
              {window.localStorage.getItem("accessToken") ? (
                <>
                  {window.localStorage.getItem("name") ? (
                    <div style={{display: 'flex', marginTop: '20%'}}>
                      <p className='navbar-link name'>
                        {localStorage.getItem("name")}
                      </p>
                      <Link className='navbar-link' onClick={handleLogout} to='/WebAppDev_front'>
                        Выйти
                      </Link>
                    </div>
                  ) :
                    <Link className='navbar-link' onClick={handleLogout} to='/WebAppDev_front'>
                      Выйти
                    </Link>
                  }
                </>
              ) : (
                <>
                  <Link className='navbar-link' to="/WebAppDev_front/auth/login">
                    Войти
                  </Link>
                  <Link className='navbar-link register' to="/WebAppDev_front/auth/registration">
                    Зарегистрироваться
                  </Link>
                </>
              )
              }
            </div>
          </Nav>
        </NavB.Collapse>
      </Container>
    </NavB>
  );
};

export default Navbar;

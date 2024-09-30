import { Outlet, useNavigate } from 'react-router-dom';
import Menubar from './Components/Menu-bar/Menubar';
// import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css';
import Header from './Components/Header/Header';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { set_Accesstoken } from './Redux/Action/Action';
import React from 'react';
import { RootState } from './Redux/Reducer';

const App = () => {
  const navigate = useNavigate();
  const accesstoken = useSelector((state: RootState) => state.user.accesstoken);
  const dispatch = useDispatch();

  const validateToken = () => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          dispatch(set_Accesstoken(token));
        }
      } catch (error: any) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    validateToken();
  }, [navigate, dispatch, accesstoken]);

  return (
    <>
      <Header />
      {/* <TransitionGroup component={null}> */}
      {/* <CSSTransition
          key={location.pathname}
          classNames={{
            enter: 'page-enter',
            exit: 'page-exit',
          }}
          timeout={0}
          nodeRef={nodeRef}
        > */}
      <div>
        <Menubar />
        <Outlet />
      </div>
      {/* </CSSTransition>
      </TransitionGroup> */}
    </>
  );
};

export default React.memo(App);

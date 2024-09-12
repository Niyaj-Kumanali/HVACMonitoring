import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Menubar from './Components/Menu-bar/Menubar';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './App.css';
import Header from './Components/Header/Header';
import { useEffect,  useRef } from 'react';
import { useSelector } from 'react-redux';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const accesstoken = useSelector((state: any) => state.user.accesstoken);
  const nodeRef = useRef(null);

  useEffect(() => {
    const validateToken = () => {
      const token = localStorage.getItem('token');

      if (!token || token !== accesstoken) {
        navigate('/login');
      } 
    };

    validateToken();
  }, [navigate, accesstoken]);



  return (
    <>
      <Header />
      <TransitionGroup component={null}>
        <CSSTransition
          key={location.pathname}
          classNames={{
            enter: 'page-enter',
            exit: 'page-exit',
          }}
          timeout={0}
          nodeRef={nodeRef}
        >
          <div>
            <Menubar />
            <Outlet />
          </div>
          
        </CSSTransition>
      </TransitionGroup>
    </>
  );
};

export default App;

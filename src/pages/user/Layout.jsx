import {Outlet} from 'react-router-dom';
import Header from '../../components/Header';
import {useSelector} from 'react-redux';
import Draw from '../../components/Animation/draw';

const Layout = () => {
    // const token = useSelector(state => state.auth.token);
    return (
        <>  
            <Header />
            <Draw isMoveable={false} inter={1000} maxScale={20}/>
            <Outlet />
        </>
    );
}

export default Layout;
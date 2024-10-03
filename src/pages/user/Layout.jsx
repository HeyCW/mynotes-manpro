import {Outlet} from 'react-router-dom';
import Header from '../../components/Header';
import {useSelector} from 'react-redux';

const Layout = () => {
    // const token = useSelector(state => state.auth.token);
    return (
        <>  
            <Header />
            <Outlet />
        </>
    );
}

export default Layout;
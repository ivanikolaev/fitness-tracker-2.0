import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Header from './Header.tsx';
import Sidebar from './Sidebar.tsx';
import Footer from './Footer.tsx';

// Import styles
import '@gravity-ui/uikit/styles/styles.css';
import './Layout.css';

const Layout = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    return (
        <div className="app-container">
            <Header />

            <div className="main-container">
                {isAuthenticated && <Sidebar />}

                <main className="content">
                    <Outlet />
                </main>
            </div>

            <Footer />
        </div>
    );
};

export default Layout;

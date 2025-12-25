import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navigation = () => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left' }}>
            <ul>
                <li>
                    <Link to="/branches">Branches</Link>
                </li>
            </ul>
            <ul>
                <li>
                    <Link to="/admins">Branch Admins</Link>
                </li>
            </ul>
            {/* {<ul>
                <li>
                    <Link to="/materials">Materials</Link>
                </li>
            </ul>
            <ul>
                <li>
                    <Link to="/products">Products</Link>
                </li>
            </ul>} */}
        </nav>
    );
};


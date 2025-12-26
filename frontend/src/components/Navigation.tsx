import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navigation = () => {
    const { isAuthenticated, user, logout, loading } = useAuth();

    if (!isAuthenticated || loading) {
        return null;
    }

    return (
        <nav style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
                {user?.role === 'superadmin' ? (
                    <>
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
                    </>
                ) : (
                    <>
                        <ul>
                            <li>
                                <Link to="/materials">Materials</Link>
                            </li>
                        </ul>
                        <ul>
                            <li>
                                <Link to="/products">Products</Link>
                            </li>
                        </ul>
                    </>
                )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <span style={{ fontSize: '14px' }}>
                    {user?.name} ({user?.role})
                </span>
                <ul>
                    <li>
                        <button onClick={logout}>Logout</button>
                    </li>
                </ul>
            </div>
        </nav>
    );
};


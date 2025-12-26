import { useEffect } from 'react';
import { useLogin } from '../hooks/useLogin'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const login = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();

    const { email, setEmail, password, setPassword, error, loading, handleSubmit } = useLogin();


    useEffect(() => {
        if (isAuthenticated && user) {
            if (user.role === 'superadmin') {
                navigate('/branches', { replace: true });
            } else {
                navigate('/materials', { replace: true });
            }
        }
    }, [isAuthenticated, user, navigate]);


    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Login'}</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    )
}

export default login;
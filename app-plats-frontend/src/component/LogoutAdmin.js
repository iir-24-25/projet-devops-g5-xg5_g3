import { signOut } from 'firebase/auth';
import { adminAuth } from '../firebaseAdmin';
import { useNavigate } from 'react-router-dom';

const LogoutAdmin = () => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(adminAuth);
        navigate('/admin/login');
    };

    return (
        <button onClick={handleLogout}>Déconnexion Admin</button>
    );
};
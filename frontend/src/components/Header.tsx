import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Header.module.css';

export default function Header() {
  const { isAuth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logo}>nawkvar</Link>
      <nav className={styles.actions}>
        {isAuth ? (
          <>
            <Link to="/cabinet" className={styles.link}>Кабинет</Link>
            <Link to="/create" className={styles.btn}>Разместить</Link>
            <button onClick={handleLogout} className={styles.logoutBtn}>Выйти</button>
          </>
        ) : (
          <Link to="/register" className={styles.btn}>Разместить</Link>
        )}
      </nav>
    </header>
  );
}

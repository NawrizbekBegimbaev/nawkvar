import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/auth';
import styles from './AuthPage.module.css';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await login(phone, password);
      setAuth(data.access, data.refresh);
      navigate('/cabinet');
    } catch {
      setError('Неверный телефон или пароль');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Вход</h1>
        <p className={styles.subtitle}>Войдите чтобы управлять объявлениями</p>

        {error && <p className={styles.error}>{error}</p>}

        <label className={styles.label}>Телефон</label>
        <input
          className={styles.input}
          type="tel"
          placeholder="+998"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />

        <label className={styles.label}>Пароль</label>
        <input
          className={styles.input}
          type="password"
          placeholder="Минимум 6 символов"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className={styles.submitBtn} type="submit" disabled={loading}>
          {loading ? 'Входим...' : 'Войти'}
        </button>

        <p className={styles.toggle}>
          Нет аккаунта? <Link to="/register">Регистрация</Link>
        </p>
      </form>
    </div>
  );
}

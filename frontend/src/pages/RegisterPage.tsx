import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register } from '../api/auth';
import styles from './AuthPage.module.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [telegram, setTelegram] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await register(phone, password, name || undefined, telegram || undefined);
      setAuth(data.access, data.refresh);
      navigate('/cabinet');
    } catch {
      setError('Ошибка регистрации. Возможно, номер уже используется.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <form className={styles.card} onSubmit={handleSubmit}>
        <h1 className={styles.title}>Регистрация</h1>
        <p className={styles.subtitle}>Создайте аккаунт чтобы разместить объявление</p>

        {error && <p className={styles.error}>{error}</p>}

        <label className={styles.label}>Имя</label>
        <input
          className={styles.input}
          type="text"
          placeholder="Ваше имя"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

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
          minLength={6}
        />

        <label className={styles.label}>Telegram (необязательно)</label>
        <input
          className={styles.input}
          type="text"
          placeholder="@username"
          value={telegram}
          onChange={(e) => setTelegram(e.target.value)}
        />

        <button className={styles.submitBtn} type="submit" disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>

        <p className={styles.toggle}>
          Уже есть аккаунт? <Link to="/login">Вход</Link>
        </p>
      </form>
    </div>
  );
}

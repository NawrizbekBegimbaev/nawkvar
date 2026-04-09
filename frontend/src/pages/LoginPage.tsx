import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/auth';
import styles from './AuthPage.module.css';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await login('+998' + phone, password);
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
        <div className={styles.phoneRow}>
          <span className={styles.phonePrefix}>+998</span>
          <input
            className={`${styles.input} ${styles.phoneInput}`}
            type="tel"
            placeholder="XX XXX XX XX"
            value={phone.replace(/(\d{2})(\d{0,3})(\d{0,2})(\d{0,2})/, (_m, a, b, c, d) => [a, b, c, d].filter(Boolean).join(' '))}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, '').slice(0, 9);
              setPhone(raw);
            }}
            required
            maxLength={12}
          />
        </div>

        <label className={styles.label}>Пароль</label>
        <div className={styles.passwordRow}>
          <input
            className={`${styles.input} ${styles.passwordInput}`}
            type={showPassword ? 'text' : 'password'}
            placeholder="Минимум 6 символов"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className={styles.eyeBtn}
            onClick={() => setShowPassword(!showPassword)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              {showPassword ? (
                <>
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </>
              ) : (
                <>
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </button>
        </div>

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

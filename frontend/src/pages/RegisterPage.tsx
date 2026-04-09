import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register, sendOtp } from '../api/auth';
import styles from './AuthPage.module.css';

export default function RegisterPage() {
  const [step, setStep] = useState(1);

  // Step 1
  const [telegram, setTelegram] = useState('');
  const [telegramError, setTelegramError] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Step 2
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!telegram.trim()) {
      setError('Укажите Telegram username');
      return;
    }
    setError('');
    setInfo('');
    setLoading(true);
    try {
      await sendOtp(telegram);
      setOtpSent(true);
      setInfo('Код отправлен в Telegram');
    } catch (err: any) {
      const detail = err.response?.data?.detail || 'Ошибка отправки кода';
      const needStart = err.response?.data?.need_start;
      if (needStart) {
        setError('Сначала отправьте /start боту @online_flat_bot, затем нажмите "Отправить код" снова');
      } else {
        setError(detail);
      }
    } finally {
      setLoading(false);
    }
  };

  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  const handleVerifyOtp = (e: FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.length < 6) {
      setError('Введите 6-значный код');
      return;
    }
    setError('');
    setInfo('');
    setVerifying(true);

    setTimeout(() => {
      setVerified(true);
      setTimeout(() => {
        setStep(2);
      }, 1200);
    }, 600);
  };

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await register('+998' + phone, password, name, telegram, otpCode);
      setAuth(data.access, data.refresh);
      navigate('/cabinet');
    } catch (err: any) {
      const detail = err.response?.data?.detail || 'Ошибка регистрации';
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      {step === 1 ? (
        <form className={styles.card} onSubmit={handleVerifyOtp}>
          <h1 className={styles.title}>Регистрация</h1>
          <p className={styles.subtitle}>Подтвердите аккаунт через Telegram</p>

          <div className={styles.steps}>
            <span className={`${styles.stepDot} ${styles.stepActive}`}>1</span>
            <span className={styles.stepLine} />
            <span className={styles.stepDot}>2</span>
          </div>

          {error && <p className={styles.error}>{error}</p>}
          {info && <p className={styles.info}>{info}</p>}

          <label className={styles.label}>Telegram username</label>
          {telegramError && <p className={styles.fieldError}>{telegramError}</p>}
          <div className={styles.otpRow}>
            <input
              className={styles.input}
              type="text"
              placeholder="username"
              value={telegram}
              onChange={(e) => {
                const val = e.target.value;
                if (val.includes('@')) {
                  setTelegramError('Напишите без @ — только username');
                  setTelegram(val.replace(/@/g, ''));
                } else {
                  setTelegramError('');
                  setTelegram(val);
                }
              }}
              required
            />
            <button
              type="button"
              className={styles.otpBtn}
              onClick={(e) => handleSendOtp(e)}
              disabled={loading || !telegram.trim()}
            >
              {otpSent ? 'Повторить' : 'Отправить код'}
            </button>
          </div>

          {otpSent && (
            <>
              <label className={styles.label}>Код из Telegram</label>
              <div className={styles.otpInputRow}>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <input
                    key={i}
                    className={styles.otpDigit}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otpCode[i] || ''}
                    autoFocus={i === 0}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      if (!val) return;
                      const newCode = otpCode.split('');
                      newCode[i] = val[0];
                      setOtpCode(newCode.join(''));
                      const next = e.target.nextElementSibling as HTMLInputElement;
                      if (next && val) next.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otpCode[i]) {
                        const prev = (e.target as HTMLInputElement).previousElementSibling as HTMLInputElement;
                        if (prev) {
                          const newCode = otpCode.split('');
                          newCode[i - 1] = '';
                          setOtpCode(newCode.join(''));
                          prev.focus();
                        }
                      }
                    }}
                    onPaste={(e) => {
                      e.preventDefault();
                      const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
                      setOtpCode(paste);
                    }}
                  />
                ))}
              </div>

              <button
                className={`${styles.submitBtn} ${verifying ? styles.btnShrink : ''} ${verified ? styles.btnSuccess : ''}`}
                type="submit"
                disabled={loading || verifying}
              >
                {verified ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" className={styles.checkmark} />
                  </svg>
                ) : verifying ? (
                  <span className={styles.spinner} />
                ) : (
                  'Далее'
                )}
              </button>
            </>
          )}

          <p className={styles.toggle}>
            Уже есть аккаунт? <Link to="/login">Вход</Link>
          </p>
        </form>
      ) : (
        <form className={styles.card} onSubmit={handleRegister}>
          <h1 className={styles.title}>Заполните данные</h1>
          <p className={styles.subtitle}>Последний шаг — информация о вас</p>

          <div className={styles.steps}>
            <span className={`${styles.stepDot} ${styles.stepDone}`}>&#10003;</span>
            <span className={`${styles.stepLine} ${styles.stepLineDone}`} />
            <span className={`${styles.stepDot} ${styles.stepActive}`}>2</span>
          </div>

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
              minLength={6}
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
            {loading ? 'Подождите...' : 'Зарегистрироваться'}
          </button>

          <button type="button" className={styles.backBtn} onClick={() => {
            setStep(1);
            setOtpCode('');
            setOtpSent(false);
            setTelegram('');
            setTelegramError('');
            setVerifying(false);
            setVerified(false);
            setError('');
            setInfo('');
          }}>
            Назад
          </button>
        </form>
      )}
    </div>
  );
}

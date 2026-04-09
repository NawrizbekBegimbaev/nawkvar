import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMyApartments, deleteApartment, updateApartmentStatus } from '../api/apartments';
import type { Apartment } from '../api/apartments';
import styles from './CabinetPage.module.css';


export default function CabinetPage() {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'ACTIVE' | 'SOLD'>('ACTIVE');
  const [confirmAction, setConfirmAction] = useState<{ type: 'sold' | 'delete'; id: number } | null>(null);

  useEffect(() => {
    if (!isAuth) {
      navigate('/login');
      return;
    }
    loadApartments();
  }, [isAuth, navigate]);

  const loadApartments = () => {
    setLoading(true);
    getMyApartments()
      .then((res) => setApartments(res.data.results))
      .finally(() => setLoading(false));
  };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'sold') {
      await updateApartmentStatus(confirmAction.id, 'SOLD');
    } else {
      await deleteApartment(confirmAction.id);
    }
    setConfirmAction(null);
    loadApartments();
  };

  const formatPrice = (price: string) =>
    Number(price).toLocaleString('ru-RU');

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Мои объявления</h1>
        <Link to="/create" className={styles.addBtn}>+ Добавить объявление</Link>
      </div>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'ACTIVE' ? styles.tabActive : ''}`}
          onClick={() => setTab('ACTIVE')}
        >
          Активные
          <span className={styles.tabCount}>{apartments.filter(a => a.status === 'ACTIVE').length}</span>
        </button>
        <button
          className={`${styles.tab} ${tab === 'SOLD' ? styles.tabActive : ''}`}
          onClick={() => setTab('SOLD')}
        >
          Продано
          <span className={styles.tabCount}>{apartments.filter(a => a.status === 'SOLD').length}</span>
        </button>
      </div>

      {loading ? (
        <p className={styles.empty}>Загрузка...</p>
      ) : apartments.filter(a => a.status === tab).length === 0 ? (
        <div className={styles.emptyState}>
          <p>{tab === 'ACTIVE' ? 'У вас пока нет активных объявлений' : 'Нет проданных объявлений'}</p>
          {tab === 'ACTIVE' && <Link to="/create" className={styles.addBtnFilled}>+ Добавить</Link>}
        </div>
      ) : (
        <div className={styles.cards}>
          {apartments.filter(a => a.status === tab).map((apt) => (
            <div key={apt.id} className={`${styles.card} ${tab === 'SOLD' ? styles.cardSold : ''}`}>
              <div className={styles.cardImage}>
                {apt.images[0] && (
                  <img src={`${apt.images[0].image}`} alt="Квартира" />
                )}
              </div>
              <div className={styles.cardInfo}>
                <div className={styles.cardTop}>
                  <p className={styles.cardPrice}>{formatPrice(apt.price)} сум/мес</p>
                  <span className={`${styles.badge} ${tab === 'SOLD' ? styles.badgeSold : styles.badgeActive}`}>
                    {tab === 'SOLD' ? 'Продано' : 'Активно'}
                  </span>
                </div>
                <p className={styles.cardRooms}>{apt.rooms} комнат(ы)</p>
                <div className={styles.cardActions}>
                  {tab === 'ACTIVE' && (
                    <>
                      <Link to={`/edit/${apt.id}`} className={styles.actionEdit}>Редактировать</Link>
                      <button
                        className={styles.actionSold}
                        onClick={() => setConfirmAction({ type: 'sold', id: apt.id })}
                      >
                        Продано
                      </button>
                    </>
                  )}
                  <button
                    className={styles.actionDelete}
                    onClick={() => setConfirmAction({ type: 'delete', id: apt.id })}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmAction && (
        <div className={styles.overlay} onClick={() => setConfirmAction(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>
              {confirmAction.type === 'sold' ? 'Отметить как продано?' : 'Удалить объявление?'}
            </h3>
            <p className={styles.modalText}>
              {confirmAction.type === 'sold'
                ? 'Объявление исчезнет с карты'
                : 'Это действие нельзя отменить'}
            </p>
            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={() => setConfirmAction(null)}>
                Отмена
              </button>
              <button
                className={confirmAction.type === 'delete' ? styles.deleteBtn : styles.confirmBtn}
                onClick={handleConfirm}
              >
                {confirmAction.type === 'sold' ? 'Да, продано' : 'Удалить'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

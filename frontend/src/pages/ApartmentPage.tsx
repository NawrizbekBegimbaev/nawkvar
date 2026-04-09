import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getApartment } from '../api/apartments';
import type { Apartment } from '../api/apartments';
import ContactModal from '../components/ContactModal';
import styles from './ApartmentPage.module.css';


export default function ApartmentPage() {
  const { id } = useParams<{ id: string }>();
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showContact, setShowContact] = useState(false);

  useEffect(() => {
    if (!id) return;
    getApartment(Number(id))
      .then((res) => setApartment(res.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (!apartment) {
    return <div className={styles.loading}>Квартира не найдена</div>;
  }

  const formatPrice = (price: string) =>
    Number(price).toLocaleString('ru-RU');

  return (
    <div className={styles.page}>
      <div className={styles.breadcrumb}>
        <Link to="/">Главная</Link> &rsaquo; <span>{apartment.rooms}-комн. квартира</span>
      </div>

      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.gallery}>
            {apartment.images.length > 0 ? (
              <img
                className={styles.mainImage}
                src={`${apartment.images[activeImage].image}`}
                alt="Квартира"
              />
            ) : (
              <div className={styles.noImage}>Нет фото</div>
            )}
          </div>
          {apartment.images.length > 1 && (
            <div className={styles.thumbnails}>
              {apartment.images.map((img, i) => (
                <img
                  key={img.id}
                  src={`${img.image}`}
                  alt=""
                  className={`${styles.thumb} ${i === activeImage ? styles.thumbActive : ''}`}
                  onClick={() => setActiveImage(i)}
                />
              ))}
            </div>
          )}

          <div className={styles.descSection}>
            <h3>Описание</h3>
            <p>{apartment.description || 'Без описания'}</p>
          </div>
        </div>

        <div className={styles.right}>
          <div className={styles.priceCard}>
            <p className={styles.price}>{formatPrice(apartment.price)} сум/мес</p>
            <div className={styles.divider} />
            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statValue}>{apartment.rooms}</span>
                <span className={styles.statLabel}>комнат(ы)</span>
              </div>
            </div>
            <div className={styles.divider} />
            <button
              className={styles.contactBtn}
              onClick={() => setShowContact(true)}
            >
              Написать
            </button>
          </div>

          <div className={styles.ownerCard}>
            <span className={styles.ownerLabel}>Владелец</span>
            <span className={styles.ownerPhone}>{apartment.owner_phone}</span>
          </div>
        </div>
      </div>

      {showContact && (
        <ContactModal
          phone={apartment.owner_phone}
          telegram={apartment.owner_telegram}
          onClose={() => setShowContact(false)}
        />
      )}
    </div>
  );
}

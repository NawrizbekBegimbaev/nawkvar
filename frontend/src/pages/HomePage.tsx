import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApartments } from '../api/apartments';
import type { Apartment } from '../api/apartments';
import styles from './HomePage.module.css';


export default function HomePage() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getApartments()
      .then((res) => setApartments(res.data.results))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;

    const initMap = () => {
      const ymaps = (window as any).ymaps;
      ymaps.ready(() => {
        const mapEl = document.getElementById('yandex-map');
        if (!mapEl || mapEl.children.length > 0) return;

        const map = new ymaps.Map('yandex-map', {
          center: [41.2995, 69.2401],
          zoom: 12,
          controls: ['zoomControl'],
        });

        apartments.forEach((apt) => {
          const shortPrice = Number(apt.price) >= 1000000
            ? (Number(apt.price) / 1000000).toFixed(1) + 'M'
            : Number(apt.price) >= 1000
            ? Math.round(Number(apt.price) / 1000) + 'K'
            : String(Number(apt.price));

          const placemark = new ymaps.Placemark(
            [apt.latitude, apt.longitude],
            { iconContent: shortPrice },
            { preset: 'islands#darkGreenStretchyIcon' }
          );
          placemark.events.add('click', function () {
            window.location.href = '/apartment/' + apt.id;
          });
          map.geoObjects.add(placemark);
        });
      });
    };

    if ((window as any).ymaps) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/2.1/?apikey=YOUR_API_KEY&lang=ru_RU';
      script.onload = initMap;
      document.head.appendChild(script);
    }
  }, [loading, apartments]);

  const formatPrice = (price: string) =>
    Number(price).toLocaleString('ru-RU');

  return (
    <div className={styles.page}>
      <div className={styles.mapPanel}>
        <div id="yandex-map" className={styles.map} />
      </div>
      <div className={styles.listPanel}>
        <div className={styles.listHeader}>
          <h2 className={styles.listTitle}>Квартиры</h2>
          {!loading && (
            <span className={styles.count}>{apartments.length} объявлений</span>
          )}
        </div>
        {loading ? (
          <div className={styles.skeletons}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : apartments.length === 0 ? (
          <p className={styles.empty}>Пока нет объявлений</p>
        ) : (
          <div className={styles.cards}>
            {apartments.map((apt) => (
              <Link
                to={`/apartment/${apt.id}`}
                key={apt.id}
                className={styles.card}
              >
                <div className={styles.cardImage}>
                  {apt.images[0] && (
                    <img
                      src={`${apt.images[0].image}`}
                      alt={apt.title}
                    />
                  )}
                </div>
                <div className={styles.cardInfo}>
                  <p className={styles.cardPrice}>
                    {formatPrice(apt.price)} сум/мес
                  </p>
                  <p className={styles.cardRooms}>{apt.rooms} комнат(ы)</p>
                  <p className={styles.cardDesc}>{apt.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

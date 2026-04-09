import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getApartments } from '../api/apartments';
import type { Apartment } from '../api/apartments';
import ContactModal from '../components/ContactModal';
import styles from './HomePage.module.css';


export default function HomePage() {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Apartment | null>(null);
  const [showContact, setShowContact] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    getApartments()
      .then((res) => setApartments(res.data.results))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading) return;

    const initMap = async () => {
      const ymaps3 = (window as any).ymaps3;
      await ymaps3.ready;

      const mapEl = document.getElementById('yandex-map');
      if (!mapEl || mapEl.children.length > 0) return;

      const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker, YMapControls } = ymaps3;
      const { YMapZoomControl, YMapGeolocationControl } = await ymaps3.import('@yandex/ymaps3-controls@0.0.1');

      const map = new YMap(mapEl, {
        location: { center: [69.2401, 41.2995], zoom: 12 },
      });
      (window as any).__nawkvarMap = map;

      map.addChild(new YMapDefaultSchemeLayer({
        customization: [
          { tags: { any: ['poi'] }, stylers: [{ visibility: 'off' }] },
        ],
      }));
      map.addChild(new YMapDefaultFeaturesLayer());
      map.addChild(new YMapControls({ position: 'right' }).addChild(new YMapZoomControl({})));
      map.addChild(new YMapControls({ position: 'top right' }).addChild(new YMapGeolocationControl({})));

      // Pulse animation
      const style = document.createElement('style');
      style.textContent = '@keyframes pulse{0%,100%{transform:scale(1);opacity:1}50%{transform:scale(1.8);opacity:0.3}}';
      document.head.appendChild(style);

      // My location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
          const myEl = document.createElement('div');
          myEl.style.cssText = 'position:relative;width:40px;height:40px;transform:translate(-50%,-50%);';

          const pulseDiv = document.createElement('div');
          pulseDiv.style.cssText = 'position:absolute;inset:0;background:rgba(66,133,244,0.15);border-radius:50%;animation:pulse 2s ease-in-out infinite;';
          myEl.appendChild(pulseDiv);

          const dotDiv = document.createElement('div');
          dotDiv.style.cssText = 'position:absolute;top:8px;left:8px;width:24px;height:24px;background:#4285f4;border:4px solid #fff;border-radius:50%;box-shadow:0 0 10px rgba(66,133,244,0.5);';
          myEl.appendChild(dotDiv);

          map.addChild(new YMapMarker({ coordinates: coords }, myEl));
          map.update({ location: { center: coords, zoom: 14, duration: 500 } });
        });
      }

      // Apartment markers
      apartments.forEach((apt) => {
        const shortPrice = Number(apt.price) >= 1000000
          ? (Number(apt.price) / 1000000).toFixed(1) + 'M'
          : Number(apt.price) >= 1000
          ? Math.round(Number(apt.price) / 1000) + 'K'
          : String(Number(apt.price));

        const el = document.createElement('div');
        el.style.cssText = 'transform:translate(-50%,-100%);cursor:pointer;';

        const badge = document.createElement('div');
        badge.style.cssText = 'background:#0071e3;color:#fff;font:600 12px/1.2 Inter,sans-serif;padding:5px 10px;border-radius:8px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,113,227,0.3);text-align:center;';
        badge.textContent = shortPrice;
        el.appendChild(badge);

        const arrow = document.createElement('div');
        arrow.style.cssText = 'width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;border-top:7px solid #0071e3;margin:0 auto;';
        el.appendChild(arrow);

        el.addEventListener('click', () => {
          setSelected(apt);
          setActiveImage(0);
        });

        map.addChild(new YMapMarker({ coordinates: [apt.longitude, apt.latitude] }, el));
      });
    };

    if ((window as any).ymaps3) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/v3/?apikey=76f1e88b-b85d-490e-af5b-e7ba7af75575&lang=ru_RU';
      script.onload = initMap;
      document.head.appendChild(script);
    }
  }, [loading, apartments]);

  const formatPrice = (price: string) =>
    Number(price).toLocaleString('ru-RU');

  return (
    <div className={styles.page}>
      <div className={styles.mapPanel}>
        <button
          className={styles.myLocationBtn}
          onClick={() => {
            if (!navigator.geolocation) return;
            navigator.geolocation.getCurrentPosition((pos) => {
              const map = (window as any).__nawkvarMap;
              if (map) {
                map.update({ location: { center: [pos.coords.longitude, pos.coords.latitude], zoom: 15, duration: 500 } });
              }
            });
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          </svg>
        </button>
        <div id="yandex-map" className={styles.map} />
      </div>
      <div className={styles.listPanel}>
        {selected ? (
          <div className={styles.detail}>
            <button className={styles.detailBack} onClick={() => setSelected(null)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Назад к списку
            </button>

            <div className={styles.detailGallery}>
              {selected.images.length > 0 ? (
                <img
                  className={styles.detailMainImage}
                  src={selected.images[activeImage]?.image}
                  alt="Квартира"
                />
              ) : (
                <div className={styles.detailNoImage}>Нет фото</div>
              )}
            </div>
            {selected.images.length > 1 && (
              <div className={styles.detailThumbs}>
                {selected.images.map((img, i) => (
                  <img
                    key={img.id}
                    src={img.image}
                    alt=""
                    className={`${styles.detailThumb} ${i === activeImage ? styles.detailThumbActive : ''}`}
                    onClick={() => setActiveImage(i)}
                  />
                ))}
              </div>
            )}

            <p className={styles.detailPrice}>{formatPrice(selected.price)} сум/мес</p>
            <div className={styles.detailStats}>
              <span className={styles.detailStat}>{selected.rooms} комнат(ы)</span>
            </div>
            {selected.description && (
              <p className={styles.detailDesc}>{selected.description}</p>
            )}

            <button
              className={styles.detailContactBtn}
              onClick={() => setShowContact(true)}
            >
              Написать
            </button>

            <Link to={`/apartment/${selected.id}`} className={styles.detailFullLink}>
              Открыть полностью
            </Link>
          </div>
        ) : (
          <>
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
                  <div
                    key={apt.id}
                    className={styles.card}
                    onClick={() => { setSelected(apt); setActiveImage(0); }}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.cardImage}>
                      {apt.images[0] && (
                        <img src={`${apt.images[0].image}`} alt="Квартира" />
                      )}
                    </div>
                    <div className={styles.cardInfo}>
                      <p className={styles.cardPrice}>{formatPrice(apt.price)} сум/мес</p>
                      <p className={styles.cardRooms}>{apt.rooms} комнат(ы)</p>
                      <p className={styles.cardDesc}>{apt.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {showContact && selected && (
        <ContactModal
          phone={selected.owner_phone}
          telegram={selected.owner_telegram}
          onClose={() => setShowContact(false)}
        />
      )}
    </div>
  );
}

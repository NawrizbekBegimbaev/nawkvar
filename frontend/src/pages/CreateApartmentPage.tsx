import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createApartment } from '../api/apartments';
import styles from './ApartmentForm.module.css';

export default function CreateApartmentPage() {
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [rooms, setRooms] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [lat, setLat] = useState(41.2995);
  const [lng, setLng] = useState(69.2401);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuth) navigate('/login');
  }, [isAuth, navigate]);

  useEffect(() => {
    let mapInstance: any = null;

    const initMap = () => {
      const ymaps = (window as any).ymaps;
      ymaps.ready(() => {
        if (mapInstance) return;
        mapInstance = new ymaps.Map('location-map', {
          center: [lat, lng],
          zoom: 14,
          controls: ['zoomControl'],
        });
        const placemark = new ymaps.Placemark([lat, lng], {}, { draggable: true });
        mapInstance.geoObjects.add(placemark);

        placemark.events.add('dragend', () => {
          const coords = placemark.geometry.getCoordinates();
          setLat(coords[0]);
          setLng(coords[1]);
        });

        mapInstance.events.add('click', (e: any) => {
          const coords = e.get('coords');
          placemark.geometry.setCoordinates(coords);
          setLat(coords[0]);
          setLng(coords[1]);
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

    return () => {
      if (mapInstance) {
        mapInstance.destroy();
        mapInstance = null;
      }
    };
  }, []);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setImages((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setPreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      setError('Добавьте хотя бы одно фото');
      return;
    }
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('rooms', rooms);
    formData.append('description', description);
    formData.append('latitude', lat.toString());
    formData.append('longitude', lng.toString());
    images.forEach((img) => formData.append('images', img));

    try {
      await createApartment(formData);
      navigate('/cabinet');
    } catch {
      setError('Ошибка при создании объявления');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Новое объявление</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.photos}>
          {previews.map((src, i) => (
            <div key={i} className={styles.photoItem}>
              <img src={src} alt="" />
              <button type="button" className={styles.photoRemove} onClick={() => removeImage(i)}>
                &times;
              </button>
            </div>
          ))}
          <label className={styles.photoAdd}>
            <span>+</span>
            <input type="file" accept="image/*" multiple onChange={handleImages} hidden />
          </label>
        </div>

        <label className={styles.label}>Название</label>
        <input className={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label className={styles.label}>Цена (сум/мес)</label>
        <input className={styles.input} type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />

        <label className={styles.label}>Комнаты</label>
        <input className={styles.input} type="number" min="1" value={rooms} onChange={(e) => setRooms(e.target.value)} required />

        <label className={styles.label}>Описание</label>
        <textarea className={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} />

        <label className={styles.label}>Расположение</label>
        <div id="location-map" className={styles.locationMap} />
        <p className={styles.hint}>Нажмите на карту или перетащите метку</p>

        <button className={styles.submitBtn} type="submit" disabled={loading}>
          {loading ? 'Публикация...' : 'Опубликовать'}
        </button>
      </form>
    </div>
  );
}

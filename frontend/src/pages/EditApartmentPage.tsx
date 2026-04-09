import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApartment, updateApartment } from '../api/apartments';
import styles from './ApartmentForm.module.css';


export default function EditApartmentPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuth } = useAuth();
  const navigate = useNavigate();
  const [price, setPrice] = useState('');
  const [rooms, setRooms] = useState('');
  const [description, setDescription] = useState('');
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const [lat, setLat] = useState(41.2995);
  const [lng, setLng] = useState(69.2401);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isAuth) { navigate('/login'); return; }
    if (!id) return;
    getApartment(Number(id)).then((res) => {
      const apt = res.data;
      setPrice(apt.price);
      setRooms(String(apt.rooms));
      setDescription(apt.description);
      setLat(apt.latitude);
      setLng(apt.longitude);
      setExistingImages(apt.images.map((img) => `${img.image}`));
      setFetching(false);
    });
  }, [id, isAuth, navigate]);

  useEffect(() => {
    if (fetching) return;
    let map: any = null;

    const initMap = async () => {
      const ymaps3 = (window as any).ymaps3;
      await ymaps3.ready;

      const mapEl = document.getElementById('location-map');
      if (!mapEl || mapEl.children.length > 0) return;

      const { YMap, YMapDefaultSchemeLayer, YMapDefaultFeaturesLayer, YMapMarker, YMapListener, YMapControls } = ymaps3;
      const { YMapZoomControl } = await ymaps3.import('@yandex/ymaps3-controls@0.0.1');

      map = new YMap(mapEl, { location: { center: [lng, lat], zoom: 14 } });
      map.addChild(new YMapDefaultSchemeLayer());
      map.addChild(new YMapDefaultFeaturesLayer());
      map.addChild(new YMapControls({ position: 'right' }).addChild(new YMapZoomControl({})));

      const pinEl = document.createElement('div');
      pinEl.style.cssText = 'width:24px;height:24px;background:#0071e3;border:3px solid #fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);cursor:grab;transform:translate(-50%,-50%);';

      let currentMarker = new YMapMarker({
        coordinates: [lng, lat] as [number, number],
        draggable: true,
        onDragEnd: (coords: [number, number]) => { setLng(coords[0]); setLat(coords[1]); },
      }, pinEl);
      map.addChild(currentMarker);

      map.addChild(new YMapListener({
        onClick: (_: any, e: any) => {
          if (e?.coordinates) {
            setLng(e.coordinates[0]);
            setLat(e.coordinates[1]);
            map.removeChild(currentMarker);
            currentMarker = new YMapMarker({
              coordinates: e.coordinates,
              draggable: true,
              onDragEnd: (coords: [number, number]) => { setLng(coords[0]); setLat(coords[1]); },
            }, pinEl);
            map.addChild(currentMarker);
          }
        },
      }));
    };

    if ((window as any).ymaps3) {
      initMap();
    } else {
      const script = document.createElement('script');
      script.src = 'https://api-maps.yandex.ru/v3/?apikey=76f1e88b-b85d-490e-af5b-e7ba7af75575&lang=ru_RU';
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      if (map) { map.destroy(); map = null; }
    };
  }, [fetching]);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewImages((prev) => [...prev, ...files]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setNewPreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('price', price);
    formData.append('rooms', rooms);
    formData.append('description', description);
    formData.append('latitude', lat.toString());
    formData.append('longitude', lng.toString());
    newImages.forEach((img) => formData.append('new_images', img));

    try {
      await updateApartment(Number(id), formData);
      navigate('/cabinet');
    } catch {
      setError('Ошибка при обновлении');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className={styles.page}><p>Загрузка...</p></div>;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Редактирование</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.photos}>
          {existingImages.map((src, i) => (
            <div key={`existing-${i}`} className={styles.photoItem}>
              <img src={src} alt="" />
            </div>
          ))}
          {newPreviews.map((src, i) => (
            <div key={`new-${i}`} className={styles.photoItem}>
              <img src={src} alt="" />
              <button type="button" className={styles.photoRemove} onClick={() => removeNewImage(i)}>
                &times;
              </button>
            </div>
          ))}
          <label className={styles.photoAdd}>
            <span>+</span>
            <input type="file" accept="image/*" multiple onChange={handleImages} hidden />
          </label>
        </div>

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
          {loading ? 'Сохранение...' : 'Сохранить'}
        </button>
      </form>
    </div>
  );
}

import styles from './ContactModal.module.css';

interface Props {
  phone: string;
  telegram: string;
  onClose: () => void;
}

export default function ContactModal({ phone, telegram, onClose }: Props) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>&times;</button>
        <h3 className={styles.title}>Связаться с владельцем</h3>
        {telegram && (
          <a
            href={`https://t.me/${telegram}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.telegramBtn}
          >
            Telegram
          </a>
        )}
        <a href={`tel:${phone}`} className={styles.callBtn}>
          Позвонить
        </a>
        <p className={styles.phone}>{phone}</p>
      </div>
    </div>
  );
}

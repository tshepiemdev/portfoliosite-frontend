import styles from "../styles/NoticeLbl.module.css";
import NoticeImg from "../assets/icons/triangle-warning-white.svg";

export default function NoticeLbl({ title, text }) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.title}>
        <img className={styles.noticeImg} src={NoticeImg} alt={text} /> {title}
      </p>
      <p className={styles.text}>{text}</p>
    </div>
  );
}

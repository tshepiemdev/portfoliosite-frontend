import styles from "../styles/NoticeLbl.module.css";
import NoticeImg from "../assets/icons/triangle-warning-white.svg";

export default function NoticeLbl({ text }) {
  return (
    <div className={styles.wrapper}>
      <img className={styles.noticeImg} src={NoticeImg} alt={text} />
      <p className={styles.text}>{text}</p>
      
    </div>
  );
}

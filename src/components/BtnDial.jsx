import { Link, useNavigate } from "react-router-dom";
import styles from "../styles/BtnDial.module.css";

export default function BtnDial({ img, linkTo }) {
  return (
    <Link className={styles.dialBtn} to={linkTo}>
      <img className={styles.nextImg} src={img} alt="contact me" />
    </Link>
  );
}

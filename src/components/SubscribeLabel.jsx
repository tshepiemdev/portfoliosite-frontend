import { useState } from "react";
import styles from "../styles/SubscribeLabel.module.css";
import LogoImg from "../assets/icons/logo-white.svg";
import Modal from "./Modal";
import SubscribeLayout from "./SubscribeLayout";
import AnimatedBentoGrid from "./AnimatedBentoGrid";
import arrowUp from "../assets/icons/arrow-up-right.svg";

export default function SubscribeLabel({ marginTop }) {
  const [open, setOpen] = useState(false);
  const [disableClose, setDisableClose] = useState(false);

  return (
    <div className={styles.wrapper} style={{ marginTop: `${marginTop}rem` }}>
      <AnimatedBentoGrid />

      <div className={styles.textsWrapper}>
        <p className={styles.text}>
          <button
            className={styles.btnSubscribe}
            type="button"
            onClick={() => setOpen(true)}
          >
            <span>
              Subscribe
              <img
                className={styles.arrowUpIcon}
                src={arrowUp}
                alt="subscribe"
              />
            </span>
          </button>{" "}
          to receive new blogs,
          <br />
          directly into your inbox.
        </p>
      </div>

      <img className={styles.logo} src={LogoImg} alt="Logo" />

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        title="Subscribe"
        showTopControl={false}
        disableClose={disableClose}
        blur
      >
        <SubscribeLayout
          onSuccess={() => {
            setOpen(false);
            setDisableClose(false);
          }}
          setDisableClose={setDisableClose}
        />
      </Modal>
    </div>
  );
}

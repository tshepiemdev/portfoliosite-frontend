import { useState } from "react";
import styles from "../styles/SubscribeLabel.module.css";
import LogoImg from "../assets/icons/logo-white.svg";
import Modal from "./Modal";
import SubscribeLayout from "./SubscribeLayout";
import AnimatedBentoGrid from "./AnimatedBentoGrid";
import arrowUp from "../assets/icons/arrow-up-right.svg";
import BtnCTAWhiteSmall from "./BtnCTAWhiteSmall";

export default function SubscribeLabel({ heading, marginTop }) {
  const [open, setOpen] = useState(false);
  const [disableClose, setDisableClose] = useState(false);

  return (
    <div className={styles.wrapper} style={{ marginTop: `${marginTop}rem` }}>
      {heading && (
        <div className={styles.headingWrapper}>
          <img className={styles.logo} src={LogoImg} alt="Logo" />
          <h4 className={styles.header}>{heading}</h4>
          <BtnCTAWhiteSmall buttonText={"Read articles"} href={"/blog"} />
        </div>
      )}

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

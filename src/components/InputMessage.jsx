import styles from "./InputMessage.module.css";
import send_img from "../assets/chatbot_send_icon.png";
import { useState } from "react";

export default function InputMessage() {
  return (
    <div className={styles.formAsk}>
      <textarea
        type="text"
        className={styles.formInput}
        placeholder="Escribe tu mensaje aquí..."
        rows="1"
      />
      <button className={styles.sendMsg}>
        <img src={send_img} alt="Enviar mensaje" />
      </button>
    </div>
  );
}

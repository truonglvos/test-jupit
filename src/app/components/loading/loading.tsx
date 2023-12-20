import styles from "@/app/styles/loading.module.scss";

export default function Loading() {
  return (
    <div className={styles["loading-container"]}>
      <div className={styles["lds-roller"]}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

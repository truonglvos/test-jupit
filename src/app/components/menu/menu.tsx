import { useState } from "react";
import { MenuItem } from "../../models/menu.model";
import styles from "@/app/styles/menu.module.scss";

export default function Menu({
  menus,
  active,
  handleSetActive,
}: {
  menus: string[];
  active: string;
  handleSetActive: (id: string) => void;
}) {
  return (
    <ul className={styles["menu"]}>
      {menus.map((item) => (
        <li
          key={item}
          className={`${styles["menu__item"]} ${
            item === active ? styles["menu__active"] : ""
          }`}
          onClick={() => handleSetActive(item)}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

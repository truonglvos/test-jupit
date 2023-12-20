import { GameItem } from "@/app/models/game.model";
import styles from "@/app/styles/game.module.scss";
import { useEffect } from "react";
import Image from "next/image";

export default function Game({
  game,
  jackpot,
}: {
  game: GameItem;
  jackpot: string | undefined;
}) {
  return (
    <div className={styles.game}>
      <div className={styles["game__frame"]}>
        <Image
          src={`https:${game.image}`}
          alt={game.name}
          width={70}
          height={70}
        />
        {jackpot && (
          <>
            <div className={styles["game__jackpot"]}></div>
            <div className={styles["game__jackpot-val"]}>{jackpot}</div>
          </>
        )}
      </div>
    </div>
  );
}

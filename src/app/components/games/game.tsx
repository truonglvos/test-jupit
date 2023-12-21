import { GameItem } from "@/app/models/game.model";
import styles from "@/app/styles/game.module.scss";
import { useEffect } from "react";
import Image from "next/image";

export default function Game({
  game,
  jackpot,
  ribbon,
}: {
  game: GameItem;
  jackpot: string | undefined;
  ribbon: string;
}) {
  const playGame = (name: string) => {
    alert("play game" + " " + name);
  };
  return (
    <div className={styles.game}>
      <div className={`${styles["game__frame"]} game-frame`}>
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
        {ribbon && (
          <div
            className={`${styles["game__ribbon"]} ${styles["game__ribbon-top"]}`}
          >
            <span>{ribbon}</span>
          </div>
        )}
        <div className={`${styles["game__cta"]} cta`}>
          <button
            onClick={() => playGame(game.name)}
          >{`Play ${game.name}`}</button>
        </div>
      </div>
    </div>
  );
}

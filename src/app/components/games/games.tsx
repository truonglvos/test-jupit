import { GameItem } from "@/app/models/game.model";
import Game from "./game";
import styles from "@/app/styles/games.module.scss";
import httpClient from "@/app/services/httpClient";
import { useEffect, useState } from "react";

export default function Games({ games }: { games: GameItem[] }) {
  const [jackpots, setJackpots] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const interval = setInterval(async () => {
      await fetchJackpot();
      // api slow
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  async function fetchJackpot() {
    const euro = Intl.NumberFormat("en-DE", {
      style: "currency",
      currency: "EUR",
    });
    try {
      const jackpots: { game: string; amount: string }[] = await httpClient.get(
        `${process.env.NEXT_PUBLIC_BE}/jackpots`
      );
      console.log(jackpots);
      let jackpotsMap: Map<string, string> = new Map();
      for (let i = 0; i < jackpots.length; i++) {
        jackpotsMap.set(jackpots[i].game, euro.format(+jackpots[i].amount));
      }
      setJackpots(jackpotsMap);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <div className={styles["game-container"]}>
      {games?.length &&
        games.map((game) => (
          <Game key={game.id} game={game} jackpot={jackpots.get(game.id)} />
        ))}
    </div>
  );
}

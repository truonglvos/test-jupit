"use client";

import { useEffect, useState } from "react";
import Menu from "./components/menu/menu";
import Games from "./components/games/games";
import Loading from "./components/loading/loading";
import { games } from "./constants/games.constant";
import { ACTIVE, GAMES_URL } from "./constants/common.constant";
import httpClient from "./services/httpClient";
import { GetStaticProps } from "next";
import { GameItem } from "./models/game.model";

export default function Home() {
  const [active, setActive] = useState<string>("");
  const [menus, setMenus] = useState<string[]>([]);
  const [gamesMap, setGamesMap] = useState<Map<string, GameItem[]>>(new Map());
  const [gamesActive, setGamesActive] = useState<GameItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const active = localStorage.getItem(ACTIVE);
    if (active) {
      setActive(active);
    } else {
      setActive("slots");
      // default value to slots
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (active && gamesMap) {
      setGamesActive(gamesMap.get(active) as GameItem[]);
    }
  }, [active, gamesMap]);

  async function fetchData() {
    try {
      setLoading(true);
      const games: GameItem[] = await httpClient.get(
        `${process.env.NEXT_PUBLIC_BE}/games`
      );
      let menus: string[] = [];
      let gamesMap: Map<string, GameItem[]> = new Map();
      for (let i = 0; i < games.length; i++) {
        const game = games[i];
        const cates = game.categories;
        for (let cate of cates) {
          if (!menus.includes(cate)) {
            menus.push(cate);
          }
          if (gamesMap.has(cate)) {
            gamesMap.get(cate)?.push(game);
          } else {
            gamesMap.set(cate, new Array(game));
          }
        }
      }
      setMenus(menus);
      setGamesMap(gamesMap);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function handleSetActive(id: string): void {
    setActive(id);
    localStorage.setItem(ACTIVE, id);
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <main>
          <Menu
            menus={menus}
            active={active}
            handleSetActive={handleSetActive}
          />
          <Games games={gamesActive} />
        </main>
      )}
    </>
  );
}

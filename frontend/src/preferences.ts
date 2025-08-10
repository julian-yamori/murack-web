// Cookie に保存するアプリ設定

import Cookies from "js-cookie";
import { useCallback, useState } from "react";
import z from "zod";

/**
 * プレイリスト以外での曲のソート方法と、その setter を返す Hook
 *
 * TODO: バックエンドの型に合わせる
 */
export function useGeneralSortType(): [string, (newValue: string) => void] {
  const [value, setValue] = useState<string>(() =>
    // 未設定の場合の初期値はジャンル順
    Cookies.get("general_sort_type") ?? "genre"
  );

  const update = useCallback((newValue: string) => {
    setValue(newValue);
    Cookies.set("general_sort_type", newValue);
  }, []);

  return [value, update];
}

/**
 * プレイリスト以外での曲のソートの、降順フラグと setter を返す Hook
 */
export function useGeneralSortDesc(): [boolean, (newValue: boolean) => void] {
  const [value, setValue] = useState<boolean>(() =>
    Cookies.get("general_sort_desc") === "true"
  );

  const update = useCallback((newValue: boolean) => {
    setValue(newValue);
    Cookies.set("general_sort_desc", newValue.toString());
  }, []);

  return [value, update];
}

/** タグ一覧画面の、閉じられたタググループの ID リスト */
export type ClosedTagGroups = ReadonlySet<number>;

/** ClosedTagGroups の値と、その setter を返す Hook */
export function useClosedTagGroups(): [
  ClosedTagGroups,
  (newValue: ClosedTagGroups) => void,
] {
  const [list, setList] = useState<ClosedTagGroups>(loadClosedTagGroups);

  const update = useCallback((newValue: ClosedTagGroups) => {
    setList(newValue);

    // 配列に変換して Cookie に保存
    const array = [...newValue];
    Cookies.set("closed_tag_groups", JSON.stringify(array));
  }, []);

  return [list, update];
}

function loadClosedTagGroups(): ClosedTagGroups {
  const saved = Cookies.get("closed_tag_groups");
  if (saved !== undefined) {
    // 保存されていた場合、配列の JSON からパース
    const obj = JSON.parse(saved);

    const zodResult = z.array(z.number()).safeParse(obj);
    if (zodResult.success) {
      return new Set(zodResult.data);
    } else {
      // 失敗したらログに出力して、初期値を返す
      console.error(zodResult.error);
    }
  }

  return new Set();
}

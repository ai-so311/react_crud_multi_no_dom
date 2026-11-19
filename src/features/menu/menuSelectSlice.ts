import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import menuSelectJson from "./menuSelect.json";

//state 型定義
//stateは「法規制台帳」画面表示を表す文字列 legalControlLedgerで初期化する
type MENUSELECTDATA = typeof menuSelectJson;
type menuSelect = {
  data: MENUSELECTDATA;
};
const initMenuSelect: menuSelect = {
  data: {
    menuSelect: "legalControlLedger",
  },
};

// 関数定義
//このSliceでは外部からデータを取得しないため非同期関数はなし
const menuSelectSlice = createSlice({
  name: "menuSelect",
  initialState: initMenuSelect,
  reducers: {
    // 法規制管理台帳ボタンmenuLegalControlLedgerが
    // クリックされたらstate(menuSelect)に法規制台帳画面を表すlegalControlLedgerをセットする関数
    menuLegalControlLedger: (state) => {
      state.data.menuSelect = "legalControlLedger";
    },

    // カテゴリーテーブル・メンテボタンmenuCrudCategoryが
    //クリックされたらstate(menuSelect)にカテゴリー・メンテ画面を表す文字列crudCategoryをセットする関数
    menuCrudCategory: (state) => {
      state.data.menuSelect = "crudCategory";
    },

    // 明細テーブル・メンテボタンmenuCrudConrolLedgerが
    //クリックされたらstate(menuState)に明細テーブル・メンテボタンを表す文字列crudControlLedgerをセットする関数
    menuCrudControlLedger: (state) => {
      state.data.menuSelect = "crudControlLedger";
    },
  },
});

//各コンポーネントで関数を使用できるようにexportしておく
//他のファイルからはimportすることで使えるようになる

//アクションのexport Menu.tsxに渡す
//分割代入して｛｝からひとつずつ取り出してそれぞれ名前を付けてexportしている
export const {
  menuLegalControlLedger,
  menuCrudCategory,
  menuCrudControlLedger,
} = menuSelectSlice.actions;

//stateを読み取る関数のexport App.tsxに渡す
//Store全体(RootState)からメニューのデータだけを取り出す関数
export const menuSelectData = (state: RootState) => state.menuSelect.data;

//reducerのexport store.tsに渡してstoreに登録する
//reducerはアクションを受け取ってstateをどう変えるかをまとめたもの
//defaultを付けると、importする側が好きな名前で受け取れる
export default menuSelectSlice.reducer;
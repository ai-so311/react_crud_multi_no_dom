import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";
import menuSelectJson from "./menuSelect.json";

// state 型定義
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
const menuSelectSlice = createSlice({
  name: "menuSelect",
  initialState: initMenuSelect,
  reducers: {
    // 法規制管理台帳ボタン
    menuLegalControlLedger: (state) => {
      state.data.menuSelect = "legalControlLedger";
    },
    // カテゴリーテーブル・メンテボタン
    menuCrudCategory: (state) => {
      state.data.menuSelect = "crudCategory";
    },
    // 明細テーブル・メンテボタン
    menuCrudControlLedger: (state) => {
      state.data.menuSelect = "crudControlLedger";
    },
  },
});

// 各種関数のエクスポート
export const {
  menuLegalControlLedger,
  menuCrudCategory,
  menuCrudControlLedger,
} = menuSelectSlice.actions;

export const menuSelectData = (state: RootState) => state.menuSelect.data;

export default menuSelectSlice.reducer;
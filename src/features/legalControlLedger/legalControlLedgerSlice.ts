import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../../app/store";
import legalcontrolledgerJson from "./legalcontrolledger.json";

//lclStateを管理する
type LCLDATA = typeof legalcontrolledgerJson;
type lclState = {
  data: LCLDATA;
};
const initialState: lclState = {
  data: legalcontrolledgerJson, // JSONの値で初期化
};

//非同期関数の定義
const apiUrl = "http://localhost:3500/lcl/list";
type APIDATALCL = LCLDATA;

export const fetchAsyncGetLclList = createAsyncThunk(
    "lclList/get",
    async () => {
        const { data } = await axios.get<APIDATALCL>(apiUrl);
        return { data: data };
    }
);


//Sliceの定義
const lclSlice = createSlice({
    name: "legalControlLedger",
    initialState,
    reducers: {},
extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetLclList.fulfilled, (state, action) => {
        state.data = action.payload.data;
    });
},
});

//export記載
// 1) stateの中のdataを、コンポーネントがuseSelectorで使えるようにする
export const lclList = (state: RootState) => state.lclState.data;

// 2) Sliceのreducerをstoreに登録できるようにする
export default lclSlice.reducer;
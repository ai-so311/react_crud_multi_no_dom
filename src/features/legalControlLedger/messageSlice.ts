import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";

import responseJson from "./response.json";

import insertCategoryJson from "./insertCategory.json";

import deleteCategoryJson from "./deleteCategory.json";

import editCategoryJson from "./editCategory.json";

import insertControlLedgerJson from "./insertControlLedger.json";

import deleteControlLedgerJson from "./deleteControlLedger.json";

import editControlLedgerJson from "./editControlLedger.json";

//リクエスト先URLを文字列型変数に格納
const apiInsertCategoryUrl = "http://localhost:3500/lcl/insertLegalCategory/";

const apiDeleteCategoryUrl = "http://localhost:3500/lcl/deleteLegalCategory/";

const apiEditCategoryUrl = "http://localhost:3500/lcl/editLegalCategory/";

const apiInsertControlLedgerUrl = "http://localhost:3500/lcl/insertLegalControlLedger/";

const apiDeleteControlLedgerUrl = "http://localhost:3500/lcl/deleteLegalControlLedger/";

const apiEditControlLedgerUrl = "http://localhost:3500/lcl/editLegalControlLedger/";


//JSON型推論で型定義
type RESPONSEDATA = typeof responseJson;
// JSON型推論で型定義
type INSERTDATACATEGORY = typeof insertCategoryJson;
//削除用非同期関数:deleteAsyncCategoryの作成
type DELETEDATACATEGORY = typeof deleteCategoryJson;
type EDITDATACATEGORY = typeof editCategoryJson;

type INSERTDATACONTROLLEDGER = typeof insertControlLedgerJson;

type DELETEDATACONTROLLEDGER = typeof deleteControlLedgerJson;

type EDITDATACONTROLLEDGER = typeof editControlLedgerJson;


//stateの型を、APIサーバーからのレスポンスのJSONファイルresponse.jsonを使って定義する
type messageText = {
    //stateに格納する処理結果メッセージの名称をdataとする
    data: RESPONSEDATA;
};

//initialStateを定義
const initMessageText: messageText = {
    data: {
        messageText: "",
    },
};


//追加用非同期関数　引数はinsertData insertCategory.jsonをもとに型定義
export const insertAsyncCategory = createAsyncThunk(
  "category/insert",
  async (insertData: INSERTDATACATEGORY) => {
    const { data } = await axios.post<RESPONSEDATA>(
      `${apiInsertCategoryUrl}`,
      insertData
    );
    return { data: data };
  }
);

//削除用非同期関数 引数はdeleteData deleteCategory.jsonをもとに定義
export const deleteAsyncCategory = createAsyncThunk(
    "category/delete",
    async (deleteData: DELETEDATACATEGORY) => {
        const { data } = await axios.post<RESPONSEDATA>(
            `${apiDeleteCategoryUrl}`,
            deleteData
        );
        return { data: data };
    }
)

//変更用非同期関数 引数はeditData editCategory.jsonをもとに定義
export const editAsyncCategory = createAsyncThunk(
    "category/edit",
    async(editData: EDITDATACATEGORY) => {
        const { data } = await axios.post<RESPONSEDATA>(
        `${apiEditCategoryUrl}`,
        editData
        );
        return { data: data};
    }
)


//追加用非同期関数 insertControlLedger.jsonをもとに型定義
export const insertAsyncControlLedger = createAsyncThunk(
    "controlLedger/insert",
    async (insertData:INSERTDATACONTROLLEDGER) => {
      const { data } = await axios.post<RESPONSEDATA>(
        `${apiInsertControlLedgerUrl}`,
        insertData
      ); 
      //おそらくaxios.getではdataと呼ばれる返却値以外のものも返却してくるが、そのうちのdataと呼ばれる部分だけもらっている stateのdataとは関係ないと思われる
      return { data: data };
    }
  );
  
  export const deleteAsyncControlLedger = createAsyncThunk(
    "controlLedger/delete",
    async (deleteData:DELETEDATACONTROLLEDGER) => {
      const { data } = await axios.post<RESPONSEDATA>(
        `${apiDeleteControlLedgerUrl}`,
        deleteData
      );
      //おそらくaxios.getではdataと呼ばれる返却値以外のものも返却してくるが、そのうちのdataと呼ばれる部分だけもらっている stateのdataとは関係ないと思われる
      return { data: data };
    }
  );
  
  export const editAsyncControlLedger = createAsyncThunk(
    "controlLedger/edit",
    async (editData:EDITDATACONTROLLEDGER) => {
      const { data } = await axios.post<RESPONSEDATA>(
        `${apiEditControlLedgerUrl}`,
        editData
      );
      //おそらくaxios.getではdataと呼ばれる返却値以外のものも返却してくるが、そのうちのdataと呼ばれる部分だけもらっている stateのdataとは関係ないと思われる
      return { data: data };
    }
  );


//処理結果メッセージ用のmessageSliceをcreateSliceメソッドを用いて定義する
const messageSlice = createSlice({
  name: "message",
  initialState: initMessageText,
  reducers: {
    messageClear: (state) => {
        state.data.messageText = "";
   },
  },
  extraReducers: (builder) => {
    //追加用非同期関数（insertAsyncCategory）がfulfilledだったときの処理
    //extraReducersで複数の処理を記載しているのでaddCaseを使用
    //state「message」内の「data」を、非同期関数を使ってAPIから受け取った処理結果のメッセージを
    //action.payload.dataに入れ替える
    builder.addCase(insertAsyncCategory.fulfilled, (state, action) => {
      return {
        ...state,
        data: action.payload.data,
      };
    });
    //削除用非同期関数（deleteAsyncCategory）がfulfilledだったときの処理
    builder.addCase(deleteAsyncCategory.fulfilled, (state, action) => {
      return {
        ...state,
        data: action.payload.data,
      };
    });
    builder.addCase(editAsyncCategory.fulfilled, (state, action) => {
      return {
        ...state, data: action.payload.data,
      };
    });
    builder.addCase(insertAsyncControlLedger.fulfilled, (state, action) => {
      return {
        ...state, data: action.payload.data,
      };
    });
    builder.addCase(deleteAsyncControlLedger.fulfilled, (state, action) => {
      return {
        ...state, data: action.payload.data
      };
    });
    builder.addCase(editAsyncControlLedger.fulfilled, (state, action) => {
      return {
        ...state, data: action.payload.data
      };
    });
  },
});

//export記述 各コンポーネントで利用するためにSliceの最後にexport
export const { messageClear } = messageSlice.actions;

//stateの中のデータを、コンポーネントがuseSelectorに使えるようにする
export const messageData = (state: RootState) => state.message.data;

//Sliceのreducerをstoreに登録できるようにする
export default messageSlice.reducer;






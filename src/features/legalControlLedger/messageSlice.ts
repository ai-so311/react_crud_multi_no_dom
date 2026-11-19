import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
//JSONファイルをインポート
import responseJson from "./response.json";
import insertCategoryJson from "./insertCategory.json";
import deleteCategoryJson from "./deleteCategory.json";
import editCategoryJson from "./editCategory.json";




//JSON型推論で型定義
type RESPONSEDATA = typeof responseJson;

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


//追加用非同期関数:insertAsyncCategoryの作成
//リクエスト先URLを文字列型変数に格納
const apiInsertCategoryUrl = "http://localhost:3500/lcl/insertLegalCategory/";

// JSON型推論で型定義
type INSERTDATACATEGORY = typeof insertCategoryJson;

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

//削除用非同期関数:deleteAsyncCategoryの作成
const apiDeleteCategoryUrl = "http://localhost:3500/lcl/deleteLegalCategory/";

type DELETEDATACATEGORY = typeof deleteCategoryJson;

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

//変更用非同期関数:editAsyncCategoryの作成
const apiEditAsyncCategoryUrl = "http://localhost:3500/lcl/editLegalCategory";

type EDITDATACATEGORY = typeof editCategoryJson;

//変更用非同期関数 引数はeditData editCategory.jsonをもとに定義
export const editAsyncCategory = createAsyncThunk(
    "category/edit",
    async(editData: EDITDATACATEGORY) => {
        const { data } = await axios.post<RESPONSEDATA>(
        `${apiEditAsyncCategoryUrl}`,
        editData
        );
        return { data: data};
    }
)

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
  },
});

//export記述 各コンポーネントで利用するためにSliceの最後にexport
export const { messageClear } = messageSlice.actions;

//stateの中のデータを、コンポーネントがuseSelectorに使えるようにする
export const messageTextData = (state: RootState) => state.message.data;

//Sliceのreducerをstoreに登録できるようにする
export default messageSlice.reducer;






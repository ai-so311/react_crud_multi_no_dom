import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import crudCategoryJson from "./crudCategory.json";
import { RootState } from "../../app/store";

// ---- 1.1 state 定義 ----
type APIDATACATEGORY = typeof crudCategoryJson;

type crudCategory = {
  data: APIDATACATEGORY;
};

const initialStateCategory: crudCategory = {
    data: {
      //タイトル用の文字
      pageTitle: "legalcategory",
      //一覧表示と追加モーダルのカラム情報
      columnTitles: [
    { Field: "id", //カラムタイトル
      value: "" //追加モーダルでの入力値の格納
    },
    { Field: "categoryname",
      value: ""
    },
    {
        Field: "sortorder",
        value: ""
    },
    {
        Field: "color",
        value: ""
    }
  ],
  //変更モーダルのカラム情報(idがない)
  columnTitlesModal: [
    {
        Field: "categoryname", //カラムタイトル
        value: "" //変更モーダルでの入力値の格納
    },
    {
        Field: "sortorder",
        value: ""
    },
    {
        Field: "color",
        value: ""
    }
  ],
  //変更モーダルのidカラム用情報
  columnTitleId: {
        Field: "id", //カラムタイトル
        value: "" //変更対象idを格納
  },
  //カテゴリーテーブルの各レコードのデータ
  details: [
    {
        id: 1, 
        categoryname: "法律・条例等",
        sortorder: 1,
        color: "#e83e8c",
        checkbox: false
    },
    {
        id: 1,
        categoryname: "",
        sortorder: 1,
        color: "",
        checkbox: false
    }
  ],
        specifiedPage: 1, //現在のページ番号
        allCount: 3, //カテゴリーテーブルの全レコード数
        displayCount: 3, //現在のページの対象レコード数
    
    //現在ページであるか否かを示す pageNationは全ページ分用意される
        pageNation: [
    {
        active: true, //trueは現在ページである
        page: 1 //ページ番号
    }
  ],
  //現在のページの前ページの有無を示す
  pagePrev: [
    {
        prev: false, //trueは前ページあり
        page: 1 //前ページのページ番号 ないときは現在のページ番号
    }
  ],
  //現在のページの次ページの有無を示す
  pageNext: [
    {
        next: false, //trueは前ページあり
        page: 1 //次ページのページ番号 ないときは現在のページ番号
    }
    ]
        },
            };



//非同期関数の定義
const apiCategoryUrl = "http://localhost:3500/lcl/crudLegalCategory/";

export const fetchAsyncGetCategory = createAsyncThunk(
  "category/get",
  async (selectPage: number) => {
    const { data } = await axios.get<APIDATACATEGORY>(
      `${apiCategoryUrl}?page=${selectPage}`
    );
    return { data: data };
  }
);

//Slice定義 ----
const crudCategorySlice = createSlice({
  name: "crudCategory",
  initialState: initialStateCategory,
  reducers: {

    //内部関数(Action) stateに入れ替えるための内部関数
    //各行のチェックボックスが押された際、チェックボックスに対応するstateを変化させる関数
    changeCategoryCheckbox: (state, action: { payload: string | undefined }) => {
      // ① 空の差し替え用配列(型を自分で定義)
      const newDetails: {
        id: number;
        categoryname: string;
        sortorder: number;
        color: string;
        checkbox: boolean;
      }[] = [];

      //stateのdataのdetailsプロパティの中身をforEachし、
      state.data.details.forEach((detail) => {
        //各要素（オブジェクト）のid項目と引数のidが同じならば
        if (action.payload === detail.id.toString()) {
          //checkboxの値を反転したものを
          const newRecord = {
            id: detail.id,
            categoryname: detail.categoryname,
            sortorder: detail.sortorder,
            color: detail.color,
            checkbox: !detail.checkbox,
          };
          //差し替え用の配列にpushする
          newDetails.push(newRecord);
        //残りのそれ以外の項目は
        } else {
          //同じ値のオブジェクトを作成
          const newRecord = {
            id: detail.id,
            categoryname: detail.categoryname,
            sortorder: detail.sortorder,
            color: detail.color,
            checkbox: detail.checkbox,
          };
          //差し替え用の配列にpushする
          newDetails.push(newRecord);
        }
      });

      //forEachし終わったら、stateのdataのdetailsをできあがった差し替え用配列で入れ替える
      state.data.details = [...newDetails];
    },

  //一覧表示で表のタイトル部の全件チェック用チェックボックスがoffからonに変更されたときに実行させる関数
  //すべてのcheckboxをtrueにする
  setAllChecked: (state) => {
    //空の差し替え用配列
    const newDetails: {
      id: number;
      categoryname: string;
      sortorder: number;
      color: string;
      checkbox: boolean;
    }[] = [];

    //stateのdataのdetailsプロパティの中身をforEachし、
    state.data.details.forEach((detail) => {
      //すべてのカテゴリのcheckboxをtrueにする
      const newRecord = {
        id: detail.id,
        categoryname: detail.categoryname,
        sortorder: detail.sortorder,
        color: detail.color,
        checkbox: true,
      };
      newDetails.push(newRecord);
      });

      // ③ forEach が終わったら details を差し替える
      state.data.details = [...newDetails];
    },

    //一覧表示で表のタイトル部の全件チェックボックスがonからoffに変更されたときに実行させる関数
    //すべてのcheckboxををfalseにする
    setAllUnChecked: (state) => {
      //空の差し替え配列を用意
      const newDetails: {
        id: number,
        categoryname: string, 
        sortorder: number;
        color: string;
        checkbox: boolean;
      }[] = [];

      //stateのdetaのdetailsプロパティの中身をforEachし、
      state.data.details.forEach((detail) => {
        //すべてのcheckboxをfalseにする
        const newRecord = {
          id: detail.id,
          categoryname: detail.categoryname,
          sortorder: detail.sortorder,
          color: detail.color,
          checkbox: false,
        };
        newDetails.push(newRecord);
      })
      state.data.details = [...newDetails];
    },

    //追加モーダルの中の入力値をクリアする関数
        //追加モーダルの中の入力値をクリアする関数
    clearInsertModal: (state) => {
      //空の差し替え配列を用意
      const newColumnTitles: {
        Field: string;
        value: string;
      }[] = [];

      //columnTitlesをforEachで回し、valueを空にしたオブジェクトをpushする
      state.data.columnTitles.forEach((columnTitle) => {
        const newRecord = {
          Field: columnTitle.Field, //valueの値が、どの項目を表しているのか
          value: "", //どのような値をモーダルに表示し、追加（変更するのか）
        };
        newColumnTitles.push(newRecord);
      });

      //forEachが終わったらcolumnTitlesを差し替える
      state.data.columnTitles = [...newColumnTitles];
    },
    
   


    //追加モーダルの入力値が変化した際に実行し、入力値をstateに反映する関数
    changeInsertModal: (state,action: {payload: {Field: string; value: string}}) => {
      //空の差し替え用配列
      const newColumnTitles: {
        Field: string;
        value: string;
      }[] = [];

      //columnTitlesをforEachで回す
      state.data.columnTitles.forEach((columnTitle) => {
        //更新対象の項目が同じ（=更新対象の項目）であれば
        if(action.payload.Field == columnTitle.Field){
          //オブジェクトを作成 入力された項目 → valueを引数の値で上書き
          const newRecord = {
            Field: columnTitle.Field, 
            value: action.payload.value,
          };
          newColumnTitles.push(newRecord);
        }else{ //更新対象の項目が同じでないときはそのまんま
          const newRecord = {
            Field: columnTitle.Field,
            value: columnTitle.value,
          };
          newColumnTitles.push(newRecord);
        }
      });

      //forEachし終わったら、stateのdataのcolumnTitlesをできあがった差し替え用配列で入れ替える
      state.data.columnTitles = [...newColumnTitles];
    },

 // 変更モーダルの入力値をstateに反映するAction
    changeEditModal: (
      state,
      action: { payload: { Field: string; value: string } }
    ) => {
      const newColumnTitlesModal: {
        Field: string;
        value: string;
      }[] = [];

      state.data.columnTitlesModal.forEach((columnTitleModal) => {
        if (action.payload.Field === columnTitleModal.Field) {
          const newRecord = {
            Field: columnTitleModal.Field,
            value: action.payload.value,
          };
          newColumnTitlesModal.push(newRecord);
        } else {
          const newRecord = {
            Field: columnTitleModal.Field,
            value: columnTitleModal.value,
          };
          newColumnTitlesModal.push(newRecord);
        }
      });

      state.data.columnTitlesModal = [...newColumnTitlesModal];
    },
    //変更モーダルを開いた際に、該当カテゴリーの現在値をモーダルに設定するAction
    setEditModal: (state, action: { payload: number }) => {
      // details を forEach で回す
      state.data.details.forEach((detail) => {
        // idが引数と同じ場合のみ処理(elseは書かない)
        if (action.payload === detail.id) {
          // 差し替え用配列を作成
          const newColumnTitlesModal = [
            {
              Field: "categoryname",
              value: detail.categoryname,
            },
            {
              Field: "sortorder",
              // number型をstring型にキャストする
              value: String(detail.sortorder),
            },
            {
              Field: "color",
              value: detail.color,
            },
          ];

          // columnTitleId にセットするオブジェクト
          state.data.columnTitleId = {
            Field: "id",
            value: String(detail.id),
          };

          // columnTitlesModal を差し替え用配列で入れ替える
          state.data.columnTitlesModal = [...newColumnTitlesModal];
        }
      });
    },
},

  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetCategory.fulfilled, (state, action) => {
      return {
        ...state,
        //action.payloadで呼び出すときに引数を利用することができる
        data: action.payload.data,
      };
    });
  },
});

// 1) reducers に定義した関数をコンポーネントで useDispatch に使えるようにする
export const {
  changeCategoryCheckbox,
  setAllChecked,
  setAllUnChecked,
  clearInsertModal,
  changeInsertModal,
  changeEditModal,
  setEditModal,
} = crudCategorySlice.actions;

// 2) state の中の data を、コンポーネントが useSelector に使えるようにする
export const crudCategoryData = (state: RootState) => state.crudCategory.data;

// 3) Slice の reducer を store に登録できるようにする
export default crudCategorySlice.reducer;
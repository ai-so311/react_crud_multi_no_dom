import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";

import crudCategoryJson from "./crudCategory.json";

//データを取得するAPI
const apiCategoryUrl ="https://localhost:3500/lcl/crudLegalCategory/"

type APIDACATEGORY = {
    data: APIDATACATEGORY;
};

const initialStateCategory: crudCategory = {
    data: {
        pageTitle: "legalcategory",
        columnTitles: [
    {
        Field: "id",
        value: ""
    },
    {
        Field: "categoryname",
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
  columnTitlesModal: [
    {
        Field: "categoryname",
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
        columnTitleId: {
        Field: "id",
        value: ""
  },
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
        specifiedPage: 1,
        allCount: 3,
        displayCount: 3,
        pageNation: [
    {
        active: true,
        page: 1
    }
  ],
  pagePrev: [
    {
        prev: false,
        page: 1
    }
  ],
  pageNext: [
    {
        next: false,
        page: 1
    }
    ]
        },
            };

  export const fetchAsyncGetCategory = createAsyncThunk(
    "category/get",
    async (selectPage:number) => {
      const { data } = await axios.get<APIDATACATEGORY>(`${apiCategoryUrl}?page=${selectPage}`); //axios.getではdataと呼ばれる返却値以外のものも返却してくるが、そのうちのdataと呼ばれる部分だけもらっている stateのdataにaxios.getで得たdataをはめる
      return { data: data };
    }
  );

  const crudCategorySlice = createSlice({
    name: "crudCategory",
    initialState: initialStateCategory,
    //Stateに対して許可する更新処理を定義する
    reducers: {
      // 第一引数は現在（更新前）のState
      // 第二引数は渡されたaction(コンポーネントで実行する際の引数)
      // action.payloadプロパティに、渡された引数が入っている
      // この関数は新しい状態を返却する
      // 各行のチェックボックスが変更された際のAction
      changeCategoryCheckbox: (state, action:{payload:string}) => {
        const newDetails: { id: number; categoryname: string; sortorder: number; color: string; checkbox: boolean; }[] = [];
        state.data.details.forEach((detail) => {
          if ((action.payload === detail.id.toString())) {
            const newRecord = {
              id: detail.id,
              categoryname: detail.categoryname,
              sortorder: detail.sortorder,
              color: detail.color,
              checkbox: !detail.checkbox,
            }
            newDetails.push(newRecord);
          }else{
            const newRecord = {
              id: detail.id,
              categoryname: detail.categoryname,
              sortorder: detail.sortorder,
              color: detail.color,
              checkbox: detail.checkbox,
            }
            newDetails.push(newRecord);
          }
          state.data.details = [...newDetails];
        });
      },
      // 全件チェック用チェックボックスがチェックされた際のAction
      setAllChecked: (state) => {
        const newDetails: { id: number; categoryname: string; sortorder: number ; color: string; checkbox: boolean; }[] = [];
        state.data.details.forEach((detail) => {
            const newRecord = {
              id: detail.id,
              categoryname: detail.categoryname,
              sortorder: detail.sortorder,
              color: detail.color,
              checkbox: true,
            }
            newDetails.push(newRecord);        
        });
        state.data.details = [...newDetails];
      },
      // 全件チェック用チェックボックスのチェックがはずされた際のAction
      setAllUnchecked: (state) => {
        const newDetails: { id: number; categoryname: string; sortorder: number ; color: string; checkbox: boolean; }[] = [];
        state.data.details.forEach((detail) => {
            const newRecord = {
              id: detail.id,
              categoryname: detail.categoryname,
              sortorder: detail.sortorder,
              color: detail.color,
              checkbox: false,
            }
            newDetails.push(newRecord);        
        });
        state.data.details = [...newDetails];
      },
      // 追加用のモーダルの入力値をクリアするAction
      clearInsertModal: (state) => {
        const newColumnTitles: { Field: string; value: string; }[] = [];
        state.data.columnTitles.forEach((columnTitle) => {
            const newRecord = {
              Field: columnTitle.Field,
              value: ""
            }
            newColumnTitles.push(newRecord);        
        });
        state.data.columnTitles = [...newColumnTitles];
      },
      // 追加用のモーダルの入力値をStateに反映させるためのAction
      changeInsertModal: (state,action:{payload:React.ChangeEvent<HTMLInputElement>}) => {
        const newColumnTitles: { Field: string; value: any; }[] = [];
        state.data.columnTitles.forEach((columnTitle) => {
          if(action.payload.target.name === columnTitle.Field){
              const newRecord = {
                Field: columnTitle.Field,
                value: action.payload.target.value
              } ;
              newColumnTitles.push(newRecord);
            }else{
              const newRecord = {
                Field: columnTitle.Field,
                value: columnTitle.value
              } ;
              newColumnTitles.push(newRecord);
            }
        });
        state.data.columnTitles = [...newColumnTitles];
      },
      // 変更用のモーダルの入力値をStateに反映させるためのAction
      changeEditModal: (state,action:{payload:React.ChangeEvent<HTMLInputElement>}) => {
        const newColumnTitlesModal: { Field: string; value: any; }[] = [];
        state.data.columnTitlesModal.forEach((columnTitleModal) => {
          if(action.payload.target.name === columnTitleModal.Field){
              const newRecord = {
                Field: columnTitleModal.Field,
                value: action.payload.target.value
              } ;
              newColumnTitlesModal.push(newRecord);
            }else{
              const newRecord = {
                Field: columnTitleModal.Field,
                value: columnTitleModal.value
              } ;
              newColumnTitlesModal.push(newRecord);
            }
        });
        state.data.columnTitlesModal = [...newColumnTitlesModal];
      },
      // 変更用モーダルを開いた際に該当カテゴリーの現在値をモーダルに表示するAction
      setEditModal: (state,action:{payload:number}) => {
        state.data.details.forEach((detail) => {
          // alert(action.payload.currentTarget.dataset.id);
          if(action.payload === detail.id){
              const newColumnTitlesModal = [
                {
                  Field: "categoryname",
                  value: detail.categoryname
                } ,
                {
                  Field: "sortorder",
                  value: String(detail.sortorder)
                } ,
                {
                  Field: "color",
                  value: detail.color
                } ,
            ];
              state.data.columnTitleId = {Field:"id",value:String(detail.id)};
              state.data.columnTitlesModal = [...newColumnTitlesModal];
            }
        });
      },
    },
    // 必要に応じて追加のReducerを指定
    // Reducer以外に定義した関数の後処理(stateへの反映)の設定、エクスポートは関数定義の際行っている
    extraReducers: (builder) => {
      builder.addCase(fetchAsyncGetCategory.fulfilled, (state, action) => {
        console.log(action.payload.data);
        return {
          //stateのdata属性に格納している　initialstateしたものがstate
          ...state,                  //現在のstateをいったん展開し、
          data: action.payload.data, // stateのdataをAPIから取得したdataに置きかえている action.payloadにはfetchAsyncGetCategoryで取得した返却値が格納されている
        };
      });
    },
  });

export const { changeCategoryCheckbox ,setAllChecked,setAllUnchecked,clearInsertModal,changeInsertModal,changeEditModal,setEditModal} = crudCategorySlice.actions;

export const crudCategoryData = (state: RootState) => state.crudCategory.data; //crudCategoryDataという名前で、コンポーネントにstateの中のdataをuseSelectorさせる。storeでconfigureStoreしているreducerにcrudCategoryが登録されている必要がある(storeに登録されているので、このSliceのstate名はcrudCategoryとなる、Sliceの名前と合わせておくとわかりやすい)


export default crudCategorySlice.reducer; //sliceのreducerをエクスポート
// stateの定義


//非同期関数の定義
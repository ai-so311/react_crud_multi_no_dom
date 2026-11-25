//APIサーバーから明細テーブルのデータを取得して利用するためのSlice
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import crudControlLedgerJson from "./crudControlLedger.json";
import { RootState } from "../../app/store";

//非同期関数の定義　APIを使って明細テーブルのデータを取得する非同期関数を定義
const apiControlLedgerUrl ="http://localhost:3500/lcl/crudLegalControlLedger/";

//state定義
type APIDATACONTROLLEDGER = typeof crudControlLedgerJson;

type crudControlLedger = {
    data: APIDATACONTROLLEDGER;
};

const initialStateControlLedger: crudControlLedger = {
data:{
  pageTitle: 'legalcontrolledger',
  columnTitles: [{
    date: false,
    category: false,
    valid: false,
    Field: 'id',
    value: ''
  }, {
    date: false,
    category: false,
    valid: false,
    Field: 'title',
    value: ''
  }, {
    date: false,
    category: false,
    valid: false,
    Field: 'url',
    value: ''
  }, {
    date: true,
    category: false,
    valid: false,
    Field: 'effectivedate',
    value: ''
  }, {
    date: false,
    category: true,
    valid: false,
    Field: 'category',
    value: '1'
  }, {
    date: false,
    category: false,
    valid: true,
    Field: 'valid',
    value: '1'
  }, {
    date: false,
    category: false,
    valid: false,
    Field: 'sortorder',
    value: ''
  }],
  columnTitlesModal: [{
    date: false,
    category: false,
    valid: false,
    Field: 'title',
    value: ''
  }, {
    date: false,
    category: false,
    valid: false,
    Field: 'url',
    value: ''
  }, {
    date: true,
    category: false,
    valid: false,
    Field: 'effectivedate',
    value: ''
  }, {
    date: false,
    category: true,
    valid: false,
    Field: 'category',
    value: '1'
  }, {
    date: false,
    category: false,
    valid: true,
    Field: 'valid',
    value: '1'
  }, {
    date: false,
    category: false,
    valid: false,
    Field: 'sortorder',
    value: ''
  }],
  columnTitleId: {
    Field: 'id',
    value: ''
  },
  details: [{
    id: 1,
    title: '個人情報の保護に関する法律（個人情報保護法）',
    url: 'https://elaws.e-gov.go.jp/search/elawsSearch/elaws_search/lsg0500/detail?lawId=415AC0000000057',
    effectivedate: '2018-07-27',
    category: 1,
    valid: 1,
    sortorder: 1,
    checkbox: false
  }, {
    id: 2,
    title: '行政手続における特定の個人を識別するための番号の利用等に関する法律(マイナンバー法)',
    url: 'https://elaws.e-gov.go.jp/search/elawsSearch/elaws_search/lsg0500/detail?lawId=425AC0000000027&openerCode=1',
    effectivedate: '2019-05-31',
    category: 1,
    valid: 1,
    sortorder: 1,
    checkbox: false
  }, {
    id: 3,
    title: '不正アクセス行為の禁止等に関する法律',
    url: 'https://elaws.e-gov.go.jp/search/elawsSearch/elaws_search/lsg0500/detail?lawId=411AC0000000128',
    effectivedate: '2013-05-31',
    category: 1,
    valid: 1,
    sortorder: 1,
    checkbox: false
  }, {
    id: 4,
    title: '著作権法',
    url: 'https://elaws.e-gov.go.jp/search/elawsSearch/elaws_search/lsg0500/detail?lawId=345AC0000000048&openerCode=1',
    effectivedate: '2018-07-13',
    category: 1,
    valid: 1,
    sortorder: 1,
    checkbox: false
  }, {
    id: 5,
    title: '労働者派遣事業の適正な運営の確保及び派遣労働者の保護等に関する法律',
    url: 'https://elaws.e-gov.go.jp/search/elawsSearch/elaws_search/lsg0500/detail?lawI',
    effectivedate: '2019-06-14',
    category: 1,
    valid: 1,
    sortorder: 1,
    checkbox: false
  }, {
    id: 6,
    title: 'プライバシーマーク付与適格性審査基準',
    url: 'https://privacymark.jp/system/guideline/pdf/pm_shinsakijun.pdf',
    effectivedate: '2018-07-17',
    category: 1,
    valid: 1,
    sortorder: 1,
    checkbox: false
  }, {
    id: 7,
    title: '札幌市個人情報保護条例',
    url: 'https://www.city.sapporo.jp/somu/kokai/kojourei.html',
    effectivedate: '2016-12-13',
    category: 1,
    valid: 1,
    sortorder: 1,
    checkbox: false
  }, {
    id: 8,
    title: '不正競争防止法',
    url: 'https://elaws.e-gov.go.jp/search/elawsSearch/elaws_search/lsg0500/detail?lawId=405AC0000000047',
    effectivedate: '2018-05-30',
    category: 1,
    valid: 1,
    sortorder: 1,
    checkbox: false
  }, {
    id: 9,
    title: '雇用管理分野における個人情報のうち健康情報を取り扱うに当たっての留意事項',
    url: 'https://www.mhlw.go.jp/file/06-Seisakujouhou-12600000-Seisakutoukatsukan/0000167762.pdf',
    effectivedate: '2017-05-29',
    category: 1,
    valid: 1,
    sortorder: 1,
    checkbox: false
  }, {
    id: 10,
    title: 'コンピュータ不正アクセス対策基準',
    url: 'https://www.ipa.go.jp/security/ciadr/guide-crack.html',
    effectivedate: '2000-12-28',
    category: 1,
    valid: 1,
    sortorder: 1,
    checkbox: false
  }],
  categories: [{
    id: 1,
    categoryname: '法律・条例等'
  }, {
    id: 2,
    categoryname: '個人情報保護 基準・ガイドラインなど'
  }, {
    id: 3,
    categoryname: '職業紹介、派遣関連'
  }],
  isValid: [{
    title: '有効',
    value: 1
  }, {
    title: '無効',
    value: 0
  }],
  specifiedPage: 1,
  allCount: 18,
  displayCount: 10,
  pageNation: [{
    active: true,
    page: 1
  }, {
    active: false,
    page: 2
  }],
  pagePrev: [{
    prev: false,
    page: 1
  }],
  pageNext: [{
    next: true,
    page: 2
  }]
},
};


export const fetchAsyncGetControlLedger = createAsyncThunk(
    "controlLedger/get",
    async(selectPage:number) => {
        const { data } = await axios.get<APIDATACONTROLLEDGER>
        (`${apiControlLedgerUrl}?page=${selectPage}`);
        return { data: data };
    }
);

//Slice定義
const crudControlLedgerSlice = createSlice({
    name: "crudControlLedger",
    initialState: initialStateControlLedger,
    //Stateに対して許可する更新処理を定義する
    reducers: {
      // 第一引数は現在（更新前）のState
      // 第二引数は渡されたaction
      // action.payloadプロパティに、渡された引数が入っている
      // この関数は新しい状態を返却する
      // 各行のチェックボックスが変更された際のAction
      changeLedgerCheckbox: (state, action:{payload:string}) => {
        const newDetails: { id: number; title: string; url: string; effectivedate: string; category: number; valid: number; sortorder: number; checkbox: boolean; }[] = [];
        state.data.details.forEach((detail, index) => {
          if (action.payload === detail.id.toString()) {
            const newRecord = {
              id: detail.id,
              title: detail.title,
              url: detail.url,
              effectivedate: detail.effectivedate,
              category:detail.category,
              valid:detail.valid,
              sortorder:detail.sortorder,
              checkbox: !detail.checkbox,
            }
            newDetails.push(newRecord);
          }else{
            const newRecord = {
              id: detail.id,
              title: detail.title,
              url: detail.url,
              effectivedate: detail.effectivedate,
              category:detail.category,
              valid:detail.valid,
              sortorder:detail.sortorder,
              checkbox: detail.checkbox,
            }
            newDetails.push(newRecord);
          }
          state.data.details = newDetails;
        });
      },
      // 全件チェック用チェックボックスがチェックされた際のAction
      setAllCheckedLedger: (state) => {
        const newDetails: { id: number; title: string; url: string; effectivedate: string; category: number; valid: number; sortorder: number; checkbox: boolean; }[] = [];
        state.data.details.forEach((detail, index) => {
            const newRecord = {
              id: detail.id,
              title: detail.title,
              url: detail.url,
              effectivedate: detail.effectivedate,
              category:detail.category,
              valid:detail.valid,
              sortorder:detail.sortorder,
              checkbox: true,
            }
            newDetails.push(newRecord);        
        });
        state.data.details = newDetails;
      },
      // 全件チェック用チェックボックスのチェックがはずされた際のAction
      setAllUncheckedLedger: (state) => {
        const newDetails: { id: number; title: string; url: string; effectivedate: string; category: number; valid: number; sortorder: number; checkbox: boolean; }[] = [];
        state.data.details.forEach((detail, index) => {
            const newRecord = {
              id: detail.id,
              title: detail.title,
              url: detail.url,
              effectivedate: detail.effectivedate,
              category:detail.category,
              valid:detail.valid,
              sortorder:detail.sortorder,
              checkbox: false,
            }
            newDetails.push(newRecord);        
        });
        state.data.details = newDetails;
      },
      // 追加用のモーダルの入力値をクリアするAction(categoryとvalidだけはselectboxの先頭の要素を表示する)
      clearInsertModalLedger: (state) => {
        const newColumnTitles: {
          date: boolean;
          category: boolean;
          valid: boolean;
          Field: string;
          value: string;
        }[] = [];
        let newRecord;
        state.data.columnTitles.forEach((columnTitle, index) => {
          if(columnTitle.Field === "category" || columnTitle.Field === "valid"){
            newRecord = {
              date:columnTitle.date,
              category:columnTitle.category,
              valid:columnTitle.valid,
              Field: columnTitle.Field,
              value: "1"
            }
          }else{
            newRecord = {
              date:columnTitle.date,
              category:columnTitle.category,
              valid:columnTitle.valid,
              Field: columnTitle.Field,
              value: ""
            }
          }
          newColumnTitles.push(newRecord); 
        });
        state.data.columnTitles = newColumnTitles;
      },
      // 追加用のモーダルの入力値をクリアするAction
      changeInsertModalLedger: (state,action:{payload:React.ChangeEvent<HTMLSelectElement>|React.ChangeEvent<HTMLInputElement>}) => {
        const newColumnTitles: { date: boolean; category: boolean; valid: boolean; Field: string; value: any; }[] = [];
        state.data.columnTitles.forEach((columnTitle, index) => {
          if(action.payload.target.name === columnTitle.Field){
              const newRecord = {
                date:columnTitle.date,
                category:columnTitle.category,
                valid:columnTitle.valid,
                Field: columnTitle.Field,
                value: action.payload.target.value
              } ;
              newColumnTitles.push(newRecord);
            }else{
              const newRecord = {
                date:columnTitle.date,
                category:columnTitle.category,
                valid:columnTitle.valid,
                Field: columnTitle.Field,
                value: columnTitle.value
              } ;
              newColumnTitles.push(newRecord);
            }
        });
        state.data.columnTitles = newColumnTitles;
      },
      // 変更用のモーダルの入力値をStateに反映させるためのAction
      changeEditModalLedger: (state,action:{payload:React.ChangeEvent<HTMLSelectElement>|React.ChangeEvent<HTMLInputElement>}) => {
        const newDetails: { date: boolean; category: boolean; valid: boolean; Field: string; value: any; }[] = [];
        state.data.columnTitlesModal.forEach((columnTitleModal, index) => {
          if(action.payload.target.name === columnTitleModal.Field){
              const newRecord = {
                date:columnTitleModal.date,
                category:columnTitleModal.category,
                valid:columnTitleModal.valid,
                Field: columnTitleModal.Field,
                value: action.payload.target.value
              } ;
              newDetails.push(newRecord);
            }else{
              const newRecord = {
                date:columnTitleModal.date,
                category:columnTitleModal.category,
                valid:columnTitleModal.valid,
                Field: columnTitleModal.Field,
                value: columnTitleModal.value
              } ;
              newDetails.push(newRecord);
            }
        });
        state.data.columnTitlesModal = newDetails;
      },
      // 変更用モーダルを開いた際に該当カテゴリーの現在値をモーダルに表示するAction
      setEditModalLedger: (state,action:{payload:number}) => {
        state.data.details.forEach((detail) => {
          // alert(action.payload.currentTarget.dataset.id);
          if(action.payload === detail.id){
  
            state.data.columnTitlesModal.forEach((columnTitleModal) => {
              switch(columnTitleModal.Field){
              case "title":
                columnTitleModal.value = detail.title;
                break;
              case "url":
                columnTitleModal.value = detail.url;
                break;
              case "effectivedate":
                columnTitleModal.value = detail.effectivedate;
                break;
              case "category":
                columnTitleModal.value = String(detail.category);
                break;
              case "valid":
                columnTitleModal.value = String(detail.valid);
                break;
              case "sortorder":
                columnTitleModal.value = String(detail.sortorder);
                break;
              }
            })
              state.data.columnTitleId = {Field:"id",value:String(detail.id)};
            }
        });
      },
    },
    //必要に応じて追加のReducerを指定
    //action creator を自動的に作成したくない場合に使用する
    //Reducer以外に定義した関数のReducerでの利用？、後処理の設定、エクスポートは関数定義の際行っている
    extraReducers: (builder) => {
      builder.addCase(fetchAsyncGetControlLedger.fulfilled, (state, action) => {
        console.log(action.payload.data);
        return {
          //stateのdata属性に格納している　initialstateしたものがstate?
          ...state,
          data: action.payload.data, //こっちはstateのdata action.payloadにはaxios.getのdataが格納されている？
        };
      });
    },
  });
  
  
  
  //もしreducersにアクションを登録していたら、以下のエクスポートを行いuseDispatchさせる準備を行う
  export const {  changeLedgerCheckbox ,setAllCheckedLedger,setAllUncheckedLedger,clearInsertModalLedger,changeInsertModalLedger,changeEditModalLedger,setEditModalLedger } = crudControlLedgerSlice.actions;
  
  export const crudControlLedgerData = (state: RootState) => state.crudControlLedger.data; //crudControlLedgerDataという名前で、コンポーネントにstateの中のdataをuseSelectorさせる。storeでconfigureStoreしているreducerにcrudCategoryが登録されている必要がある(storeに登録されているので、このファイルのstate名はcrudControlLedgerとなる、Sliceの名前と合わせておくとわかりやすい)
  
  //sliceのreducerをエクスポート 
  export default crudControlLedgerSlice.reducer; 
/* eslint-disable jsx-a11y/anchor-is-valid */
// ↑ <a href="#..."> の警告(anchor-is-valid)を消すための設定

//import
import React, { useEffect, useRef, useState } from "react";
// Redux Toolkit のフック(型付きの dispatch と selector)
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
// crudCategorySlice の「非同期関数」と「state」
import { fetchAsyncGetCategory,
        crudCategoryData,
        changeCategoryCheckbox,
        setAllChecked,
        setAllUnChecked,
        clearInsertModal,
        changeInsertModal,
        changeEditModal,
        setEditModal,
    } from "../crudCategorySlice";
import {
  messageClear,
  insertAsyncCategory,
  deleteAsyncCategory,
  editAsyncCategory,
} from "../messageSlice";
import insertCategoryJson from "../insertCategory.json";
import deleteCategoryJson from "../deleteCategory.json";
import editCategoryJson from "../editCategory.json";
    // 処理結果メッセージを表示するコンポーネント
import MainResult from "../mainResult/MainResult";

type INSERTDATACATEGORY = typeof insertCategoryJson;
type DELETEDATACATEGORY = typeof deleteCategoryJson;
type EDITDATACATEGORY = typeof editCategoryJson;


const CrudCategory: React.FC = () => {
  //データ取得非同期関数の実行
  //Selector を使って state(data)の内容を取得し、変数 data に格納する
  const data = useAppSelector(crudCategoryData);

  //dispatch を使えるようにする(Slice の関数を実行するときに使う)
  const dispatch = useAppDispatch();

  // 画面が表示されたときに、カテゴリーの一覧を取得する
  // 第1引数:アロー関数で非同期関数を dispatch(引数は今のページ番号)
  // 第2引数:[dispatch]
  useEffect(() => {
    dispatch(fetchAsyncGetCategory(data.specifiedPage));
  }, [dispatch]);

    //ローカルstateの定義　カテゴリーテーブルメンテ機能内で使用するローカルstateの定義
    //全件選択チェックボックス用
    //stateの現在地allCheckCheckbox stateのset関数setAllCheckCheckbox stateの初期値false
    const [allCheckCheckbox, setAllCheckCheckbox] = useState(false);

    //削除id格納用(初期値は文字列「なし」)
    //stateの現在地deleteIds stateのset関数setDeleteIds stateの初期値なしという文字列
    const [deleteIds, setDeleteIds] = useState("なし");

    // Ref定義 各モーダルのクローズボタンにアクセスするためのRef
    //Ref(Reference)とは、再レンダリングを引き起こさずに値を保持したり、DOM要素に直接アクセスする仕組みのこと
    ////追加モーダルのクローズボタンにアクセスするためのrefを定義
    const insertClose: React.RefObject<HTMLButtonElement> = useRef(null);

    //削除モーダルのクローズボタンにアクセスするためのrefを定義
    const deleteClose: React.RefObject<HTMLButtonElement> = useRef(null);

    //変更モーダルのクローズボタンにアクセスするためのrefを定義
    const editClose: React.RefObject<HTMLButtonElement> = useRef(null);

    //ローカル関数の作成
    //全件選択チェックボックス用チェンジイベント関数
    //全件チェックボックスが押された際、
    //もともとチェックが入っていた→チェックを外し、すべての項目の選択状態を解除する
    //もともとチェックが入っていない→チェックを付け、すべての項目を選択状態にする
    const selectAllCheckboxes = () => {
    //①処理結果メッセージが表示されていればクリアする
    dispatch(messageClear());

    //全件選択チェックボックスの状態(ローカルstateのallCheckCheckbox)を参照して処理を切り替える
    if (allCheckCheckbox) {
      // true のとき:全部のチェックを外す
      setAllCheckCheckbox(false);
      dispatch(setAllUnChecked());
    } else {
      // false のとき:全部にチェックを入れる
      setAllCheckCheckbox(true);
      dispatch(setAllChecked());
    }
  };

  //各行のチェックボックス用チェンジイベント用関数
  //各項目のチェックボックスが押された際、その行のチェックボックスに関するstateを更新する
  const selectCheckboxes = (e: React.ChangeEvent<HTMLInputElement>) => {
    //処理結果メッセージが表示されていたらクリアする
    dispatch(messageClear());

    //押されたチェックボックスのidを変数に代入する
    const checkboxId = e.target.dataset.id;

    //↑のidを引数として渡し、changeCategoryCheckboxをdispatchする
    dispatch(changeCategoryCheckbox(checkboxId));

    //全件チェックボックスを非選択にするために、allCheckCheckBoxの値をfalseにする
    setAllCheckCheckbox(false);
  };

  //全チェックボックス（全件選択、各行）を初期化する関数
  //ページネーションのボタンが押された際、全件選択チェックボックス用check状態stateをfalseに、
  //各行のチェックボックスのすべてのチェックを外す
  const initCheckbox = () => {
    setAllCheckCheckbox(false);
    dispatch(setAllUnChecked());
  };

  //追加モーダルの内容を初期化する関数
  //モーダルでの追加処理を行った際、再度モーダルで追加を行うと、前の内容がstateに残ってしまうので
  //それを初期化（削除）する関数
  const initialAddModal = () => {
    dispatch(messageClear());
    dispatch(clearInsertModal());
  };

  //追加処理実行関数
  //追加モーダルの値を使ってAPIの追加処理を実行し、一覧表示する関数
  const handleInsertSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    //formタグによるデフォルト送信をキャンセルする(リロード阻止)する
    e.preventDefault();
    //id,categoryName,sortOrder,colorの一時格納用変数を用意する
    let insertId: string="";
    let insertCategoryname: string="";
    let insertSortorder: string="";
    let insertColor: string="";

    //stateのcolumnTitlesをforEachする　
    //↑で定義した４つの変数にそれぞれ対応した値を入れる
    data.columnTitles.forEach((detail,index) => {
        switch(detail.Field){
            case "id":
                insertId = detail.value;
                break;
            case "categoryname":
                insertCategoryname = detail.value;
                break;
            case "sortorder":
                insertSortorder = detail.value;
                break;
            case "color":
                insertColor = detail.value;
                break;
        }
    });

    //insertCategory.jsonから設定した型をもつオブジェクトthisInsertDataを定義し、
    //各プロパティに、一時格納用変数の値をセットする
    // →このとき、currentPageプロパティには、stateのspecifiedPageから値をセットする
    const thisInsertData: INSERTDATACATEGORY = {
        id: insertId,
        categoryname: insertCategoryname,
        sortorder: insertSortorder,
        color: insertColor,
        currentPage: data.specifiedPage
    };

    //Refを使ってDOM操作する記述 (モーダルを閉じる、×ボタンにフォーカスする)
    (insertClose.current as HTMLButtonElement).click();

    //追加処理 → 一覧取得を、順番に実行する関数
    //二つの関数をまとめた関数だがasync-awaitで記載することで
    //１．追加処理を行う　２．追加後の一覧情報を取得するという動きを実現できる
    const execInsert = async () => {
      // 追加処理が終わるまで待つ
      await dispatch(insertAsyncCategory(thisInsertData));
      // その後に一覧を取得する
      await dispatch(fetchAsyncGetCategory(data.specifiedPage));
    };
    //↑で作成した関数execInsertを実行する
    execInsert();
  };

  //単体削除が押された際に実行する関数
  //該当idを削除モーダルに渡す関数 ボタンを押してから削除モーダルが表示される前に実行される
  const setDeleteModal = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    //formタグによるデフォルト送信をキャンセル（リロード阻止のため）
    e.preventDefault();
    //処理結果メッセージが表示されていればクリアする
    dispatch(messageClear());
    //押された項目のidを変数に代入する
    const deleteId = e.currentTarget.dataset.id as string;
    //ローカルstateのdeleteIdsにdeleteIdを格納する
    setDeleteIds(deleteId);
}; 

//複数行削除　-Deleteが押された際に実行する関数
//該当idを1つの文字列にして削除モーダルに渡す関数 ボタンを押してから削除モーダルが表示される前に実行される
//チェックボックスにチェックが入っている項目のidをstateからすべて取り出してカンマ区切りの文字列にしてセットする
const setDeleteModalSelected = (e: React.MouseEvent<HTMLAnchorElement,MouseEvent>) => {
    //formタグによるDefault送信をキャンセル
    e.preventDefault();
    //処理結果メッセージが表示されていればクリア
    dispatch(messageClear());
    //数字を要素とする配列を作成 初期値は空
    const deleteIdOrg: number[] = [];
    //カテゴリstate内のdetails を forEach し、
    data.details.forEach((detail) => {
      //detailsから取り出した要素のcheckboxがtrueがtrueのとき、idを配列の中にpushする
      if (detail.checkbox === true) {
        deleteIdOrg.push(detail.id);
      }
    });

    //文字列格納用変数に、idをカンマ区切りの文字列にして代入する↑のforEachによって、
    // 配列内にはidに対応する数字が入っている これをカンマ区切りの文字列にするために、joinメソッドを使用する
    let deleteIds = deleteIdOrg.join();

    //deleteIdsがnullか"　"ならその中に"なし"を格納する
    if(deleteIds == null || deleteIds == ""){
    deleteIds = "なし";
    }
    //ローカルstate deleteIds に格納する
    setDeleteIds(deleteIds);
  };


//削除処理実行関数 ローカルstate deleteIdsの値を使って、削除処理を行い、一覧表示を行う関数
const handleDeleteSubmit = (e:React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //deleteCategory.jsonの型のオブジェクトを作成する
    const thisDeleteData: DELETEDATACATEGORY = {
        //ローカルstate　deleteIdsの値
        id: deleteIds,
        //stateのspecifieldPageから取得した値 現在のページ番号
        currentPage: data.specifiedPage,
    };

    //Refを使ってDOM操作をする モーダルを閉じる、×ボタンにフォーカスする
    (deleteClose.current as HTMLButtonElement).click();

    //関数execDeleteを作成し、順番に実行する
    const execDelete = async() => {
        //作成したオブジェクトを引数に処理を行う 非同期関数を実行する
        await dispatch(deleteAsyncCategory(thisDeleteData));
        //削除後の一覧情報を取得する
        await dispatch(fetchAsyncGetCategory(data.specifiedPage));
    };
    // 作成した関数を実行する
    execDelete();
  };

  //変更処理実行関数　変更モーダルの値を使ってAPIの追加処理を実行し、一覧表示する関数
  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    //id,categoryName,sortOrder,colorの一時格納用変数を用意する
    //idの値はmapする必要がないので、このとき取得して初期値として代入する
    const editId: string = data.columnTitleId.value;
    let editCategoryname: string = "";
    let editSortorder: string = "";
    let editColor: string ="";

    //stateのcolumnTitlesModalをforEachする ↑で定義したidを除く３つの変数にそれぞれ対応した値を入れる
    data.columnTitlesModal.forEach((columnTitleModal) => {
        switch(columnTitleModal.Field){
            case "categoryname":
                editCategoryname = columnTitleModal.value;
                break;
            case "sortorder":
                editSortorder = columnTitleModal.value;
                break;
            case "color":
                editColor = columnTitleModal.value;
                break;
        } 
  });

    //editCategory.jsonから設定した型をもつオブジェクトthisEditDataを定義し、
    //各プロパティに一時格納用変数の値をセットする
    //このとき、currentPageプロパティにはstateのspecifiedPageから値をセットする
    const thisEditData: EDITDATACATEGORY = {
        id: editId,
        categoryname: editCategoryname,
        sortorder: editSortorder,
        color: editColor,
        currentPage: data.specifiedPage,
    };

    //Refを使って、DOM操作をする記述　モーダルを閉じる、×ボタンにフォーカスする
    (editClose.current as HTMLButtonElement).click();

    //関数execEditを作成し、順番に実行する
    const execEdit = async () => {
        //作成したオブジェクトを引数に処理を行う 非同期関数を実行する
        await dispatch(editAsyncCategory(thisEditData));
        //変更後の一覧情報を取得する
        await dispatch(fetchAsyncGetCategory(data.specifiedPage));
    };
    execEdit();
  };



  //仮想DOM記述
  return (
    <>
      {/* ##### 一覧表示【Ax】 ##### */}
      <div className="container">
        <div className="table-wrapper">
          <div className="table-title">
            <div className="row">
              <div className="col-sm-6">
                <h2>
                  {/* 【A1】state(data)の pageTitle を表示 */}
                  テーブルメンテナンス <b>{data.pageTitle}</b>
                </h2>
              </div>
              <div className="col-sm-6">
                {/* 「Add New Record」ボタン:追加モーダルを開く */}
                <a
                  href="#addRecordModal"
                  className="btn btn-success"
                  data-toggle="modal"
                  onClick = { initialAddModal }
                >
                  <i className="material-icons">&#xE147;</i>
                  <span>Add New Record</span>
                </a>
                {/* 「Delete」ボタン:削除モーダルを開く(チェックした行をまとめて削除) */}
                <a
                  href="#deleteRecordModal"
                  id="selectDelete"
                  className="btn btn-warning"
                  data-toggle="modal"
                  onClick = { setDeleteModalSelected }
                >
                  <i className="material-icons">&#xE15C;</i> <span>Delete</span>
                </a>
              </div>
            </div>
          </div>


          {/* 【A2】処理結果メッセージ表示用の MainResult コンポーネントを設置 */}
          <MainResult />

          <table className="table table-striped table-hover">
            <thead>
              <tr>
                {/* 全件選択用のチェックボックス */}
                <th>
                  <span className="custom-checkbox">
                    <input
                      type="checkbox"
                      id="selectAll"
                      checked = { allCheckCheckbox }
                      onChange = { selectAllCheckboxes }
                    />
                    <label htmlFor="selectAll"></label>
                  </span>
                </th>
                {/* 【A3】columnTitles を map して、表の見出し(4項目)を作る */}
                {data.columnTitles.map((columnTitle, i) => {
                  return <th key={i}>{columnTitle.Field}</th>;
                })}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {/* 【A4】details を map して、表の各行を作る(各要素を detail とする) */}
                { data.details.map((detail,j) => {
                return (
                  <tr key={j}>
                    <td>
                      <span className="custom-checkbox">
                        {/* 行のチェックボックス */}
                        <input
                          type="checkbox"
                          // id:文字列「checkbox」+ detail の id(例 checkbox1)
                          id={`checkbox${detail.id}`}
                          name="options"
                          // value:表示行を示す map の index
                          value={j}
                          onChange={ (e)=>selectCheckboxes(e) }
                          // checked:各カテゴリーの checkbox の状態
                          checked={detail.checkbox}
                          // data-id:カテゴリーの idをテンプレート文字列で設定する
                          data-id={`${detail.id}`}
                        />
                        {/* label の対象は、上の input の id と同じ内容 */}
                        <label htmlFor={`checkbox${detail.id}`}></label>
                      </span>
                    </td>
                    <td>{detail.id}</td>
                    <td className="text-left">{detail.categoryname}</td>
                    <td>{detail.sortorder}</td>
                    <td>{detail.color}</td>
                    <td>
                      {/* ##### 変更アイコン(鉛筆):変更モーダルを開く ##### */}
                      <a
                        href="#editRecordModal"
                        className="edit"
                        data-toggle="modal"
                        id={`${detail.id}Edit`}
                        data-id={`${detail.id}`}
                        onClick={(() => {
                        dispatch(messageClear());
                        dispatch(setEditModal(detail.id));
                        })}
                      >
                        <i
                          className="material-icons"
                          data-toggle="tooltip"
                          title="Edit"
                        >
                          &#xE254;
                        </i>
                      </a>
                      {/* ##### 削除アイコン(ゴミ箱):削除モーダルを開く ##### */}
                      <a
                        href="#deleteRecordModal"
                        className="delete"
                        data-toggle="modal"
                        data-id={`${detail.id}`}
                        onClick = { setDeleteModal }
                      >
                        <i
                          className="material-icons"
                          data-toggle="tooltip"
                          title="Delete"
                        >
                          &#xE872;
                        </i>
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* ##### ページネーション【Ex】 ##### */}
          <div className="clearfix">
            {/* 【E1】【E2】件数表示:全件数と、このページの表示件数 */}
            <div className="hint-text">
              全 <b>{data.allCount}</b> 件中 <b>{data.displayCount}</b> 件表示
            </div>

            <ul className="pagination">
              {/* 【E3】現在表示している前ページへのリンク:pagePrev を map し、前ページがあるかで出し分け */}
              {data.pagePrev.map((prev, l) => {
                if (prev.prev) {
                  // 前ページがある場合
                  return (
                    <li
                      className="page-item"
                      key={l}
                      onClick={() => {
                        dispatch(fetchAsyncGetCategory(prev.page));
                        initCheckbox();
                        dispatch(messageClear())
                        }}
                    >
                      <a>Previous</a>
                    </li>
                  );
                } else {
                  // 前ページがない場合(押せない表示)
                  return (
                    <li className="page-item disabled" key={l}>
                      <a>Previous</a>
                    </li>
                  );
                }
              })}

              {/* 【E4】現在ページ:pageNation を map し、現在のページかで出し分け */}
              {data.pageNation.map((nation, l) => {
                if (nation.active) {
                  // 現在のページ番号の場合(強調表示)
                  return (
                    <li
                      className="page-item active"
                      key={l}
                      onClick={() => {
                        dispatch(fetchAsyncGetCategory(nation.page));
                        initCheckbox();
                        dispatch(messageClear())
                        }}
                    >
                      <a className="page-link">{nation.page}</a>
                    </li>
                  );
                } else {
                  // 現在のページ番号以外の場合
                  return (
                    <li
                      className="page-item"
                      key={l}
                      onClick={() => {
                        dispatch(fetchAsyncGetCategory(nation.page));
                        initCheckbox();
                        dispatch(messageClear())
                        }}
                    >
                      <a className="page-link">{nation.page}</a>
                    </li>
                  );
                }
              })}

              {/* 【E5】次ページ:pageNext を map し、次ページがあるかで出し分け */}
              {data.pageNext.map((next, l) => {
                if (next.next) {
                  // 次ページがある場合
                  return (
                    <li
                      className="page-item"
                      key={l}
                      onClick={() => {
                        dispatch(fetchAsyncGetCategory(next.page));
                        initCheckbox();
                        dispatch(messageClear())
                    }}
                    >
                      <a className="page-link">Next</a>
                    </li>
                  );
                } else {
                  // 次ページがない場合(押せない表示)
                  return (
                    <li className="page-item disabled" key={l}>
                      <a>Next</a>
                    </li>
                  );
                }
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* ##### 追加モーダル(addRecordModal)【Bx】 ##### */}
      <div id="addRecordModal" className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <form
              onSubmit = {(e) => (handleInsertSubmit(e))}
              id="addForm"
            >
              <div className="modal-header">
                {/* 【B1】pageTitle を表示 */}
                <h4 className="modal-title">レコード追加{data.pageTitle}</h4>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-hidden="true"
                  ref = { insertClose }
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                {/* 【B2】columnTitles を map して、入力欄を項目の数だけ作る */}
                {data.columnTitles.map((columnTitle, i) => {
                  return (
                    <div className="form-group" key={i}>
                      <label>{columnTitle.Field}</label>
                      <input
                        type="text"
                        className="form-control"
                        id={columnTitle.Field}
                        name={columnTitle.Field}
                        value={columnTitle.value}
                        onChange={(e) =>
                      dispatch(changeInsertModal({ Field: e.target.name, value: e.target.value }))}       
                      required
                      />
                    </div>
                  );
                })}
              </div>
              <div className="modal-footer">
                {/* 【B3】現在のページ番号(画面には出ない。追加後の一覧表示で使う) */}
                <input
                  type="hidden"
                  name="currentPage"
                  value={data.specifiedPage}
                />
                <input
                  type="button"
                  className="btn btn-default"
                  data-dismiss="modal"
                  value="Cancel"
                />
                <input
                  type="submit"
                  className="btn btn-success"
                  value="Add"
                  id="addButton"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ##### 削除モーダル(deleteRecordModal)【Cx】 ##### */}
      <div id="deleteRecordModal" className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <form
              onSubmit={(e) => (handleDeleteSubmit(e))}
              id="deleteForm"
            >
              <div className="modal-header">
                {/* 【C1】pageTitle を表示 */}
                <h4 className="modal-title">レコード削除 {data.pageTitle}</h4>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-hidden="true"
                  ref = { deleteClose }
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <p>以下のレコードを削除してよろしいですか?</p>
                <p className="text-warning lead">
                  <small>
                    id:<span id="deletingTarget">{ deleteIds }</span>
                  </small>
                </p>
                <input type="hidden" name="id" id="ids" />
              </div>
              <div className="modal-footer">
                {/* 【C2】現在のページ番号 type=hiddenなので一覧には表示されないが、削除が実行された後に
                削除後の内容で一機表示を行う際に使用する */}
                <input
                  type="hidden"
                  name="currentPage"
                  value={data.specifiedPage}
                />
                <input
                  type="button"
                  className="btn btn-default"
                  data-dismiss="modal"
                  value="Cancel"
                />
                <input
                  type="submit"
                  className="btn btn-danger"
                  value="Delete"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* ##### 変更モーダル(editRecordModal)【Dx】 ##### */}
      <div id="editRecordModal" className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <form
              onSubmit={(e) => (handleEditSubmit(e))}
              id="editForm"
            >
              <div className="modal-header">
                <h4 className="modal-title">レコード更新 {data.pageTitle}</h4>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-hidden="true"
                  ref = { editClose }
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                {/* 【D2】項目 "ID":columnTitleId から設定(変更不可なので readOnly) */}
                {/* 変更モーダルの項目"ID"を設定する */}
                <div className="form-group text-left">
                  <label>{data.columnTitleId.Field}</label>
                  <input
                    type="text"
                    className="form-control"
                    name={data.columnTitleId.Field}
                    id={`${data.columnTitleId.Field}Edit`}
                    value={data.columnTitleId.value}
                    readOnly
                  />
                </div>
                {/* 【D3】"ID" 以外の項目:columnTitlesModal を map して作る */}
                {data.columnTitlesModal.map((colmunTitlesModal, i) => {
                  return (
                    <div className="form-group text-left" key={i}>
                      <label>{colmunTitlesModal.Field}</label>
                      <input
                        type="text"
                        className="form-control"
                        id={`${colmunTitlesModal.Field}Edit`}
                        name={colmunTitlesModal.Field}
                        value={colmunTitlesModal.value}
                        onChange={(e) =>
  dispatch(changeEditModal({ Field: e.target.name, value: e.target.value }))
                        }
                  required   
                      />
                    </div>
                  );
                })}
                <div className="modal-footer">
                  {/* 【D4】現在のページ番号(変更後に同じページを再表示するため) */}
                  <input
                    type="hidden"
                    name="currentPage"
                    value={data.specifiedPage}
                  />
                  <input
                    type="button"
                    className="btn btn-default"
                    data-dismiss="modal"
                    value="Cancel"
                  />
                  <input type="submit" className="btn btn-info" value="Save" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* ##### 仮想DOM END ##### */}
    </>
  );
};


      

export default CrudCategory;
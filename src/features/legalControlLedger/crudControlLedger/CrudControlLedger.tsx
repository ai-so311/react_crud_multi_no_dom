/* eslint-disable jsx-a11y/anchor-is-valid */
// ↑ <a href="#..."> の警告(anchor-is-valid)を消すための設定

import React, { useEffect, useRef, useState } from "react";
// Redux Toolkit のフック(型付きの dispatch と selector)
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
// crudCategorySlice の「非同期関数」と「state」
import {
  crudControlLedgerData,
  fetchAsyncGetControlLedger,
  changeLedgerCheckbox,
  setAllCheckedLedger,
  setAllUncheckedLedger,
  clearInsertModalLedger,
  changeInsertModalLedger,
  changeEditModalLedger,
  setEditModalLedger
} from "../crudControlLedgerSlice";
import {
  messageClear,
  insertAsyncControlLedger,
  deleteAsyncControlLedger,
  editAsyncControlLedger,
} from "../messageSlice";
// 処理結果メッセージを表示するコンポーネント
import MainResult from "../mainResult/MainResult";

import insertControlLedgerJson from "../insertControlLedger.json";
import deleteControlLedgerJson from "../deleteControlLedger.json";
import editControlLedgerJson from "../editControlLedger.json";

//3つのJsonファイルの形から、TypeScriptの型を自動で作っている
//handleInsertSubmitの中で送るデータを作るときに使用する
type INSERTDATACONTROLLEDGER = typeof insertControlLedgerJson;
type DELETEDATACONTROLLEDGER = typeof deleteControlLedgerJson;
type EDITDATACONTROLLEDGER = typeof editControlLedgerJson;

//コンポーネントを定義する
const CrudControlLedger: React.FC = () => {

  //データ取得非同期関数の実行
  //Selector を使って state(data)の内容を取得し、変数 data に格納する
  const data = useAppSelector(crudControlLedgerData);

  //dispatch を使えるようにする(Slice の関数を実行するときに使う)
  const dispatch = useAppDispatch();

  // 画面が表示されたときに、カテゴリーの一覧を取得する
  // 第1引数:アロー関数で非同期関数を dispatch(引数は今のページ番号)
  // 第2引数:[dispatch]
  useEffect(() => {
    dispatch(fetchAsyncGetControlLedger(data.specifiedPage));
  }, [dispatch]);

    //ローカルstateの定義　カテゴリーテーブルメンテ機能内で使用するローカルstateの定義
    //全件選択チェックボックス用
    //stateの現在地allCheckCheckbox stateのset関数setAllCheckCheckbox stateの初期値false
    const [allCheckCheckbox, setAllCheckCheckbox] = useState(false);

   //すべてのチェックボックスのチェックをはずす関数
   const initCheckboxes = () => {
    //全件選択チェックボックス用check状態stateをfalseに
    setAllCheckCheckbox(false);           
    //各行のチェックボックスのすべてチェックをはずす
    dispatch(setAllUncheckedLedger());    
  };

  //全件チェックボックス用チェンジイベント関数
  const selectAllCheckboxes = () => {
    //追加変更削除の処理結果が表示されていた場合はクリアする
    dispatch(messageClear());        
    //選択状態なら自身を非選択にして各チェックボックスもすべて非選択状態に、
    //非選択状態なら自身を選択状態にして各チェックボックスもすべて選択状態に
    if (allCheckCheckbox) {
      //チェックボックスのすべてのチェックをはずす
      initCheckboxes(); 
    } else {
      setAllCheckCheckbox(true);
      dispatch(setAllCheckedLedger());
    };
  };

  //各チェックチェックボックスのチェンジイベント用関数
  // 全件チェックボックスを非選択にする
  const selectCheckboxes = (e: React.ChangeEvent<HTMLInputElement>) => {
    //追加変更削除の処理結果が表示されていた場合はクリアする
    const selectItemId=e.target.dataset.id as string;                           
    dispatch(messageClear());     
    //各行のチェックボックスのチェック状態の変化を反映する
    dispatch(changeLedgerCheckbox(selectItemId));     
    //全件チェック用チェックボックスのチェックを外す
    setAllCheckCheckbox(false);                               
  };

  //追加モーダルのクローズドボタンにアクセスするためのref定義
  const insertClose: React.RefObject<HTMLButtonElement> = useRef(null);

  //連続追加の場合にモーダルに前の内容が残らないようにする
  const initialAddModal = () => {
    //追加変更削除の処理結果が表示されていた場合はクリアする 
    dispatch(messageClear());            
    //追加モーダルの各項目の値をクリアする
    dispatch(clearInsertModalLedger());
  }

  //追加モーダルの値(State上の)を使ってExpressの追加処理を実行=>一覧表示
  const handleInsertSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //formタグによるデフォルト送信をキャンセルする（リロード阻止）
    e.preventDefault();                     
    let insertId: string = "";
    let insertTitle: string = "";
    let insertUrl: string = "";
    let insertEffectivedate: string = "";
    let insertCategory: string = "";
    let insertValid: string = "";
    let insertSortorder: string = "";
    data.columnTitles.forEach((detail, index) => {
      switch (detail.Field) {
        case "id":
          insertId = detail.value;
          break;
        case "title":
          insertTitle = detail.value;
          break;
        case "url":
          insertUrl = detail.value;
          break;
        case "effectivedate":
          insertEffectivedate = detail.value;
          break;
        case "category":
          insertCategory = detail.value;
          break;
        case "valid":
          insertValid = detail.value;
          break;
        case "sortorder":
          insertSortorder = detail.value;
          break;
      }
    });

    //追加モーダルの入力値をAPIに送る一つのオブジェクトにする
    const thisInsertData: INSERTDATACONTROLLEDGER = {
      //一時変数(switchでcolumnTitlesから取り出したもの)
      id: insertId,
      title: insertTitle,
      url: insertUrl,
      effectivedate: insertEffectivedate,
      category: insertCategory,
      valid: insertValid,
      sortorder: insertSortorder,
      //今のページ番号をstateから直接もらっている
      currentPage: data.specifiedPage
    };

    //Refを使ってDOM操作=>モーダルクローズ
     (insertClose.current as HTMLButtonElement).click();
    //Expressに追加処理と一覧取得処置を順番に行う
    const execInsert = async () => {
      await dispatch(insertAsyncControlLedger(thisInsertData));
      await dispatch(fetchAsyncGetControlLedger(data.specifiedPage));
    }
    execInsert();
  }

    //削除id格納用(初期値は文字列「なし」)
    //stateの現在地deleteIds stateのset関数setDeleteIds stateの初期値なしという文字列
    const [deleteIds, setDeleteIds] = useState("なし");

    //Ref定義 各モーダルのクローズボタンにアクセスするためのRef
    //Ref(Reference)とは、再レンダリングを引き起こさずに値を保持したりDOM要素に直接アクセスする仕組みのこと
  
    //削除モーダルのクローズボタンにアクセスするためのrefを定義
    const deleteClose: React.RefObject<HTMLButtonElement> = useRef(null);

    //一覧の該当idを削除モーダルに渡す（単行削除）
    const setDeleteModal = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      //formタグによるデフォルト送信をキャンセルする（リロード阻止）
      e.preventDefault();                                     
      //追加変更削除の処理結果が表示されていた場合はクリアする
      dispatch(messageClear());                               
    const deleteId = e.currentTarget.dataset.id as string;
    setDeleteIds(deleteId);
  };

  //チェックされたidを削除モーダルに渡す
  const setDeleteModalSelected = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    dispatch(messageClear());
    let deleteIdOrg: number[] = [];
    data.details.forEach((detail, l) => {
      if (detail.checkbox === true) { deleteIdOrg.push(detail.id); }
    })
    //カンマ区切りで文字列をセット
    let deleteIds = deleteIdOrg.join();
    if (deleteIds == null || deleteIds === '') {
      deleteIds = "なし";
    }
    setDeleteIds(deleteIds);
  };

  //削除モーダルの値(state上の)を使ってExpressの追加処理を実行=>一覧表示
  const handleDeleteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //formタグによるデフォルト送信をキャンセルする（リロード阻止）
    e.preventDefault();                
    let tempDeleteData: DELETEDATACONTROLLEDGER = {
      id: deleteIds,
      currentPage: data.specifiedPage
    };

  //Refを使ってDOM操作=>モーダルクローズ
  (deleteClose.current as HTMLButtonElement).click();
    const execDelete = async () => {
      //非同期関数の削除処理と一覧取得処置を順番に行う
      await dispatch(deleteAsyncControlLedger(tempDeleteData));
      await dispatch(fetchAsyncGetControlLedger(data.specifiedPage));
    }
    execDelete();
  }

  // //修正モーダルのクローズボタンにアクセスするためのrefを定義
  const editClose: React.RefObject<HTMLButtonElement> = useRef(null);

  //修正モーダルの値（state上の）を使って非同期関数の変更処理を実行=>一覧表示
  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    //formタグによるデフォルト送信をキャンセルする（リロード阻止）
    e.preventDefault();                                     
    let editId: string = data.columnTitleId.value;
    let editTitle: string = "";
    let editUrl: string = "";
    let editEffectivedate: string = "";
    let editCategory: string = "";
    let editValid: string = "";
    let editSortorder: string = "";
    data.columnTitlesModal.forEach((detail, index) => {
      switch (detail.Field) {
        case "title":
          editTitle = detail.value;
          break;
        case "url":
          editUrl = detail.value;
          break;
        case "effectivedate":
          editEffectivedate = detail.value;
          break;
        case "category":
          editCategory = detail.value;
          break;
        case "valid":
          editValid = detail.value;
          break;
        case "sortorder":
          editSortorder = detail.value;
          break;
      }
    });
    const thisEditData: EDITDATACONTROLLEDGER = {
      id: editId,
      title: editTitle,
      url: editUrl,
      effectivedate: editEffectivedate,
      category: editCategory,
      valid: editValid,
      sortorder: editSortorder,
      currentPage: data.specifiedPage
    };

    //Refを使ってDOM操作=>変更モーダルクローズ
    (editClose.current as HTMLButtonElement).click();
    //非同期関数の変更処理と一覧取得処置を順番に行う
    const execEdit = async () => {
      await dispatch(editAsyncControlLedger(thisEditData));
      await dispatch(fetchAsyncGetControlLedger(data.specifiedPage));
    }
    execEdit();
  }

  //長い項目のフル表示
  const popupDetail = (e: React.MouseEvent<HTMLTableCellElement, MouseEvent>) => {
    alert(e.currentTarget.innerText);
  }

   return (
    <>
      <div className="container">
        <div className="table-wrapper">
          <div className="table-title">
            <div className="row">
              <div className="col-sm-6">
                <h2>テーブルメンテナンス <b>{data.pageTitle}</b></h2>
              </div>
              <div className="col-sm-6">
                <a href="#addRecordModal" className="btn btn-success" data-toggle="modal" onClick={initialAddModal}><i
                  className="material-icons">&#xE147;</i> <span>Add New Record</span></a>
                <a href="#deleteRecordModal" id="selectDelete" className="btn btn-warning" data-toggle="modal" onClick={setDeleteModalSelected}><i
                  className="material-icons">&#xE15C;</i> <span>Delete</span></a>
              </div>
            </div>
          </div>
          <MainResult />
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>
                  <span className="custom-checkbox">
                    <input type="checkbox" id="selectAll" checked={allCheckCheckbox} onChange={selectAllCheckboxes} />
                    <label htmlFor="selectAll"></label>
                  </span>
                </th>
                {data.columnTitles.map((columnTitle, i) => {
                  return (
                    <th key={i}>{columnTitle.Field}</th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {data.details.map((detail, j) => {
                return (
                  <tr key={j}>
                    <td>
                      <span className="custom-checkbox">
                        {/* <input type="checkbox" id={`checkbox${detail.id}`} name="options" value={j} onChange={selectCheckboxes} checked={checkboxes[j]} key={j} /> */}
                        <input type="checkbox" id={`checkbox${detail.id}`} name="options" value={j} onChange={selectCheckboxes} checked={detail.checkbox} data-id={`${detail.id}`} />
                        <label htmlFor={`checkbox${detail.id}`}></label>
                      </span>
                    </td>
                    <td className="abbreviation max-width-30">{detail.id}</td>
                    <td className="popup abbreviation max-width-180" onClick={popupDetail}>{detail.title}</td>
                    <td className="popup abbreviation max-width-190" onClick={popupDetail}>{detail.url}</td>
                    <td className="abbreviation max-width-80">{detail.effectivedate}</td>
                    <td className="abbreviation max-width-30">{detail.category}</td>
                    <td className="abbreviation max-width-30">{detail.valid}</td>
                    <td className="abbreviation max-width-30">{detail.sortorder}</td>
                    <td>
                      <a href="#editRecordModal" 
                      className="edit" 
                      data-toggle="modal" 
                      id={`${detail.id}Edit`} 
                      data-id={`${detail.id}`} 
                      data-title={`${detail.title}`} 
                      data-url={`${detail.url}`} 
                      data-effectivedate={`${detail.effectivedate}`} 
                      data-category={`${detail.category}`} 
                      data-valid={`${detail.valid}`} 
                      data-sortorder={`${detail.sortorder}`} 
                      onClick={() => { 
                        dispatch(messageClear()); 
                        dispatch(setEditModalLedger(detail.id)) 
                      }}><i className="material-icons"
                        data-toggle="tooltip" title="Edit">&#xE254;</i></a>
                      <a href="#deleteRecordModal" className="delete" data-toggle="modal" data-id={`${detail.id}`} onClick={setDeleteModal}><i
                        className="material-icons" data-toggle="tooltip" title="Delete">&#xE872;</i></a>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="clearfix">
            <div className="hint-text">全 <b>{data.allCount}</b> 件中 <b>{data.displayCount}</b> 件表示</div>
            <ul className="pagination">
              {data.pagePrev.map((prev,l) => {
                if (prev.prev) {
                  return (
                    <li className="page-item" key={l} onClick={() => { dispatch(fetchAsyncGetControlLedger(prev.page)); initCheckboxes(); dispatch(messageClear()) }}><a >Previous</a></li>
                  )
                } else {
                  return (
                    <li className="page-item disabled" key={l}><a>Previous</a></li>
                  )
                }
              })}

              {data.pageNation.map((nation, l) => {
                if (nation.active) {
                  return (
                    // <li className="page-item active" key={l} onClick={() => dispatch(fetchAsyncGetCategory(nation.page))} ><a className="page-link">{nation.page}</a></li> 
                    <li className="page-item active" key={l} onClick={() => { dispatch(fetchAsyncGetControlLedger(nation.page)); initCheckboxes(); dispatch(messageClear()) }} ><a className="page-link">{nation.page}</a></li>

                  )
                } else {
                  return (
                    <li className="page-item" key={l} onClick={() => { dispatch(fetchAsyncGetControlLedger(nation.page)); initCheckboxes(); dispatch(messageClear()) }}><a
                      className="page-link">{nation.page}</a></li>
                  )
                }
              })}
              {data.pageNext.map((next,l) => {
                if (next.next) {
                  return (
                    <li key={l} className="page-item" onClick={() => { dispatch(fetchAsyncGetControlLedger(next.page)); initCheckboxes(); dispatch(messageClear()) }}><a className="page-link">Next</a></li>
                  )
                } else {
                  return (
                    <li key={l} className="page-item disabled"><a>Next</a></li>
                  )
                }
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* <!-- Add Modal HTML --> */}
      <div id="addRecordModal" className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={(e) => (handleInsertSubmit(e))}>
              <div className="modal-header">
                <h4 className="modal-title">レコード追加 {data.pageTitle}</h4>
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true" ref={insertClose} >&times;</button>
              </div>
              <div className="modal-body">
                {data.columnTitles.map((columnTitle, i) => {
                  if (columnTitle.date) {
                    return (
                      <div key={i} className="form-group text-left">
                        <label>{columnTitle.Field}</label>
                        <input type="date" className="form-control" id={columnTitle.Field} name={columnTitle.Field} value={columnTitle.value} onChange={(e) => dispatch(changeInsertModalLedger(e))} required />
                      </div>
                    )
                  } else if (columnTitle.category) {
                    return (
                      <div key={i} className="form-group text-left">
                        <label>{columnTitle.Field}</label>
                        <select className="form-control" id={columnTitle.Field} name={columnTitle.Field} value={columnTitle.value} onChange={(e) => dispatch(changeInsertModalLedger(e))} required>
                          {data.categories.map((category, j) => {
                            return (
                              <option key={j} value={`${category.id}`}>{category.categoryname}</option>
                            )
                          })}
                        </select>
                      </div>
                    )

                  } else if (columnTitle.valid) {
                    return (
                      <div key={i} className="form-group text-left">
                        <label>{columnTitle.Field}</label>
                        <select className="form-control" id={columnTitle.Field} name={columnTitle.Field} value={columnTitle.value} onChange={(e) => dispatch(changeInsertModalLedger(e))} required>
                          {data.isValid.map((valid, j) => {
                            return (
                              <option key={j} value={`${valid.value}`}>{valid.title}</option>
                            )
                          })}
                        </select>
                      </div>
                    )
                  } else {
                    return (
                      <div key={i} className="form-group text-left">
                        <label>{columnTitle.Field}</label>
                        <input type="text" className="form-control" id={columnTitle.Field} name={columnTitle.Field} value={columnTitle.value} onChange={(e) => dispatch(changeInsertModalLedger(e))} required />
                      </div>
                    )
                  }
                })}
              </div>
              <div className="modal-footer">
                <input type="hidden" name="currentPage" value="{{specifiedPage}}" />
                <input type="button" className="btn btn-default" data-dismiss="modal" value="Cancel" />
                <input type="submit" className="btn btn-success" value="Add" />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* <!-- Delete Modal HTML --> */}
      <div id="deleteRecordModal" className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={(e) => (handleDeleteSubmit(e))}>
              <div className="modal-header">
                <h4 className="modal-title">レコード削除 {data.pageTitle}</h4>
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true" ref={deleteClose}>&times;</button>
              </div>
              <div className="modal-body">
                <p>以下のレコードを削除してよろしいですか?</p>
                <p className="text-warning lead"><small>id:<span id="deletingTarget">{deleteIds}</span></small></p>
                <input type="hidden" name="{data.colmunTitleId}" id="ids" />
              </div>
              <div className="modal-footer">
                <input type="hidden" name="currentPage" value="{data.specifiedPage}" />
                <input type="button" className="btn btn-default" data-dismiss="modal" value="Cancel" />
                <input type="submit" className="btn btn-danger" value="Delete" />
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* <!-- Edit Modal HTML --> */}
      <div id="editRecordModal" className="modal fade">
        <div className="modal-dialog">
          <div className="modal-content">
            <form onSubmit={(e) => (handleEditSubmit(e))}>
              <div className="modal-header">
                <h4 className="modal-title">レコード更新 {data.pageTitle}</h4>
                <button type="button" className="close" data-dismiss="modal" aria-hidden="true" ref={editClose} >&times;</button>
              </div>
              <div className="modal-body">
                <div className="form-group text-left">
                  <label>{data.columnTitleId.Field}</label>
                  <input type="text" className="form-control" name="id" id={`${data.columnTitleId.Field}Edit`} value={data.columnTitleId.value} readOnly />
                </div>
                {data.columnTitlesModal.map((columnTitleModal, i) => {
                  if (columnTitleModal.date) {
                    return (
                      <div key={i} className="form-group text-left">
                        <label>{columnTitleModal.Field}</label>
                        <input type="date" className="form-control" name={columnTitleModal.Field} id={`${columnTitleModal.Field}Edit`} value={columnTitleModal.value} onChange={(e) => dispatch(changeEditModalLedger(e))} required />
                      </div>
                    )
                  } else if (columnTitleModal.category) {
                    return (
                      <div key={i} className="form-group text-left">
                        <label>{columnTitleModal.Field}</label>
                        <select className="form-control" name={columnTitleModal.Field} id={`${columnTitleModal.Field}Edit`} value={columnTitleModal.value} onChange={(e) => dispatch(changeEditModalLedger(e))} required>
                          {data.categories.map((category, j) => {
                            return (
                              <option key={j} value={`${category.id}`}>{category.categoryname}</option>
                            )
                          })}
                        </select>
                      </div>
                    )

                  } else if (columnTitleModal.valid) {
                    return (
                      <div key={i} className="form-group text-left">
                        <label>{columnTitleModal.Field}</label>
                        <select className="form-control" name={columnTitleModal.Field} id={`${columnTitleModal.Field}Edit`} value={columnTitleModal.value} onChange={(e) => dispatch(changeEditModalLedger(e))} required>
                          {data.isValid.map((valid, j) => {
                            return (
                              <option key={j} value={`${valid.value}`}>{valid.title}</option>
                            )
                          })}
                        </select>
                      </div>
                    )
                  } else {
                    return (
                      <div key={i} className="form-group text-left">
                        <label>{columnTitleModal.Field}</label>
                        <input type="text" className="form-control" name={columnTitleModal.Field} id={`${columnTitleModal.Field}Edit`} value={columnTitleModal.value} onChange={(e) => dispatch(changeEditModalLedger(e))} required />
                      </div>
                    )
                  }
                })}

              </div>
              <div className="modal-footer">
                <input type="hidden" name="currentPage" value="{{specifiedPage}}" />
                <input type="button" className="btn btn-default" data-dismiss="modal" value="Cancel" />
                <input type="submit" className="btn btn-info" value="Save" />
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default CrudControlLedger
import React from 'react'
import { useDispatch } from 'react-redux';
import {
    menuCrudCategory,
    menuCrudControlLedger,
    menuLegalControlLedger,
} from "./menuSelectSlice";
import { messageClear } from '../legalControlLedger/messageSlice';

//メニューボタンを押して、押されたらstateを書き換えるコンポーネント
//ボタンを押す→dispatchでアクションを送る→stateのmenuSelectが変わる
//画面を切り替えるのはApp.tsxの仕事で、このファイルはどの画面にするかを指示するだけ

//Menuというコンポーネントの部品を作る : 型の指定（これはReactの関数だよとTypeScriptに伝える） 
const Menu: React.FC = () => {
    //storeで指示を受け取る係をdispatchで受け取る フックの準備
    const dispatch = useDispatch();

    //MenuというReactの関数コンポーネントが呼ばれたら、returnの中身を返す
    //中身はJSXで記載して、App.tsxで<Menu />と記載すると呼び出すことができる
    //onClickイベントで複数の処理を実行させる場合は、{}で囲み、処理を;で区切る必要がある
    return (
        <div>
            <p></p>
            <div className="py-4 m-3">
                <section id="buttons" className="mt-3">
                    <div className="container text-center">
                        <div className="row ">
                            <div className="col-md-12 col-lg-12">
                                <div className="btn-group btn-group-toggle mt-1" data-toggle="buttons">
                                    <button className="btn btn-primary " type="button" onClick={() => dispatch(menuLegalControlLedger())}>法規制管理台帳</button>
                                    <button className="btn btn-info " type="button" onClick={() => {
                                        dispatch(messageClear());
                                        dispatch(menuCrudCategory());
                                    }}>カテゴリーテーブル・メンテ</button>
                                    <button className="btn btn-success " type="button" onClick={() => {
                                        dispatch(messageClear());
                                        dispatch(menuCrudControlLedger());
                                    }}>明細テーブル・メンテ</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default Menu
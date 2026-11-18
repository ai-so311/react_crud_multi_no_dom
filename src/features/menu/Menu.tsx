import React from 'react'
import { useDispatch } from 'react-redux';
import {
    menuCrudCategory,
    menuCrudControlLedger,
    menuLegalControlLedger,
} from "./menuSelectSlice";

const Menu: React.FC = () => {
    const dispatch = useDispatch();

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
                                    <button className="btn btn-info " type="button" onClick={() => dispatch(menuCrudCategory())}>カテゴリーテーブル・メンテ</button>
                                    <button className="btn btn-success " type="button" onClick={() => dispatch(menuCrudControlLedger())}>明細テーブル・メンテ</button>
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
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../app/store";
import { fetchAsyncGetLclList, lclList } from "../legalControlLedgerSlice";

const LegalControlLedger: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const lcl = useSelector(lclList);

  // 表示するデータを取得するために、useEffectでlegalControlLedgerSliceの
  // 法規制管理台帳表示用データを取得する非同期関数をdispatchする
  useEffect(() => {
    dispatch(fetchAsyncGetLclList());
  }, [dispatch]);

  return (
    <div>
      <main role="main" className="container text-left">
        {/* 一覧のタイトル部分 */}
        <div className="d-flex align-items-center p-3 my-3 text-white-50 bg-purple rounded shadow-sm">
          <img
            className="mr-3"
            src="./images/logo_hotwave_2.jpg"
            alt=""
            width="116"
            height="48"
          />
          <div className="lh-100">
            <h6 className="mb-0 text-white lh-100">{lcl.pageTitle}</h6>
            <small>Since 2020/2/1</small>
          </div>
        </div>

        {/* categoryのまとまり、1つ目のループ */}
        {lcl.ledgers.map((ledger) => (
          <div key={ledger.category} className="my-3 p-3 bg-white rounded shadow-sm">
            <h6 className="border-bottom border-gray pb-2 mb-0">
              {ledger.categoryName}
            </h6>

            {/* detailのまとまり、2つ目のループ */}
            {ledger.detail.map((d) => (
              <div key={d.url} className="media text-muted pt-3">
                <svg
                  className="bd-placeholder-img mr-2 rounded"
                  width="32"
                  height="32"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid slice"
                  focusable="false"
                  role="img"
                  aria-label="Placeholder: 32x32"
                >
                  <title>Placeholder</title>
                  <rect width="100%" height="100%" fill={ledger.categoryColor} />
                  <text x="50%" y="50%" fill={ledger.categoryColor} dy=".3em">
                    32x32
                  </text>
                </svg>
                <p className="media-body pb-3 mb-0 small lh-125 border-bottom border-gray">
                  <strong className="d-block text-gray-dark">
                    <a href={d.url}>{d.title}</a>
                  </strong>
                  {d.effectivedate}
                </p>
              </div>
            ))}
          </div>
        ))}
      </main>
    </div>
  );
};

export default LegalControlLedger;
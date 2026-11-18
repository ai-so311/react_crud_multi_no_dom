import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../../app/store";
import { fetchAsyncGetLclList, lclList } from "../legalControlLedgerSlice";

const LegalControlLedger: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const lcl = useSelector(lclList);

  useEffect(() => {
    dispatch(fetchAsyncGetLclList());
  }, [dispatch]);

  return (
    <>
      <h2>{lcl.pageTitle}</h2>
      {lcl.ledgers.map((ledger) => (
        <div key={ledger.category}>
          <h3 style={{ color: ledger.categoryColor }}>{ledger.categoryName}</h3>
          {ledger.detail.map((d) => (
            <div key={d.url}>
              <a href={d.url} target="_blank" rel="noreferrer">{d.title}</a>
              <span> （施行日: {d.effectivedate}）</span>
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default LegalControlLedger;
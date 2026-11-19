import { configureStore } from "@reduxjs/toolkit";
//menuSelectSliceのReducerだけをimportしている
import menuSelectSlice from "../features/menu/menuSelectSlice";
import messageSlice from "../features/legalControlLedger/messageSlice";
import legalControlLedgerSlice from "../features/legalControlLedger/legalControlLedgerSlice";

export const store = configureStore({
  reducer: {
    //reducerにmenuSelectとして設定
    menuSelect: menuSelectSlice,
    lclState: legalControlLedgerSlice,
    message: messageSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
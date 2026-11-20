import { configureStore } from "@reduxjs/toolkit";
import menuSelectSlice from "../features/menu/menuSelectSlice";
import messageSlice from "../features/legalControlLedger/messageSlice";
import legalControlLedgerSlice from "../features/legalControlLedger/legalControlLedgerSlice";
import crudCategorySlice from "../features/legalControlLedger/crudCategorySlice";   // 追加

export const store = configureStore({
  reducer: {
    menuSelect: menuSelectSlice,
    lclState: legalControlLedgerSlice,
    message: messageSlice,
    crudCategory: crudCategorySlice,   // 追加
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { configureStore } from "@reduxjs/toolkit";
import menuSelectSlice from "../features/menu/menuSelectSlice";
import legalControlLedgerSlice from "../features/legalContltolLedger/legalControlLedger/LegalControlLedger";

export const store = configureStore({
  reducer: {
    menuSelect: menuSelectSlice,
    lclState: legalControlLedgerSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
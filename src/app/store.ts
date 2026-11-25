import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import lclReducer from "../features/legalControlLedger/legalControlLedgerSlice";
import categoryReducer from '../features/legalControlLedger/crudCategorySlice';
import controlLedgerReducer from '../features/legalControlLedger/crudControlLedgerSlice';
import messageReducer from '../features/legalControlLedger/messageSlice';
import menuSelectReducer from '../features/menu/menuSelectSlice';

export const store = configureStore({
  reducer: {
    menuSelect: menuSelectReducer,
    lclState: lclReducer,
    message: messageReducer,
    crudCategory: categoryReducer,
    crudControlLedger: controlLedgerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
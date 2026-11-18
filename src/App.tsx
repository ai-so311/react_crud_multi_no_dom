import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import ./'App.css';
import Header from "./features/parts/Header";
import Footer from "./features/parts/Footer";
import Menu from "./features/menu/Menu";
import { menuSelectData } from "./features/menu/menuSelectSlice";
import LegalControlLedger from "./features/legalControlLedger/legalControlLedger/LegalControlLedger";
import CrudCategory from "./features/legalControlLedger/crudLegalCategory/CrudCategory";
import CrudControlLedger from "./features/legalControlLedger/crudControlLedger/CrudControlLedger";

const App: React.FC = () => {
  const menu = useSelector(menuSelectData);

  const useComponent = useMemo(() => {
    switch (menu.menuSelect) {
      case "crudCategory":
        return <CrudCategory />;
      case "crudControlLedger":
        return <CrudControlLedger />;
      default:
        return <LegalControlLedger />;
    }
  }, [menu.menuSelect]);

  return (
    <div className="App">
      <Header />
      <Menu />
      {useComponent}
      <Footer />
    </div>
  );
};

export default App;

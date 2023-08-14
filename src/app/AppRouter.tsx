import {FunctionComponent} from "react";
import {Route, Routes} from "react-router-dom";
import {RouterPaths} from "../utils/RouterPaths";
import QuoteBuilderComponent from "../components/QuoteBuilder/QuoteBuilderComponent";
import LabelMakerComponent from "../components/LabelMaker/LabelMakerComponent";
import RolodexComponent from "../components/Rolodex/RolodexComponent";

const AppRouter: FunctionComponent = () => {
    return (
        <Routes>
          <Route path={RouterPaths.Empty} element={<QuoteBuilderComponent />} />
          <Route path={RouterPaths.QuoteBuilder} element={<QuoteBuilderComponent />} />
          <Route path={RouterPaths.LabelMaker} element={<LabelMakerComponent />} />
          <Route path={RouterPaths.Rolodex} element={<RolodexComponent />} />
        </Routes>
    );
}

export default AppRouter;
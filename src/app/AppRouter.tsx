import {FunctionComponent} from "react";
import {Route, Routes} from "react-router-dom";
import {RouterPaths} from "../utils/RouterPaths";
import QuoteBuilderComponent from "../components/QuoteBuilder/QuoteBuilderComponent";
import LabelMakerComponent from "../components/LabelMaker/LabelMakerComponent";
import RolodexComponent from "../components/Rolodex/RolodexComponent";
import PartCollectorComponent from "../components/PartCollector/PartCollectorComponent";

const AppRouter: FunctionComponent = () => {
    return (
        <Routes>
          <Route path={RouterPaths.Empty} element={<QuoteBuilderComponent />} />
          <Route path={RouterPaths.QuoteBuilder} element={<QuoteBuilderComponent />} />
          <Route path={RouterPaths.LabelMaker} element={<LabelMakerComponent />} />
          <Route path={RouterPaths.Rolodex} element={<RolodexComponent />} />
          <Route path={RouterPaths.PartCollector} element={<PartCollectorComponent />} />
        </Routes>
    );
}

export default AppRouter;
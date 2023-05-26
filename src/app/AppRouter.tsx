import {FunctionComponent} from "react";
import {Route, Routes} from "react-router-dom";
import {RouterPaths} from "../utils/RouterPaths";
import MainComponent from "../components/Main/MainComponent";

const AppRouter: FunctionComponent = () => {
    return (
        <Routes>
            <Route path={RouterPaths.Empty} element={<MainComponent />} />
        </Routes>
    );
}

export default AppRouter;
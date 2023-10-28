import React, { FunctionComponent } from "react";
import NavBar from "../_shared/NavBar/NavBar";
import Version from "../_shared/Version/Version";
import { Tabs } from "../_shared/NavBar/Tabs";
import { CurrentView } from "./CurrentView";
import AddPartsComponent from "./AddParts/AddPartsComponent";
import ViewPartsComponent from "./ViewParts/ViewPartsComponent";
import { useDispatch, useSelector } from "react-redux";
import { updateCurrentView } from "../../redux/slices/partSlice";

const PartCollectorComponent: FunctionComponent = () => {

  // const [currentView, setCurrentView] = useState<CurrentView>(CurrentView.ADD_PARTS);

  const dispatch = useDispatch();
  const currentView: CurrentView = useSelector((state: any) => state.partStore.currentView);

  return (
    <div className={"App"}>
      <NavBar
        activeTab={Tabs.PART_COLLECTOR}
        currentView={currentView}
      showAddParts={() => dispatch(updateCurrentView(CurrentView.ADD_PARTS))}
      showViewParts={() => dispatch(updateCurrentView(CurrentView.VIEW_PARTS))} />
      <Version />
      {currentView === CurrentView.ADD_PARTS && (
        <AddPartsComponent />
      )}
      {currentView === CurrentView.VIEW_PARTS && (
        <ViewPartsComponent />
      )}
    </div>
  );
};

export default React.memo(PartCollectorComponent);
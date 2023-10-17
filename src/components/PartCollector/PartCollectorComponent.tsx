import React, { FunctionComponent, useState } from "react";
import NavBar from "../_shared/NavBar/NavBar";
import Version from "../_shared/Version/Version";
import { Tabs } from "../_shared/NavBar/Tabs";
import { CurrentView } from "./CurrentView";
import AddPartsComponent from "./AddParts/AddPartsComponent";
import ViewPartsComponent from "./ViewParts/ViewPartsComponent";

const PartCollectorComponent: FunctionComponent = () => {

  const [currentView, setCurrentView] = useState<CurrentView>(CurrentView.ADD_PARTS);

  return (
    <div className={"App"}>
      <NavBar
        activeTab={Tabs.PART_COLLECTOR}
        currentView={currentView}
        showAddParts={() => setCurrentView(CurrentView.ADD_PARTS)}
        showViewParts={() => setCurrentView(CurrentView.VIEW_PARTS)} />
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
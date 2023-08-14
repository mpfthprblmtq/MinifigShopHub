import React, { FunctionComponent } from "react";
import { Typography } from "@mui/material";
import NavBar from "../_shared/NavBar/NavBar";
import Version from "../_shared/Version/Version";
import { Tabs } from "../_shared/NavBar/Tabs";

const LabelMakerComponent: FunctionComponent = () => {
  return (
    <div className={"App"}>
      <NavBar activeTab={Tabs.LABEL_MAKER} />
      <Version />
      <Typography>Label Maker coming soon!</Typography>
    </div>
  );
};

export default LabelMakerComponent;
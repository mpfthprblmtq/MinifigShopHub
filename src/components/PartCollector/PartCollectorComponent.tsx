import React, { FunctionComponent } from "react";
import { Typography } from "@mui/material";
import NavBar from "../_shared/NavBar/NavBar";
import Version from "../_shared/Version/Version";
import { Tabs } from "../_shared/NavBar/Tabs";

const PartCollectorComponent: FunctionComponent = () => {
  return (
    <div className={"App"}>
      <NavBar activeTab={Tabs.PART_COLLECTOR} />
      <Version />
      <Typography>Part Collector coming soon!</Typography>
    </div>
  );
};

export default React.memo(PartCollectorComponent);
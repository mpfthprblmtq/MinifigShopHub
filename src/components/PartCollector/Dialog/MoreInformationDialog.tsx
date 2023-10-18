import { FunctionComponent } from "react";
import { PartDisplay } from "../../../model/partCollector/PartDisplay";

interface MoreInformationDialogParams {
  open: boolean;
  onClose: () => void;
  part?: PartDisplay;
}

const MoreInformationDialog: FunctionComponent<MoreInformationDialogParams> = ({open, onClose, part}) => {

  return (
    <></>
  )
}

export default MoreInformationDialog;
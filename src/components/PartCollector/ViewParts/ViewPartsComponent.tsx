import { FunctionComponent, useEffect } from "react";
import { usePartsService } from "../../../hooks/dynamo/usePartsService";

const ViewPartsComponent: FunctionComponent = () => {

  const { getAllParts } = usePartsService();

  useEffect(() => {
    getAllParts().then(parts => console.log(parts));
  }, [getAllParts]);

  return (<></>);
}

export default ViewPartsComponent;
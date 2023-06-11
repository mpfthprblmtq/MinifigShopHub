import {FunctionComponent} from "react";
import {Dialog} from "@mui/material";
import {Item} from "../../../model/item/Item";

interface ImageDialogParams {
    open: boolean;
    onClose: () => void;
    item?: Item;
}

const ImageDialog: FunctionComponent<ImageDialogParams> = ({open, onClose, item}) => {

    return (
        <Dialog open={open} onClose={onClose}>
            <img src={item?.image_url} alt="bricklink-img" />
        </Dialog>
    )
}

export default ImageDialog;
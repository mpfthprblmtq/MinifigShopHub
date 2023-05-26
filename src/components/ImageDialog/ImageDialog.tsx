import {FunctionComponent} from "react";
import {Dialog} from "@mui/material";

interface ImageDialogParams {
    open: boolean;
    onClose: () => void;
    imageUrl: string;
}

const ImageDialog: FunctionComponent<ImageDialogParams> = ({open, onClose, imageUrl}) => {

    return (
        <Dialog open={open} onClose={onClose}>
            <img src={imageUrl} alt="bricklink-img" />
        </Dialog>
    )
}

export default ImageDialog;
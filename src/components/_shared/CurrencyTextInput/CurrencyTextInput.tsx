import { forwardRef, FunctionComponent, ReactNode } from "react";
import {NumericFormat, NumericFormatProps} from "react-number-format";
import {TextField} from "@mui/material";

interface NumericFormatCustomParams {
    onChange: (event: { target: { value: string } }) => void;
}

const NumericFormatCustom = forwardRef<NumericFormatProps, NumericFormatCustomParams>(
    function NumericFormatCustom(props, ref) {
        const { onChange, ...other } = props;

        return (
            <NumericFormat
                {...other}
                getInputRef={ref}
                onValueChange={(event) => {
                    onChange({
                        target: {
                            value: event.value,
                        },
                    });
                }}
                thousandSeparator
                valueIsNumericString
                prefix="$ "
            />
        );
    },
);

interface CurrencyTextInputParams {
    value?: string;
    label?: string;
    readonly?: boolean;
    onChange: (event: any) => void;
    onBlur?: (event: any) => void;
    color?: string;
    error?: boolean;
    helperText?: string;
    endAdornment?: ReactNode;
}

const CurrencyTextInput: FunctionComponent<CurrencyTextInputParams> =
    ({value, label, readonly, onChange, onBlur, color, error, helperText, endAdornment}) => {

    return (
        <TextField
            sx={{
                input: { color: color, backgroundColor: 'white' }
            }}
            label={label ?? ''}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            InputProps={{
              inputComponent: NumericFormatCustom as any,
              readOnly: readonly ?? false,
              endAdornment: endAdornment
            }}
            variant="outlined"
            error={error}
            helperText={helperText}
        />
    );
};

export default CurrencyTextInput;
import {forwardRef, FunctionComponent} from "react";
import {NumericFormat, NumericFormatProps} from "react-number-format";
import {TextField} from "@mui/material";

interface CustomProps {
    onChange: (event: { target: { name: string; value: string } }) => void;
    name: string;
}

const NumericFormatCustom = forwardRef<NumericFormatProps, CustomProps>(
    function NumericFormatCustom(props, ref) {
        const { onChange, ...other } = props;

        return (
            <NumericFormat
                {...other}
                getInputRef={ref}
                onValueChange={(values) => {
                    onChange({
                        target: {
                            name: props.name,
                            value: values.value,
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
    onBlur: (event: any) => void;
}

const CurrencyTextInput: FunctionComponent<CurrencyTextInputParams> =
    ({value, label, readonly, onChange, onBlur}) => {

    return (
        <TextField
            style={{backgroundColor: 'white'}}
            label={label ?? ''}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            id="formatted-currency-input"
            InputProps={{
                inputComponent: NumericFormatCustom as any,
                readOnly: readonly ?? false,
            }}
            variant="outlined"
        />
    );
};

export default CurrencyTextInput;
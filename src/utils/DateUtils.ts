import dayjs, { Dayjs } from "dayjs";

export const formatDate = (date: Dayjs | undefined): string => {
    if (date) {
        return dayjs(date).format('MM/DD/YYYY');
    }
    return '';
}
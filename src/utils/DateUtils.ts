import {SalesHistory} from "../model/salesHistory/SalesHistory";

export const formatDate = (dateString: string | undefined): string => {
    if (dateString) {
        return new Date(dateString).toLocaleDateString();
    }
    return '';
};

export const filterOutOldDates = (salesHistory: SalesHistory): SalesHistory => {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    salesHistory.price_detail = salesHistory.price_detail
        .filter(priceDetail =>
            (priceDetail.date_ordered ? new Date(priceDetail.date_ordered) : new Date()) >= sixMonthsAgo);
    return salesHistory;
};
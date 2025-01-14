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
    salesHistory.sales = salesHistory.sales
        .filter(sale =>
            (sale.date ? new Date(sale.date) : new Date()) >= sixMonthsAgo);
    return salesHistory;
};
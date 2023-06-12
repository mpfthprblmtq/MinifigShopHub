import {SalesHistory} from "../model/salesHistory/SalesHistory";

export const formatDate = (dateString: string | undefined): string => {
    if (dateString) {
        return new Date(dateString).toLocaleDateString();
    }
    return '';
};

export const filterOutOldDates = (salesHistory: SalesHistory): SalesHistory => {
    if (salesHistory.price_detail && salesHistory.price_detail[0].date_ordered) {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        salesHistory.price_detail.forEach((priceDetail) => {
            if (new Date(priceDetail.date_ordered!) < sixMonthsAgo) {
                salesHistory.unit_quantity = salesHistory.unit_quantity - 1;
                salesHistory.total_quantity = salesHistory.total_quantity - priceDetail.quantity;

                const index = salesHistory.price_detail.findIndex(pd => pd === priceDetail);
                salesHistory.price_detail.splice(index, 1);
            }
        });
    }
    return salesHistory;
};
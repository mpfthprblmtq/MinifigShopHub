export interface PriceDetail {
    quantity: number;
    unit_price: string;
    seller_country_code?: string;
    buyer_country_code?: string;
    date_ordered?: string;
}
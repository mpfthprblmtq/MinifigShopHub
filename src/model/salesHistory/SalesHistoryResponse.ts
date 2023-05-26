import {Meta} from "../shared/Meta";
import {SalesHistory} from "./SalesHistory";

export interface SalesHistoryResponse {
    meta: Meta;
    data: SalesHistory;
}
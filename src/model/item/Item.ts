import {Condition} from "../_shared/Condition";
import {Source} from "../_shared/Source";
import {Type} from "../_shared/Type";
import {RetailStatus} from "../retailStatus/RetailStatus";
import { AllSalesHistory } from "../salesHistory/AllSalesHistory";

export interface Item {
    id: number;
    setId?: string;
    brickLinkId?: string;
    name: string;
    theme?: string;
    subTheme?: string;
    imageUrl?: string;
    thumbnailUrl?: string;
    year?: number;
    pieceCount?: number;
    minifigCount?: number;
    type: Type;
    sources: Source[];
    messages?: string[];
    retailStatus?: RetailStatus;
    salesHistory?: AllSalesHistory;
    condition: Condition;
    baseValue: number;
    valueAdjustment: number;
    value: number;
    comment?: string;
}
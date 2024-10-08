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
    yearReleased?: number;
    pieceCount?: number;
    minifigCount?: number;
    condition: Condition;
    baseValue: number;
    valueAdjustment: number;
    value: number;
    brickEconomyValue?: number;
    comment?: string;
    sources: Source[];
    type: Type;
    retailStatus?: RetailStatus;
    salesData?: AllSalesHistory;
    messages?: string[];
}
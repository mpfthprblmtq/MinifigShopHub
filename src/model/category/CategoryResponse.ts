import {Meta} from "../shared/Meta";
import {Category} from "./Category";

export interface CategoryResponse {
    meta: Meta;
    data: Category;
}
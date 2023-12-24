import { Quote } from "../quote/Quote";

export interface SavedQuote {
  id: string;
  quote: Quote;
  customerInfo: string;
  inputtedBy: string;
  keyWords: string[];
  date: string;
}
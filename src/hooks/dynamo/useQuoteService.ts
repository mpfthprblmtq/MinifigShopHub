import { SavedQuote } from "../../model/dynamo/SavedQuote";
import { db, QuotesTable } from "../../db.config";
import { v4 as uuidv4 } from 'uuid';
import { DocumentClient } from "aws-sdk/clients/dynamodb";

export interface UseQuoteServiceHooks {
  saveQuote: (savedQuote: SavedQuote) => Promise<void>;
  loadQuotes: () => Promise<SavedQuote[]>;
  deleteQuote: (id: string) => Promise<void>;
}

export const useQuoteService = (): UseQuoteServiceHooks => {

  const saveQuote = async (savedQuote: SavedQuote): Promise<void> => {
    const params = {
      Item: {
        'id': uuidv4(),
        'quote': JSON.stringify(savedQuote)
      },
      TableName: QuotesTable
    };

    try {
      await db.put(params).promise();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const loadQuotes = async (): Promise<SavedQuote[]> => {
    const quotes: SavedQuote[] = [];
    const params = { TableName: QuotesTable };

    try {
      const data: DocumentClient.ScanOutput = await db.scan(params).promise();
      const quoteResults = data.Items;
      if (quoteResults) {
        quoteResults.forEach(quote => {
          quotes.push({ ...JSON.parse(quote.quote), id: quote.id });
        });
        return quotes;
      } else {
        return [];
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  const deleteQuote = async (id: string) => {
    const params = {
      Key: {
        'id': id
      },
      TableName: QuotesTable
    };
    try {
      await db.delete(params).promise();
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  return { saveQuote, loadQuotes, deleteQuote };
}
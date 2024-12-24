import { SavedQuote } from "../../model/dynamo/SavedQuote";
import { db, QuoteKeyTable, QuotesTable } from "../../db.config";
import { v4 as uuidv4 } from 'uuid';
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { SavedQuoteKey } from "../../model/dynamo/SavedQuoteKey";

export interface UseQuoteServiceHooks {
  saveQuote: (savedQuote: SavedQuote) => Promise<void>;
  loadQuoteKeys: () => Promise<SavedQuoteKey[]>;
  loadQuote: (id: string) => Promise<SavedQuote>;
  deleteQuote: (id: string) => Promise<void>;
}

export const useQuoteService = (): UseQuoteServiceHooks => {

  const saveQuote = async (quote: SavedQuote): Promise<void> => {
    // id to be used by both tables
    const id: string = uuidv4();

    // create a key object from the main quote
    const quoteKey: SavedQuoteKey = {
      id: id,
      customerInfo: quote.customerInfo,
      inputtedBy: quote.inputtedBy,
      keyWords: quote.keyWords,
      date: quote.date,
      sets: quote.quote.items.map(item => `${item.setId} - ${item.name}`)
    } as SavedQuoteKey;

    // params for the quote key
    const quoteKeyParams = {
      Item: {
        'id': id,
        'key': JSON.stringify(quoteKey)
      },
      TableName: QuoteKeyTable
    }

    // params for the main quote
    const quoteParams = {
      Item: {
        'id': id,
        'quote': JSON.stringify(quote)
      },
      TableName: QuotesTable
    };

    const promises = [
      db.put(quoteKeyParams).promise(),
      db.put(quoteParams).promise()
    ];
    const results = await Promise.allSettled(promises);
    if (results[0].status === 'fulfilled' && results[1].status === 'fulfilled') {
      // all good
    } else if ((results[0].status === 'fulfilled' && results[1].status === 'rejected')
      || (results[0].status === 'rejected' && results[1].status === 'fulfilled')
      || (results[0].status === 'rejected' && results[1].status === 'rejected')) {
      await deleteQuote(id);
      throw new Error('Error saving quote to database!');
    }
  };

  const loadQuoteKeys = async (): Promise<SavedQuoteKey[]> => {
    const quoteKeys: SavedQuoteKey[] = [];
    const params = { TableName: QuoteKeyTable };

    try {
      const data: DocumentClient.ScanOutput = await db.scan(params).promise();
      const quoteKeyResults = data.Items;
      if (quoteKeyResults) {
        quoteKeyResults.forEach(quoteKey => {
          quoteKeys.push({ ...JSON.parse(quoteKey.key), id: quoteKey.id });
        });
        return quoteKeys;
      } else {
        return [];
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const loadQuote = async (id: string): Promise<SavedQuote> => {
    const params = { Key: { id: id }, TableName: QuotesTable };

    try {
      const quoteData = await db.get(params).promise();
      if (quoteData.Item) {
        return JSON.parse(quoteData.Item.quote) as SavedQuote;
      }
      return {} as SavedQuote;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteQuote = async (id: string) => {
    const quoteKeyParams = { Key: { 'id': id }, TableName: QuoteKeyTable };
    const quoteParams = { Key: { 'id': id }, TableName: QuotesTable };

    const promises = [
      db.delete(quoteKeyParams).promise(),
      db.delete(quoteParams).promise()
    ];
    const results = await Promise.allSettled(promises);
    if (results[0].status === 'fulfilled' && results[1].status === 'fulfilled') {
      // all good
    } else if ((results[0].status === 'fulfilled' && results[1].status === 'rejected')
      || (results[0].status === 'rejected' && results[1].status === 'fulfilled')
      || (results[0].status === 'rejected' && results[1].status === 'rejected')) {
      throw new Error('Error deleting quote from database!');
    }
  };

  return { saveQuote, loadQuote, loadQuoteKeys, deleteQuote };
}
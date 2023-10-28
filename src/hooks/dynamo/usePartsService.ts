import { PartDisplay } from "../../model/partCollector/PartDisplay";
import { db, PartsTable } from "../../db.config";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Part } from "../../model/partCollector/Part";
import { v4 as uuidv4 } from 'uuid';

export interface PartsServiceHooks {
  getAllParts: () => Promise<PartDisplay[]>;
  addPartToDatabase: (part: Part, quantity: number, comment: string, set: string) => Promise<string>;
  deletePartFromDatabase: (key: string) => Promise<void>;
}

export const usePartsService = (): PartsServiceHooks => {

  const getAllParts = async (): Promise<PartDisplay[]> => {
    const parts: PartDisplay[] = [];
    const params = { TableName: PartsTable };
    try {
      const data: DocumentClient.ScanOutput = await db.scan(params).promise();
      const items = data.Items;
      if (items) {
        items.forEach(item => {
          parts.push({
            key: item.key,
            quantity: item.quantity,
            comment: item.comment,
            set: item.set,
            part: JSON.parse(item.part)
          } as PartDisplay)
        });
        return parts;
      } else {
        return [];
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const addPartToDatabase = async (part: Part, quantity: number, comment: string, set: string): Promise<string> => {
    const key: string = uuidv4();
    const params = {
      Item: {
        'key': key,
        'part': JSON.stringify(part),
        'quantity': quantity,
        'comment': comment,
        'set': set
      },
      TableName: PartsTable
    };
    try {
      await db.put(params).promise();
      return key;
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  };

  const deletePartFromDatabase = async (key: string) => {
    const params = {
      Key: {
        'key': key
      },
      TableName: PartsTable
    };
    try {
      await db.delete(params).promise();
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  }

  return { getAllParts, addPartToDatabase, deletePartFromDatabase };
}
import { PartDisplay } from "../../model/partCollector/PartDisplay";
import { db, PartsTable } from "../../db.config";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { Part } from "../../model/partCollector/Part";
import { v4 as uuidv4 } from 'uuid';

export interface PartsServiceHooks {
  getAllParts: () => Promise<PartDisplay[]>;
  addPartToDatabase: (part: Part, quantity: number, comment: string, set: string) => Promise<void>;
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
        console.log(parts)

        return parts;
      } else {
        return [];
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const addPartToDatabase = async (part: Part, quantity: number, comment: string, set: string): Promise<void> => {
    const params = {
      Item: {
        'key': uuidv4() ,
        'part': JSON.stringify(part),
        'quantity': quantity,
        'comment': comment,
        'set': set
      },
      TableName: PartsTable
    };
    try {
      await db.put(params).promise();
    } catch (error: any) {
      console.error(error);
      throw error;
    }

  };

  return { getAllParts, addPartToDatabase };
}
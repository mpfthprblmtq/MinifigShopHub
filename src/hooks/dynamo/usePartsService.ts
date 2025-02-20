import { PartDisplay } from "../../model/partCollector/PartDisplay";
import { db, PartsTable } from "../../db.config";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import { v4 as uuidv4 } from 'uuid';
import { Part } from "../../model/rebrickable/RebrickableResponse";
import dayjs from "dayjs";
import {useAuth0} from "@auth0/auth0-react";

export interface PartsServiceHooks {
  getAllParts: () => Promise<PartDisplay[]>;
  addPartToDatabase: (part: Part, quantity: number, comment: string, set: string, id?: string) => Promise<string>;
  deletePartFromDatabase: (key: string) => Promise<void>;
}

export const usePartsService = (): PartsServiceHooks => {

  const { user } = useAuth0();

  const getAllParts = async (): Promise<PartDisplay[]> => {
    const parts: PartDisplay[] = [];
    const params = { TableName: PartsTable };
    try {
      const data: DocumentClient.ScanOutput = await db.scan(params).promise();
      const items = data.Items;
      if (items) {
        items.forEach(item => {
          parts.push({
            id: item.id,
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

  const addPartToDatabase = async (part: Part, quantity: number, comment: string, set: string, id?: string): Promise<string> => {
    id = id ? id : uuidv4();
    const params = {
      Item: {
        'id': id,
        'part': JSON.stringify(part),
        'quantity': quantity,
        'comment': comment,
        'set': set,
        'date': dayjs().format('YYYY-MM-DD'),
        'organization': user?.org_id
      },
      TableName: PartsTable
    };
    try {
      await db.put(params).promise();
      return id;
    } catch (error: any) {
      console.error(error);
      throw error;
    }
  };

  const deletePartFromDatabase = async (id: string) => {
    const params = {
      Key: {
        'id': id
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
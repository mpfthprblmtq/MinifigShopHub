import {Configuration} from "../../model/dynamo/Configuration";
import {ConfigurationTable, db} from "../../db.config";

export interface ConfigurationServiceHooks {
    initConfig: (organization: string) => Promise<Configuration>;
    updateConfig: (organization: string, updatedConfig: Configuration) => Promise<Configuration>;
}

export const useConfigurationService = (): ConfigurationServiceHooks => {

    const initConfig = async (organization: string): Promise<Configuration> => {

        // addAttributeToAllRecords();
        try {
            const params = { TableName: ConfigurationTable, Key: { organization: organization } };
            const response = await db.get(params).promise();

            if (!response.Item) {
                console.error("No record found");
                return {} as Configuration;
            }

            return JSON.parse(response.Item.value);
        } catch (error) {
            console.error("Error fetching record:", error);
            return {} as Configuration;
        }
    };

    const updateConfig = async (
        organization: string, updatedConfig: Configuration): Promise<Configuration> => {

        const params = {
            TableName: ConfigurationTable,
            Item: {
                organization: organization,
                value: JSON.stringify(updatedConfig)
            }
        };
        const response = await db.put(params).promise();
        if (response.$response.httpResponse.statusCode === 200) {
            return updatedConfig;
        }
        return {} as Configuration;
    }

//     async function addAttributeToAllRecords() {
//         try {
//             // Step 1: Scan to get all items
//             let lastEvaluatedKey: AWS.DynamoDB.DocumentClient.Key | undefined = undefined;
//
//             do {
//                 const scanParams: AWS.DynamoDB.DocumentClient.ScanInput = {
//                     TableName: 'parts',
//                     ExclusiveStartKey: lastEvaluatedKey, // For pagination
//                 };
//
//                 const scanResult = await db.scan(scanParams).promise();
//
//                 if (!scanResult.Items) {
//                     console.log("No records found in the table.");
//                     return;
//                 }
//
//                 // Step 2: Iterate over each item and update it
//                 for (const item of scanResult.Items) {
//                     await updateRecord(item.id); // Replace 'key' with your actual partition key name
//                 }
//
//                 // Step 3: Continue scanning if there are more records
//                 lastEvaluatedKey = scanResult.LastEvaluatedKey;
//
//             } while (lastEvaluatedKey);
//
//             console.log("Successfully added the attribute to all records.");
//         } catch (error) {
//             console.error("Error adding attribute:", error);
//         }
//     }
//
// // Function to update a single record
//     async function updateRecord(id: string) {
//         const updateParams: AWS.DynamoDB.DocumentClient.UpdateItemInput = {
//             TableName: 'parts',
//             Key: { id }, // Make sure this matches your partition key name
//             UpdateExpression: "SET comment = :value",
//             ExpressionAttributeValues: {
//                 ":value": "", // Change this to your desired default value
//             },
//         };
//
//         await db.update(updateParams).promise();
//         console.log(`Updated record with id: ${id}`);
//     }

    return {initConfig, updateConfig};
};
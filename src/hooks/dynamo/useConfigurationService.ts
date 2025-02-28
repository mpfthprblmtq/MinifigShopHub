import {Configuration} from "../../model/dynamo/Configuration";
import {ConfigurationTable, db} from "../../db.config";

export interface ConfigurationServiceHooks {
    initConfig: (organization: string) => Promise<Configuration>;
    updateConfig: (organization: string, updatedConfig: Configuration) => Promise<Configuration>;
}

export const useConfigurationService = (): ConfigurationServiceHooks => {

    const initConfig = async (organization: string): Promise<Configuration> => {
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

    return {initConfig, updateConfig};
};
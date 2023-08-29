import {Configuration} from "../../model/dynamo/Configuration";
import {db, Table} from "../../db.config";
import {DocumentClient} from "aws-sdk/clients/dynamodb";

export interface ConfigurationServiceHooks {
    initConfig: () => Promise<Configuration>;
    updateConfig: (config: Configuration, updatedConfig: Configuration) => Promise<Configuration>;
}

export const STORE_CREDIT_VALUE_ADJUSTMENT: string = 'STORE_CREDIT_VALUE_ADJUSTMENT';
export const AUTO_ADJUSTMENT_PERCENTAGE_NEW: string = 'AUTO_ADJUSTMENT_PERCENTAGE_NEW';
export const AUTO_ADJUSTMENT_PERCENTAGE_USED: string = 'AUTO_ADJUSTMENT_PERCENTAGE_USED';
export const AUTO_ADJUSTMENT_PERCENTAGE_CERTIFIED_PREOWNED: string = 'AUTO_ADJUSTMENT_PERCENTAGE_CERTIFIED_PREOWNED';

export const useConfigurationService = (): ConfigurationServiceHooks => {

    const initConfig = async (): Promise<Configuration> => {
        const params = { TableName: Table };
        try {
            const data: DocumentClient.ScanOutput = await db.scan(params).promise();
            const items = data.Items;
            if (items) {
                return {
                    storeCreditValueAdjustment: items?.find(
                      e => e.key === STORE_CREDIT_VALUE_ADJUSTMENT)!.value,
                    autoAdjustmentPercentageNew: items?.find(
                      e => e.key === AUTO_ADJUSTMENT_PERCENTAGE_NEW)!.value,
                    autoAdjustmentPercentageUsed: items?.find(
                      e => e.key === AUTO_ADJUSTMENT_PERCENTAGE_USED)!.value,
                    autoAdjustmentPercentageCertifiedPreOwned: items?.find(
                      e => e.key === AUTO_ADJUSTMENT_PERCENTAGE_CERTIFIED_PREOWNED)!.value
                } as Configuration;
            } else {
                return {
                    storeCreditValueAdjustment: 0,
                    autoAdjustmentPercentageNew: 0,
                    autoAdjustmentPercentageUsed: 0,
                    autoAdjustmentPercentageCertifiedPreOwned: 0,
                };
            }
        } catch (error) {
            console.error(error);
            throw error;
        }
    };

    const updateConfig = async (
        config: Configuration, updatedConfig: Configuration): Promise<Configuration> => {

        const paramsList: DocumentClient.PutItemInput[] = [];

        if (config.storeCreditValueAdjustment !== updatedConfig.storeCreditValueAdjustment) {
            paramsList.push({
                TableName: Table,
                Item: {
                    key: STORE_CREDIT_VALUE_ADJUSTMENT,
                    value: updatedConfig.storeCreditValueAdjustment
                }
            });
        }
        if (config.autoAdjustmentPercentageNew !== updatedConfig.autoAdjustmentPercentageNew) {
            paramsList.push({
                TableName: Table,
                Item: {
                    key: AUTO_ADJUSTMENT_PERCENTAGE_NEW,
                    value: updatedConfig.autoAdjustmentPercentageNew
                }
            });
        }
        if (config.autoAdjustmentPercentageUsed !== updatedConfig.autoAdjustmentPercentageUsed) {
            paramsList.push({
                TableName: Table,
                Item: {
                    key: AUTO_ADJUSTMENT_PERCENTAGE_USED,
                    value: updatedConfig.autoAdjustmentPercentageUsed
                }
            });
        }
        if (config.autoAdjustmentPercentageCertifiedPreOwned !==
          updatedConfig.autoAdjustmentPercentageCertifiedPreOwned) {
            paramsList.push({
                TableName: Table,
                Item: {
                    key: AUTO_ADJUSTMENT_PERCENTAGE_CERTIFIED_PREOWNED,
                    value: updatedConfig.autoAdjustmentPercentageCertifiedPreOwned
                }
            });
        }

        paramsList.forEach((params) => {
            db.put(params, (err) => {
                if (err) {
                    console.error(err);
                    throw err;
                }
            })
        });

        return {
            storeCreditValueAdjustment: updatedConfig.storeCreditValueAdjustment,
            autoAdjustmentPercentageNew: updatedConfig.autoAdjustmentPercentageNew,
            autoAdjustmentPercentageUsed: updatedConfig.autoAdjustmentPercentageUsed,
            autoAdjustmentPercentageCertifiedPreOwned: updatedConfig.autoAdjustmentPercentageCertifiedPreOwned
        } as Configuration;
    }

    return {initConfig, updateConfig};
};
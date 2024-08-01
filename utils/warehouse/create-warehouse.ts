import { Warehouse, WarehouseArgs } from "@pulumi/snowflake";
import { warehouses } from "./store";

const defaultOptions: WarehouseArgs = {
    autoResume: "true",
    autoSuspend: 60,
    minClusterCount: 1,
    maxClusterCount: 4,
};

export function createWarehouse(name: string, options: WarehouseArgs) {
    warehouses.set(
        name,
        new Warehouse(name, {
            name,
            ...defaultOptions,
            ...options,
        }),
    );
}
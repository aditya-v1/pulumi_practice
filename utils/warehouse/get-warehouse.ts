import { Warehouse } from "@pulumi/snowflake";
import { warehouses } from "./store";
import { WarehouseName } from "../../resources/snowflake/types/index";

export function getWarehouse(name: WarehouseName): Warehouse {
    const warehouse = warehouses.get(name);
    if (!warehouse) {
        throw new Error(`${name} warehouse was not found`);
    }

    return warehouse;
}
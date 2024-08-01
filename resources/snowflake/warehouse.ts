import { createWarehouse } from "../../utils/warehouse/index";
import { WarehouseName } from "./types/index";

export function createSnowflakeWarehouses(): void {

    createWarehouse(WarehouseName.TransformingSmall, {
        comment: "Small transforming warehouse",
        warehouseSize: "small",
    });

    createWarehouse(WarehouseName.TransformingMedium, {
        comment: "Medium transforming warehouse",
        warehouseSize: "medium",
    });


}
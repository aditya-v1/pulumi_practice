export enum WarehouseName {
    Fivetran = "FIVETRAN",
    Sisense = "SISENSE",
    Ternary = "TERNARY",
    TransformingMedium = "TRANSFORMING_MEDIUM",
    TransformingSmall = "TRANSFORMING_SMALL",
    
}

export enum WarehouseAssociationName {

    AirflowWarehouseTransformingSmall = "AIRFLOW_WAREHOUSE_TRANSFORMING_SMALL",
    AirflowWarehouseTransformingMedium = "AIRFLOW_WAREHOUSE_TRANSFORMING_MEDIUM",
    AirflowWarehouseTransformingXLarge = "AIRFLOW_WAREHOUSE_TRANSFORMING_XLARGE",

    SisenseWarehouseSisense = "SISENSE_WAREHOUSE_SISENSE",

    AnalyticsWarehouseTransformingSmall = "ANALYTICS_WAREHOUSE_TRANSFORMING_SMALL",

    DbaWarehouseTransformingSmall = "DBA_WAREHOUSE_TRANSFORMING_SMALL",

    GitHubWarehouseTransformingSmall = "GITHUB_WAREHOUSE_TRANSFORMING_SMALL",
}
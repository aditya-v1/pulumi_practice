import {
//    createSnowflakeAccountParameters,
    createSnowflakeDatabaseGrants,
    createSnowflakeDatabases,
//    createSnowflakePasswordPolicy,
    createSnowflakeRoleHierarchy,
    createSnowflakeRoles,
//    createSnowflakeUsers,
    createSnowflakeWarehouseGrants,
    createSnowflakeWarehouses,
} from "./resources/snowflake/index";

createSnowflakeDatabases();
createSnowflakeRoles();
createSnowflakeDatabaseGrants();
createSnowflakeRoleHierarchy();
createSnowflakeWarehouses();
createSnowflakeWarehouseGrants();



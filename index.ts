import {
//    createSnowflakeAccountParameters,
    createSnowflakeDatabaseGrants,
    createSnowflakeDatabases,
    createSnowflakeManagedAccounts,
//    createSnowflakePasswordPolicy,
    createSnowflakeRoleHierarchy,
    createSnowflakeRoles,
//    createSnowflakeUsers,
    createSnowflakeWarehouseGrants,
    createSnowflakeWarehouses,
} from "./resources/snowflake/index";

//import { createSnowflakeShareAccounts } from "./resources/snowflake/shares/datastudio-data-shares";


createSnowflakeDatabases();
createSnowflakeRoles();
createSnowflakeDatabaseGrants();
createSnowflakeRoleHierarchy();
createSnowflakeWarehouses();
createSnowflakeWarehouseGrants();

createSnowflakeManagedAccounts();
//createSnowflakeShares();
//createsnowflakeschemaforshares();


//getSnowflakeManagedAccounts();
//createSnowflakeShareAccounts();
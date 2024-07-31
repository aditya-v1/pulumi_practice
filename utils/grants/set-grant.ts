import {
    GrantAccountRole,
    GrantPrivilegesToAccountRole,
    Role,
} from "@pulumi/snowflake";
import { PrivilegeOption } from "../../resources/snowflake/types/privilege";
import { getDatabaseRole, getFunctionalRole } from "../role/index";
import {
    DatabaseName,
    DatabaseRoleName,
    FunctionalRoleName,
    WarehouseName,
} from "../../resources/snowflake/types/index";
import { getWarehouse } from "../warehouse/index";
import { getDatabase } from "../database/index";

export function grantPrivilegesToSchemas(
    roleName: DatabaseRoleName,
    databaseName: DatabaseName,
    privilegeChoice: PrivilegeOption,
): void {
    const database = getDatabase(databaseName);
    const role = getDatabaseRole(roleName);

    const privileges =
        privilegeChoice === PrivilegeOption.ReadWrite
            ? ["ALL PRIVILEGES"]
            : ["USAGE"];

    new GrantPrivilegesToAccountRole(
        `${roleName}_SCHEMA`,
        {
            onSchema: {
                allSchemasInDatabase: database.name,
            },
            accountRoleName: role.name,
            privileges,
        },
        { deleteBeforeReplace: true },
    );

    new GrantPrivilegesToAccountRole(
        `${roleName}_FUTURE_SCHEMA`,
        {
            onSchema: {
                futureSchemasInDatabase: database.name,
            },
            accountRoleName: role.name,
            privileges,
        },
        { deleteBeforeReplace: true },
    );
}

export function grantPrivilegesToTables(
    roleName: DatabaseRoleName,
    databaseName: DatabaseName,
    privilegeChoice: PrivilegeOption,
): void {
    const database = getDatabase(databaseName);
    const role = getDatabaseRole(roleName);

    const privileges =
        privilegeChoice === PrivilegeOption.ReadWrite
            ? ["SELECT", "INSERT", "UPDATE", "DELETE", "TRUNCATE", "REFERENCES"]
            : ["SELECT", "REFERENCES"];

    new GrantPrivilegesToAccountRole(
        `${roleName}_FUTURE_TABLES`,
        {
            onSchemaObject: {
                future: {
                    inDatabase: database.name,
                    objectTypePlural: "TABLES",
                },
            },
            accountRoleName: role.name,
            privileges,
        },
        { deleteBeforeReplace: true },
    );
}

export function grantPrivilegesToViews(
    roleName: DatabaseRoleName,
    databaseName: DatabaseName,
): void {
    const database = getDatabase(databaseName);
    const role = getDatabaseRole(roleName);

    new GrantPrivilegesToAccountRole(
        `${roleName}_FUTURE_VIEWS`,
        {
            onSchemaObject: {
                future: {
                    inDatabase: database.name,
                    objectTypePlural: "VIEWS",
                },
            },
            accountRoleName: role.name,
            privileges: ["SELECT", "REFERENCES"],
        },
        { deleteBeforeReplace: true },
    );

    new GrantPrivilegesToAccountRole(
        `${roleName}_FUTURE_MATERIALIZED_VIEWS`,
        {
            onSchemaObject: {
                future: {
                    inDatabase: database.name,
                    objectTypePlural: "MATERIALIZED VIEWS",
                },
            },
            accountRoleName: role.name,
            privileges: ["SELECT", "REFERENCES"],
        },
        { deleteBeforeReplace: true },
    );
}

export function grantDatabaseRoleHierarchy(
    databaseRoleName: DatabaseRoleName,
    roleNames: FunctionalRoleName[],
): void {
    const databaseRole = getDatabaseRole(databaseRoleName);

    roleNames.forEach((roleName) => {
        new GrantAccountRole(`${databaseRoleName}_${roleName}`, {
            roleName: databaseRole.name,
            parentRoleName: getFunctionalRole(roleName).name,
        });
    });
}

export function grantWarehouseRole(
    associationName: string,
    role: Role,
    warehouseName: WarehouseName,
): void {
    const warehouse = getWarehouse(warehouseName);

    new GrantPrivilegesToAccountRole(
        associationName,
        {
            onAccountObject: {
                objectType: "WAREHOUSE",
                objectName: warehouse.name,
            },
            accountRoleName: role.name,
            privileges: ["USAGE"],
        },
        { deleteBeforeReplace: true },
    );
}

export function grantPrivilegesToDatabase(
    roleName: DatabaseRoleName,
    databaseName: DatabaseName,
    privilegeChoice: PrivilegeOption,
): void {
    const database = getDatabase(databaseName);
    const role = getDatabaseRole(roleName);

    const privileges =
        privilegeChoice === PrivilegeOption.ReadWrite
            ? ["USAGE", "CREATE SCHEMA"]
            : ["USAGE"];

    new GrantPrivilegesToAccountRole(
        `${roleName}_DATABASE`,
        {
            onAccountObject: {
                objectType: "DATABASE",
                objectName: database.name,
            },
            accountRoleName: role.name,
            privileges,
        },
        { deleteBeforeReplace: true },
    );

    grantPrivilegesToSchemas(roleName, databaseName, privilegeChoice);
    grantPrivilegesToTables(roleName, databaseName, privilegeChoice);
    grantPrivilegesToViews(roleName, databaseName);
}
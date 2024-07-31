import { Database, Role } from "@pulumi/snowflake";
import { databaseRoles, functionalRoles } from "./store";

export function createDatabaseRole(name: string, database: Database): void {
    databaseRoles.set(
        name,
        new Role(
            name,
            {
                name,
                comment: `${name} database role`,
            },
            { dependsOn: [database] },
        ),
    );
}

export function createFunctionalRole(
    name: string,
    databaseRoleList: Role[],
): void {
    functionalRoles.set(
        name,
        new Role(
            name,
            {
                name,
                comment: `${name} functional role`,
            },
            { dependsOn: databaseRoleList },
        ),
    );
}
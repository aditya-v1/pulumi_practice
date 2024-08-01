import { GrantAccountRole } from "@pulumi/snowflake";

import {
    DatabaseName,
    DatabaseRoleName,
    FunctionalRoleName,
    SystemRoles,
    WarehouseAssociationName,
    WarehouseName,
} from "./types/index";
import { getFunctionalRole } from "../../utils/role/index";
import {
    grantDatabaseRoleHierarchy,
    grantPrivilegesToDatabase,
    grantWarehouseRole,
} from "../../utils/grants/index";
import { PrivilegeOption } from "./types/privilege";

export function createSnowflakeDatabaseGrants(): void {
    const mapping = [
        {
            databaseName: DatabaseName.Staging,
            roleReadOnly: DatabaseRoleName.StagingRoleRO,
            roleReadWrite: DatabaseRoleName.StagingRoleRW,
        },
        {
            databaseName: DatabaseName.Analytics,
            roleReadOnly: DatabaseRoleName.AnalyticsRoleRO,
            roleReadWrite: DatabaseRoleName.AnalyticsRoleRW,
        },
    ];


    mapping.forEach(({ databaseName, roleReadOnly, roleReadWrite }) => {
        grantPrivilegesToDatabase(
            roleReadOnly,
            databaseName,
            PrivilegeOption.ReadOnly,
        );

        grantPrivilegesToDatabase(
            roleReadWrite,
            databaseName,
            PrivilegeOption.ReadWrite,
        );
    });
}

export function createSnowflakeWarehouseGrants(): void {


    const airflowRole = getFunctionalRole(FunctionalRoleName.AirflowRole);
    grantWarehouseRole(
        WarehouseAssociationName.AirflowWarehouseTransformingSmall,
        airflowRole,
        WarehouseName.TransformingSmall,
    );
    grantWarehouseRole(
        WarehouseAssociationName.AirflowWarehouseTransformingMedium,
        airflowRole,
        WarehouseName.TransformingMedium,
    );


    const analyticsEngineerRole = getFunctionalRole(
        FunctionalRoleName.AnalyticsEngineerRole,
    );
    grantWarehouseRole(
        WarehouseAssociationName.AnalyticsWarehouseTransformingSmall,
        analyticsEngineerRole,
        WarehouseName.TransformingSmall,
    );


    const githubRole = getFunctionalRole(FunctionalRoleName.GithubRole);
    grantWarehouseRole(
        WarehouseAssociationName.GitHubWarehouseTransformingSmall,
        githubRole,
        WarehouseName.TransformingSmall,
    );
}

export function createSnowflakeRoleHierarchy(): void {
    Object.values(FunctionalRoleName).forEach((roleName) => {

        const role = getFunctionalRole(roleName);

        new GrantAccountRole(`${roleName}_${SystemRoles.SystemAdministrator}`, {
            roleName: role.name,
            parentRoleName: SystemRoles.SystemAdministrator,
        });
    });


    grantDatabaseRoleHierarchy(DatabaseRoleName.StagingRoleRW, [
        FunctionalRoleName.AirflowRole,
        FunctionalRoleName.DbaRole,
    ]);



    grantDatabaseRoleHierarchy(DatabaseRoleName.AnalyticsRoleRW, [
        FunctionalRoleName.AnalyticsEngineerRole, // AnalyticsEngineerRole can write in non-production environments
        FunctionalRoleName.AirflowRole,
        FunctionalRoleName.DbaRole,
    ]);
    grantDatabaseRoleHierarchy(DatabaseRoleName.AnalyticsRoleRO, [
        FunctionalRoleName.GithubRole,
    ]);

    grantDatabaseRoleHierarchy(DatabaseRoleName.StagingRoleRO, [
        FunctionalRoleName.GithubRole,
    ]);
    }


    

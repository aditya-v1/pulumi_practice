import { Role } from "@pulumi/snowflake";
import {
    DatabaseName,
    DatabaseRoleName,
    FunctionalRoleName,
} from "./types/index";
import { getDatabase } from "../../utils/database/index";
import {
    createDatabaseRole,
    createFunctionalRole,
    getDatabaseRole,
} from "../../utils/role/index";

function createSnowflakeDatabaseRoles(): void {

    const analyticsDatabase = getDatabase(DatabaseName.Analytics);
    createDatabaseRole(DatabaseRoleName.AnalyticsRoleRO, analyticsDatabase);
    createDatabaseRole(DatabaseRoleName.AnalyticsRoleRW, analyticsDatabase);

    const stagingDatabase = getDatabase(DatabaseName.Staging);
    createDatabaseRole(DatabaseRoleName.StagingRoleRO, stagingDatabase);
    createDatabaseRole(DatabaseRoleName.StagingRoleRW, stagingDatabase);
}

function createSnowflakeFunctionalRoles(): void {

    const airflowRoleDependency: Role[] = [];
    const analyticsDatabaseRoleRW = getDatabaseRole(
        DatabaseRoleName.AnalyticsRoleRW,
    );
    airflowRoleDependency.push(analyticsDatabaseRoleRW);


    createFunctionalRole(FunctionalRoleName.AirflowRole, airflowRoleDependency);

    // TODO: link to airflow service account and elt_xs_wh, elt_m_wh, elt_xl_wh warehouses

    const analyticsDatabaseRoleRO = getDatabaseRole(
        DatabaseRoleName.AnalyticsRoleRO,
    );

    const stagingDatabaseRoleRO = getDatabaseRole(
        DatabaseRoleName.StagingRoleRO,
    );


    // TODO: link to sisense service account and sisense_wh warehouses

    const analyticsEngineerRoleDependency: Role[] = [];
    const stagingDatabaseRoleRW = getDatabaseRole(
        DatabaseRoleName.StagingRoleRW,
    );
    analyticsEngineerRoleDependency.push(stagingDatabaseRoleRW);

    createFunctionalRole(
        FunctionalRoleName.AnalyticsEngineerRole,
        analyticsEngineerRoleDependency,
    );

    // TODO: link to elt_xs_wh warehouse

    const dbaRoleDependency: Role[] = [];
    dbaRoleDependency.push(analyticsDatabaseRoleRW, stagingDatabaseRoleRW);

    createFunctionalRole(FunctionalRoleName.DbaRole, dbaRoleDependency);

    // TODO: link to elt_xs_wh, elt_m_wh warehouses

    const gitHubRoleDependency: Role[] = [];
    gitHubRoleDependency.push(analyticsDatabaseRoleRO, stagingDatabaseRoleRW);

    createFunctionalRole(FunctionalRoleName.GithubRole, gitHubRoleDependency);
}

export function createSnowflakeRoles(): void {
    createSnowflakeDatabaseRoles();
    createSnowflakeFunctionalRoles();
}
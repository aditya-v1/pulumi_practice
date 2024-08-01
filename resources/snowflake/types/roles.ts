import { DatabaseName } from "./database";
import { PrivilegeOption } from "./privilege";

export enum DatabaseRoleName {
    AnalyticsRoleRO = "ANALYTICS_RO",
    AnalyticsRoleRW = "ANALYTICS_RW",
    StagingRoleRO = "STAGING_RO",
    StagingRoleRW = "STAGING_RW",
}

export enum FunctionalRoleName {
    //FivetranRole = "FIVETRAN",
    AirflowRole = "AIRFLOW",
    GithubRole = "GITHUB",
    AnalyticsEngineerRole = "ANALYTICS_ENGINEER",
    DbaRole = "DBA",
}

export enum SystemRoles {
    OrganizationAdministrator = "ORGADMIN",
    AccountAdministrator = "ACCOUNTADMIN",
    SecurityAdministrator = "SECURITYADMIN",
    UserAdministrator = "USERADMIN",
    SystemAdministrator = "SYSADMIN",
}
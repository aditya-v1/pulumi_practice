//import * as snowflake from "@pulumi/snowflake";
import "@pulumi/pulumi"
import { getPassword } from "../../utils/password/index";
//
//export function createReaderAccount(
//    agencyLabel: string,
//    accountType: string,
//): void {
//    new snowflake.ManagedAccount(`managedAccountResource-${agencyLabel}`, {
//        adminName: "admin",
//        adminPassword: getPassword(`reader_acct_${agencyLabel}`).result,
//        name: `READER_ACCT_${agencyLabel}`,
//        type: accountType,
//    });
//}

import * as snowflake from "@pulumi/snowflake";
//import { createReaderAccount } from "../index";

import { createReaderAccount_new, getManagedAccount } from "../../utils/managed-account/index";
import { dataStudioAgency, datasStudioView } from "../snowflake/lists/index";
import { buildWhereClause } from "../../utils/snowflake/index";

import { ManagedAccount } from "@pulumi/snowflake";

const org_name_prod = 'KUVUTKO'

// function to create reader account

export function createSnowflakeManagedAccounts(): void {
    /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     1. Snowflake does not support the ability to link a reader account
        to a share.
     2. The script is missing the ability to configure resources
        in the Reader Account.
    Please refer to the ticket for more details.
    https://footholdtech.atlassian.net/browse/DFT-627
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */

    dataStudioAgency.forEach((agency) => {
        if (agency.type === "READER") {
            const new_reader_account = new snowflake.ManagedAccount(`managedAccountResource-${agency.label}`, {
                adminName: "admin",
                //adminPassword: getPassword(`reader_acct_${agency.label}`).result,
                adminPassword: 'SnowflakePass1!',
                name: `READER_ACCT_${agency.label}`,
                type: agency.type,
            })
            
            const share = new snowflake.Share(`fht_share_${agency.label}`, {
                name: `fht_share_${agency.label}`,
                comment: `Data share for ${agency.label} with read-only access to their data in the Datastudio schema`,
                accounts:  [`${org_name_prod}.READER_ACCT_${agency.label}`]
            },
            {
                dependsOn: [new_reader_account]
            }
        );

        const shared_database = new snowflake.Database(`shared_awards_tech_${agency.label}`, {
            name: `shared_awards_tech_${agency.label}`,
            comment: `Shared database for ${agency.label} Datastudio`,
            dataRetentionTimeInDays: 90,
            },
        );

        const grant_usage_on_db = new snowflake.GrantPrivilegesToShare(
            `GrantResourceSharedDatabase${agency.label.toUpperCase()}`,
            {
                onDatabase: shared_database.id,
                privileges: ["USAGE"],
                toShare: share.id,
            },
        );

        new snowflake.GrantPrivilegesToShare(
            `GrantResourceRawDatabase${agency.label.toUpperCase()}`,
            {
                onDatabase: `STAGING`,
                privileges: ["REFERENCE_USAGE"],
                toShare: share.id,
            },
            {
                dependsOn: grant_usage_on_db
            }
        );

        new snowflake.GrantPrivilegesToShare(
            `GrantResourceAnalyticsDatabase${agency.label.toUpperCase()}`,
            {
                onDatabase: `ANALYTICS`,
                privileges: ["REFERENCE_USAGE"],
                toShare: share.id,
            },
            {
                dependsOn: grant_usage_on_db
            }

        );

        // there can be multiple users. we create 1 schema for each user
        agency.users.forEach((user) => {
            const shared_schema = new snowflake.Schema(`shared_awards_tech_${agency.label}`, {
                database: shared_database.id,
                name: user.schemaName,
                comment: `Shared schema for ${agency.label} Datastudio`,
            })
        
            new snowflake.GrantPrivilegesToShare(
                `GrantResource${user.schemaName.toUpperCase()}Schema${agency.label.toUpperCase()}`,
            {
                //onSchema: `shared_awards_tech_${agency.label}.${shared_schema.id}`,
                onSchema: `shared_awards_tech_${agency.label}.${user.schemaName}`,
                privileges: ["USAGE"],
                toShare: share.id,
            },
            {
                dependsOn: [shared_schema, grant_usage_on_db]
            }
            );

        
//            datasStudioView.forEach((view) => {
//                const whereClause = buildWhereClause(view, user);
//
//                // Create Views and grant to share
//                const shared_view = new snowflake.View(
//                    `shared_awards_tech_${agency.label}.datastudio.${view.name}`,
//                    {
//                        database: shared_database.id,
//                        schema: shared_schema.name,
//                        name: `${view.name}`,
//                        statement: `select * from analytics.insights_v1.${view.name} ${whereClause};`,
//                        orReplace: false,
//                        isSecure: true,
//                    },
//                );
//
//                new snowflake.GrantPrivilegesToShare(
//                    `GrantResource-shared_awards_tech_${agency.label}.datastudio.${view.name}`,
//                    {
//                        onView: `shared_awards_tech_${agency.label}.${user.schemaName}.${view.name}`,
//                        toShare: share.id,
//                        privileges: ["SELECT"],
//                    },
//                    {
//                        dependsOn: shared_view
//                    }
//                );
//            });        
        
        })


        }
    
});
    
    
}


/*
export async function createSnowflakeShares(): Promise<void> {

    dataStudioAgency.forEach((agency) => {
        if (agency.type === "READER") {
            const share = new snowflake.Share(`fht_share_${agency.label}`, {
                name: `fht_share_${agency.label}`,
                comment: `Data share for ${agency.label} with read-only access to their data in the Datastudio schema`,
                accounts: [`${org_name_prod}.READER_ACCT_${agency.label}`]
            });

            const shared_database = new snowflake.Database(`shared_awards_tech_${agency.label}`, {
                name: `shared_awards_tech_${agency.label}`,
                comment: `Shared database for ${agency.label} Datastudio`,
                dataRetentionTimeInDays: 90,
            },
            {
                dependsOn: [share]
            });

            const grant_usage_on_db = new snowflake.GrantPrivilegesToShare(
                `GrantResourceSharedDatabase${agency.label.toUpperCase()}`,
                {
                    onDatabase: `shared_awards_tech_${agency.label}`,
                    privileges: ["USAGE"],
                    toShare: `fht_share_${agency.label}`,
                },
                {
                    dependsOn: [share, shared_database]
                },
            );


            new snowflake.GrantPrivilegesToShare(
                `GrantResourceRawDatabase${agency.label.toUpperCase()}`,
                {
                    onDatabase: `STAGING`,
                    privileges: ["REFERENCE_USAGE"],
                    toShare: `fht_share_${agency.label}`,
                },
                {
                    dependsOn: [share, grant_usage_on_db]
                },
            );

            new snowflake.GrantPrivilegesToShare(
                `GrantResourceAnalyticsDatabase${agency.label.toUpperCase()}`,
                {
                    onDatabase: `ANALYTICS`,
                    privileges: ["REFERENCE_USAGE"],
                    toShare: `fht_share_${agency.label}`,
                },
                {
                    dependsOn: [share, grant_usage_on_db]
                },
            );

        }
    });
    }

export async function createsnowflakeschemaforshares(): Promise<void> {

        dataStudioAgency.forEach((agency) => {
            agency.users.forEach((user) => {
                
                // 1st create the schema
                const shared_schema = new snowflake.Schema(`shared_awards_tech_${agency.label}`, {
                    database: `shared_awards_tech_${agency.label}`,
                    name: user.schemaName,
                    comment: `Shared schema for ${agency.label} Datastudio`,
                })

                // grant usage privilege on tis schema to the share
                new snowflake.GrantPrivilegesToShare(
                    `GrantResource${user.schemaName.toUpperCase()}Schema${agency.label.toUpperCase()}`,
                {
                    onSchema: `shared_awards_tech_${agency.label}.${user.schemaName}`,
                    privileges: ["USAGE"],
                    toShare: `fht_share_${agency.label}`,
                },
                {
                    dependsOn: [shared_schema]
                }
                );
            
                datasStudioView.forEach((view) => {
                    const whereClause = buildWhereClause(view, user);
    
                    // Create Views and grant to share
                    const shared_view = new snowflake.View(
                        `shared_awards_tech_${agency.label}.datastudio.${view.name}`,
                        {
                            database: `shared_awards_tech_${agency.label}`,
                            schema: user.schemaName,
                            name: `${view.name}`,
                            statement: `select * from analytics.insights_v1.${view.name} ${whereClause};`,
                            orReplace: false,
                            isSecure: true,
                        },
                        {
                            dependsOn: [shared_schema]
                        }
                    );
    
                    new snowflake.GrantPrivilegesToShare(
                        `GrantResource-shared_awards_tech_${agency.label}.datastudio.${view.name}`,
                        {
                            onView: `shared_awards_tech_${agency.label}.${user.schemaName}.${view.name}`,
                            toShare: `fht_share_${agency.label}`,
                            privileges: ["SELECT"],
                        },
                        {
                            // dependson to ensure the grant runs after view is created
                            dependsOn: [shared_view]
                        }
                    );
                });
            
            
            });

        });
        }
*/
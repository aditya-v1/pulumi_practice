import * as snowflake from "@pulumi/snowflake";
//import { createReaderAccount } from "../index";

import { createReaderAccount_new, getManagedAccount } from "../../../utils/managed-account/index";
import { dataStudioAgency, datasStudioView } from "../lists/index";
import { buildWhereClause } from "../../../utils/snowflake/index";

import { ManagedAccount } from "@pulumi/snowflake";

export function createSnowflakeShareAccounts(): void {
    /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     1. Snowflake does not support the ability to link a reader account
        to a share.
     2. The script is missing the ability to configure resources
        in the Reader Account.
    Please refer to the ticket for more details.
    https://footholdtech.atlassian.net/browse/DFT-627
    !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */

    dataStudioAgency.forEach((agency) => {
        if (agency.type === "reader") {
            createReaderAccount_new(agency.label, agency.type);
            //const reader_account_name = getManagedAccount(`managedAccountResource-${agency.label}`)
            //console.log (reader_account_name)
        }


        
        //* 1. Create new Share
         

        const share = new snowflake.Share(`fht_share_${agency.label}`, {
            name: `fht_share_${agency.label}`,
            comment: `Data share for ${agency.label} with read-only access to their data in the Datastudio schema`,
            accounts: [`KUVUTKO.${agency.label}`]
        });

        /**
         * 2. Create new Database and Grant Databases to share
         */
        new snowflake.Database(`shared_awards_tech_${agency.label}`, {
            name: `shared_awards_tech_${agency.label}`,
            comment: `Shared database for ${agency.label} Datastudio`,
            dataRetentionTimeInDays: 90,
        },
        {
            dependsOn: [share]
        });

        new snowflake.GrantPrivilegesToShare(
            `GrantResourceSharedDatabase${agency.label.toUpperCase()}`,
            {
                onDatabase: `shared_awards_tech_${agency.label}`,
                privileges: ["USAGE"],
                toShare: `fht_share_${agency.label}`,
            },
        );

        new snowflake.GrantPrivilegesToShare(
            `GrantResourceRawDatabase${agency.label.toUpperCase()}`,
            {
                onDatabase: "raw",
                privileges: ["REFERENCE_USAGE"],
                toShare: `fht_share_${agency.label}`,
            },
        );

        new snowflake.GrantPrivilegesToShare(
            `GrantResourceAnalyticsDatabase${agency.label.toUpperCase()}`,
            {
                onDatabase: "analytics",
                privileges: ["REFERENCE_USAGE"],
                toShare: `fht_share_${agency.label}`,
            },
        );

        /**
         * 3. For each user, create a schema and create all views
         */
        agency.users.forEach((user) => {
            // Create new Schema and grant to share.
            // Each user has a schema, contained all in one database.
            new snowflake.Schema(`shared_awards_tech_${agency.label}`, {
                database: `shared_awards_tech_${agency.label}`,
                name: user.schemaName,
                comment: `Shared schema for ${agency.label} Datastudio`,
            });

            new snowflake.GrantPrivilegesToShare(
                `GrantResource${user.schemaName.toUpperCase()}Schema${agency.label.toUpperCase()}`,
                {
                    onSchema: `shared_awards_tech_${agency.label}.${user.schemaName}`,
                    privileges: ["USAGE"],
                    toShare: `fht_share_${agency.label}`,
                },
            );

            datasStudioView.forEach((view) => {
                const whereClause = buildWhereClause(view, user);

                // Create Views and grant to share
                new snowflake.View(
                    `shared_awards_tech_${agency.label}.datastudio.${view.name}`,
                    {
                        database: `shared_awards_tech_${agency.label}`,
                        schema: user.schemaName,
                        name: `${view.name}`,
                        statement: `select * from analytics.insights_v1.${view.name} ${whereClause};`,
                        orReplace: false,
                        isSecure: true,
                    },
                );

                new snowflake.GrantPrivilegesToShare(
                    `GrantResource-shared_awards_tech_${agency.label}.datastudio.${view.name}`,
                    {
                        onView: `shared_awards_tech_${agency.label}.${user.schemaName}.${view.name}`,
                        toShare: `fht_share_${agency.label}`,
                        privileges: ["SELECT"],
                    },
                );
            });
        });
    });
}
import * as snowflake from "@pulumi/snowflake";
import { getPassword } from "../password/index";

export function createReaderAccount_new(
    agencyLabel: string,
    accountType: string,
): void {
    new snowflake.ManagedAccount(`managedAccountResource-${agencyLabel}`, {
        adminName: "admin",
        //adminPassword: 'getPassword(`reader_acct_${agencyLabel}`).result',
        adminPassword: 'SnowflakePass1!',
        name: `READER_ACCT_${agencyLabel}`,
        type: accountType,
    })
    
    
    //console.log('xxxxxxxxxxxxx',getPassword(`reader_acct_${agencyLabel}`).result.toString());
}

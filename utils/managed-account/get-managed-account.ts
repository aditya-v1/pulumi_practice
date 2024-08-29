import * as snowflake from "@pulumi/snowflake";
import { ManagedAccount } from "@pulumi/snowflake";
import { managedaccounts } from "./store";
import { ManagedAccountTypes } from "../../resources/snowflake/lists/index";


export function getManagedAccount(name: string, id: string): ManagedAccount {
    const managed_account = snowflake.ManagedAccount.get(name, id);
    if (!managed_account) {
        throw new Error(`${name} managed account was not found`);
    }

    return managed_account;
}
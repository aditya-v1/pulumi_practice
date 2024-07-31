import { Database } from "@pulumi/snowflake";
import { databases } from "./store";
import { DatabaseName } from "../../resources/snowflake/types/index";

export function getDatabase(name: DatabaseName): Database {
    const database = databases.get(name);
    if (!database) {
        throw new Error(`${name} database was not found`);
    }

    return database;
}
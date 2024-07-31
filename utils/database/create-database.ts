import { Database, DatabaseArgs } from "@pulumi/snowflake";
import { databases } from "./store";

export function createDatabase(name: string, options: DatabaseArgs) {
    databases.set(
        name,
        new Database(name, {
            name,
            ...options,
        }),
    );
}
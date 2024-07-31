import { DatabaseName } from "./types/index";
import { createDatabase } from "../../utils/database/index";

export function createSnowflakeDatabases(): void {

    createDatabase(DatabaseName.Analytics, {
        comment: "Analytics database data",
        dataRetentionTimeInDays: 90,
    });

    createDatabase(DatabaseName.Staging, {
        comment: "Staging database for pre-production data",
        dataRetentionTimeInDays: 90,
    });

    createDatabase(DatabaseName.Testing, {
        comment: "Testing database for pre-production data",
        dataRetentionTimeInDays: 90,
    });

}
import { Database } from "@pulumi/snowflake";

export const databases = new Map<string, Database>();
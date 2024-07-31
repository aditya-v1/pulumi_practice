import { Role } from "@pulumi/snowflake";

export const databaseRoles = new Map<string, Role>();
export const functionalRoles = new Map<string, Role>();
export const systemRoles = new Map<string, Role>();
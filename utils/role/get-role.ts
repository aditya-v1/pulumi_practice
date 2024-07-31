import { Role } from "@pulumi/snowflake";
import { databaseRoles, functionalRoles, systemRoles } from "./store";
import {
    DatabaseRoleName,
    FunctionalRoleName,
} from "../../resources/snowflake/types/index";

export function getDatabaseRole(name: DatabaseRoleName): Role {
    const role = databaseRoles.get(name);
    if (!role) {
        throw new Error(`${name} database role was not found`);
    }

    return role;
}

export function getFunctionalRole(name: FunctionalRoleName): Role {
    const role = functionalRoles.get(name);
    if (!role) {
        throw new Error(`${name} functional role was not found`);
    }

    return role;
}

export function getSystemRole(name: string): Role {
    if (!systemRoles.has(name)) {
        systemRoles.set(name, Role.get(name, name));
    }

    const role = systemRoles.get(name);
    if (!role) {
        throw new Error(`${name} system role was not found`);
    }

    return role;
}
import { RandomPassword } from "@pulumi/random";

export const passwords = new Map<string, RandomPassword>();
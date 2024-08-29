import { RandomPassword } from "@pulumi/random";
import { passwords } from "./store";

export function createPassword(name: string): RandomPassword {
    const date = new Date();

    const password = new RandomPassword(name, {
        length: 16,
        special: true,
        lower: true,
        upper: true,
        numeric: true,
        minSpecial: 2,
        minUpper: 2,
        minLower: 2,
        minNumeric: 2,
        keepers: {
            rotationDate: `${date.getFullYear()}-${date.getMonth()}`,
        },
    });

    passwords.set(name, password);

    return password;
}
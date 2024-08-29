import { createPassword } from "./create-password";
import { passwords } from "./store";

export function getPassword(name: string) {
    let password = passwords.get(name);
    if (!password) {
        password = createPassword(name);
    }

    return password;
}
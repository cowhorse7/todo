import { ByuAccount, KeycloakRole } from "@fhss-web-team/backend-utils";
import { generateDummyUserData } from "../../../dummy/helpers/dummy-user"

// THIS FILE IS NOT REAL
// Jonah: i was going to start figuring jest out, but then I got distracted, i plan to get back to this soon hopefully
describe('Create user', () => {
    const testUser = generateDummyUserData();
    const testRole: KeycloakRole = {
        id: '123abc',
        name: 'user',
        description: 'idk bro',
        containerId: 'asdf564',
    };
    const testAccount: ByuAccount = {
        type: 'NonByu',
        netId: 'dummyNetId',
        firstName: 'John',
        middleName: 'Q',
        lastName: 'Doe',
        suffix: 'Jr',
        preferredFirstName: 'Johnny',
        preferredLastName: 'D',
    };

})
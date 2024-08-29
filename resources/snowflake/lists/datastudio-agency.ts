export interface Users {
    user: string;
    schemaName: string;
    agencyFilter: string;
    divisionFilter: string | undefined;
    programFilter: string | undefined;
}

interface AgencyDataStudioProfile {
    label: string;
    type: string;
    accountName: string | undefined;
    users: Users[];
}

export enum ManagedAccountTypes {
    reader = "READER",
}

export const dataStudioAgency: AgencyDataStudioProfile[] = [
    // {
    //     label: "example",
    //     type: ManagedAccountTypes.reader,
    //     accountName: undefined,
    //     users: [
    //         {
    //             user: "analyst",
    //             schemaName: "datastudio",
    //             agencyFilter: "where agency_id = 'awards_example'",
    //             divisionFilter: "'divion 1', 'divion 2', 'divion 3', 'divion 4'",
    //             programFilter: "'program 1', 'program 2', 'program 3', 'program 4'",
    //         },
    //     ],
    // },
//    {
//        label: "DEMO1",
//        type: ManagedAccountTypes.reader,
//        accountName: undefined,
//        users: [
//            {
//                user: "analyst",
//                schemaName: "datastudio",
//                agencyFilter: "where agency_id = 'test_demo1'",
//                divisionFilter: undefined,
//                programFilter: undefined,
//            },
//        ],
//    },
//    {
//        label: "DEMO11",
//        type: ManagedAccountTypes.reader,
//        accountName: undefined,
//        users: [
//            {
//                user: "analyst",
//                schemaName: "datastudio",
//                agencyFilter: "where agency_id = 'test_demo1'",
//                divisionFilter: undefined,
//                programFilter: undefined,
//            },
//        ],
//    },
    {
        label: "DEMO12",
        type: ManagedAccountTypes.reader,
        accountName: undefined,
        users: [
            {
                user: "analyst",
                schemaName: "datastudio",
                agencyFilter: "where agency_id = 'test_demo12'",
                divisionFilter: undefined,
                programFilter: undefined,
            },
        ],
    },
    {
        label: "DEMO13",
        type: ManagedAccountTypes.reader,
        accountName: undefined,
        users: [
            {
                user: "analyst",
                schemaName: "datastudio",
                agencyFilter: "where agency_id = 'test_demo12'",
                divisionFilter: undefined,
                programFilter: undefined,
            },
        ],
    },
    {
        label: "DEMO14",
        type: ManagedAccountTypes.reader,
        accountName: undefined,
        users: [
            {
                user: "analyst",
                schemaName: "datastudio",
                agencyFilter: "where agency_id = 'test_demo12'",
                divisionFilter: undefined,
                programFilter: undefined,
            },
        ],
    },

    {
        label: "DEMO16",
        type: ManagedAccountTypes.reader,
        accountName: undefined,
        users: [
            {
                user: "analyst",
                schemaName: "datastudio",
                agencyFilter: "where agency_id = 'test_demo12'",
                divisionFilter: undefined,
                programFilter: undefined,
            },
        ],
    },


]
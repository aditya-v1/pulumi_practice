export interface DataStudioView {
    name: string;
    hasDivision: boolean;
    hasProgram: boolean;
}

export const datasStudioView: DataStudioView[] = [
    { name: "dim_table1", hasDivision: false, hasProgram: false },
    { name: "fct_table1", hasDivision: false, hasProgram: false },
]
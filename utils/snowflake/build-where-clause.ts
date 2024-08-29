import {
    DataStudioView,
    Users,
} from "../../resources/snowflake/lists/index";

export function buildWhereClause(view: DataStudioView, user: Users): string {
    let whereClause = user.agencyFilter;

    if (view.hasDivision) {
        whereClause += ` and program_division in (${user.divisionFilter})`;
    }

    if (view.hasProgram) {
        whereClause += ` and program_name in (${user.programFilter})`;
    }

    return whereClause;
}
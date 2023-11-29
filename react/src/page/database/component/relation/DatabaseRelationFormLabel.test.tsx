import { render, screen } from "@testing-library/react";
import DatabaseRelationFormLabel from "./DatabaseRelationFormLabel";

describe("Database: DatabaseRelationFormLabel", () => {
    beforeEach(() => render(<DatabaseRelationFormLabel />));

    it("should have the header title Name, Field, Foreign Table, Foreign Field", () => {
        expect(
            screen.getByText("database.dashboard.action.relations.header.name")
        ).toBeInTheDocument();
        expect(
            screen.getByText("database.dashboard.action.relations.header.field")
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "database.dashboard.action.relations.header.foreigntable"
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "database.dashboard.action.relations.header.foreignfield"
            )
        ).toBeInTheDocument();
    });
});

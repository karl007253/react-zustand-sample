import { render, screen } from "@testing-library/react";
import DatabaseStructureFormLabel from "./DatabaseStructureFormLabel";

describe("Database: DatabaseStructureFormLabel", () => {
    beforeEach(() => render(<DatabaseStructureFormLabel />));

    it("should have the header with titles Primary, Name, Type, Length, Optional and Default", () => {
        expect(
            screen.getByAltText(
                "database.dashboard.action.structure.header.primary"
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText("database.dashboard.action.structure.header.name")
        ).toBeInTheDocument();
        expect(
            screen.getByText("database.dashboard.action.structure.header.type")
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "database.dashboard.action.structure.header.length"
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "database.dashboard.action.structure.header.optional"
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                "database.dashboard.action.structure.header.default"
            )
        ).toBeInTheDocument();
    });
});

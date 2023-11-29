import { render, screen } from "@testing-library/react";
import DatabaseMenu from "./DatabaseMenu";

describe("Database: DatabaseMenu", () => {
    beforeEach(() => render(<DatabaseMenu />));

    it("should have 3 tabs title of primary menu", () => {
        const tabsTitle = [
            "database.dashboard.menu.tabs.primary.structure",
            "database.dashboard.menu.tabs.primary.relations",
            "database.dashboard.menu.tabs.primary.content",
        ];

        tabsTitle.forEach((title) =>
            expect(
                screen.getByRole("tab", {
                    name: title,
                })
            ).toBeInTheDocument()
        );
    });
});

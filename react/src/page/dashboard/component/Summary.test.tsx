import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Summary from "./Summary";

describe("Dashboard: Summaries", () => {
    beforeEach(() => {
        render(<Summary />, {
            wrapper: MemoryRouter,
        });
    });

    it("should have a API card title ", () => {
        expect(
            screen.getByRole("heading", {
                name: "dashboard.summary.title.api",
            })
        ).toBeInTheDocument();
    });

    it("should have a Database card title ", () => {
        expect(
            screen.getByRole("heading", {
                name: "dashboard.summary.title.database",
            })
        ).toBeInTheDocument();
    });

    it("should have a Scheduler card title ", () => {
        expect(
            screen.getByRole("heading", {
                name: "dashboard.summary.title.scheduler",
            })
        ).toBeInTheDocument();
    });
});

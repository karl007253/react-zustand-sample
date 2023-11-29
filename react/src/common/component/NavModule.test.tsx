import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";

import NavModule from "./NavModule";

describe("Component: NavModule", () => {
    const appid = "1234567890";

    beforeEach(() => {
        render(
            <MemoryRouter initialEntries={[`/module/${appid}/api`]}>
                <Routes>
                    <Route
                        path="/module/:appid/api"
                        element={<NavModule module="API" />}
                    />
                </Routes>
            </MemoryRouter>
        );
    });

    it("should have app icon", () => {
        expect(
            screen.getByRole("img", { name: "app-icon-image" })
        ).toBeInTheDocument();
    });

    it("should have link to module api", () => {
        expect(
            screen.getByRole("img", { name: "api-img" }).parentElement
        ).toHaveAttribute("href", `/module/${appid}/api`);
    });

    it("should have link to module database", () => {
        expect(
            screen.getByRole("img", { name: "database-img" }).parentElement
        ).toHaveAttribute("href", `/module/${appid}/database`);
    });

    it("should have link to module scheduler", () => {
        expect(
            screen.getByRole("img", { name: "scheduler-img" }).parentElement
        ).toHaveAttribute("href", `/module/${appid}/scheduler`);
    });
});

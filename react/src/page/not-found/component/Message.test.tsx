import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Message from "./Message";

describe("Page: Not Found - Message", () => {
    describe("with configuration", () => {
        beforeEach(() => {
            process.env.REACT_APP_MAIN_FRONTEND_URL = "http://localhost";

            render(<Message />, { wrapper: MemoryRouter });
        });

        it("should have a link of main page", () => {
            expect(
                screen.getByRole("link", { name: "not.found.page.link.back" })
            ).toHaveAttribute("href", "http://localhost");
        });

        it("should have a message informing the users that the requested page is invalid", () => {
            expect(
                screen.getByRole("heading", {
                    name: "not.found.page.message",
                })
            ).toBeInTheDocument();
        });
    });

    describe("without configuration", () => {
        beforeEach(() => {
            // Set undefined to the configuration
            process.env = {
                ...process.env,
                REACT_APP_MAIN_FRONTEND_URL: undefined,
            };

            render(<Message />, { wrapper: MemoryRouter });
        });

        it("should have a link of main page", () => {
            expect(
                screen.getByRole("link", { name: "not.found.page.link.back" })
            ).toHaveAttribute("href", "/");
        });
    });
});

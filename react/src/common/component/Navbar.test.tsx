import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";

describe("Layout: Menubar", () => {
    const appid = "1234567890";

    beforeEach(() => {
        render(
            <MemoryRouter initialEntries={[`/dashboard/${appid}`]}>
                <Routes>
                    <Route path="/dashboard/:appid" element={<Navbar />} />
                </Routes>
            </MemoryRouter>
        );
    });

    it("should have a Dashboard menu name", () => {
        const linkElement1 = screen.getByText(/Dashboard/i);
        expect(linkElement1).toBeInTheDocument();
    });

    it("should have a Module menu name", () => {
        const linkElement2 = screen.getByText(/Module/i);
        expect(linkElement2).toBeInTheDocument();
    });

    it("should have a Service menu name", () => {
        const linkElement3 = screen.getByText(/Service/i);
        expect(linkElement3).toBeInTheDocument();
    });

    it("should have a Configuration menu name", () => {
        const linkElement3 = screen.getByText(/Configuration/i);
        expect(linkElement3).toBeInTheDocument();
    });

    it("should have a menubar link to Dashboard", () => {
        expect(
            screen.getByRole("link", { name: "header.nav.button.dashboard" })
        ).toHaveAttribute("href", `/dashboard/${appid}`);
    });

    it("should have a menubar link to Module", () => {
        expect(
            screen.getByRole("link", { name: "header.nav.button.module" })
        ).toHaveAttribute("href", `/module/${appid}`);
    });

    it("should have a menubar link to Service", () => {
        expect(
            screen.getByRole("link", { name: "header.nav.button.service" })
        ).toHaveAttribute("href", `/service/${appid}`);
    });

    it("should have a menubar link to Configuration", () => {
        expect(
            screen.getByRole("link", {
                name: "header.nav.button.configuration",
            })
        ).toHaveAttribute("href", `/configuration/${appid}`);
    });
});

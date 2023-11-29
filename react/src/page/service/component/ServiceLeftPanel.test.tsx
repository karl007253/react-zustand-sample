import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";

import ServiceLeftPanel from "./ServiceLeftPanel";

describe("Component: ServiceLeftPanel", () => {
    beforeEach(() => {
        render(<ServiceLeftPanel />, { wrapper: MemoryRouter });
    });

    it("should have the list of available service components", () => {
        expect(screen.getByRole("list")).toBeInTheDocument();
    });

    it("should have RestConnector as one of available service component", () => {
        expect(screen.getByText("RAW(REST) Connector")).toBeInTheDocument();
    });

    it("should have SoapConnector as one of available service component", () => {
        expect(screen.getByText("Soap Connector")).toBeInTheDocument();
    });

    it("should have DatabaseConnector as one of available service component", () => {
        expect(screen.getByText("Database Connector")).toBeInTheDocument();
    });

    it("should have DatabaseTable as one of available service component", () => {
        expect(screen.getByText("Database Table")).toBeInTheDocument();
    });
});

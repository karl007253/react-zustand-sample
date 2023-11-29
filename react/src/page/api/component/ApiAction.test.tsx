import { render, screen } from "@testing-library/react";
import ApiAction from "./ApiAction";

describe("Api: ApiAction", () => {
    it("should have event flow panel", () => {
        render(<ApiAction tab="action" requestMethod="get" />);
        expect(screen.getByLabelText("event-flow-panel")).toBeInTheDocument();
    });

    it("should not have event flow panel", () => {
        const tabOtherThanAction = "header";
        render(<ApiAction tab={tabOtherThanAction} requestMethod="get" />);
        expect(
            screen.queryByLabelText("event-flow-panel")
        ).not.toBeInTheDocument();
    });
});

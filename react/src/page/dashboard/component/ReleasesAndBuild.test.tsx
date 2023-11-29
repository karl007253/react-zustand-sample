import { render, screen } from "@testing-library/react";
import ReleasesAndBuild from "./ReleasesAndBuild";

// to resolve error: Not implemented: HTMLCanvasElement.prototype.getContext
HTMLCanvasElement.prototype.getContext = jest.fn();

// to resolve error: Failed to create chart: can't acquire context from the given item
jest.mock("react-chartjs-2", () => ({
    Line: () => null,
}));

describe("Dashboard: ReleasesAndBuild", () => {
    beforeEach(() => {
        render(<ReleasesAndBuild />);
    });

    it("should have a Releases And Build title ", () => {
        expect(
            screen.getByRole("heading", {
                name: "dashboard.title.releaseAndBuild",
            })
        ).toBeInTheDocument();
    });
});

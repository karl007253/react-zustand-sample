import { screen, render, within } from "@testing-library/react";
import CardStorage from "./CardStorage";

const memory = 0;
const mockRender = async () => {
    render(<CardStorage title="dashboard.summary.current" memory={memory} />);
};

describe("Dashboard: CardStorage", () => {
    beforeEach(() => {
        mockRender();
    });
    it("should have a storage class name", () => {
        const { container } = render(
            <CardStorage title="dashboard.summary.current" memory={memory} />
        );
        const labelName = container.getElementsByClassName("storage");
        expect(labelName.length).toBe(1);
    });

    it("should display value based on the passed memory props", () => {
        const { getByText } = within(
            screen.getByTestId("storage-dashboard.summary.current")
        );
        expect(getByText(`${memory}MB`)).toBeInTheDocument();
    });
});

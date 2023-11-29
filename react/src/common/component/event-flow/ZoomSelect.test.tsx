import { render, screen } from "@testing-library/react";

import ZoomSelect from "./ZoomSelect";

describe("Component: ZoomSelect", () => {
    const mockFunction = jest.fn();
    // zoom levels
    const MAX_ZOOM = "200";
    const MIN_ZOOM = "40";
    const zoomOptions = [
        MAX_ZOOM,
        "180",
        "160",
        "140",
        "120",
        "100",
        "80",
        "60",
        MIN_ZOOM,
    ];

    beforeEach(() =>
        render(
            <ZoomSelect value="" options={zoomOptions} action={mockFunction} />
        )
    );

    it("should have selection of percentage", () => {
        const mockPercentage = zoomOptions[0];
        expect(screen.getByText(`${mockPercentage}%`)).toBeInTheDocument();
    });
});

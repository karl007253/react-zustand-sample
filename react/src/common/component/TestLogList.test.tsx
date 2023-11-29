import { render, screen } from "@testing-library/react";
import TestLogList from "./TestLogList";

const sampleLogs = [
    "Sample log item 1",
    "Sample log item 2",
    "Sample log item 3",
];

describe("Component: Test Log List", () => {
    beforeEach(() => {
        render(<TestLogList logs={sampleLogs} />);
    });

    it("must show all contents inside the log", () => {
        sampleLogs.forEach((log) => {
            expect(screen.getByText(log)).toBeInTheDocument();
        });
    });
});

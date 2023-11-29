import { render, screen } from "@testing-library/react";
import ApiAuthenticationInfoTable, {
    ApiAuthenticationInfoTableProps,
} from "./ApiAuthenticationInfoTable";

const mockDataHeader = ["No", "Name", "Age"];

const mockDataBody = [
    ["1", "Name A", "30"],
    ["2", "Name B", "30"],
    ["3", "Name C", "30"],
    ["4", "Name D", "30"],
    ["5", "Name E", "30"],
];

const mockTableName = "Table title";
const mockTableAriaLabel = "table-aria-label";

const renderTable = (props: ApiAuthenticationInfoTableProps) => {
    render(
        <ApiAuthenticationInfoTable
            label={mockTableAriaLabel}
            tableName={props.tableName}
            headers={props.headers}
            body={props.body}
        />
    );
};

describe("Component: Table", () => {
    beforeEach(() =>
        renderTable({
            tableName: mockTableName,
            headers: mockDataHeader.map((name) => {
                return { name };
            }),
            body: mockDataBody,
        })
    );

    it("should render a title text properly", () => {
        expect(screen.getByRole("heading")).toHaveTextContent(mockTableName);
    });

    it("should have the correct ARIA label", () => {
        expect(screen.getByRole("table")).toHaveAttribute(
            "aria-label",
            mockTableAriaLabel
        );
    });

    it("should have a correct number of headers", () => {
        const tableHeaders = screen.getAllByRole("columnheader");
        expect(tableHeaders).toHaveLength(mockDataHeader.length);
    });

    it("should have a correct number of rows", () => {
        const tableBodies = screen.getAllByRole("row");
        // Table rows including table header (1) and body (mockDataBody.length)
        expect(tableBodies).toHaveLength(mockDataBody.length + 1);
    });

    it("should have a correct header labels", () => {
        mockDataHeader.forEach((header) => {
            expect(
                screen.getByRole("columnheader", { name: header })
            ).toBeInTheDocument();
        });
    });
});

describe("Component: Table with variable column widths (all specified)", () => {
    describe("(all specified)", () => {
        const columnWidths = ["20%", "30%", "50%"];

        beforeEach(() =>
            renderTable({
                tableName: mockTableName,
                headers: mockDataHeader.map((name, index) => {
                    return { name, columnWidth: columnWidths[index] };
                }),
                body: mockDataBody,
            })
        );

        it("should have correct column widths", () => {
            const tableHeaders = screen.getAllByRole("columnheader");
            for (let i = 0; i < tableHeaders.length; i++) {
                expect(tableHeaders[i].style.width).toBe(columnWidths[i]);
            }
        });
    });

    describe("(some unspecified)", () => {
        // We intentionally left the last column blank
        const columnWidths = ["20%", "30%"];

        beforeEach(() =>
            renderTable({
                tableName: mockTableName,
                headers: mockDataHeader.map((name, index) => {
                    return { name, columnWidth: columnWidths[index] };
                }),
                body: mockDataBody,
            })
        );

        it("should have correct column widths", () => {
            const tableHeaders = screen.getAllByRole("columnheader");
            for (let i = 0; i < tableHeaders.length; i++) {
                if (i > columnWidths.length - 1) {
                    // For unspecified widths, we expect the width to be "auto"
                    expect(tableHeaders[i].style.width).toBe("auto");
                } else {
                    expect(tableHeaders[i].style.width).toBe(columnWidths[i]);
                }
            }
        });
    });

    describe("(all unspecified)", () => {
        beforeEach(() =>
            renderTable({
                tableName: mockTableName,
                headers: mockDataHeader.map((name) => {
                    return { name };
                }),
                body: mockDataBody,
            })
        );

        it("should have correct column widths", () => {
            const tableHeaders = screen.getAllByRole("columnheader");
            for (let i = 0; i < tableHeaders.length; i++) {
                expect(tableHeaders[i].style.width).toBe("auto");
            }
        });
    });
});

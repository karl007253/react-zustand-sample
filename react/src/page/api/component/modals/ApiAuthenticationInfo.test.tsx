import { render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import ApiAuthenticationInfo, {
    AuthenticationInfoTab,
} from "./ApiAuthenticationInfo";

describe("Component: Modal - ApiAuthenticationInfo", () => {
    // mock handle close
    const mockHandleClose = jest.fn();

    // Refer AuthenticationInfoTab type for all implemented tabs
    const allTabs = [
        AuthenticationInfoTab.tokenEndpoint,
        AuthenticationInfoTab.refreshTokenEndpoint,
        AuthenticationInfoTab.invalidateTokenEndpoint,
    ];

    // Map headers and parameters content from locale to table body
    const bodyText = (key: string): string => {
        return `api.dashboard.modalAuthInfo.body.${key}`;
    };

    beforeEach(() => {
        render(
            <MemoryRouter>
                <ApiAuthenticationInfo show handleClose={mockHandleClose} />
            </MemoryRouter>
        );
    });

    it("should have a modal title", () => {
        expect(
            screen.getByText("api.dashboard.modalAuthInfo.title")
        ).toBeInTheDocument();
    });

    it("should have a cancel button that triggers handleClose", () => {
        // trigger click event
        userEvent.click(screen.getByRole("button", { name: "Close" }));

        // ensure mock function is called
        expect(mockHandleClose).toBeCalledTimes(1);
    });

    it("should have all the relevant tabs exist", () => {
        const allTabLabels = allTabs.map(
            (tab) =>
                `api.dashboard.modalAuthInfo.tabs.${AuthenticationInfoTab[tab]}`
        );

        allTabLabels.forEach((label) => {
            expect(
                screen.getByRole("tab", { name: label })
            ).toBeInTheDocument();
        });
    });

    it("should ensure all URI fields are read-only", () => {
        allTabs.forEach((tab) => {
            const tabName = AuthenticationInfoTab[tab];
            expect(
                screen.getByRole("textbox", {
                    name: `uri-field-${tabName}`,
                })
            ).toHaveAttribute("readOnly");
        });
    });

    it("should have the correct URI fields in all tabs", async () => {
        allTabs.forEach((tab) => {
            const tabName = AuthenticationInfoTab[tab];

            // Ensure the inputs exist in the view.
            // Visibility toggling is controlled by the underlying TabMenu component
            expect(
                screen.getByRole("textbox", {
                    name: `uri-field-${tabName}`,
                })
            ).toBeInTheDocument();
        });
    });

    it("should show all the parameters data in each tabs", async () => {
        // Each tabs have their own parameters
        const parameterKeys: {
            [tab in AuthenticationInfoTab]: string[];
        } = {
            [AuthenticationInfoTab.tokenEndpoint]: [
                "grantTypePassword",
                "scope",
                "username",
                "password",
            ],
            [AuthenticationInfoTab.refreshTokenEndpoint]: [
                "grantTypeRefreshToken",
                "scope",
                "refreshToken",
            ],
            [AuthenticationInfoTab.invalidateTokenEndpoint]: ["refreshToken"],
        };

        const operations = allTabs.map(async (tab) => {
            const tabName = AuthenticationInfoTab[tab];
            await waitFor(() => {
                userEvent.click(
                    screen.getByRole("tab", {
                        name: `api.dashboard.modalAuthInfo.tabs.${tabName}`,
                    })
                );
            });
            const table = screen.getByRole("table", {
                name: `table-parameters-${tabName}`,
            });
            // For each rows, ensure the keys, values and descriptions are correct and visible
            parameterKeys[tab].forEach((parameter) => {
                ["key", "value", "description"].forEach((column) => {
                    expect(
                        within(table).getByRole("cell", {
                            name: bodyText(
                                `parameters.tableBody.${parameter}.${column}`
                            ),
                        })
                    ).toBeVisible();
                });
            });
        });
        await Promise.all(operations);
    });

    it("should show all the headers data in each tabs", async () => {
        // For now, all tabs only have one row: Authorization
        const headerKeys: {
            [tab in AuthenticationInfoTab]: string[];
        } = {
            [AuthenticationInfoTab.tokenEndpoint]: ["authorization"],
            [AuthenticationInfoTab.refreshTokenEndpoint]: ["authorization"],
            [AuthenticationInfoTab.invalidateTokenEndpoint]: ["authorization"],
        };

        const operations = allTabs.map(async (tab) => {
            const tabName = AuthenticationInfoTab[tab];

            await waitFor(() => {
                userEvent.click(
                    screen.getByRole("tab", {
                        name: `api.dashboard.modalAuthInfo.tabs.${tabName}`,
                    })
                );
            });
            const table = screen.getByRole("table", {
                name: `table-headers-${tabName}`,
            });
            // For each rows, ensure the keys, values and descriptions are correct and visible
            headerKeys[tab].forEach((parameter) => {
                ["key", "value", "description"].forEach((column) => {
                    expect(
                        within(table).getByRole("cell", {
                            name: bodyText(
                                `headers.tableBody.${parameter}.${column}`
                            ),
                        })
                    ).toBeVisible();
                });
            });
        });
        await Promise.all(operations);
    });
});

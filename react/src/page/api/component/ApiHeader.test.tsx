import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

import ApiHeader from "./ApiHeader";

import useStore from "../../../common/zustand/Store";

// Prepare role name
const firstInputType = "api-header-input-type-0";
const firstInputValue = "api-header-input-value-0";
const firstDeleteButton = "api-header-delete-button-0";

describe("Api: ApiHeader", () => {
    beforeEach(() => render(<ApiHeader requestMethod="get" />));

    it("should have the header title Type and Value", () => {
        expect(
            screen.getByText("api.dashboard.action.header.type")
        ).toBeInTheDocument();
        expect(
            screen.getByText("api.dashboard.action.header.value")
        ).toBeInTheDocument();
    });

    it("should show no input fields before having any data", () => {
        const inputFields = screen.queryAllByRole("textbox");
        expect(inputFields.length).toEqual(0);
    });

    it("should add a header data after clicking Add button", async () => {
        // Click Add button
        userEvent.click(
            screen.getByRole("button", {
                name: "api.dashboard.action.header.button.add",
            })
        );

        // ensure a additional record is added
        expect(
            screen.getByRole("textbox", { name: firstInputType })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("textbox", { name: firstInputValue })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: firstDeleteButton })
        ).toBeInTheDocument();
    });

    describe("with header data", () => {
        const mockHeaderData = [
            {
                type: "Type1",
                value: "Value1",
            },
        ];

        const mockApi = {
            uuid: "1",
            name: "testApi",
            title: "testApi",
            data: {
                get: {
                    header: mockHeaderData,
                },
            },
            order: 0,
        };

        let mockUpdateApiHeader: jest.Mock;

        // render module with data
        beforeEach(() =>
            act(async () => {
                // Ensure mockUpdateApiHeader is reset to 0 call, by assigning a new jest.fn() in each test
                mockUpdateApiHeader = jest.fn();

                useStore.setState(
                    {
                        api: [mockApi],
                        selectedApiUuid: mockApi.uuid,
                        updateApiHeader: mockUpdateApiHeader,
                    },
                    true
                );
            })
        );

        it("should display all header data", () => {
            mockHeaderData.forEach((header, index) => {
                // Ensure input field of type is shown with the correct value
                expect(
                    screen.getByRole("textbox", {
                        name: `api-header-input-type-${index}`,
                    })
                ).toHaveValue(header.type);

                // Ensure input field of value is shown with the correct value
                expect(
                    screen.getByRole("textbox", {
                        name: `api-header-input-value-${index}`,
                    })
                ).toHaveValue(header.value);

                // Ensure delete button is shown
                expect(
                    screen.getByRole("button", {
                        name: `api-header-delete-button-${index}`,
                    })
                ).toBeInTheDocument();
            });
        });

        it("should update header data in global state when an existing header type is changed", async () => {
            const changedHeader = mockHeaderData[0];

            // Input anything to the input field of type
            userEvent.type(
                screen.getByRole("textbox", { name: firstInputType }),
                `-new`
            );

            // Ensure the input field of type is updated after user input
            expect(
                screen.getByRole("textbox", { name: firstInputType })
            ).toHaveValue(`${changedHeader.type}-new`);

            // Ensure updateApiHeader is not called immediately
            expect(mockUpdateApiHeader).toHaveBeenCalledTimes(0);

            // Ensure updateApiHeader is called upon completion of user typing
            await waitFor(() => {
                expect(mockUpdateApiHeader).toHaveBeenCalledTimes(1);
            });

            // Input anything to the input field of value
            userEvent.type(
                screen.getByRole("textbox", { name: firstInputValue }),
                `-new`
            );

            // Ensure the input field of value is updated after user input
            expect(
                screen.getByRole("textbox", { name: firstInputValue })
            ).toHaveValue(`${changedHeader.value}-new`);

            // Ensure updateApiHeader is called upon completion of user typing
            await waitFor(() => {
                expect(mockUpdateApiHeader).toHaveBeenCalledTimes(2);
            });
        });

        it("should update header data in global state when a new header type is provided", async () => {
            // Click Add button
            userEvent.click(
                screen.getByRole("button", {
                    name: "api.dashboard.action.header.button.add",
                })
            );

            // Input a value to the new input field of type
            userEvent.type(
                screen.getByRole("textbox", {
                    name: `api-header-input-type-${mockHeaderData.length}`,
                }),
                "newTypeInput"
            );

            // Ensure updateApiHeader is not called immediately
            expect(mockUpdateApiHeader).toHaveBeenCalledTimes(0);

            // Ensure updateApiHeader is called upon completion of user typing
            await waitFor(() => {
                expect(mockUpdateApiHeader).toHaveBeenCalledTimes(1);
            });
        });

        it("should not update header when a new header value is provided without a type", async () => {
            const newHeaderRow = mockHeaderData.length;

            // Click Add button
            userEvent.click(
                screen.getByRole("button", {
                    name: "api.dashboard.action.header.button.add",
                })
            );

            // Input a value to the new input field of value
            userEvent.type(
                screen.getByRole("textbox", {
                    name: `api-header-input-value-${newHeaderRow}`,
                }),
                "newTypeValue"
            );

            // Ensure new input field of type does not have any value
            expect(
                screen.getByRole("textbox", {
                    name: `api-header-input-type-${newHeaderRow}`,
                })
            ).toHaveValue("");

            // Ensure updateApiHeader is not called immediately
            expect(mockUpdateApiHeader).toHaveBeenCalledTimes(0);

            // Ensure updateApiHeader is not called upon completion of user typing
            await waitFor(() => {
                expect(mockUpdateApiHeader).toHaveBeenCalledTimes(0);
            });
        });

        it("should remove the record after clicking the delete button", async () => {
            // Click Delete button
            userEvent.click(
                screen.getByRole("button", {
                    name: firstDeleteButton,
                })
            );

            // Check if the data is already deleted
            expect(
                screen.queryByRole("textbox", { name: firstInputType })
            ).not.toBeInTheDocument();
            expect(
                screen.queryByRole("textbox", { name: firstInputValue })
            ).not.toBeInTheDocument();
            expect(
                screen.queryByRole("button", { name: firstDeleteButton })
            ).not.toBeInTheDocument();

            // Ensure updateApiHeader is not called immediately
            expect(mockUpdateApiHeader).toHaveBeenCalledTimes(0);

            // Ensure updateApiHeader is called upon completion of deletion
            await waitFor(() => {
                expect(mockUpdateApiHeader).toHaveBeenCalledTimes(1);
            });
        });

        it("should remove the record after an existing header type is cleared", async () => {
            // Clear input field of type
            userEvent.clear(
                screen.getByRole("textbox", { name: firstInputType })
            );

            // Check if the data is already deleted
            expect(
                screen.queryByRole("textbox", { name: firstInputType })
            ).not.toBeInTheDocument();
            expect(
                screen.queryByRole("textbox", { name: firstInputValue })
            ).not.toBeInTheDocument();
            expect(
                screen.queryByRole("button", { name: firstDeleteButton })
            ).not.toBeInTheDocument();

            // Ensure updateApiHeader is not called immediately
            expect(mockUpdateApiHeader).toHaveBeenCalledTimes(0);

            // Ensure updateApiHeader is called upon completion of clearing
            await waitFor(() => {
                expect(mockUpdateApiHeader).toHaveBeenCalledTimes(1);
            });
        });
    });
});

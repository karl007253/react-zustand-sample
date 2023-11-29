import {
    render,
    screen,
    waitFor,
    within,
    BoundFunctions,
    queries,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import produce from "immer";
import ApiParameterList from "./ApiParameterList";
import useStore from "../../../common/zustand/Store";
import {
    Api,
    ParameterType,
    QueryParameter,
    DataType,
    RequestParameter,
} from "../../../common/zustand/interface/ApiInterface";

// Mock ApiList
const mockApiList: Api[] = [
    {
        uuid: "id-endpoint-1",
        name: "endpoint-1",
        title: "endpoint-1",
        data: {},
        order: 0,
    },
];

// Prepare default query parameter data
const queryDefaultQueryParameter = {
    field: "",
    description: "",
    type: DataType.STRING,
    required: false,
};

// Get all row in "parameter-list"
const parameterList = () =>
    within(screen.getByLabelText("parameter-list")).getAllByRole("row");

// Get add button
const addParameterButton = () =>
    screen.getByRole("button", { name: "common.button.add" });

// Get input textbox of field
const fieldTextBox = (component: BoundFunctions<typeof queries>) =>
    component.getByRole("textbox", { name: "field" });

// Get input textbox of description
const descriptionTextBox = (component: BoundFunctions<typeof queries>) =>
    component.getByRole("textbox", { name: "description" });

// Get input select of type
const typeComboBox = (component: BoundFunctions<typeof queries>) =>
    component.getByRole("combobox", { name: "type" });

// Get checkbox of required
const requiredCheckBox = (component: BoundFunctions<typeof queries>) =>
    component.getByRole("checkbox", { name: "required" });

// Get delete button
const deleteParameterButton = (component: BoundFunctions<typeof queries>) =>
    component.getByRole("button", { name: "delete" });

// Get input select of body paramter type
const parameterTypeComboBox = () =>
    screen.getByRole("combobox", {
        name: "api.dashboard.action.parameters.label.type",
    });

const addNewItem = () => {
    // Trigger add button
    userEvent.click(addParameterButton());

    // Get input within the first parameter on list
    const listItems = parameterList();
    const addedItem = listItems[listItems.length - 1]; // -1 to get last

    // return added item
    return addedItem;
};

// Prepare mock update
const mockUpdateParameter = jest.fn();

// Check column names
const verifyColumns = () => {
    // Prepare list of columns
    const columns = [
        "parameter",
        "description",
        "type",
        "required",
        "delete-button",
    ];

    columns.forEach((col) => {
        const colName =
            col === "delete-button"
                ? `table-column-${col}`
                : `api.dashboard.action.parameters.table.column.${col}`;

        // Ensure all column headers are present
        expect(
            within(screen.getByLabelText(`parameter-columns`)).getByRole(
                "columnheader",
                { name: colName }
            )
        ).toBeInTheDocument();
    });
};

const verifyRow = (queryParameter: QueryParameter[]) => {
    const rows = parameterList();

    // Ensure all query parameter is shown
    expect(rows).toHaveLength(queryParameter.length);

    rows.forEach((row, index) => {
        const { field, description, type, required } = queryParameter[index];

        // Ensure input textbox of field is shown with a value
        expect(fieldTextBox(within(row))).toHaveValue(field);

        // Ensure input textbox of description is shown with a value
        expect(descriptionTextBox(within(row))).toHaveValue(description);

        // Ensure input select of type is shown with a value
        expect(typeComboBox(within(row))).toHaveValue(type);

        // Ensure checkbox is ticked if required is true
        if (required) {
            expect(requiredCheckBox(within(row))).toBeChecked();
        } else {
            expect(requiredCheckBox(within(row))).not.toBeChecked();
        }

        // Ensure delete button is able to click
        expect(deleteParameterButton(within(row))).toBeEnabled();
    });
};

const verifyEmptyList = () => {
    // Ensure parameter list is empty
    expect(
        within(screen.getByLabelText("parameter-list")).queryAllByRole("row")
    ).toHaveLength(0);
};

const verifyLengthOfList = (length: number) => {
    // Ensure parameter list is having the correct length
    if (length === 0) {
        verifyEmptyList();
    } else {
        expect(parameterList()).toHaveLength(length);
    }
};

const verifyUpdateParameterCalledTimes = async (calledTimes: number) => {
    const verifyCalledTimes = (expectedCalledTimes: number) =>
        expect(mockUpdateParameter).toHaveBeenCalledTimes(expectedCalledTimes);

    const initialCalledTime = calledTimes > 0 ? calledTimes - 1 : 0;

    // Ensure updateApiParameter() is not called initially
    verifyCalledTimes(initialCalledTime);

    // Ensure updateApiParameter() is called upon completion of editing
    await waitFor(() => verifyCalledTimes(calledTimes));
};

// Ensures add button is not disabled
// Will also check its behavior
const verifyAddButton = async () => {
    verifyEmptyList();

    // Trigger add button
    addNewItem();

    // Ensure the new row is added
    // Ensure all the component within a row is having the correct default value
    verifyRow([queryDefaultQueryParameter]);

    // Ensure updateParameter is not called
    await verifyUpdateParameterCalledTimes(0);
};

const verifyDataTypeSelectInput = () => {
    // Trigger add button
    addNewItem();

    // Ensure all available options is shown in the input select of type
    Object.values(DataType).forEach((type) =>
        expect(typeComboBox(screen)).toContainElement(
            screen.getByRole("option", { name: type })
        )
    );
};

const verifyResultWhenInputFieldIsProvided = async () => {
    // Trigger add button
    const newItem = addNewItem();

    const fieldInput = "new field";

    // Type in the input textbox of field
    userEvent.type(fieldTextBox(within(newItem)), fieldInput);

    // Ensure all the row is shown with the correct value
    verifyRow([{ ...queryDefaultQueryParameter, field: fieldInput }]);

    // Ensure updateApiParameter is called
    await verifyUpdateParameterCalledTimes(1);
};

const verifyResultWhenInputFieldIsNotProvided = async () => {
    // Trigger add button
    const newItem = addNewItem();

    const descriptionInput = "new description";
    const typeInput = DataType.NUMBER;

    userEvent.type(descriptionTextBox(within(newItem)), descriptionInput);
    userEvent.selectOptions(typeComboBox(within(newItem)), typeInput);
    userEvent.click(requiredCheckBox(within(newItem)));

    // Ensure all the row is shown with the correct value
    verifyRow([
        {
            ...queryDefaultQueryParameter,
            description: descriptionInput,
            type: typeInput,
            required: true,
        },
    ]);

    // Ensure updateApiParameter is not called if input textbox of field is empty
    await verifyUpdateParameterCalledTimes(0);
};

const verifyResultWhenInputIsChanged = async (
    mockParameter: QueryParameter[]
) => {
    const changedApiParameter = mockParameter[0];
    const changedRow = parameterList()[0];
    const newInput = "new input";

    // Ensure input textbox of field is updated and updateApiParameter() is called
    userEvent.type(fieldTextBox(within(changedRow)), newInput);
    expect(fieldTextBox(within(changedRow))).toHaveValue(
        `${changedApiParameter.field}${newInput}`
    );
    await verifyUpdateParameterCalledTimes(1);

    // Ensure input textbox of description is updated and updateApiParameter() is called
    userEvent.type(descriptionTextBox(within(changedRow)), newInput);
    expect(descriptionTextBox(within(changedRow))).toHaveValue(
        `${changedApiParameter.description}${newInput}`
    );
    await verifyUpdateParameterCalledTimes(2);

    // Ensure input select of type is updated and updateApiParameter() is called
    userEvent.selectOptions(typeComboBox(within(changedRow)), DataType.NUMBER);
    expect(typeComboBox(within(changedRow))).toHaveValue(DataType.NUMBER);
    await verifyUpdateParameterCalledTimes(3);

    // Ensure checkbox of required is updated and updateApiParameter() is called
    userEvent.click(requiredCheckBox(within(changedRow)));
    if (!changedApiParameter.required) {
        expect(requiredCheckBox(within(changedRow))).toBeChecked();
    } else {
        expect(requiredCheckBox(within(changedRow))).not.toBeChecked();
    }
    await verifyUpdateParameterCalledTimes(4);
};

const verifyResultWhenFieldIsCleared = async () => {
    const initialRows = parameterList();
    const removedRow = initialRows[0];

    // Clear the value of input textbox of field
    userEvent.clear(fieldTextBox(within(removedRow)));

    // Ensure a row is removed
    verifyLengthOfList(initialRows.length - 1);

    // Ensure updateApiParamter() is called
    await verifyUpdateParameterCalledTimes(1);
};

const verifyResultWhenDeleteButtonIsClicked = async () => {
    const initialRows = parameterList();
    const removedRow = initialRows[0];

    // Click delete button
    userEvent.click(deleteParameterButton(within(removedRow)));

    // Ensure a row is removed
    verifyLengthOfList(initialRows.length - 1);

    // Ensure updateApiParamter() is called
    await verifyUpdateParameterCalledTimes(1);
};

// Store initial global state
const initialState = useStore.getState();

const renderApiParameterList = (
    paramType: keyof RequestParameter,
    mockUpdate?: boolean,
    apiList?: Api[]
) => {
    // set state
    const api = apiList || mockApiList;
    const isMockUpdate = mockUpdate === undefined ? true : mockUpdate;

    useStore.setState(
        {
            ...initialState,
            api,
            selectedApiUuid: api[0].uuid,
            // mock updateApiParameter if mockUpdate is enabled
            ...(isMockUpdate && { updateApiParameter: mockUpdateParameter }),
        },
        true
    );

    render(<ApiParameterList requestMethod="get" paramType={paramType} />);

    // Ensure updateApiParameter is not called yet before each test
    mockUpdateParameter.mockReset();
};

describe("Api: ApiParameterList", () => {
    describe("TYPE - QUERY", () => {
        describe("generic test & without data of api parameter", () => {
            beforeEach(() => renderApiParameterList("query"));

            it("should have the right column names", verifyColumns);

            it("should have an empty list initially", verifyEmptyList);

            it("should have an active add button", verifyAddButton);

            it(
                "should have all available options in the select input of type",
                verifyDataTypeSelectInput
            );

            it("should not have the select parameter type combobox", () => {
                // Ensure input select of body parameter type is not present
                expect(
                    screen.queryByRole("combobox", {
                        name: "api.dashboard.action.parameters.label.type",
                    })
                ).not.toBeInTheDocument();
            });

            it(
                "should update parameter data when input of field is provided",
                verifyResultWhenInputFieldIsProvided
            );

            it(
                "should not update parameter data when input of field is not provided",
                verifyResultWhenInputFieldIsNotProvided
            );
        });

        describe("with data of api parameter", () => {
            // Mock query Parameter
            const mockQueryParameter = [
                {
                    field: "query field",
                    type: DataType.STRING,
                    description: "query description",
                    required: true,
                },
            ];

            beforeEach(() =>
                // Render ApiParameterList with query parameter data
                renderApiParameterList(
                    "query",
                    true,
                    produce(mockApiList, (draft) => {
                        draft[0].data = {
                            get: {
                                parameter: {
                                    query: mockQueryParameter,
                                },
                            },
                        };
                    })
                )
            );

            it("should display all the query parameters", () =>
                verifyRow(mockQueryParameter));

            it("should update parameter data when any input is changed", () =>
                verifyResultWhenInputIsChanged(mockQueryParameter));

            it(
                "should remove the entire row when field is cleared",
                verifyResultWhenFieldIsCleared
            );

            it(
                "should remove the entire row when delete button is clicked",
                verifyResultWhenDeleteButtonIsClicked
            );
        });
    });

    describe("TYPE - BODY", () => {
        describe("Parameter Type select input", () => {
            it("should have all available options in the select input of parameter type", () => {
                renderApiParameterList("body", false);

                Object.values(ParameterType).forEach((type) =>
                    expect(parameterTypeComboBox()).toContainElement(
                        screen.getByRole("option", {
                            name: type,
                        })
                    )
                );
            });

            it("should have 'json' as the default parameter type", () => {
                renderApiParameterList("body", false);

                // Ensure input select of body parameter type is having value of "json"
                expect(parameterTypeComboBox()).toHaveValue(ParameterType.JSON);

                // Ensure "parameter-list" is present when "json" is selected
                expect(
                    screen.getByLabelText("parameter-list")
                ).toBeInTheDocument();
            });

            it("should have an active select parameter type", async () => {
                renderApiParameterList("body", false);

                // Change body parameter type to "text"
                userEvent.selectOptions(
                    parameterTypeComboBox(),
                    ParameterType.TEXT
                );

                // Ensure "parameter-list" is absent when "json" is not selected
                await waitFor(() =>
                    expect(
                        screen.queryByLabelText("parameter-list")
                    ).not.toBeInTheDocument()
                );
            });

            it("should update api parameter when parameter type is changed", () => {
                renderApiParameterList("body");

                // Change body parameter type to "text"
                userEvent.selectOptions(
                    parameterTypeComboBox(),
                    ParameterType.TEXT
                );

                // Ensure updateApiParameter() is called
                expect(mockUpdateParameter).toHaveBeenCalledTimes(1);
            });
        });

        describe("generic test & without data of api parameter", () => {
            beforeEach(() => renderApiParameterList("body"));

            it("should have the right column names", verifyColumns);

            it("should have an empty list initially", verifyEmptyList);

            it("should have an active add button", verifyAddButton);

            it(
                "should have all available options in the select input of type",
                verifyDataTypeSelectInput
            );

            it(
                "should update parameter data when input of field is provided",
                verifyResultWhenInputFieldIsProvided
            );

            it(
                "should not update parameter data when input of field is not provided",
                verifyResultWhenInputFieldIsNotProvided
            );
        });

        describe("when parameter type is JSON & with data of api parameter", () => {
            // Mock body Parameter
            const mockBodyParameter = [
                {
                    field: "query field",
                    type: DataType.STRING,
                    description: "query description",
                    required: true,
                },
            ];

            beforeEach(() =>
                // Render ApiParameterList with body parameter data
                renderApiParameterList(
                    "body",
                    true,
                    produce(mockApiList, (draft) => {
                        draft[0].data = {
                            get: {
                                parameter: {
                                    body: {
                                        type: ParameterType.JSON,
                                        parameter: mockBodyParameter,
                                    },
                                },
                            },
                        };
                    })
                )
            );

            it("should display all the body parameters", () =>
                verifyRow(mockBodyParameter));

            it("should update parameter data when any input is changed", () =>
                verifyResultWhenInputIsChanged(mockBodyParameter));

            it(
                "should remove the entire row when field is cleared",
                verifyResultWhenFieldIsCleared
            );

            it(
                "should remove the entire row when delete button is clicked",
                verifyResultWhenDeleteButtonIsClicked
            );
        });
    });
});

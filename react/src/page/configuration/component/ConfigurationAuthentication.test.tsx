import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfigurationFields } from "..";
import { ApplicationDetails } from "../../../common/zustand/interface/ApplicationInterface";

import {
    Configuration,
    ConfigurationType,
    GlobalConfigurationType,
} from "../../../common/zustand/interface/ConfigurationInterface";
import useStore from "../../../common/zustand/Store";
import ConfigurationAuthentication, {
    configAuthFields,
} from "./ConfigurationAuthentication";

// Mock Data
const mockApplicationData: ApplicationDetails = {
    id: 1,
    application_code: "163066112782698",
    application_type_id: 1,
    application_type_name: "Client",
    user_id: 1,
    appname: "test",
    description: "test",
    compiler: "java",
    icon: "app_icon.png",
    is_published: false,
    is_locked: false,
    theme: "classic",
    version: 1,
    version_name: null,
    build_status: null,
    last_build_at: null,
    created_at: "2021-09-03T16:25:27.904+07:00",
    created_by: null,
    updated_at: "2021-09-03T16:25:27.904+07:00",
    updated_by: null,
};

const mockConfigData: ConfigurationFields = {
    clientId: "client-id-test",
    clientSecret: "secret-test",
    accessTokenValidity: "123",
    refreshTokenValidity: "123456",
};

const mockConfigurationList: Configuration[] = [
    {
        uuid: "config-application-uuid",
        name: GlobalConfigurationType.AUTHENTICATION,
        title: GlobalConfigurationType.AUTHENTICATION,
        data: mockConfigData,
        type: ConfigurationType.GLOBAL,
        order: 0,
    },
];

const inputTextbox = (name: string) => {
    return screen.getByRole("textbox", {
        name: `configuration.authentication.form.label.${name}`,
    });
};

// Set State
useStore.setState({
    applicationData: mockApplicationData,
});

describe("Configuration: ConfigurationAuthentication", () => {
    // mock handleSaveFields
    const mockSaveFields = jest.fn();

    describe("with ApplicationData", () => {
        beforeEach(() => {
            render(
                <ConfigurationAuthentication
                    handleSaveFields={mockSaveFields}
                    configurationList={mockConfigurationList}
                />
            );
        });

        it("should render the right header title", () => {
            expect(
                screen.getByText("configuration.authentication.header")
            ).toBeInTheDocument();
        });

        it("should render the correct fields with the correct default data", async () => {
            // Iterate through the fields and check if they are rendered correctly
            configAuthFields.forEach(({ fieldName, defaultValue }) => {
                // Prepare the name
                const name = `configuration.authentication.form.label.${fieldName}`;

                // Prepare value to be used
                // use mock data if it exists
                let expectedValue = defaultValue ?? "";
                if (mockConfigData[fieldName]) {
                    expectedValue = mockConfigData[fieldName];
                }

                // Ensure that the label is rendered
                expect(screen.getByLabelText(name)).toBeInTheDocument();

                // Ensure that the input has the correct default value
                expect(inputTextbox(fieldName)).toHaveValue(
                    String(expectedValue)
                );
            });
        });

        it("should save fields after changes", () => {
            // Iterate through the fields and check if they are rendered correctly
            configAuthFields.forEach(({ fieldName }) => {
                // mock value
                const mockValue = mockConfigData[fieldName];

                // Prepare the input
                const inputElement = inputTextbox(fieldName);

                // Clear the input
                userEvent.clear(inputElement);

                // Change the input value
                userEvent.type(inputElement, mockValue);

                // Ensure that the input has the correct value
                expect(inputElement).toHaveValue(mockValue);
            });

            // Ensure that the handleSaveFields is called only once
            expect(mockSaveFields).toBeCalledTimes(1);
        });
    });
});

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
import { ConfigurationInputType } from "./ConfigurationInput";
import ConfigurationSSL, { configSSLFields } from "./ConfigurationSSL";

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
    sslEnabled: "true",
    keyAlias: "keyAlias_test",
    keyPassword: "keyPassword_test",
    keyStore: "keyStore_test",
    keyStoreType: "keyStoreType_test",
    keyStorePassword: "keyStorePassword_test",
};

const mockConfigurationList: Configuration[] = [
    {
        uuid: "config-ssl-uuid",
        name: GlobalConfigurationType.SSL,
        title: GlobalConfigurationType.SSL,
        data: mockConfigData,
        type: ConfigurationType.GLOBAL,
        order: 0,
    },
];

const inputCheckbox = (name: string) => {
    return screen.getByRole("combobox", {
        name: `configuration.ssl.form.label.${name}`,
    });
};

const inputTextbox = (name: string) => {
    return screen.getByRole("textbox", {
        name: `configuration.ssl.form.label.${name}`,
    });
};

const inputLabel = (name: string) => {
    return screen.getByLabelText(`configuration.ssl.form.label.${name}`);
};

// Set State
useStore.setState({
    applicationData: mockApplicationData,
});

describe("Configuration: ConfigurationSSL", () => {
    // mock handleSaveFields
    const mockSaveFields = jest.fn();

    beforeEach(() => {
        render(
            <ConfigurationSSL
                handleSaveFields={mockSaveFields}
                configurationList={mockConfigurationList}
            />
        );
    });

    it("should render the right header title", () => {
        expect(
            screen.getByText("configuration.ssl.header")
        ).toBeInTheDocument();
    });

    it("should render the correct fields with the correct default data", async () => {
        // Iterate through the fields and check if they are rendered correctly
        configSSLFields.forEach(({ fieldName, type, defaultValue }) => {
            // Prepare the expected value
            let expectedValue = defaultValue ?? "";

            // use mock data if it exists
            if (mockConfigData[fieldName]) {
                expectedValue = mockConfigData[fieldName];
            }

            // Ensure that the label is rendered
            expect(inputLabel(fieldName)).toBeInTheDocument();

            // Ensure that the input is rendered
            if (type === ConfigurationInputType.BOOLEAN) {
                // Ensure that the checkbox is not checked
                expect(inputCheckbox(fieldName)).toHaveValue(
                    String(expectedValue)
                );
            } else {
                // Ensure that the input has the correct default value
                expect(inputTextbox(fieldName)).toHaveValue(
                    String(expectedValue)
                );
            }
        });
    });

    it("should save fields after changes", () => {
        // Iterate through the fields and check if they are rendered correctly
        configSSLFields.forEach(({ fieldName, type }) => {
            // Ensure that the input is rendered
            if (type === ConfigurationInputType.BOOLEAN) {
                // mock value
                const mockValue = "true";

                // Change the value
                userEvent.selectOptions(inputCheckbox(fieldName), "true");

                // Ensure that the checkbox is checked
                expect(inputCheckbox(fieldName)).toHaveValue(mockValue);
            } else {
                // mock value
                const mockValue = `${fieldName}_test`;

                // Clear the input
                userEvent.clear(inputTextbox(fieldName));

                // Change the input value
                userEvent.type(inputTextbox(fieldName), mockValue);

                // Ensure that the input has the correct value
                expect(inputTextbox(fieldName)).toHaveValue(mockValue);
            }
        });

        // Ensure that the handleSaveFields is called only once
        expect(mockSaveFields).toBeCalledTimes(1);
    });
});

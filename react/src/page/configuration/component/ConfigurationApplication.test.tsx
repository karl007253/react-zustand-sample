import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConfigurationFields } from "..";
import { createPackageName } from "../../../common/helper/Function";
import { ApplicationDetails } from "../../../common/zustand/interface/ApplicationInterface";

import {
    Configuration,
    ConfigurationType,
    GlobalConfigurationType,
} from "../../../common/zustand/interface/ConfigurationInterface";
import useStore from "../../../common/zustand/Store";
import ConfigurationApplication, {
    mergedConfigFields,
} from "./ConfigurationApplication";

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
    groupId: "com.orangekloud",
    artifactId: "artifact-id-test",
    smtpTimeout: "5000",
    fileStoragePath: "file-storage-path-test",
    asyncPoolSize: "1000",
    asyncMaxSize: "1002",
    asyncQueueCapacity: "1003",
    schedulePoolSize: "1004",
};

const mockConfigurationList: Configuration[] = [
    {
        uuid: "config-application-uuid",
        name: GlobalConfigurationType.APPLICATION,
        title: GlobalConfigurationType.APPLICATION,
        data: mockConfigData,
        type: ConfigurationType.GLOBAL,
        order: 0,
    },
];

const inputTextbox = (name: string) => {
    return screen.getByRole("textbox", {
        name: `configuration.application.form.label.${name}`,
    });
};

const inputLabel = (name: string) => {
    return screen.getByLabelText(
        `configuration.application.form.label.${name}`
    );
};

// Set State
useStore.setState({
    applicationData: mockApplicationData,
});

describe("Configuration: ConfigurationApplication", () => {
    // mock handleSaveFields
    const mockSaveFields = jest.fn();

    describe("with ApplicationData", () => {
        beforeEach(() => {
            render(
                <ConfigurationApplication
                    handleSaveFields={mockSaveFields}
                    configurationList={mockConfigurationList}
                />
            );
        });

        it("should render the right header title", () => {
            expect(
                screen.getByText("configuration.application.header")
            ).toBeInTheDocument();
        });

        it("should render the correct fields with the correct default data", async () => {
            // Iterate through the fields and check if they are rendered correctly
            mergedConfigFields.forEach(({ fieldName, defaultValue }) => {
                // Prepare value to be used
                // use mock data if it exists
                let expectedValue = defaultValue ?? "";

                if (mockConfigData[fieldName]) {
                    expectedValue = mockConfigData[fieldName];
                }

                // If package name, use the helper function to generate the package name
                if (fieldName === "packageName") {
                    expectedValue = createPackageName(
                        mockConfigData.groupId,
                        mockConfigData.artifactId
                    );
                }

                // Ensure that the label is rendered
                expect(inputLabel(fieldName)).toBeInTheDocument();

                // Ensure that the input has the correct default value
                expect(inputTextbox(fieldName)).toHaveValue(
                    String(expectedValue)
                );
            });
        });

        it("should update package name correctly", async () => {
            // Prepare mock value
            const mockArtifactId = "testArtifact";

            // Clear the input
            userEvent.clear(inputTextbox("artifactId"));

            // Type in the input
            userEvent.type(inputTextbox("artifactId"), mockArtifactId);

            // Ensure that the input has the correct value
            expect(inputTextbox("artifactId")).toHaveValue(mockArtifactId);

            // Ensure package name is updated correctly
            expect(inputTextbox("packageName")).toHaveValue(
                createPackageName(mockConfigData.groupId, mockArtifactId)
            );

            // Ensure that the saveFields function is called for the second time
            await waitFor(() => expect(mockSaveFields).toBeCalledTimes(2));
        });

        it("should save fields after changes", async () => {
            // Prepare fields to be changed
            const triggerFields = mockConfigData;

            // Remove groupId and artifactId from triggerFields
            delete triggerFields.groupId;
            delete triggerFields.artifactId;

            // Iterate through the fields and change the input
            Object.keys(triggerFields).forEach((fieldName) => {
                // Clear the input
                userEvent.clear(inputTextbox(fieldName));

                // Type in the input
                userEvent.type(
                    inputTextbox(fieldName),
                    triggerFields[fieldName]
                );

                // Ensure that the input has the correct value
                expect(inputTextbox(fieldName)).toHaveValue(
                    triggerFields[fieldName]
                );
            });

            // Ensure that the saveFields function is called for the second time
            await waitFor(() => expect(mockSaveFields).toBeCalledTimes(2));
        });

        it("should not allow special characters in artifact id", async () => {
            // Prepare mock value
            const mockArtifactId = "testArtifact!@#$%^&*()_+ Test";

            // Clear the input
            userEvent.clear(inputTextbox("artifactId"));

            // Type in the input
            userEvent.type(inputTextbox("artifactId"), mockArtifactId);

            // Prepare expected value
            const expectedValue = mockArtifactId
                .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
                .replace(/\s/g, "-"); // Replace spaces with dashes

            // Ensure that the input has the correct value
            expect(inputTextbox("artifactId")).toHaveValue(expectedValue);
        });
    });
});

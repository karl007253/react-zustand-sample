import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfigurationFieldItem, ConfigurationFields } from "..";
import { generateRandomString } from "../../../common/helper/Function";
import useDebounce from "../../../common/hooks/Debounce";
import {
    Configuration,
    GlobalConfigurationType,
} from "../../../common/zustand/interface/ConfigurationInterface";
import useStore from "../../../common/zustand/Store";
import ConfigurationInput, {
    ConfigurationInputType,
} from "./ConfigurationInput";

// Prepare the fields
const configAuthFields: ConfigurationFieldItem[] = [
    { fieldName: "clientId", defaultValue: "" },
    { fieldName: "clientSecret", defaultValue: generateRandomString(20) },
    {
        fieldName: "accessTokenValidity",
        defaultValue: 3600,
        type: ConfigurationInputType.NUMBER,
    },
    {
        fieldName: "refreshTokenValidity",
        defaultValue: 172800,
        type: ConfigurationInputType.NUMBER,
    },
];

type ConfigurationAuthenticationProps = {
    handleSaveFields: (
        fields: ConfigurationFields,
        configType: GlobalConfigurationType
    ) => void;
    configurationList: Configuration[];
};

const ConfigurationAuthentication = ({
    handleSaveFields,
    configurationList,
}: ConfigurationAuthenticationProps) => {
    const { t } = useTranslation();

    const { applicationData } = useStore((state) => ({
        applicationData: state.applicationData,
    }));

    const [fields, setFields] = useState<ConfigurationFields>({
        ...Object.assign(
            {},
            ...configAuthFields.map(({ fieldName, defaultValue }) => ({
                [fieldName]: defaultValue ?? "",
            }))
        ),
    });

    const debouncedFields = useDebounce(fields);

    // Handle field change
    const handleFieldChange = (key: string, value: string) => {
        setFields({
            ...fields,
            [key]: value,
        });
    };

    // Set the initial fields
    useEffect(() => {
        if (applicationData) {
            // Find the config
            const configuration = configurationList.find(
                ({ name }) => name === GlobalConfigurationType.AUTHENTICATION
            ) as Configuration;

            // Parse the config
            const configData = configuration?.data as ConfigurationFields;

            // Prepare the initial fields
            const initialFields = {
                ...Object.assign(
                    {},
                    ...configAuthFields.map(({ fieldName, defaultValue }) => {
                        // Prepare the default value
                        let useValue = defaultValue ?? "";

                        // Set the client id default value
                        if (fieldName === "clientId") {
                            useValue = applicationData.appname;
                        }

                        // Return the value
                        return {
                            [fieldName]: configData?.[fieldName] ?? useValue,
                        };
                    })
                ),
            };

            // Set the initial fields
            setFields(initialFields);
        }
    }, [applicationData]);

    // Save the fields
    useEffect(() => {
        handleSaveFields(
            debouncedFields,
            GlobalConfigurationType.AUTHENTICATION
        );
    }, [debouncedFields]);

    return (
        <div>
            <div className="text-md fw-bold text-philippine-gray mb-40">
                {t("configuration.authentication.header")}
            </div>

            {/* Start of form */}
            {configAuthFields.map(({ fieldName, type }) => (
                <ConfigurationInput
                    key={fieldName}
                    type={type}
                    value={fields[fieldName]}
                    onChange={(value) => handleFieldChange(fieldName, value)}
                    label={t(
                        `configuration.authentication.form.label.${fieldName}`
                    )}
                />
            ))}
        </div>
    );
};

export { configAuthFields };
export default ConfigurationAuthentication;

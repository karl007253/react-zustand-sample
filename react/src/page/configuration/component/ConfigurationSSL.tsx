import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfigurationFieldItem, ConfigurationFields } from "..";
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
const configSSLFields: ConfigurationFieldItem[] = [
    {
        fieldName: "sslEnabled",
        defaultValue: false,
        type: ConfigurationInputType.BOOLEAN,
    },
    { fieldName: "keyAlias" },
    { fieldName: "keyPassword" },
    { fieldName: "keyStore" },
    { fieldName: "keyStoreType" },
    { fieldName: "keyStorePassword" },
];

type ConfigurationApplicationProps = {
    handleSaveFields: (
        fields: ConfigurationFields,
        configType: GlobalConfigurationType
    ) => void;
    configurationList: Configuration[];
};

const ConfigurationSSL = ({
    handleSaveFields,
    configurationList,
}: ConfigurationApplicationProps) => {
    const { t } = useTranslation();

    const { applicationData } = useStore((state) => ({
        applicationData: state.applicationData,
    }));

    const [fields, setFields] = useState<ConfigurationFields>({
        ...Object.assign(
            {},
            ...configSSLFields.map(({ fieldName, defaultValue }) => ({
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
                ({ name }) => name === GlobalConfigurationType.SSL
            ) as Configuration;

            // Parse the config
            const configData = configuration?.data as ConfigurationFields;

            // Prepare the initial fields
            const initialFields = {
                ...Object.assign(
                    {},
                    ...configSSLFields.map(({ fieldName, defaultValue }) => {
                        // Prepare the default value
                        const useValue = defaultValue ?? "";

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
        handleSaveFields(debouncedFields, GlobalConfigurationType.SSL);
    }, [debouncedFields]);

    return (
        <div>
            <div className="text-md fw-bold text-philippine-gray mb-40">
                {t("configuration.ssl.header")}
            </div>

            {/* Start of form */}
            {configSSLFields.map(({ fieldName, type }) => (
                <ConfigurationInput
                    key={fieldName}
                    onChange={(value) => handleFieldChange(fieldName, value)}
                    value={fields[fieldName]}
                    label={t(`configuration.ssl.form.label.${fieldName}`)}
                    type={type}
                />
            ))}
        </div>
    );
};

export { configSSLFields };
export default ConfigurationSSL;

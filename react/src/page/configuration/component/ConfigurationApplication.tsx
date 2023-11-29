import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ConfigurationInput, {
    ConfigurationInputType,
} from "./ConfigurationInput";

import useDebounce from "../../../common/hooks/Debounce";
import {
    Configuration,
    GlobalConfigurationType,
} from "../../../common/zustand/interface/ConfigurationInterface";
import useStore from "../../../common/zustand/Store";
import { ConfigurationFieldItem, ConfigurationFields } from "..";
import { createPackageName } from "../../../common/helper/Function";

// Prepare the fields
const configAppFields: ConfigurationFieldItem[] = [
    { fieldName: "groupId", defaultValue: "com.orangekloud", disabled: true },
    { fieldName: "artifactId" },
    { fieldName: "packageName", disabled: true },
    { fieldName: "smtpTimeout", type: ConfigurationInputType.NUMBER },
    { fieldName: "fileStoragePath" },
];

// Prepare thread app config
const configAppThreadFields: ConfigurationFieldItem[] = [
    { fieldName: "asyncPoolSize", defaultValue: 5 },
    { fieldName: "asyncMaxSize", defaultValue: 10 },
    { fieldName: "asyncQueueCapacity", defaultValue: 100 },
    { fieldName: "schedulePoolSize", defaultValue: 5 },
];

// Merge the fields
const mergedConfigFields = [...configAppFields, ...configAppThreadFields];

type ConfigurationApplicationProps = {
    handleSaveFields: (
        fields: ConfigurationFields,
        configType: GlobalConfigurationType
    ) => void;
    configurationList: Configuration[];
};

const ConfigurationApplication = ({
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
            ...mergedConfigFields.map(({ fieldName, defaultValue }) => ({
                [fieldName]: defaultValue ?? "",
            }))
        ),
    });

    const debouncedFields = useDebounce(fields);

    // Handle field change
    const handleFieldChange = (key: string, value: string) => {
        let useValue = value;

        // Check if the artifact name is valid otherwise run validation
        if (key === "artifactId") {
            // don't proceed if special characters but allow dash
            if (value.match(/[^a-zA-Z0-9 \\-]/g)) {
                return;
            }

            // replace spaces with "-"
            useValue = value.replace(/\s/g, "-");
        }

        setFields({
            ...fields,
            [key]: String(useValue),

            // Update the package name
            packageName: createPackageName(
                fields.groupId,
                key === "artifactId" ? value : fields.artifactId
            ),
        });
    };

    // Set the initial fields
    useEffect(() => {
        if (applicationData) {
            // Find the config
            const configuration = configurationList.find(
                ({ name }) => name === GlobalConfigurationType.APPLICATION
            ) as Configuration;

            // Parse the config
            const configData = configuration?.data as ConfigurationFields;

            // Prepare the initial fields
            const initialFields = {
                ...Object.assign(
                    {},
                    ...mergedConfigFields.map(({ fieldName, defaultValue }) => {
                        // Prepare the default value
                        const useValue = defaultValue ?? "";

                        return {
                            [fieldName]: configData?.[fieldName] ?? useValue,
                        };
                    })
                ),
            };

            // Prepare the package name
            initialFields.packageName = createPackageName(
                initialFields.groupId,
                initialFields.artifactId
            );

            // Set the initial fields
            setFields(initialFields);
        }
    }, [applicationData]);

    // Save the fields
    useEffect(() => {
        handleSaveFields(debouncedFields, GlobalConfigurationType.APPLICATION);
    }, [debouncedFields]);

    return (
        <div>
            <div className="text-md fw-bold text-philippine-gray mb-40">
                {t("configuration.application.header")}
            </div>

            {/* Start of form */}
            {configAppFields.map(({ fieldName, disabled, type }) => (
                <ConfigurationInput
                    key={fieldName}
                    type={type}
                    onChange={(value) => handleFieldChange(fieldName, value)}
                    value={fields[fieldName]}
                    disabled={disabled}
                    label={t(
                        `configuration.application.form.label.${fieldName}`
                    )}
                />
            ))}

            <Row className="align-items-center mt-45">
                <Col sm={12} md={3} className="text-rg fw-bold">
                    {t(`configuration.application.form.label.thread`)}
                </Col>
                <Col sm={12} md={9} className="border-top" />
            </Row>

            <Row className="align-items-center mt-45 text-philippine-gray">
                {configAppThreadFields.map(({ fieldName }) => (
                    <Col key={fieldName} md={12} lg={6} className="text-rg">
                        <ConfigurationInput
                            onChange={(value) =>
                                handleFieldChange(fieldName, value)
                            }
                            label={t(
                                `configuration.application.form.label.${fieldName}`
                            )}
                            value={fields[fieldName]}
                            type={ConfigurationInputType.NUMBER_STEP}
                            spacing={[7, 5]}
                        />
                    </Col>
                ))}
            </Row>
        </div>
    );
};

export { mergedConfigFields };
export default ConfigurationApplication;

import { useFormik, validateYupSchema, yupToFormErrors } from "formik";
import { Col, Form, Row, Stack } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import * as Yup from "yup";
import useToast from "../../../../common/hooks/Toast";

import {
    DatabaseData,
    Encoding,
    Engine,
} from "../../../../common/zustand/interface/DatabaseInterface";
import useStore from "../../../../common/zustand/Store";

import EmobiqModal, {
    ButtonVariant,
} from "../../../../common/component/helper/EmobiqModal";
import {
    CONFIGURATION_PREFIX,
    DATABASE_PARENT,
    ROOT_DATABASE_CONFIGURATION_NAME,
} from "../../../../common/data/Constant";
import {
    Configuration,
    ConfigurationType,
    DatabaseConfigurationData,
} from "../../../../common/zustand/interface/ConfigurationInterface";
import generateUniqueId from "../../../../common/helper/UniqueId";

interface ConfigurationDatabaseForm {
    engine: Engine;
    encoding: Encoding;
    host: string;
    port: string;
    username: string;
    password: string;
}

interface DatabaseConfigurationProps {
    show: boolean;
    handleClose: () => void;
}

const DatabaseConfiguration = ({
    show,
    handleClose,
}: DatabaseConfigurationProps) => {
    const { t } = useTranslation();

    const toastMessage = useToast(true);

    const {
        databaseList,
        selectedDatabaseUuid,
        updateDatabaseConfiguration,
        rootConfiguration,
        addNewConfiguration,
        updateConfiguration,
    } = useStore((state) => ({
        databaseList: state.database,
        selectedDatabaseUuid: state.selectedDatabaseUuid,
        updateDatabaseConfiguration: state.updateDatabaseConfiguration,
        // Pick up the latest configuration with type "database".
        // Ideally we will only have one item in the list, if there is more, we pick up the last item and ignore the rest.
        rootConfiguration: state.configuration
            ?.filter((e) => e.type === ConfigurationType.DATABASE)
            .at(-1),
        addNewConfiguration: state.addNewConfiguration,
        updateConfiguration: state.updateConfiguration,
    }));

    // Determine if user is opening a root configuration or a children configuration dialog
    const isRootConfigSelected = selectedDatabaseUuid === DATABASE_PARENT;

    // Check if there's selected database
    const selected = databaseList.find(
        ({ uuid }) => uuid === selectedDatabaseUuid
    );

    // Cast the rootConfiguration.data to the proper type, if any
    const rootConfigData = rootConfiguration?.data as DatabaseConfigurationData;

    // One-time function to return undefined if argument supplied is an empty string
    const undefinedIfEmpty = (value?: string): string | undefined => {
        if (!value) {
            return undefined;
        }
        return value.trim() === "" ? undefined : value;
    };

    const updateDatabaseConfigurationForm =
        useFormik<ConfigurationDatabaseForm>({
            enableReinitialize: true,

            // Use currently selected database configuration data
            initialValues: {
                engine:
                    selected?.data?.engine ??
                    rootConfigData?.engine ??
                    Engine.INNODB,
                encoding:
                    selected?.data?.encoding ??
                    rootConfigData?.encoding ??
                    Encoding.UTF8,
                host: selected?.data?.host ?? rootConfigData?.host ?? "",
                port: selected?.data?.port ?? rootConfigData?.port ?? "",
                username:
                    selected?.data?.username ?? rootConfigData?.username ?? "",
                password:
                    selected?.data?.password ?? rootConfigData?.password ?? "",
            },

            onSubmit: async (values, formikHelpers) => {
                const { resetForm } = formikHelpers;

                if (isRootConfigSelected) {
                    // Save root configuration in "configuration" state
                    const config: Configuration = {
                        uuid:
                            rootConfiguration?.uuid ??
                            generateUniqueId(CONFIGURATION_PREFIX),
                        name: ROOT_DATABASE_CONFIGURATION_NAME,
                        title: ROOT_DATABASE_CONFIGURATION_NAME,
                        type: ConfigurationType.DATABASE,
                        data: {
                            engine: undefinedIfEmpty(values.engine),
                            encoding: undefinedIfEmpty(values.encoding),
                            host: undefinedIfEmpty(values.host),
                            port: undefinedIfEmpty(values.port),
                            username: undefinedIfEmpty(values.username),
                            password: undefinedIfEmpty(values.password),
                        } as DatabaseConfigurationData,
                        order: 1,
                    };

                    if (!rootConfiguration?.uuid) {
                        // If no root configuration is saved yet, add a new one with brand-new UUID
                        addNewConfiguration(config);
                    } else {
                        // Update the existing configuration, reusing UUID
                        updateConfiguration(config);
                    }
                } else if (selected && selected?.uuid) {
                    // One-time function to process the entered values and compare it to root configuration value.
                    // Basically, if the entered value is similar with root config, the function tries to prioritize the root config.
                    const pickValue = <T,>(
                        value1: T,
                        value2: T
                    ): T | undefined => {
                        if (value1 === value2) {
                            // Both values are similar to each other.
                            return undefined;
                        }
                        // Pick the first value, ignoring the other one, which means,
                        // the first value will always override the second value.
                        return value1;
                    };

                    // Save children configuration in "database" state
                    const databaseData: DatabaseData = {
                        engine: pickValue(
                            values.engine,
                            rootConfigData?.engine
                        ),
                        encoding: pickValue(
                            values.encoding,
                            rootConfigData?.encoding
                        ),
                        host: undefinedIfEmpty(
                            pickValue(values.host, rootConfigData?.host)
                        ),
                        port: undefinedIfEmpty(
                            pickValue(values.port, rootConfigData?.port)
                        ),
                        username: undefinedIfEmpty(
                            pickValue(values.username, rootConfigData?.username)
                        ),
                        password: undefinedIfEmpty(
                            pickValue(values.password, rootConfigData?.password)
                        ),
                    };

                    // update the selected database data
                    updateDatabaseConfiguration(databaseData);
                }

                // Display success message
                toastMessage(
                    t(
                        `database.dashboard.modal.configuration.form.message.success`
                    ),
                    toast.TYPE.SUCCESS
                );

                // Clear the form
                resetForm();

                // Close the modal
                handleClose();
            },

            validate: async (values) => {
                try {
                    const validationSchema = Yup.object({
                        port: Yup.number().typeError(
                            `database.dashboard.modal.configuration.form.message.error.portNotANumber`
                        ),
                    });
                    await validateYupSchema(values, validationSchema);
                    return {};
                } catch (error) {
                    const validationError = error as Yup.ValidationError;
                    const errorMessages = validationError.errors;
                    toastMessage(t(errorMessages[0]), toast.TYPE.ERROR);
                    return yupToFormErrors(validationError);
                }
            },

            validateOnChange: false,
            validateOnBlur: false,
        });

    const onCloseModal = () => {
        handleClose();
        updateDatabaseConfigurationForm.resetForm();
    };

    return (
        <EmobiqModal
            show={show}
            modalHeaderTitle={t("database.dashboard.modal.configuration.title")}
            handleClose={onCloseModal}
            modalFooterButton={[
                {
                    name: "common.button.cancel",
                    variant: ButtonVariant.OUTLINE_EMOBIQ_BRAND,
                    handleClick: onCloseModal,
                },
                {
                    name: "common.button.update",
                    variant: ButtonVariant.EMOBIQ_BRAND,
                    handleClick: updateDatabaseConfigurationForm.submitForm,
                },
            ]}
        >
            <Form onSubmit={updateDatabaseConfigurationForm.handleSubmit}>
                <Stack gap={4}>
                    <Form.Group controlId="engine">
                        <Row className="align-items-center">
                            <Col xs={12} sm={3}>
                                <Form.Label className="text-rg m-0">
                                    {t(
                                        "database.dashboard.modal.configuration.form.label.engine"
                                    )}
                                </Form.Label>
                            </Col>
                            <Col xs={12} sm={9}>
                                <Form.Select
                                    className="text-rg"
                                    onChange={
                                        updateDatabaseConfigurationForm.handleChange
                                    }
                                    value={
                                        updateDatabaseConfigurationForm.values
                                            .engine
                                    }
                                >
                                    {Object.values(Engine).map((name) => (
                                        <option key={name} value={name}>
                                            {t(
                                                `database.options.engine.${name}`
                                            )}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group controlId="encoding">
                        <Row className="align-items-center">
                            <Col xs={12} sm={3}>
                                <Form.Label className="text-rg m-0">
                                    {t(
                                        "database.dashboard.modal.configuration.form.label.encoding"
                                    )}
                                </Form.Label>
                            </Col>
                            <Col xs={12} sm={9}>
                                <Form.Select
                                    className="text-rg"
                                    onChange={
                                        updateDatabaseConfigurationForm.handleChange
                                    }
                                    value={
                                        updateDatabaseConfigurationForm.values
                                            .encoding
                                    }
                                >
                                    {Object.values(Encoding).map((name) => (
                                        <option key={name} value={name}>
                                            {t(
                                                `database.options.encoding.${name}`
                                            )}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Col>
                        </Row>
                    </Form.Group>

                    <Form.Group controlId="host">
                        <Row className="align-items-center">
                            <Col xs={12} sm={3}>
                                <Form.Label className="text-rg m-0">
                                    {t(
                                        "database.dashboard.modal.configuration.form.label.host"
                                    )}
                                </Form.Label>
                            </Col>
                            <Col xs={12} sm={9}>
                                <Form.Control
                                    className="text-rg"
                                    onChange={
                                        updateDatabaseConfigurationForm.handleChange
                                    }
                                    value={
                                        updateDatabaseConfigurationForm.values
                                            .host
                                    }
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group controlId="port">
                        <Row className="align-items-center">
                            <Col xs={12} sm={3}>
                                <Form.Label className="text-rg m-0">
                                    {t(
                                        "database.dashboard.modal.configuration.form.label.port"
                                    )}
                                </Form.Label>
                            </Col>
                            <Col xs={12} sm={9}>
                                <Form.Control
                                    className="text-rg"
                                    onChange={
                                        updateDatabaseConfigurationForm.handleChange
                                    }
                                    value={
                                        updateDatabaseConfigurationForm.values
                                            .port
                                    }
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group controlId="username">
                        <Row className="align-items-center">
                            <Col xs={12} sm={3}>
                                <Form.Label className="text-rg m-0">
                                    {t(
                                        "database.dashboard.modal.configuration.form.label.username"
                                    )}
                                </Form.Label>
                            </Col>
                            <Col xs={12} sm={9}>
                                <Form.Control
                                    className="text-rg"
                                    onChange={
                                        updateDatabaseConfigurationForm.handleChange
                                    }
                                    value={
                                        updateDatabaseConfigurationForm.values
                                            .username
                                    }
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Row className="align-items-center">
                            <Col xs={12} sm={3}>
                                <Form.Label className="text-rg m-0">
                                    {t(
                                        "database.dashboard.modal.configuration.form.label.password"
                                    )}
                                </Form.Label>
                            </Col>
                            <Col xs={12} sm={9}>
                                <Form.Control
                                    className="text-rg"
                                    onChange={
                                        updateDatabaseConfigurationForm.handleChange
                                    }
                                    value={
                                        updateDatabaseConfigurationForm.values
                                            .password
                                    }
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                </Stack>
            </Form>
        </EmobiqModal>
    );
};

export type { ConfigurationDatabaseForm };
export default DatabaseConfiguration;

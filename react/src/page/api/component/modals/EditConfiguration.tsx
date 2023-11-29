import {
    Button,
    Col,
    Container,
    Dropdown,
    Form,
    InputGroup,
    OverlayTrigger,
    Popover,
    Row,
} from "react-bootstrap";
import { ChangeEvent, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCheck,
    faEllipsisH,
    faPlus,
    faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useFormik, validateYupSchema, yupToFormErrors } from "formik";
import * as Yup from "yup";
import { ValidationError } from "yup";
import useStore from "../../../../common/zustand/Store";
import useToast from "../../../../common/hooks/Toast";
import EmobiqModal, {
    ButtonVariant,
} from "../../../../common/component/helper/EmobiqModal";
import useActiveConfiguration from "../../../../common/hooks/ActiveConfiguration";
import useDebounce from "../../../../common/hooks/Debounce";
import generateUniqueId from "../../../../common/helper/UniqueId";
import {
    ApiConfigurationData,
    AuthType,
    Configuration,
    ConfigurationType,
} from "../../../../common/zustand/interface/ConfigurationInterface";
import { Database } from "../../../../common/zustand/interface/DatabaseInterface";
import {
    DatabaseTable,
    Field,
} from "../../../../common/zustand/interface/DatabaseTableInterface";
import {
    CONFIGURATION_PREFIX,
    SPECIAL_CHARACTERS_REGEX,
} from "../../../../common/data/Constant";

interface EditConfigurationForm {
    uuid: string; // include uuid to reset the form upon creating new form
    authType: string;
    name: string;
    dbConnection: string;
    tableReference: string;
    username: string;
    password: string;
}

interface ConfigInputType {
    name: string;
    reference: Database[] | DatabaseTable[] | Field[];
}

type EditConfigurationProps = {
    show: boolean;
    handleClose: () => void;
};

const EditConfiguration = ({ show, handleClose }: EditConfigurationProps) => {
    const { t } = useTranslation();
    const toastMessage = useToast(true);
    const {
        deleteConfiguration,
        addNewConfiguration,
        updateConfiguration,
        setSelectedConfiguration,
        configuration,
        selectedApi,
        selectedApiFolder,
        api,
        database,
        databaseTable,
    } = useStore((state) => ({
        addNewConfiguration: state.addNewConfiguration,
        deleteConfiguration: state.deleteConfiguration,
        updateConfiguration: state.updateConfiguration,
        setSelectedConfiguration: state.setSelectedConfiguration,
        configuration: state.configuration,
        selectedApi: state.api.find((a) => a.uuid === state.selectedApiUuid),
        selectedApiFolder: state.folder.find(
            (f) => f.uuid === state.selectedApiFolderUuid
        ),
        api: state.api,
        database: state.database,
        databaseTable: state.databaseTable,
    }));

    // Focused config inside the modal
    const [focusedConfig, setFocusedConfig] = useState<Configuration>(
        {} as Configuration
    );
    const [newlyCreatedConfig, setNewlyCreatedConfig] = useState<Configuration>(
        {} as Configuration
    );

    // Local list before being submitted to global state
    const [localConfigList, setLocalConfigList] = useState<Configuration[]>([]);

    const [searchInput, setSearchInput] = useState("");
    const [createMode, setCreateMode] = useState(false);

    const [selectedDatabaseUuid, setSelectedDatabaseUuid] = useState("");
    const [selectedDatabaseTableUuid, setSelectedDatabaseTableUuid] =
        useState("");

    // Ensure search happens only when typing is finished
    const debouncedSearchInput = useDebounce(searchInput);

    // Get selected config
    const activeConfiguration = useActiveConfiguration(ConfigurationType.API);

    useEffect(() => {
        // If modal is not shown but activeConfig is changed or if there is no focusedConfig then focus on activeConfig
        if (
            (!show || Object.keys(focusedConfig).length === 0) &&
            activeConfiguration
        ) {
            setFocusedConfig(activeConfiguration);
        } else {
            // Reset when there is a change to localConfigList, for example after deleting a config or after search
            setFocusedConfig(
                localConfigList.find((c) => c.uuid === focusedConfig.uuid) ??
                    ({} as Configuration)
            );
        }
    }, [show, api, localConfigList, activeConfiguration]);

    // useEffect with additional condition of searchInput
    useEffect(() => {
        // TODO: Change to fetching data from backend once backend is done
        const listResult =
            configuration &&
            configuration.filter(
                (config: Configuration) =>
                    config.name
                        .toLowerCase()
                        .includes(searchInput.toLowerCase()) &&
                    config.type === ConfigurationType.API
            );
        // In case there is any newly created config
        if (createMode || configuration.length === 0) {
            const newConfig = {
                uuid: generateUniqueId(CONFIGURATION_PREFIX),
                name: "",
            } as Configuration;
            listResult.unshift(newConfig);
            setFocusedConfig(newConfig);
        }
        setLocalConfigList(listResult);
    }, [
        show,
        selectedApi,
        selectedApiFolder,
        configuration,
        debouncedSearchInput,
    ]);

    const handleSearchInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchInput(event.target.value);
    };

    const onFocusedConfig = (config: Configuration) => {
        setFocusedConfig(config);
        if (config.uuid === newlyCreatedConfig.uuid || !config.name) {
            setCreateMode(true);
        } else {
            setCreateMode(false);
        }
    };

    const createNewConfig = () => {
        setCreateMode(true);
        setSearchInput("");
        const createdConfig = {
            uuid: generateUniqueId(CONFIGURATION_PREFIX),
            name: "",
        } as Configuration;
        setLocalConfigList([createdConfig, ...localConfigList]);
        setFocusedConfig(createdConfig);
        setNewlyCreatedConfig(createdConfig);
    };

    const deleteConfig = () => {
        // Update localConfigList here to remove newly created config that is not yet saved, and also to support unit testing
        setLocalConfigList(
            localConfigList.filter(
                (config) => config.uuid !== focusedConfig.uuid
            )
        );
        deleteConfiguration(focusedConfig.uuid);

        toastMessage(
            t(`api.dashboard.modalConfig.form.success.delete`),
            toast.TYPE.SUCCESS
        );
    };

    const hidePopover = () => document.body.click();

    const deleteConfigPopover = (
        <Popover id="api-config-delete-top">
            <Popover.Body>
                <div>
                    <p className="m-0 text-center text-spanish-gray">
                        {t("api.dashboard.modalConfig.form.warning.delete")}
                    </p>
                    <div className="button-bar pt-15">
                        <Button
                            aria-label="delete-config-no"
                            variant={
                                ButtonVariant.OUTLINE_CHINESE_SILVER_PHILIPPINE_GRAY
                            }
                            className="text-rg px-3"
                            onClick={hidePopover}
                        >
                            {t("common.button.no")}
                        </Button>
                        <Button
                            aria-label="delete-config-yes"
                            variant={ButtonVariant.OUTLINE_EMOBIQ_BRAND}
                            className="text-rg px-3"
                            onClick={deleteConfig}
                        >
                            {t("common.button.yes")}
                        </Button>
                    </div>
                </div>
            </Popover.Body>
        </Popover>
    );

    const [isFormChanged, setIsFormChanged] = useState(false);

    const onFormChange = () => {
        setIsFormChanged(true);
    };

    // Prepare a variable for the initial values
    const focusedConfigData = focusedConfig?.data as ApiConfigurationData;

    // Configuration for edit form
    const editConfigurationForm = useFormik<EditConfigurationForm>({
        enableReinitialize: true,

        initialValues: {
            uuid: focusedConfig?.uuid,
            name: focusedConfig?.name || "",
            authType: focusedConfigData?.authType || "",
            dbConnection: focusedConfigData?.dbConnection || "",
            tableReference: focusedConfigData?.tableReference || "",
            username: focusedConfigData?.username || "",
            password: focusedConfigData?.password || "",
        },

        onSubmit: (values) => {
            // Set the payload to create or update a config
            const newConfig: Configuration = {
                ...focusedConfig,
                name: values.name,
                data: {
                    authType: values.authType,
                    dbConnection: values.dbConnection,
                    tableReference: values.tableReference,
                    username: values.username,
                    password: values.password,
                } as ApiConfigurationData,
                type: ConfigurationType.API,
            };

            // check if config already exists
            const exists = configuration.filter(
                (config) => config.uuid === newConfig.uuid
            );
            // if it doesn't exist yet = newly created config
            if (exists.length === 0) {
                newConfig.uuid = generateUniqueId("config");
                addNewConfiguration(newConfig);
            } else {
                updateConfiguration(newConfig);
            }

            setFocusedConfig(newConfig);
            setIsFormChanged(false);
            setCreateMode(false);
            setSearchInput("");

            setSelectedDatabaseUuid("");
            setSelectedDatabaseTableUuid("");

            // Show a success message
            toastMessage(
                t(`api.dashboard.modalConfig.form.success.update`),
                toast.TYPE.SUCCESS
            );
        },

        validate: async (values) => {
            try {
                // Form validation schema
                const validationSchema = Yup.object({
                    authType: Yup.string().required(
                        "api.dashboard.modalConfig.form.error.required.authType"
                    ),
                    name: Yup.string()
                        .required(
                            "api.dashboard.modalConfig.form.error.required.name"
                        )
                        .test({
                            message: "common.error.nameExist",
                            test: (value) => {
                                // Find config with the same name within Api configuration list
                                const items = configuration.find((item) => {
                                    return (
                                        item.type === ConfigurationType.API &&
                                        item.name === value &&
                                        item.uuid !== focusedConfig.uuid
                                    );
                                });

                                // Check if value (name) is in the list
                                return items === undefined;
                            },
                        })
                        .matches(
                            SPECIAL_CHARACTERS_REGEX,
                            t(
                                "common.error.specialCharactersDetectedSpecific",
                                {
                                    field: "Name",
                                }
                            )
                        ),
                    dbConnection: Yup.string().required(
                        "api.dashboard.modalConfig.form.error.required.dbConnection"
                    ),
                    tableReference: Yup.string().required(
                        "api.dashboard.modalConfig.form.error.required.tableReference"
                    ),
                    username: Yup.string().required(
                        "api.dashboard.modalConfig.form.error.required.username"
                    ),
                    password: Yup.string().required(
                        "api.dashboard.modalConfig.form.error.required.password"
                    ),
                });

                // Trigger form validation
                await validateYupSchema(values, validationSchema, true);

                // Return an empty object if there's no validation error
                return {};
            } catch (error) {
                const validationError = error as ValidationError;

                // get only first error
                const errorMessage = t(validationError.errors[0]);

                // Show error
                toastMessage(errorMessage, toast.TYPE.ERROR);

                // Return validation error
                return yupToFormErrors(validationError);
            }
        },
        validateOnChange: false,
        validateOnBlur: false,
    });

    // modal close handler
    const onCloseModal = () => {
        // close modal
        handleClose();
        setCreateMode(false);
        setSearchInput("");
        // clear fields once modal is closed
        editConfigurationForm.resetForm();
    };

    const [formFields, setFormFields] = useState<string[]>([]);
    const [fieldReference, setFieldReference] = useState<ConfigInputType[]>([]);

    const handleDropdownChange = (name: string, value: string | null) => {
        if (name === "dbConnection") {
            const selectedUuid =
                database.find((item) => item.name === value)?.uuid || "";
            setSelectedDatabaseUuid(selectedUuid);
        } else if (name === "tableReference") {
            const selectedUuid =
                databaseTable.find(
                    (item) =>
                        item.database_uuid === selectedDatabaseUuid &&
                        item.name === value
                )?.uuid || "";
            setSelectedDatabaseTableUuid(selectedUuid);
        }
    };

    useEffect(() => {
        const databaseList = database;
        const tableList = databaseTable.filter(
            (item) => item.database_uuid === selectedDatabaseUuid
        );
        const usernamePasswordFields =
            databaseTable.find(
                (item) => item.uuid === selectedDatabaseTableUuid
            )?.data?.structure || [];

        const fieldReferenceData: ConfigInputType[] = [
            {
                name: "dbConnection",
                reference: databaseList,
            },
            {
                name: "tableReference",
                reference: tableList,
            },
            {
                name: "username",
                reference: usernamePasswordFields,
            },
            {
                name: "password",
                reference: usernamePasswordFields,
            },
        ];
        setFieldReference(fieldReferenceData);
    }, [selectedDatabaseUuid, selectedDatabaseTableUuid]);

    useEffect(() => {
        const { authType } = editConfigurationForm.values;
        const authTypeToField: { [type: string]: string[] } = {
            [AuthType.BASIC_AUTH]: [
                "dbConnection",
                "tableReference",
                "username",
                "password",
            ],
            [AuthType.OAUTH2]: [
                "dbConnection",
                "tableReference",
                "username",
                "password",
            ],
        };
        setFormFields(authTypeToField[authType] ?? []);
    }, [editConfigurationForm.values.authType]);

    // OverlayTrigger tag has too many required attributes which is actually unnecessary. We had to suppress them
    // noinspection RequiredAttributes
    return (
        <EmobiqModal
            show={show}
            handleClose={onCloseModal}
            modalHeaderTitle={t("api.dashboard.modalConfig.title")}
        >
            <Row className="m-n4 min-h-400">
                {/* Left Component */}
                <Col xs={4} className="pt-3 pb-4 pe-0 d-flex flex-column">
                    {/* Search Bar */}
                    <InputGroup className="pb-3 pe-2">
                        <Form.Control
                            type="text"
                            placeholder={t(
                                `api.dashboard.modalConfig.form.placeholder.search`
                            )}
                            className="text-rg border-end-0 rounded-6 input-placeholder-chinese-silver"
                            value={searchInput}
                            onChange={handleSearchInputChange}
                        />
                        <InputGroup.Text className="text-chinese-silver bg-white ps-0 rounded-6">
                            <FontAwesomeIcon icon={faSearch} />
                        </InputGroup.Text>
                    </InputGroup>

                    {/* API Configuration List */}
                    <div className="pb-3 pe-0 overflow-auto mh-370">
                        {localConfigList.map((config) => (
                            <Button
                                key={config.uuid}
                                aria-label={
                                    config.name !== ""
                                        ? config.name
                                        : t(
                                              `api.dashboard.modalConfig.form.placeholder.new`
                                          )
                                }
                                variant={
                                    ButtonVariant.PHILIPPINE_GRAY_EMOBIQ_BRAND
                                }
                                className="border-0 border-top rounded-0 text-rg font-bold w-100 text-start"
                                active={focusedConfig.uuid === config.uuid}
                                onClick={() => {
                                    onFocusedConfig(config);
                                }}
                            >
                                <div className="text-truncate">
                                    {config.name !== ""
                                        ? config.name
                                        : t(
                                              `api.dashboard.modalConfig.form.placeholder.new`
                                          )}
                                </div>
                                {config.uuid === activeConfiguration?.uuid && (
                                    <p className="text-xxs m-0">
                                        {t(
                                            "api.dashboard.modalConfig.selectedLabel"
                                        )}
                                    </p>
                                )}
                            </Button>
                        ))}
                    </div>

                    {/* Action Button - Create */}
                    <div className="mt-auto ms-12 pt-3">
                        {configuration.length > 0 && createMode === false && (
                            <Button
                                className="py-2 rounded-3-px text-rg"
                                variant={ButtonVariant.OUTLINE_EMOBIQ_BRAND}
                                onClick={() => createNewConfig()}
                                key="Create"
                                aria-label="button-create"
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                <span className="ms-2 d-none d-sm-inline">
                                    {t(
                                        "api.dashboard.modalConfig.form.button.create"
                                    )}
                                </span>
                            </Button>
                        )}
                    </div>
                </Col>
                <Col
                    xs={8}
                    className="right-column-modal-config border-start pb-4"
                >
                    {(Object.keys(focusedConfig).length > 0 ||
                        configuration.length === 0 ||
                        createMode === true) && (
                        <Container className="text-sm h-100 d-flex flex-column">
                            {/* Add / Update API Configuration Form */}
                            <Form
                                onSubmit={editConfigurationForm.handleSubmit}
                                onChange={onFormChange}
                                id="edit-configuration-form"
                            >
                                <Form.Group
                                    key="name"
                                    controlId="name"
                                    className="row my-3 align-items-center"
                                >
                                    <Col xs={12} sm={5} className="pe-0">
                                        <Form.Label className="m-0 text-philippine-gray">
                                            {t(
                                                `api.dashboard.modalConfig.form.input.name`
                                            )}
                                        </Form.Label>
                                    </Col>
                                    <Col xs={12} sm={7}>
                                        <Form.Control
                                            name="name"
                                            type="text"
                                            className="rounded-3-px text-sm"
                                            placeholder={t(
                                                `api.dashboard.modalConfig.form.placeholder.name`
                                            )}
                                            value={
                                                editConfigurationForm.values
                                                    .name
                                            }
                                            onChange={(e) => {
                                                editConfigurationForm.handleChange(
                                                    e
                                                );
                                            }}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group
                                    key="authType"
                                    controlId="authType"
                                    className="row my-3 align-items-center"
                                >
                                    <Col xs={12} sm={5} className="pe-0">
                                        <Form.Label className="m-0 text-philippine-gray">
                                            {t(
                                                `api.dashboard.modalConfig.form.input.authType`
                                            )}
                                        </Form.Label>
                                    </Col>
                                    <Col xs={12} sm={7}>
                                        <Form.Select
                                            className="text-sm rounded-3-px"
                                            onChange={
                                                editConfigurationForm.handleChange
                                            }
                                            value={
                                                editConfigurationForm.values
                                                    .authType
                                            }
                                        >
                                            <option value="" hidden>
                                                {t(
                                                    "api.dashboard.modalConfig.form.select.options.select"
                                                )}
                                            </option>
                                            <option value={AuthType.BASIC_AUTH}>
                                                {t(
                                                    "api.dashboard.modalConfig.form.select.options.basicAuth"
                                                )}
                                            </option>
                                            <option value={AuthType.OAUTH2}>
                                                {t(
                                                    "api.dashboard.modalConfig.form.select.options.oauth2"
                                                )}
                                            </option>
                                        </Form.Select>
                                    </Col>
                                </Form.Group>
                                {Object.entries(
                                    editConfigurationForm.values
                                ).map(
                                    ([key, value]) =>
                                        formFields.includes(key) && (
                                            <Form.Group
                                                key={key}
                                                className="row my-3 align-items-center"
                                            >
                                                <Col
                                                    xs={12}
                                                    sm={5}
                                                    className="pe-0"
                                                >
                                                    <Form.Label
                                                        className="m-0 text-philippine-gray"
                                                        htmlFor={key}
                                                    >
                                                        {t(
                                                            `api.dashboard.modalConfig.form.input.${key}`
                                                        )}
                                                    </Form.Label>
                                                </Col>
                                                <Col
                                                    xs={12}
                                                    sm={7}
                                                    className="pe-0"
                                                >
                                                    <InputGroup className="pe-0">
                                                        <Form.Control
                                                            className="rounded-3-px text-sm"
                                                            aria-label={`text-${key}`}
                                                            value={value}
                                                            readOnly
                                                        />

                                                        <Dropdown
                                                            onSelect={(
                                                                eventKey
                                                            ) => {
                                                                setIsFormChanged(
                                                                    true
                                                                );
                                                                editConfigurationForm.setFieldValue(
                                                                    key,
                                                                    eventKey
                                                                );
                                                                handleDropdownChange(
                                                                    key,
                                                                    eventKey
                                                                );
                                                            }}
                                                        >
                                                            <Dropdown.Toggle
                                                                aria-label={key}
                                                                variant={
                                                                    ButtonVariant.DARK_PLATINUM_OSLO_GRAY
                                                                }
                                                                id={key}
                                                                className="h-36 me-12 rounded-3-px"
                                                            >
                                                                <FontAwesomeIcon
                                                                    icon={
                                                                        faEllipsisH
                                                                    }
                                                                />
                                                            </Dropdown.Toggle>

                                                            <Dropdown.Menu>
                                                                <>
                                                                    {fieldReference[
                                                                        fieldReference.findIndex(
                                                                            (
                                                                                x
                                                                            ) =>
                                                                                x.name ===
                                                                                key
                                                                        )
                                                                    ].reference.map(
                                                                        (
                                                                            itemVal
                                                                        ) => (
                                                                            <Dropdown.Item
                                                                                eventKey={
                                                                                    itemVal.name
                                                                                }
                                                                                key={
                                                                                    itemVal.name
                                                                                }
                                                                            >
                                                                                {
                                                                                    itemVal.name
                                                                                }
                                                                            </Dropdown.Item>
                                                                        )
                                                                    )}
                                                                </>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </InputGroup>
                                                </Col>
                                            </Form.Group>
                                        )
                                )}
                            </Form>

                            {/* Action Buttons */}
                            <Row className="pt-2 mt-auto">
                                <Col className="text-end">
                                    {createMode === true ||
                                    configuration.length === 0 ? (
                                        <>
                                            {/* Cancel button */}
                                            <Button
                                                className="py-2 rounded-3-px text-rg"
                                                variant={
                                                    ButtonVariant.OUTLINE_CHINESE_SILVER_PHILIPPINE_GRAY
                                                }
                                                onClick={() => {
                                                    onCloseModal();
                                                }}
                                            >
                                                {t(
                                                    "api.dashboard.modalConfig.form.button.cancel"
                                                )}
                                            </Button>
                                            {/* Create button */}
                                            <Button
                                                className="py-2 ms-3 rounded-3-px text-rg"
                                                variant={
                                                    ButtonVariant.OUTLINE_EMOBIQ_BRAND_SHADED
                                                }
                                                form="edit-configuration-form"
                                                data-testid="button-submit"
                                                aria-label="button-create-add"
                                                type="submit" // Use form handler for its onclick function
                                            >
                                                <FontAwesomeIcon
                                                    icon={faPlus}
                                                />
                                                <span className="ms-2 d-none d-sm-inline">
                                                    {t(
                                                        "api.dashboard.modalConfig.form.button.create"
                                                    )}
                                                </span>
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            {/* Delete button */}
                                            <OverlayTrigger
                                                trigger="click"
                                                placement="top"
                                                rootClose
                                                overlay={deleteConfigPopover}
                                            >
                                                <Button
                                                    className="py-2 rounded-3-px text-rg float-start"
                                                    variant={
                                                        ButtonVariant.OUTLINE_EMOBIQ_BRAND
                                                    }
                                                >
                                                    {t(
                                                        "api.dashboard.modalConfig.form.button.delete"
                                                    )}
                                                </Button>
                                            </OverlayTrigger>
                                            {/* Update button */}
                                            <Button
                                                className="py-2 ms-2 rounded-3-px text-rg"
                                                variant={
                                                    ButtonVariant.OUTLINE_EMOBIQ_BRAND
                                                }
                                                disabled={!isFormChanged}
                                                form="edit-configuration-form"
                                                data-testid="button-submit"
                                                type="submit" // Use form handler for its onclick function
                                            >
                                                {t(
                                                    "api.dashboard.modalConfig.form.button.update"
                                                )}
                                            </Button>
                                            {/* Select button */}
                                            <Button
                                                className="py-2 ms-2 rounded-3-px text-rg"
                                                variant={
                                                    ButtonVariant.OUTLINE_EMOBIQ_BRAND_SHADED
                                                }
                                                onClick={() => {
                                                    setSelectedConfiguration(
                                                        focusedConfig.uuid
                                                    );
                                                    onCloseModal();
                                                }}
                                            >
                                                {focusedConfig.uuid ===
                                                activeConfiguration?.uuid ? (
                                                    <>
                                                        <FontAwesomeIcon
                                                            icon={faCheck}
                                                        />
                                                        <span className="ms-2 d-none d-sm-inline">
                                                            {t(
                                                                "api.dashboard.modalConfig.form.button.selected"
                                                            )}
                                                        </span>
                                                    </>
                                                ) : (
                                                    t(
                                                        "api.dashboard.modalConfig.form.button.select"
                                                    )
                                                )}
                                            </Button>
                                        </>
                                    )}
                                </Col>
                            </Row>
                        </Container>
                    )}
                </Col>
            </Row>
        </EmobiqModal>
    );
};

export type { EditConfigurationForm };
export default EditConfiguration;

import { useFormik, validateYupSchema, yupToFormErrors } from "formik";
import { Col, Form, Row, Stack } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import * as Yup from "yup";

import useToast from "../../../../common/hooks/Toast";

import {
    Database,
    DatabaseData,
    Encoding,
    Engine,
} from "../../../../common/zustand/interface/DatabaseInterface";
import { DatabaseTable } from "../../../../common/zustand/interface/DatabaseTableInterface";
import useStore from "../../../../common/zustand/Store";

import EmobiqModal, {
    ButtonVariant,
} from "../../../../common/component/helper/EmobiqModal";
import generateUniqueId from "../../../../common/helper/UniqueId";

import {
    DATABASE_PREFIX,
    TABLE_PREFIX,
    DATABASE_PARENT,
    SPECIAL_CHARACTERS_REGEX,
} from "../../../../common/data/Constant";

interface CreateDatabaseForm {
    name: string;
    engine: Engine;
    encoding: Encoding;
}

interface DatabaseCreateProps {
    show: boolean;
    handleClose: () => void;
}

const DatabaseCreate = ({ show, handleClose }: DatabaseCreateProps) => {
    const { t } = useTranslation();

    const toastMessage = useToast(true);

    const {
        databaseList,
        databaseTableList,
        selectedDatabaseUuid,
        selectedDatabaseTableUuid,

        addNewDatabase,
        addNewDatabaseTable,
        setSelectedDatabaseUuid,
        setSelectedDatabaseTableUuid,
    } = useStore((state) => ({
        databaseList: state.database,
        databaseTableList: state.databaseTable,
        selectedDatabaseUuid: state.selectedDatabaseUuid,
        selectedDatabaseTableUuid: state.selectedDatabaseTableUuid,

        addNewDatabase: state.addNewDatabase,
        addNewDatabaseTable: state.addNewDatabaseTable,
        setSelectedDatabaseUuid: state.setSelectedDatabaseUuid,
        setSelectedDatabaseTableUuid: state.setSelectedDatabaseTableUuid,
    }));

    // Is the form for creating database
    //   No database or table selected
    //   The database selected is Parent Database
    const isDatabaseCreate =
        !(selectedDatabaseUuid || selectedDatabaseTableUuid) ||
        selectedDatabaseUuid === DATABASE_PARENT;

    const createDatabaseForm = useFormik<CreateDatabaseForm>({
        initialValues: {
            name: "",
            engine: Engine.INNODB,
            encoding: Encoding.UTF8,
        },

        onSubmit: async (values, formikHelpers) => {
            const { resetForm } = formikHelpers;

            let type = "";

            if (isDatabaseCreate) {
                // If no selected database or table, create a database

                const databaseData: DatabaseData = {
                    engine: values.engine,
                    encoding: values.encoding,
                };

                const data: Database = {
                    uuid: generateUniqueId(DATABASE_PREFIX),
                    name: values.name,
                    title: values.name,
                    order: 0,
                    data: databaseData,
                };

                // Set the type of message to display
                type = "database";

                // Add the database
                addNewDatabase(data);

                // Set this database as selected
                setSelectedDatabaseUuid(data.uuid);
            } else {
                // If selected database is found, create a table under the database
                // If selected table is found, create a table as its sibling

                const databaseUuid =
                    selectedDatabaseUuid ||
                    databaseTableList.find(
                        ({ uuid }) => uuid === selectedDatabaseTableUuid
                    )?.database_uuid;

                const data: DatabaseTable = {
                    uuid: generateUniqueId(TABLE_PREFIX),
                    name: values.name,
                    title: values.name,
                    order: 0,
                    database_uuid: databaseUuid,
                };

                // Set the type of message to display
                type = "table";

                // Add the database table
                addNewDatabaseTable(data);

                // Set this table as selected
                setSelectedDatabaseTableUuid(data.uuid);
            }

            // Display success message
            toastMessage(
                t(
                    `database.dashboard.modal.create.form.message.success.${type}`
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
                    name: Yup.string()
                        .required(
                            "database.dashboard.modal.create.form.error.required.name"
                        )
                        .test({
                            message: "common.error.nameSpace",
                            test: (value) => !value?.includes(" "),
                        })
                        .test({
                            message: "common.error.nameExist",
                            test: (value) => {
                                // If creating database then check in the database list
                                if (isDatabaseCreate) {
                                    // Check the name from the database list
                                    return !databaseList.some(
                                        ({ name }) => name === value
                                    );
                                }

                                // If database is selected, then use it's uuid
                                // else get the database uuid by selected table's uuid
                                const databaseUuid =
                                    selectedDatabaseUuid ||
                                    databaseTableList.find(
                                        ({ uuid }) =>
                                            uuid === selectedDatabaseTableUuid
                                    )?.database_uuid;

                                // Get all tables by the database uuid
                                const items = databaseTableList.filter(
                                    (item) =>
                                        item.database_uuid === databaseUuid
                                );

                                // Check the name from the tables of the selected database uuid
                                return !items.some(
                                    ({ name }) => name === value
                                );
                            },
                        })
                        .matches(
                            SPECIAL_CHARACTERS_REGEX,
                            "common.error.specialCharactersDetected"
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
        createDatabaseForm.resetForm();
    };

    return (
        <EmobiqModal
            show={show}
            modalHeaderTitle={
                isDatabaseCreate
                    ? t("database.dashboard.modal.create.title.database")
                    : t("database.dashboard.modal.create.title.table")
            }
            handleClose={onCloseModal}
            modalFooterButton={[
                {
                    name: "common.button.cancel",
                    variant: ButtonVariant.OUTLINE_EMOBIQ_BRAND,
                    handleClick: onCloseModal,
                },
                {
                    name: "common.button.create",
                    variant: ButtonVariant.EMOBIQ_BRAND,
                    handleClick: createDatabaseForm.submitForm,
                },
            ]}
        >
            <Form onSubmit={createDatabaseForm.handleSubmit}>
                <Stack gap={4}>
                    <Form.Group controlId="name">
                        <Row className="align-items-center">
                            <Col xs={12} sm={3}>
                                <Form.Label className="text-rg m-0">
                                    {t(
                                        "database.dashboard.modal.create.form.label.name"
                                    )}
                                </Form.Label>
                            </Col>
                            <Col xs={12} sm={9}>
                                <Form.Control
                                    className="text-rg"
                                    placeholder={t(
                                        "database.dashboard.modal.create.form.label.name"
                                    )}
                                    onChange={createDatabaseForm.handleChange}
                                    value={createDatabaseForm.values.name}
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                    {/* Only show these fields when no selected database or table */}
                    {isDatabaseCreate && (
                        <>
                            <Form.Group controlId="engine">
                                <Row className="align-items-center">
                                    <Col xs={12} sm={3}>
                                        <Form.Label className="text-rg m-0">
                                            {t(
                                                "database.dashboard.modal.create.form.label.engine"
                                            )}
                                        </Form.Label>
                                    </Col>
                                    <Col xs={12} sm={9}>
                                        <Form.Select
                                            className="text-rg"
                                            onChange={
                                                createDatabaseForm.handleChange
                                            }
                                            value={
                                                createDatabaseForm.values.engine
                                            }
                                        >
                                            {Object.values(Engine).map((e) => (
                                                <option key={e} value={e}>
                                                    {t(
                                                        `database.options.engine.${e}`
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
                                                "database.dashboard.modal.create.form.label.encoding"
                                            )}
                                        </Form.Label>
                                    </Col>
                                    <Col xs={12} sm={9}>
                                        <Form.Select
                                            className="text-rg"
                                            onChange={
                                                createDatabaseForm.handleChange
                                            }
                                            value={
                                                createDatabaseForm.values
                                                    .encoding
                                            }
                                        >
                                            {Object.values(Encoding).map(
                                                (e) => (
                                                    <option key={e} value={e}>
                                                        {t(
                                                            `database.options.encoding.${e}`
                                                        )}
                                                    </option>
                                                )
                                            )}
                                        </Form.Select>
                                    </Col>
                                </Row>
                            </Form.Group>
                        </>
                    )}
                </Stack>
            </Form>
        </EmobiqModal>
    );
};

export default DatabaseCreate;

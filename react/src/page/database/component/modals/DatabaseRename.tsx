import { useFormik, validateYupSchema, yupToFormErrors } from "formik";
import { Col, Form, Row, Stack } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import * as Yup from "yup";

import useToast from "../../../../common/hooks/Toast";

import { Database } from "../../../../common/zustand/interface/DatabaseInterface";
import { DatabaseTable } from "../../../../common/zustand/interface/DatabaseTableInterface";
import useStore from "../../../../common/zustand/Store";

import EmobiqModal, {
    ButtonVariant,
} from "../../../../common/component/helper/EmobiqModal";
import { SPECIAL_CHARACTERS_REGEX } from "../../../../common/data/Constant";

interface RenameDatabaseForm {
    name: string;
}

interface DatabaseRenameProps {
    show: boolean;
    handleClose: () => void;
}

const DatabaseRename = ({ show, handleClose }: DatabaseRenameProps) => {
    const { t } = useTranslation();
    const toastMessage = useToast(true);

    const {
        databaseList,
        databaseTableList,
        selectedDatabaseUuid,
        selectedDatabaseTableUuid,
        selectedDatabase,
        selectedDatabaseTable,

        updateDatabaseName,
        updateDatabaseTableName,
    } = useStore((state) => ({
        databaseList: state.database,
        databaseTableList: state.databaseTable,
        selectedDatabaseUuid: state.selectedDatabaseUuid,
        selectedDatabaseTableUuid: state.selectedDatabaseTableUuid,

        selectedDatabase: state.database.find(
            (d) => d.uuid === state.selectedDatabaseUuid
        ),
        selectedDatabaseTable: state.databaseTable.find(
            (d) => d.uuid === state.selectedDatabaseTableUuid
        ),

        updateDatabaseName: state.updateDatabaseName,
        updateDatabaseTableName: state.updateDatabaseTableName,
    }));

    const selected: Database | DatabaseTable | undefined = selectedDatabaseUuid
        ? selectedDatabase
        : selectedDatabaseTable;

    const renameDatabaseForm = useFormik<RenameDatabaseForm>({
        enableReinitialize: true,

        initialValues: {
            name: selected?.name || "",
        },

        onSubmit: async (values, formikHelpers) => {
            const { resetForm } = formikHelpers;
            let type = "";
            if (selectedDatabaseUuid) {
                type = "database";
                updateDatabaseName(values.name);
            } else if (selectedDatabaseTableUuid) {
                type = "table";
                updateDatabaseTableName(values.name);
            }

            // Display success message
            toastMessage(
                t(
                    `database.dashboard.modal.rename.form.message.success.${type}`
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
                            "database.dashboard.modal.rename.form.error.required.name"
                        )
                        .test({
                            message: "common.error.nameSpace",
                            test: (value) => !value?.includes(" "),
                        })
                        .test({
                            message: "common.error.nameExist",
                            test: (value) => {
                                // If database selected then check in the database list
                                if (selectedDatabaseUuid) {
                                    // Check the name from the database list
                                    return !databaseList.some(
                                        ({ name, uuid }) =>
                                            name === value &&
                                            // Make sure we're not validating the same database
                                            uuid !== selectedDatabaseUuid
                                    );
                                }

                                // If table is selected, then use it's uuid
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
                                    ({ name, uuid }) =>
                                        name === value &&
                                        // Make sure we're not validating the same database table
                                        uuid !== selectedDatabaseTableUuid
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
        renameDatabaseForm.resetForm();
    };

    return (
        <EmobiqModal
            show={show}
            modalHeaderTitle={
                selectedDatabaseUuid
                    ? t("database.dashboard.modal.rename.title.database")
                    : t("database.dashboard.modal.rename.title.table")
            }
            handleClose={onCloseModal}
            modalFooterButton={[
                {
                    name: "common.button.cancel",
                    variant: ButtonVariant.OUTLINE_EMOBIQ_BRAND,
                    handleClick: onCloseModal,
                },
                {
                    name: "common.button.rename",
                    variant: ButtonVariant.EMOBIQ_BRAND,
                    handleClick: renameDatabaseForm.submitForm,
                },
            ]}
        >
            <Form onSubmit={renameDatabaseForm.handleSubmit}>
                <Stack gap={4}>
                    <Form.Group controlId="name">
                        <Row className="align-items-center">
                            <Col xs={12} sm={3}>
                                <Form.Label className="text-rg m-0">
                                    {t(
                                        "database.dashboard.modal.rename.form.label.name"
                                    )}
                                </Form.Label>
                            </Col>
                            <Col xs={12} sm={9}>
                                <Form.Control
                                    className="text-rg"
                                    placeholder={t(
                                        "database.dashboard.modal.rename.form.label.name"
                                    )}
                                    onChange={renameDatabaseForm.handleChange}
                                    value={renameDatabaseForm.values.name}
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                </Stack>
            </Form>
        </EmobiqModal>
    );
};

export default DatabaseRename;

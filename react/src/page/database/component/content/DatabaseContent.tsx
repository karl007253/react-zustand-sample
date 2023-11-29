import { BaseSyntheticEvent, useEffect, useState } from "react";
import { Button, Col, Row, Table, Alert } from "react-bootstrap";
import { isEmpty } from "lodash";
import { useTranslation } from "react-i18next";
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import DatabaseContentFormInput from "./DatabaseContentFormInput";
import useToast from "../../../../common/hooks/Toast";
import useStore from "../../../../common/zustand/Store";

import { ButtonVariant } from "../../../../common/component/helper/EmobiqModal";
import {
    DatabaseTableDataType,
    Field,
} from "../../../../common/zustand/interface/DatabaseTableInterface";
import { DatabaseTableRecordValue } from "../../../../common/zustand/interface/DatabaseTableContentInterface";
import {
    valueFromString,
    valueToString,
} from "../../../../common/helper/Function";

import { AlertVariant } from "../../../../common/data/Enum";
import useDebounce from "../../../../common/hooks/Debounce";

// blobToBase64 function for converting blob to base64 values
const blobToBase64 = (blob: Blob) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
    });
};

// isFieldsChanged function for checking if the structure has been changed from the structure tab but the user haven't saved the project yet
const isFieldsChanged = (newFields: Field[], oldFields: Field[]) => {
    // Check only for a change if both newFields and oldFields have values
    if (newFields.length > 0 && oldFields.length > 0) {
        const result = newFields.filter(
            (field1) =>
                !oldFields.some(
                    (field2) =>
                        field1.primary === field2.primary &&
                        field1.name === field2.name &&
                        field1.type === field2.type &&
                        field1.length === field2.length &&
                        field1.optional === field2.optional &&
                        field1.default === field2.default
                )
        );

        // If this is more than one, means that there is a change
        return result.length > 0;
    }

    // Default to no change
    return false;
};

const DatabaseContent = () => {
    const toastMessage = useToast(true);
    const { t } = useTranslation();

    const [updateFields, setUpdateFields] = useState<{
        [key: number]: DatabaseTableRecordValue;
    }>({});

    const debouncedFields = useDebounce(updateFields, 1000);

    // Get the query string
    const segments = useParams();

    // Get the application_code / app
    const appCode = segments.appid as string;

    const {
        databaseTable,
        selectedDatabaseTableUuid,
        databaseTableContentContents,
        databaseTableContentFields,
        dataHasChanged,
        clearDatabaseTableContents,
        getApplicationDatabaseTableContents,
        postApplicationDatabaseTableContents,
        patchApplicationDatabaseTableContent,
        deleteApplicationDatabaseTableContent,
        setDataHasChanged,
    } = useStore((state) => ({
        selectedDatabaseTableUuid: state.selectedDatabaseTableUuid,
        databaseTable: state.databaseTable,
        databaseTableContentFields: state.databaseTableContentFields,
        databaseTableContentContents: state.databaseTableContentContents,
        dataHasChanged: state.dataHasChanged,
        clearDatabaseTableContents: state.clearDatabaseTableContents,
        getApplicationDatabaseTableContents:
            state.getApplicationDatabaseTableContents,
        postApplicationDatabaseTableContents:
            state.postApplicationDatabaseTableContents,
        patchApplicationDatabaseTableContent:
            state.patchApplicationDatabaseTableContent,
        deleteApplicationDatabaseTableContent:
            state.deleteApplicationDatabaseTableContent,
        setDataHasChanged: state.setDataHasChanged,
    }));

    const selectedDatabaseTableData = databaseTable.find(
        (a) => a.uuid === selectedDatabaseTableUuid
    );

    const displayError = (errors: string[], defaultError: string) => {
        let error = "";
        if (Array.isArray(errors) && errors.length > 0) {
            error = errors.join(", ");
        } else {
            error = t(defaultError);
        }

        toastMessage(error, toast.TYPE.ERROR);
    };

    // Set dataHasChanged back to false to reset and also to trigger fetching of DatabaseTableContents
    useEffect(() => {
        if (dataHasChanged) {
            setDataHasChanged(false);
        }
    }, [dataHasChanged]);

    useEffect(() => {
        // fetch data if dataHasChanged is false because dataHasChanged will be changed to false anyway after saving Application
        if (!dataHasChanged) {
            // If the selected table has changed then clear the table content fields
            clearDatabaseTableContents();

            // Only get the contents if there's an id
            // this means that this table is already existing in the backend
            if (selectedDatabaseTableData?.id) {
                getApplicationDatabaseTableContents(
                    appCode,
                    selectedDatabaseTableData?.database_id ?? 0,
                    selectedDatabaseTableData?.id ?? 0
                )
                    .then((res) => {
                        if (!res.success) {
                            toastMessage(res.message, toast.TYPE.ERROR);
                        }
                    })
                    .catch((errorList) => {
                        displayError(
                            errorList,
                            "database.dashboard.action.content.error.gettingRecordField"
                        );
                    });
            }
        }
    }, [selectedDatabaseTableUuid, dataHasChanged]);

    // handle deleting a content item
    const handleDelete = (id: number) => {
        deleteApplicationDatabaseTableContent(
            appCode,
            selectedDatabaseTableData?.database_id ?? 0,
            selectedDatabaseTableData?.id ?? 0,
            id
        )
            .then((res) => {
                if (!res.success) {
                    toastMessage(res.message, toast.TYPE.ERROR);
                }
            })
            .catch((errorList) => {
                displayError(
                    errorList,
                    "database.dashboard.action.content.error.deletingRecordField"
                );
            });
    };

    // handle adding a new content item
    const handleAdd = () => {
        const fields: { [x: string]: string } = {};
        databaseTableContentFields.forEach((element) => {
            fields[element.name] = element?.default ?? "";
        });

        postApplicationDatabaseTableContents(
            appCode,
            selectedDatabaseTableData?.database_id ?? 0,
            selectedDatabaseTableData?.id ?? 0,
            fields
        )
            .then((res) => {
                if (!res.success) {
                    toastMessage(res.message, toast.TYPE.ERROR);
                }
            })
            .catch((errorList) => {
                displayError(
                    errorList,
                    "database.dashboard.action.content.error.addingRecordField"
                );
            });
    };

    // handle updating the input field of value
    const handleUpdateValue = (
        tableContentId: number,
        structure: Field,
        e: BaseSyntheticEvent
    ) => {
        if (
            structure.optional === false &&
            isEmpty(e.target?.value) &&
            structure.type !== DatabaseTableDataType.DECIMAL
        ) {
            toastMessage(
                t("database.dashboard.action.content.error.noNullField"),
                toast.TYPE.ERROR
            );
            return;
        }
        if (
            (structure.type === DatabaseTableDataType.INT &&
                e.target?.value?.length > structure?.length) ||
            (structure.type === DatabaseTableDataType.DECIMAL &&
                e.target?.value?.length > structure?.length)
        ) {
            toastMessage(
                `${t(
                    "database.dashboard.action.content.error.maximumFieldLength"
                )} 
                ${structure?.length}`,
                toast.TYPE.ERROR
            );
            return;
        }

        const fieldName = structure.name as string;

        if (structure.type === DatabaseTableDataType.BLOB) {
            if (!e.target.files?.[0]) {
                return;
            }

            blobToBase64(e.target.files?.[0]).then((dataBlob) => {
                const value = valueFromString(
                    dataBlob as unknown as string,
                    DatabaseTableDataType.BLOB
                );

                // Set the value in the updateFields
                setUpdateFields(() => ({
                    ...updateFields,
                    [tableContentId]: {
                        ...updateFields[tableContentId],
                        [fieldName]: value,
                    },
                }));
            });
        } else {
            // Set the value in the updateFields
            setUpdateFields(() => ({
                ...updateFields,
                [tableContentId]: {
                    ...updateFields[tableContentId],
                    [fieldName]:
                        valueToString(e.target.value, structure.type) ?? "",
                },
            }));
        }
    };

    useEffect(() => {
        if (!isEmpty(debouncedFields)) {
            Object.entries(debouncedFields).forEach(
                ([tableContentId, updatedFields]) => {
                    patchApplicationDatabaseTableContent(
                        appCode,
                        selectedDatabaseTableData?.database_id ?? 0,
                        selectedDatabaseTableData?.id ?? 0,
                        Number(tableContentId),
                        updatedFields
                    )
                        .then((res) => {
                            if (!res.success) {
                                toastMessage(res.message, toast.TYPE.ERROR);
                            }

                            // Clear fields if success
                            setUpdateFields({});
                        })
                        .catch((errorList) => {
                            displayError(
                                errorList,
                                "database.dashboard.action.content.error.updatingRecordField"
                            );
                        });
                }
            );
        }
    }, [debouncedFields]);

    // displaying table row and body data
    const contentFieldListing = () => {
        return databaseTableContentContents?.map((tableContent) => {
            return (
                <tr key={tableContent.record?.id}>
                    {databaseTableContentFields?.map(
                        (structure, structureIndex) => {
                            return (
                                <td
                                    className="ps-0"
                                    key={`structure-${structure.name}`}
                                >
                                    <DatabaseContentFormInput
                                        onChange={(e) => {
                                            handleUpdateValue(
                                                tableContent.record?.id,
                                                structure,
                                                e
                                            );
                                        }}
                                        tableContent={tableContent}
                                        structure={structure}
                                        structureIndex={structureIndex}
                                        defaultValue={valueToString(
                                            tableContent.values?.[
                                                structure?.name
                                            ] ?? structure?.default,
                                            structure.type
                                        )}
                                    />
                                </td>
                            );
                        }
                    )}

                    <td className="pe-0" key="delete-button">
                        <Button
                            aria-label={`database-content-delete-button-${tableContent.record?.id}`}
                            variant={ButtonVariant.OUTLINE_CHINESE_SILVER}
                            onClick={() =>
                                handleDelete(tableContent.record?.id)
                            }
                            className="text-rg rounded-3-px"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </Button>
                    </td>
                </tr>
            );
        });
    };

    // If no id yet, then display a warning message to let the user save the project first
    if (!selectedDatabaseTableData?.id) {
        return (
            <Alert variant={AlertVariant.WARNING}>
                {t("database.dashboard.action.content.structureNotSaved")}
            </Alert>
        );
    }

    // If no table content data, display warning
    if (
        selectedDatabaseTableData?.data === null ||
        selectedDatabaseTableData?.data?.structure?.length === 0
    ) {
        return (
            <Alert variant={AlertVariant.WARNING}>
                {t("database.dashboard.action.content.structureNotExist")}
            </Alert>
        );
    }

    return (
        <>
            {/* will check if the structure has been changed from the structure tab but the user haven't saved the project yet */}
            {isFieldsChanged(
                selectedDatabaseTableData?.data?.structure ?? [],
                databaseTableContentFields
            ) && (
                <Alert variant={AlertVariant.WARNING}>
                    {t("database.dashboard.action.content.structureChanged")}
                </Alert>
            )}
            <Table
                responsive
                borderless
                className="table-width-database-content"
                aria-label="database-content-table-container"
            >
                <thead className="text-spanish-gray text-rg">
                    <tr>
                        {databaseTableContentFields?.map((item) => (
                            <th
                                data-testid="table-head"
                                className="pt-0 ps-0 fw-normal"
                                key={item.name}
                            >
                                {item.name}
                            </th>
                        ))}

                        <th
                            aria-label="table-column-delete-button"
                            className="pt-0 pe-0"
                        />
                    </tr>
                </thead>
                <tbody aria-label="field-list">{contentFieldListing()}</tbody>
            </Table>
            {(databaseTableContentFields.length ?? 0) > 0 && (
                <Row className="text-spanish-gray mb-4">
                    <Col>
                        <Button
                            aria-label="database-content-add-button"
                            variant={ButtonVariant.OUTLINE_LIGHT_EMOBIQ_BRAND}
                            onClick={handleAdd}
                            className="text-sm"
                        >
                            <FontAwesomeIcon icon={faPlus} />
                            <span className="ms-2 d-none d-sm-inline">
                                {t(
                                    "database.dashboard.action.content.button.add"
                                )}
                            </span>
                        </Button>
                    </Col>
                </Row>
            )}
        </>
    );
};

export default DatabaseContent;

import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { ButtonVariant } from "../../../../common/component/helper/EmobiqModal";

import {
    DatabaseTable,
    Field,
} from "../../../../common/zustand/interface/DatabaseTableInterface";
import useToast from "../../../../common/hooks/Toast";
import { validateSpecialCharacters } from "../../../../common/helper/Function";

type RelationFormInputProps = {
    tableList: DatabaseTable[];
    tableFields: Field[];
    name: string;
    field: string;
    foreignTable: string;
    foreignField: string;
    index: number;
    handleDelete: (index: number) => void;
    handleChange: (index: number, name: string, value: string) => void;
};

const DatabaseRelationFormInput = ({
    tableList,
    tableFields,
    name,
    field,
    foreignTable,
    foreignField,
    index,
    handleDelete,
    handleChange,
}: RelationFormInputProps) => {
    const { t } = useTranslation();
    const toastMessage = useToast(true);
    // The selected foreign table
    const [selectedForeignTable, setSelectedForeignTable] =
        useState<string>(foreignTable);

    // The fields of the selected foreign table
    const [fieldsOfSelectedForeignTable, setFieldsOfSelectedForeignTable] =
        useState<Field[]>([]);

    // When the selected foreign table changes update the foreign table fields
    useEffect(() => {
        const table = tableList.find(
            (item) => item.name === selectedForeignTable
        );
        setFieldsOfSelectedForeignTable(table?.data?.structure || []);
    }, [selectedForeignTable, tableList]);

    useEffect(() => {
        setSelectedForeignTable(foreignTable);
    }, [foreignTable]);

    const handleForeignTableChange = (
        tableIndex: number,
        tableName: string,
        valueName: string
    ) => {
        // Update the global state
        handleChange(tableIndex, tableName, valueName);

        // Update the local state
        setSelectedForeignTable(valueName);
    };

    return (
        <Row className="align-items-center">
            <Col xs={2}>
                <Form.Control
                    aria-label={`database-table-relation-input-name-${index}`}
                    className="text-rg mb-2"
                    name="name"
                    value={name ?? ""}
                    onChange={(e) => {
                        // Checking for special characters
                        if (
                            validateSpecialCharacters(e.target.value) &&
                            e.target.value !== ""
                        ) {
                            toastMessage(
                                t("common.error.specialCharactersDetected"),
                                toast.TYPE.ERROR
                            );
                        } else {
                            handleChange(index, e.target.name, e.target.value);
                        }
                    }}
                />
            </Col>
            <Col xs={2}>
                <Form.Select
                    aria-label={`database-table-relation-input-field-${index}`}
                    className="text-rg mb-2"
                    name="field"
                    value={field ?? ""}
                    onChange={(e) =>
                        handleChange(index, e.target.name, e.target.value)
                    }
                >
                    <option value="">Select ...</option>
                    {tableFields.map((item, idx) => (
                        <option
                            // eslint-disable-next-line react/no-array-index-key
                            key={`field-${item.name}-${idx}`}
                            value={item.name}
                        >
                            {item.name}
                        </option>
                    ))}
                </Form.Select>
            </Col>
            <Col xs={2}>
                <Form.Select
                    aria-label={`database-table-relation-input-foreigntable-${index}`}
                    className="text-rg mb-2"
                    name="foreign_table"
                    value={foreignTable ?? ""}
                    onChange={(e) =>
                        handleForeignTableChange(
                            index,
                            e.target.name,
                            e.target.value
                        )
                    }
                >
                    <option value="">Select ...</option>
                    {tableList.map((item, idx) => (
                        <option
                            // eslint-disable-next-line react/no-array-index-key
                            key={`foreign-table-${item.name}-${idx}`}
                            value={item.name}
                        >
                            {item.name}
                        </option>
                    ))}
                </Form.Select>
            </Col>
            <Col xs={2}>
                <Form.Select
                    aria-label={`database-table-relation-input-foreignfield-${index}`}
                    className="text-rg mb-2"
                    name="foreign_field"
                    value={foreignField ?? ""}
                    onChange={(e) => {
                        // TODO: Implement this properly, put it here for the meantime
                        // even though it doesn't cover every scenarios - time.

                        // Retrieve if primary key
                        const isPrimaryKey = fieldsOfSelectedForeignTable.find(
                            (item) => item.name === e.target.value
                        )?.primary;

                        // Validate if the selected field is not primary key.
                        if (e.target.value && !isPrimaryKey) {
                            toastMessage(
                                t(
                                    "database.dashboard.action.relations.error.foreignField.notPrimaryKey"
                                ),
                                toast.TYPE.ERROR
                            );
                            return;
                        }

                        // Update the state
                        handleChange(index, e.target.name, e.target.value);
                    }}
                >
                    <option value="">Select ...</option>
                    {fieldsOfSelectedForeignTable.map((item, idx) => (
                        <option
                            // eslint-disable-next-line react/no-array-index-key
                            key={`foreign-field-${item.name}-${idx}`}
                            value={item.name}
                        >
                            {item.name}
                        </option>
                    ))}
                </Form.Select>
            </Col>
            <Col xs={1}>
                <Button
                    aria-label={`database-table-relation-button-delete-${index}`}
                    className="mb-2"
                    variant={ButtonVariant.OUTLINE_CHINESE_SILVER}
                    onClick={() => {
                        handleDelete(index);
                    }}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </Button>
            </Col>
        </Row>
    );
};

export default DatabaseRelationFormInput;

import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import _ from "lodash";

import { Relation } from "../../../../common/zustand/interface/DatabaseTableInterface";
import useStore from "../../../../common/zustand/Store";

import DatabaseRelationForm from "./DatabaseRelationForm";

import useDebounce from "../../../../common/hooks/Debounce";
import useToast from "../../../../common/hooks/Toast";
import { SPECIAL_CHARACTERS_REGEX } from "../../../../common/data/Constant";

const DatabaseRelation = () => {
    const { t } = useTranslation();
    const toastMessage = useToast(true);

    const { selectedDatabaseTable, updateDatabaseTableRelation } = useStore(
        (state) => ({
            selectedDatabaseTable: state.databaseTable.find(
                (item) => item.uuid === state.selectedDatabaseTableUuid
            ),
            updateDatabaseTableRelation: state.updateDatabaseTableRelation,
        })
    );

    const [relationData, setRelationData] = useState<Relation[]>([]);

    const debouncedRelationData = useDebounce(relationData);

    useEffect(() => {
        setRelationData(selectedDatabaseTable?.data?.relations || []);
    }, [selectedDatabaseTable?.uuid]);

    useEffect(() => {
        // All fields are required
        const newRelations = debouncedRelationData.filter(
            (item) =>
                item.name?.length > 0 &&
                item.field?.length > 0 &&
                item.foreign_table?.length > 0 &&
                item.foreign_field?.length > 0
        );

        const currentRelation = selectedDatabaseTable?.data?.relations || [];

        const isCurrentRelationGreaterThanNewRelation =
            currentRelation.length > newRelations.length;

        const isRelationUpdated = newRelations.some((relation, index) => {
            if (currentRelation[index]) {
                return !_.isEqual(relation, currentRelation[index]);
            }
            return true;
        });
        if (isCurrentRelationGreaterThanNewRelation || isRelationUpdated) {
            updateDatabaseTableRelation(newRelations);
        }
    }, [debouncedRelationData]);

    // Check if a table relation already exists
    const isRelationExists = (
        index: number,
        name: string,
        value: string
    ): boolean => {
        const relation: Relation = {
            ...relationData[index],
            [name]: value,
        };

        // Check if the name is for foreign key relationship
        const isNameForeignKey = [
            "field",
            "foreign_table",
            "foreign_field",
        ].includes(name);

        if (
            isNameForeignKey &&
            relation &&
            relation.field &&
            relation.foreign_table &&
            relation.foreign_field
        ) {
            const relationValue = `${relation.field}:${relation.foreign_table}:${relation.foreign_field}`;

            return relationData.some(
                (item) =>
                    relationValue ===
                    `${item.field}:${item.foreign_table}:${item.foreign_field}`
            );
        }

        // Default to not exists
        return false;
    };

    const validateName = (name: string): boolean => {
        let error = false;

        // Validate for empty value
        // No need to return error, fields with empty name will be removed anyway
        if (name === "") {
            error = true;
        }

        // Validate for an empty space
        else if (name.includes(" ")) {
            toastMessage(t("common.error.nameSpace"), toast.TYPE.ERROR);
            error = true;
        }

        // Name should not start with a number
        else if (!SPECIAL_CHARACTERS_REGEX.test(name)) {
            toastMessage(
                t("common.error.specialCharactersDetected"),
                toast.TYPE.ERROR
            );
            error = true;
        }

        // Validate for duplicate name
        else if (relationData.some((item) => item.name === name)) {
            toastMessage(t("common.error.nameExist"), toast.TYPE.ERROR);
            error = true;
        }

        return !error;
    };

    const handleDelete = (index: number) => {
        const newStructureData = relationData.filter(
            (_relationData, i) => i !== index
        );
        setRelationData(newStructureData);
    };

    const handleUpdate = (index: number, name: string, value: string) => {
        let newValues: Partial<Relation> = {};

        if (isRelationExists(index, name, value)) {
            // Clear the input
            newValues = { [name]: "" };

            // Clear the foreign field
            if (name === "foreign_table") {
                newValues = { ...newValues, foreign_field: "" };
            }

            // Display error message
            toastMessage(
                t("database.dashboard.action.relations.error.relationExist"),
                toast.TYPE.ERROR
            );
        } else {
            switch (name) {
                case "foreign_table":
                    // If the foreign_table is changed then set the foreign_field to blank
                    newValues = { foreign_table: value, foreign_field: "" };
                    break;
                case "name":
                    newValues = { name: validateName(value) ? value : "" };
                    break;
                default:
                    newValues = { [name]: value };
            }
        }

        const newUpdates = relationData.map((item, i) =>
            i === index ? { ...item, ...newValues } : item
        );

        setRelationData(newUpdates);
    };

    const handleAdd = () => {
        setRelationData([...relationData, {} as Relation]);
    };

    return (
        <Row>
            <Col xs={12} sm={12}>
                <DatabaseRelationForm
                    formData={relationData}
                    handleDelete={handleDelete}
                    handleAdd={handleAdd}
                    handleChange={handleUpdate}
                />
            </Col>
        </Row>
    );
};

export default DatabaseRelation;

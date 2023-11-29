import { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import _ from "lodash";

import {
    Field,
    DatabaseTableDataType,
} from "../../../../common/zustand/interface/DatabaseTableInterface";
import useStore from "../../../../common/zustand/Store";

import useDebounce from "../../../../common/hooks/Debounce";
import { StringBoolean } from "../../../../common/data/Enum";

import DatabaseStructureForm from "./DatabaseStructureForm";
import generateUniqueId from "../../../../common/helper/UniqueId";
import { TABLE_FIELD_PREFIX } from "../../../../common/data/Constant";

const DatabaseStructure = () => {
    const {
        selectedDatabaseTable,
        updateDatabaseTableStructure,
        dataHasChanged,
        setDataHasChanged,
    } = useStore((state) => ({
        selectedDatabaseTable: state.databaseTable.find(
            (item) => item.uuid === state.selectedDatabaseTableUuid
        ),
        updateDatabaseTableStructure: state.updateDatabaseTableStructure,
        dataHasChanged: state.dataHasChanged,
        setDataHasChanged: state.setDataHasChanged,
    }));

    const [structureData, setStructureData] = useState<Field[]>([]);

    // Make sure the structure is updated only when the user has finished typing
    const debouncedStructureData = useDebounce(structureData);

    // Reset the structure when the selected database table changed
    useEffect(() => {
        if (dataHasChanged) {
            setStructureData(selectedDatabaseTable?.data?.structure || []);
            setDataHasChanged(false);
        }
    }, [dataHasChanged]);

    useEffect(() => {
        setStructureData(selectedDatabaseTable?.data?.structure || []);
    }, [selectedDatabaseTable?.uuid]);

    useEffect(() => {
        const newFields = debouncedStructureData.filter(
            ({ name }) => name?.length > 0
        );

        const currentField = selectedDatabaseTable?.data?.structure || [];

        const isCurrentFieldGreaterThanNewField =
            currentField.length > newFields.length;

        const isFieldUpdated = newFields.some((field, index) => {
            if (currentField[index]) {
                return !_.isEqual(field, currentField[index]);
            }
            return true;
        });
        if (isCurrentFieldGreaterThanNewField || isFieldUpdated) {
            updateDatabaseTableStructure(newFields);
        }
    }, [debouncedStructureData]);

    const handleDelete = (index: number) => {
        const newStructureData = structureData.filter(
            (field, i) => i !== index
        );
        setStructureData(newStructureData);
    };

    const handleUpdate = (index: number, name: string, value: string) => {
        if (name === "name" && value.length === 0) {
            handleDelete(index);
        } else {
            let newValue: unknown = value;
            if (name === "optional" || name === "primary") {
                newValue = value === StringBoolean.TRUE;
            }

            const newUpdates = structureData.map((item, i) =>
                i === index ? { ...item, [name]: newValue } : item
            );

            setStructureData(newUpdates);
        }
    };

    const handleAdd = () => {
        setStructureData([
            ...structureData,
            {
                uuid: generateUniqueId(TABLE_FIELD_PREFIX),
                type: DatabaseTableDataType.VARCHAR,
                length: "",
                optional: true,
                primary: false,
                default: "",
            } as Field,
        ]);
    };

    return (
        <Row>
            <Col xs={12} sm={12}>
                <DatabaseStructureForm
                    formData={structureData}
                    handleDelete={handleDelete}
                    handleChange={handleUpdate}
                    handleAdd={handleAdd}
                />
            </Col>
        </Row>
    );
};

export default DatabaseStructure;

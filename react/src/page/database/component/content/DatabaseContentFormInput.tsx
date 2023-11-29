import { Form } from "react-bootstrap";
import { BaseSyntheticEvent } from "react";

import {
    DatabaseTableDataType,
    Field,
} from "../../../../common/zustand/interface/DatabaseTableInterface";
import { DatabaseTableContentCreateUpdateResponse } from "../../../../common/zustand/interface/DatabaseTableContentInterface";
import { valueToString } from "../../../../common/helper/Function";

type DatabaseContentFormInputProps = {
    onChange: (e: BaseSyntheticEvent) => void;
    tableContent: DatabaseTableContentCreateUpdateResponse;
    structure: Field;
    structureIndex: number;
    defaultValue?: string | number;
};

const DatabaseContentFormInput = ({
    onChange,
    tableContent,
    structure,
    structureIndex,
    defaultValue,
}: DatabaseContentFormInputProps) => {
    if (
        structure.type === DatabaseTableDataType.VARCHAR ||
        structure.type === DatabaseTableDataType.TEXT ||
        structure.type === DatabaseTableDataType.DATETIME ||
        structure.type === DatabaseTableDataType.TIMESTAMP
    ) {
        return (
            <Form.Control
                aria-label={`database-content-input-${structure.type.toLowerCase()}-${
                    tableContent.record?.id
                }-${structureIndex}`}
                className="text-sm"
                maxLength={parseInt(structure.length, 10)}
                onChange={onChange}
                defaultValue={valueToString(defaultValue, structure.type)}
            />
        );
    }
    if (
        structure.type === DatabaseTableDataType.INT ||
        structure.type === DatabaseTableDataType.DECIMAL
    ) {
        return (
            <Form.Control
                aria-label={`database-content-input-${structure.type.toLowerCase()}-${
                    tableContent.record?.id
                }-${structureIndex}`}
                className="text-sm"
                type="number"
                step={structure.type === DatabaseTableDataType.INT ? 1 : "any"}
                maxLength={parseInt(structure.length, 10)}
                onChange={onChange}
                defaultValue={defaultValue}
            />
        );
    }
    if (structure.type === DatabaseTableDataType.BOOLEAN) {
        return (
            <Form.Select
                aria-label={`database-content-input-boolean-${tableContent.record?.id}-${structureIndex}`}
                className="text-sm"
                onChange={onChange}
                defaultValue={valueToString(defaultValue, structure.type)}
            >
                {structure.optional && <option value="">Null</option>}
                <option value="1">True</option>
                <option value="0">False</option>
            </Form.Select>
        );
    }
    if (structure.type === DatabaseTableDataType.DATE) {
        return (
            <Form.Control
                aria-label={`database-content-input-date-${tableContent.record?.id}-${structureIndex}`}
                className="text-sm"
                type="date"
                maxLength={parseInt(structure.length, 10)}
                onChange={onChange}
                defaultValue={valueToString(defaultValue, structure.type)}
            />
        );
    }
    if (structure.type === DatabaseTableDataType.TIME) {
        return (
            <Form.Control
                aria-label={`database-content-input-time-${tableContent.record?.id}-${structureIndex}`}
                className="text-sm"
                type="time"
                maxLength={parseInt(structure.length, 10)}
                onChange={onChange}
                defaultValue={valueToString(defaultValue, structure.type)}
            />
        );
    }
    if (structure.type === DatabaseTableDataType.BLOB) {
        const fileTitle = valueToString(defaultValue, structure.type).slice(
            0,
            25
        );
        return (
            <Form>
                <Form.Group>
                    <Form.Label
                        className="text-sm form-control text-nowrap"
                        htmlFor={`database-content-input-blob-${tableContent.record?.id}-${structureIndex}`}
                    >
                        {fileTitle.length > 0 ? (
                            <>Selected file: {fileTitle}</>
                        ) : (
                            <>Select a file</>
                        )}
                    </Form.Label>
                    <Form.Control
                        aria-label={`database-content-input-blob-${tableContent.record?.id}-${structureIndex}`}
                        id={`database-content-input-blob-${tableContent.record?.id}-${structureIndex}`}
                        type="file"
                        style={{ display: "none" }}
                        onChange={onChange}
                    />
                </Form.Group>
            </Form>
        );
    }

    return null;
};

export default DatabaseContentFormInput;

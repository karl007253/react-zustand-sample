import { useEffect, useState } from "react";
import { Button, Col, Form, InputGroup, Row } from "react-bootstrap";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { ButtonVariant } from "../../../../common/component/helper/EmobiqModal";
import { StringBoolean } from "../../../../common/data/Enum";
import { DatabaseTableDataType } from "../../../../common/zustand/interface/DatabaseTableInterface";
import useToast from "../../../../common/hooks/Toast";
import { validateSpecialCharacters } from "../../../../common/helper/Function";

// TODO: Study if the minValue and maxValue is being used
interface DataTypeProperty {
    name: string;
    minValue?: string | number;
    maxValue?: string | number;
    maxLength?: number;
    lengthRequired?: boolean;
    primaryKeySupported?: boolean;
}
// mariadb datatype
const dataTypes: DataTypeProperty[] = [
    {
        name: DatabaseTableDataType.VARCHAR,
        maxLength: 21844,
        lengthRequired: true,
        primaryKeySupported: true,
    },
    {
        name: DatabaseTableDataType.TEXT,
        maxLength: 4294967295,
    },
    {
        name: DatabaseTableDataType.BOOLEAN,
        primaryKeySupported: true,
    },
    {
        name: DatabaseTableDataType.INT,
        primaryKeySupported: true,
    },
    {
        name: DatabaseTableDataType.DECIMAL,
        maxLength: 65,
        primaryKeySupported: true,
    },
    {
        name: DatabaseTableDataType.DATE,
        maxValue: "9999-12-31",
        minValue: "1000-01-01",
        primaryKeySupported: true,
    },
    {
        name: DatabaseTableDataType.DATETIME,
        maxValue: "9999-12-31 23:59:59",
        minValue: "1000-01-01 00:00:00",
        primaryKeySupported: true,
    },
    {
        name: DatabaseTableDataType.TIME,
        maxValue: "838:59:59.999999",
        minValue: "-838:59:59.999999",
        primaryKeySupported: true,
    },
    {
        name: DatabaseTableDataType.TIMESTAMP,
        maxValue: "2038-01-19 03:14:07",
        minValue: "1970-01-01 00:00:00",
        primaryKeySupported: true,
    },
    {
        name: DatabaseTableDataType.BLOB,
        maxLength: 4294967295,
    },
];

type StructureFormInputProps = {
    primary: boolean;
    primaryExist: boolean;
    name: string;
    type: string;
    length: string;
    optional: string;
    defaultValue: string;
    index: number;
    handleDelete: (index: number) => void;
    handleChange: (index: number, name: string, value: string) => void;
};

const DatabaseStructureFormInput = ({
    primary,
    primaryExist,
    name,
    type,
    length,
    optional,
    defaultValue,
    index,
    handleDelete,
    handleChange,
}: StructureFormInputProps) => {
    const toastMessage = useToast(true);

    const { t } = useTranslation();

    const [errorMessage, setErrorMessage] = useState<string | undefined>();

    const [currentLength, setCurrentLength] = useState<string>("");

    const [currentType, setCurrentType] = useState<
        DataTypeProperty | undefined
    >();

    const [currentPrimary, setCurrentPrimary] = useState<boolean | undefined>();

    // Update underlying content whenever external parameters are changed
    useEffect(() => {
        setCurrentType(dataTypes.find((d) => d.name === type));
    }, [type]);
    useEffect(() => {
        setCurrentLength(length);
    }, [length]);
    useEffect(() => {
        setCurrentPrimary(primary);
    }, [primary]);

    // Update new maximum length based on type. Also, clear user length input if type doesn't have length
    useEffect(() => {
        if (currentType) {
            if (!currentType.maxLength) {
                setCurrentLength("");
            }
            if (!currentType.primaryKeySupported) {
                setCurrentPrimary(false);
            }
        }
    }, [currentType]);

    // Show error if length is outside its range or invalid
    useEffect(() => {
        if (currentType?.maxLength) {
            if (currentType?.lengthRequired && currentLength === "") {
                setErrorMessage(
                    t(
                        "database.dashboard.action.structure.error.length.required"
                    )
                );
                return;
            }
            // Ensure input is either empty or digit only
            if (!/^\d*$/.test(currentLength)) {
                setErrorMessage(
                    t(
                        "database.dashboard.action.structure.error.length.invalid"
                    )
                );
                return;
            }
            if (+currentLength > currentType.maxLength) {
                setErrorMessage(
                    t(
                        "database.dashboard.action.structure.error.length.outOfRange"
                    )
                );
                return;
            }
        }
        setErrorMessage(undefined);
    }, [currentLength, currentType]);

    // Pass to handler whenever type changes
    useEffect(() => {
        handleChange(index, "type", currentType?.name ?? "");
    }, [currentType]);

    // Pass to handler whenever length changes
    useEffect(() => {
        handleChange(index, "length", currentLength);
    }, [currentLength]);

    // Pass to handler whenever primary key checkbox changes
    useEffect(() => {
        handleChange(index, "primary", (currentPrimary ?? false).toString());
    }, [currentPrimary]);

    return (
        <Row className="align-items-start">
            <Col className="mw-55 text-center align-middle">
                <Form.Check
                    aria-label={`database-table-structure-input-primary-${index}`}
                    type="checkbox"
                    name="primary"
                    checked={currentPrimary}
                    disabled={
                        (!currentPrimary && primaryExist) ||
                        !currentType?.primaryKeySupported
                    }
                    onChange={(e) => setCurrentPrimary(e.target.checked)}
                />
            </Col>
            <Col>
                <Form.Control
                    aria-label={`database-table-structure-input-name-${index}`}
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
            <Col>
                <Form.Select
                    aria-label={`database-table-structure-input-type-${index}`}
                    className="text-rg mb-2 text-uppercase"
                    name="type"
                    value={currentType?.name ?? ""}
                    onChange={(e) =>
                        setCurrentType(
                            dataTypes.find((d) => d.name === e.target.value)
                        )
                    }
                >
                    {Object.values(DatabaseTableDataType).map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </Form.Select>
            </Col>
            <Col xs="2" sm="2">
                <InputGroup hasValidation>
                    <Form.Control
                        aria-label={`database-table-structure-input-length-${index}`}
                        className="text-rg mb-2"
                        name="length"
                        value={currentLength || ""}
                        onChange={(e) => setCurrentLength(e.target.value)}
                        disabled={!currentType?.maxLength}
                        isInvalid={!!errorMessage} // undefined or empty string
                    />
                    <Form.Control.Feedback type="invalid">
                        {errorMessage}
                    </Form.Control.Feedback>
                </InputGroup>
            </Col>
            <Col xs="2" sm="2">
                <Form.Select
                    aria-label={`database-table-structure-input-optional-${index}`}
                    className="text-rg mb-2 text-capitalize"
                    name="optional"
                    value={optional ?? ""}
                    onChange={(e) =>
                        handleChange(index, e.target.name, e.target.value)
                    }
                >
                    {Object.values(StringBoolean).map((item) => (
                        <option key={item} value={item}>
                            {item}
                        </option>
                    ))}
                </Form.Select>
            </Col>
            <Col>
                <Form.Control
                    aria-label={`database-table-structure-input-default-${index}`}
                    className="text-rg mb-2"
                    name="default"
                    value={defaultValue ?? ""}
                    onChange={(e) =>
                        handleChange(index, e.target.name, e.target.value)
                    }
                />
            </Col>
            <Col xs={1} sm={1}>
                <Button
                    aria-label={`database-table-structure-button-delete-${index}`}
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

export default DatabaseStructureFormInput;

import { useEffect, useState } from "react";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button, Col, Row } from "react-bootstrap";

import { useTranslation } from "react-i18next";
import { Field } from "../../../../common/zustand/interface/DatabaseTableInterface";
import { ButtonVariant } from "../../../../common/component/helper/EmobiqModal";

import { StringBoolean } from "../../../../common/data/Enum";

import DatabaseStructureFormInput from "./DatabaseStructureFormInput";
import DatabaseStructureFormLabel from "./DatabaseStructureFormLabel";

type DatabaseStructureInputProps = {
    formData: Field[];
    handleDelete: (index: number) => void;
    handleChange: (index: number, name: string, value: string) => void;
    handleAdd: () => void;
};

const DatabaseStructureForm = ({
    formData,
    handleDelete,
    handleChange,
    handleAdd,
}: DatabaseStructureInputProps) => {
    const { t } = useTranslation();

    // To identify if primary key exist already
    // disabling composite key first.
    const [primaryKeyExist, setPrimaryKeyExist] = useState<boolean>(false);

    // When formData is changed
    useEffect(() => {
        // Check if there is any primary key already
        const primaryKey: Field | undefined = formData.find(
            (item) => item.primary
        );
        setPrimaryKeyExist(!!primaryKey);
    }, [formData]);

    return (
        <>
            <Row>
                <Col xs={10} sm={10}>
                    <DatabaseStructureFormLabel />
                </Col>
            </Row>
            {formData.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Row key={`field-${index}`}>
                    <Col xs={10} sm={10}>
                        <DatabaseStructureFormInput
                            index={index}
                            primary={item.primary}
                            primaryExist={primaryKeyExist}
                            name={item.name}
                            type={item.type}
                            length={item.length}
                            optional={
                                item.optional === true ||
                                item.optional === undefined
                                    ? StringBoolean.TRUE
                                    : StringBoolean.FALSE
                            }
                            defaultValue={item.default}
                            handleDelete={handleDelete}
                            handleChange={handleChange}
                        />
                    </Col>
                </Row>
            ))}
            <Row>
                <Col xs={2} sm={2}>
                    <Button
                        variant={ButtonVariant.OUTLINE_LIGHT_EMOBIQ_BRAND}
                        className="mt-4 text-sm"
                        onClick={handleAdd}
                    >
                        <FontAwesomeIcon icon={faPlus} className="me-3" />
                        {t("common.button.add")}
                    </Button>
                </Col>
                <Col xs={10} sm={10} />
            </Row>
        </>
    );
};

export default DatabaseStructureForm;

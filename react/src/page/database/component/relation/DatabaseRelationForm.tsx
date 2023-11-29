import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Button, Col, Row } from "react-bootstrap";

import { useTranslation } from "react-i18next";
import { Relation } from "../../../../common/zustand/interface/DatabaseTableInterface";
import { ButtonVariant } from "../../../../common/component/helper/EmobiqModal";

import useStore from "../../../../common/zustand/Store";

import DatabaseRelationFormLabel from "./DatabaseRelationFormLabel";
import DatabaseRelationFormInput from "./DatabaseRelationFormInput";

type DatabaseRelationInputProps = {
    formData: Relation[];
    handleDelete: (index: number) => void;
    handleChange: (index: number, name: string, value: string) => void;
    handleAdd: () => void;
};

const DatabaseRelationForm = ({
    formData,
    handleDelete,
    handleChange,
    handleAdd,
}: DatabaseRelationInputProps) => {
    const { t } = useTranslation();

    // TODO : use formik

    const { tableList, selectedDatabaseTable } = useStore((state) => ({
        tableList: state.databaseTable,
        selectedDatabaseTable: state.databaseTable.find(
            ({ uuid }) => uuid === state.selectedDatabaseTableUuid
        ),
    }));

    return (
        <>
            <Row>
                <Col xs={12} sm={12}>
                    <DatabaseRelationFormLabel />
                </Col>
            </Row>
            {formData.map((item, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <Row key={`relation-${index}`}>
                    <Col xs={12} sm={12}>
                        <DatabaseRelationFormInput
                            name={item.name}
                            field={item.field}
                            foreignTable={item.foreign_table}
                            foreignField={item.foreign_field}
                            tableList={tableList}
                            tableFields={
                                selectedDatabaseTable?.data?.structure || []
                            }
                            index={index}
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

export default DatabaseRelationForm;

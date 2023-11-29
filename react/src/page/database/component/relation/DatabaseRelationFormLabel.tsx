import { Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const DatabaseStructureFormLabel = () => {
    const { t } = useTranslation();

    return (
        <Form.Group controlId="labelForm">
            <Row className="align-items-center">
                <Col xs={2} sm={2}>
                    <Form.Label className="text-rg m-0 text-uppercase mb-3 text-spanish-gray">
                        {t("database.dashboard.action.relations.header.name")}
                    </Form.Label>
                </Col>
                <Col xs={2} sm={2}>
                    <Form.Label className="text-rg m-0 text-uppercase mb-3 text-spanish-gray">
                        {t("database.dashboard.action.relations.header.field")}
                    </Form.Label>
                </Col>
                <Col xs={2} sm={2}>
                    <Form.Label className="text-rg m-0 text-uppercase mb-3 text-spanish-gray">
                        {t(
                            "database.dashboard.action.relations.header.foreigntable"
                        )}
                    </Form.Label>
                </Col>
                <Col xs={2} sm={2}>
                    <Form.Label className="text-rg m-0 text-uppercase mb-3 text-spanish-gray">
                        {t(
                            "database.dashboard.action.relations.header.foreignfield"
                        )}
                    </Form.Label>
                </Col>
                <Col xs={1} sm={1} />
            </Row>
        </Form.Group>
    );
};

export default DatabaseStructureFormLabel;

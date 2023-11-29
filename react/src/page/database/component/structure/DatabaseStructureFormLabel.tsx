import { Col, Form, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import keyImage from "../../../../common/assets/images/icons/key.svg";

const DatabaseStructureFormLabel = () => {
    const { t } = useTranslation();

    return (
        <Form.Group controlId="labelForm">
            <Row className="align-items-center">
                <Col className="mw-55 text-center">
                    <img
                        className="mb-3"
                        src={keyImage}
                        alt={t(
                            "database.dashboard.action.structure.header.primary"
                        )}
                    />
                </Col>
                <Col>
                    <Form.Label className="text-rg m-0 text-uppercase mb-3 text-spanish-gray">
                        {t("database.dashboard.action.structure.header.name")}
                    </Form.Label>
                </Col>
                <Col>
                    <Form.Label className="text-rg m-0 text-uppercase mb-3 text-spanish-gray">
                        {t("database.dashboard.action.structure.header.type")}
                    </Form.Label>
                </Col>
                <Col xs={2} sm={2}>
                    <Form.Label className="text-rg m-0 text-uppercase mb-3 text-spanish-gray">
                        {t("database.dashboard.action.structure.header.length")}
                    </Form.Label>
                </Col>
                <Col xs={2} sm={2}>
                    <Form.Label className="text-rg m-0 text-uppercase mb-3 text-spanish-gray">
                        {t(
                            "database.dashboard.action.structure.header.optional"
                        )}
                    </Form.Label>
                </Col>
                <Col>
                    <Form.Label className="text-rg m-0 text-uppercase mb-3 text-spanish-gray">
                        {t(
                            "database.dashboard.action.structure.header.default"
                        )}
                    </Form.Label>
                </Col>
                <Col xs={1} sm={1} />
            </Row>
        </Form.Group>
    );
};

export default DatabaseStructureFormLabel;

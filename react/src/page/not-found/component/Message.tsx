import { useTranslation } from "react-i18next";
import { Container, Row, Col } from "react-bootstrap";

const Message = () => {
    const { t } = useTranslation();

    return (
        <Container fluid>
            <Row className="py-3">
                <Col>
                    <h3>{t("not.found.page.message")}</h3>
                    <p>{t("not.found.page.description")}</p>
                    <a
                        className="link-primary"
                        href={process.env.REACT_APP_MAIN_FRONTEND_URL ?? "/"}
                    >
                        {t("not.found.page.link.back")}
                    </a>
                </Col>
            </Row>
        </Container>
    );
};

export default Message;

import { useTranslation } from "react-i18next";
import { Container, Row, Col } from "react-bootstrap";

type ConfigurationLayoutProps = {
    children: JSX.Element | JSX.Element[];
};

const ConfigurationLayout = ({ children }: ConfigurationLayoutProps) => {
    const { t } = useTranslation();

    return (
        <Container>
            <Row>
                <Col className="text-h1 mt-5 mb-5">
                    {t("configuration.main.title")}
                </Col>
            </Row>

            {children}
        </Container>
    );
};

export default ConfigurationLayout;

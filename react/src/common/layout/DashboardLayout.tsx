import { useTranslation } from "react-i18next";
import { Container, Row, Col } from "react-bootstrap";

type DashboardLayoutProps = {
    children: JSX.Element | JSX.Element[];
};

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const { t } = useTranslation();

    return (
        <Container>
            <Row>
                <Col className="dashboard-title text-xxxl text-uppercase mt-5 mb-5">
                    <h4>{t("dashboard.main.title")}</h4>
                </Col>
            </Row>

            {children}
        </Container>
    );
};

export default DashboardLayout;

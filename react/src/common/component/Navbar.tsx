import { Row, Col, Container, Nav } from "react-bootstrap";
import { Link, useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BuildStatus from "./BuildStatus";

const Navbar = () => {
    const { t } = useTranslation();
    let { appid } = useParams();
    const location = useLocation();

    // Check if there's appid
    appid = appid ? `/${appid}` : "";

    // Default list of nav
    const navs: { [key: string]: string } = {
        dashboard: "",
        module: "",
        service: "",
        configuration: "",
    };

    // Find which nav is active
    Object.keys(navs).forEach((key) => {
        // Check if pathname is the nav key, if true then make it active
        if (location.pathname.indexOf(`/${key}`) === 0) {
            navs[key] = "active";
        }
    });

    return (
        <section id="navbar">
            <Container className="p-0 gx-0" fluid>
                <Row>
                    <Col className="p-0">
                        <Nav defaultActiveKey="/" as="ul">
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${navs.dashboard}`}
                                    to={`/dashboard${appid}`}
                                >
                                    {t("header.nav.button.dashboard")}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${navs.module}`}
                                    to={`/module${appid}`}
                                >
                                    {t("header.nav.button.module")}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${navs.service}`}
                                    to={`/service${appid}`}
                                >
                                    {t("header.nav.button.service")}
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    className={`nav-link ${navs.configuration}`}
                                    to={`/configuration${appid}`}
                                >
                                    {t("header.nav.button.configuration")}
                                </Link>
                            </li>
                        </Nav>
                    </Col>
                    <Col className="p-0 bg-light-gray">
                        <BuildStatus />
                    </Col>
                </Row>
            </Container>
        </section>
    );
};

export default Navbar;

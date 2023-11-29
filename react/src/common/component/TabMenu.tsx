import { Card, Col, ListGroup, Nav, Row, Tab } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

type BodyProps = {
    className?: string;
};

type TabItem = {
    title: string;
    component?: JSX.Element;
};

type TabProps = {
    tabs: TabItem[];
    activeTab?: string;
    onTabChange: (tab: string) => void;
    className?: string;
};

type MenuProps = {
    dark?: boolean;
    body?: BodyProps;
    primary: TabProps;
    secondary?: TabProps;
    scrollable?: boolean;
    unmountOnExit?: boolean;
};

const SecondaryTabMenu = ({
    tabs,
    activeTab,
    onTabChange,
    className,
}: TabProps) => {
    const { t } = useTranslation();

    // Prepare default active key
    const [secondaryActiveKey, setSecondaryActiveKey] = useState<string>();

    useEffect(() => {
        setSecondaryActiveKey(activeTab || tabs[0]?.title);
    }, [activeTab]);

    return (
        <Tab.Container
            activeKey={secondaryActiveKey}
            defaultActiveKey={secondaryActiveKey}
            onSelect={(tab) => {
                if (tab) {
                    setSecondaryActiveKey(tab);
                    onTabChange(tab);
                }
            }}
        >
            <Row className="h-100" aria-label="secondary-tab-menu">
                {/* Vertical menu on left hand side */}
                <Col xs={2} md={3} lg={2}>
                    <Row className="flex-column h-100">
                        <Col xs={12} className="pe-0">
                            <ListGroup className="text-rg">
                                {tabs.map((tab, index) => (
                                    <ListGroup.Item
                                        action
                                        key={tab.title}
                                        eventKey={tab.title}
                                        className={`text-uppercase text-truncate ${
                                            index === 0
                                                ? "rounded-top-end-0"
                                                : ""
                                        } ${
                                            index === tabs.length - 1
                                                ? "rounded-bottom-end-0"
                                                : ""
                                        } ${
                                            secondaryActiveKey === tab.title
                                                ? "fw-bold border-end-0"
                                                : "fw-lighter"
                                        }`}
                                    >
                                        {t(tab.title)}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Col>

                        {/* Additional <Col /> is required to fill up the remaining space */}
                        <Col
                            xs={12}
                            className="flex-grow-1 pe-0 border-end-light-gray"
                        />

                        {/* Ensure there's a rounded border radius on bottom left */}
                        <Col xs={12} className="pe-0 pb-1" />
                    </Row>
                </Col>

                {/* Menu's tab component */}
                <Col xs={10} md={9} lg={10} className="ps-0 h-100">
                    <Card
                        className={`h-100 border-start-0 rounded-top-start-0 ${
                            className || ""
                        }`}
                        aria-label="secondary-menu"
                    >
                        <Card.Body className="p-4">
                            <Tab.Content className="h-100">
                                {tabs.map((tab) => (
                                    <Tab.Pane
                                        key={tab.title}
                                        eventKey={tab.title}
                                        className="h-100"
                                    >
                                        {tab.component}
                                    </Tab.Pane>
                                ))}
                            </Tab.Content>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Tab.Container>
    );
};

/**
 * Reusable Menu tabs
 * @param {TabItem[]} primary.tabs the list of primary tabs to be rendered
 * @param {string} primary.activeTab the primary active tab
 * @param {(tab) => void} primary.onTabChange on tab change handler for primary tab
 * @param {TabItem[]} secondary.tabs the optional list of secondary tabs to be rendered. If secondary menu is provided, component in primary menu will be ignored.
 * @param {string} secondary.activeTab the secondary active tab
 * @param {(tab) => void} secondary.onTabChange on tab change handler for secondary tab
 *
 *  E.g.
 *  const [activeTab, setActiveTab] = useState("newProject");
 *
 *  const tabs: TabItem[] = [
 *      {
 *          title: "title",
 *          component: <TitleComponent />,
 *      },
 *      {
 *          title: "title-2",
 *          component: (
 *              <Title2Component />
 *          ),
 *      },
 *      {
 *          title: "title-3",
 *          component: <Title2Component />
 *      },
 *  ];
 *
 *  render(){
 *      <TabMenu
 *          primary={{
 *              tabs: tabs,
 *              onTabChange: setActiveTab
 *              activeTab: activeTab
 *          }}
 *      />
 *  }
 */
const TabMenu = ({
    dark,
    body,
    primary,
    secondary,
    scrollable = false,
    unmountOnExit = false,
}: MenuProps) => {
    const { t } = useTranslation();

    // Prepare default active key
    const [primaryActiveKey, setPrimaryActiveKey] = useState<string>();

    useEffect(() => {
        setPrimaryActiveKey(primary.activeTab || primary.tabs[0]?.title);
    }, [primary.activeTab]);

    return (
        <Card
            className={`h-100 ${primary.className || ""} tab-menu${
                dark ? " dark" : ""
            }`}
            aria-label="primary-menu"
        >
            <Tab.Container
                unmountOnExit={unmountOnExit}
                activeKey={primaryActiveKey}
                defaultActiveKey={primaryActiveKey}
                onSelect={(tab) => {
                    if (tab) {
                        setPrimaryActiveKey(tab);
                        primary.onTabChange(tab);
                    }
                }}
            >
                <Card.Header
                    className={`pt-0 px-0 bg-bright-gray ${
                        dark ? "border-0" : "border-light"
                    }`}
                >
                    <Nav variant="tabs" className="mx-0 overflow-nav-tabs">
                        {primary.tabs.map((tab) => (
                            <Nav.Item key={tab.title}>
                                <Nav.Link
                                    as="button"
                                    eventKey={tab.title}
                                    className={`text-uppercase ${
                                        tab.title === primaryActiveKey
                                            ? "fw-bold"
                                            : "fw-lighter"
                                    }`}
                                >
                                    {t(tab.title)}
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>
                </Card.Header>

                <Card.Body
                    className={`${body?.className || "py-4 px-4"} ${
                        scrollable ? "overflow-y-auto" : ""
                    }`}
                >
                    <Tab.Content className="h-100">
                        {secondary ? (
                            <SecondaryTabMenu
                                tabs={secondary.tabs}
                                activeTab={secondary.activeTab}
                                onTabChange={secondary.onTabChange}
                                className={secondary.className}
                            />
                        ) : (
                            primary.tabs.map((tab) => (
                                <Tab.Pane key={tab.title} eventKey={tab.title}>
                                    {tab.component}
                                </Tab.Pane>
                            ))
                        )}
                    </Tab.Content>
                </Card.Body>
            </Tab.Container>
        </Card>
    );
};

export type { TabItem };
export default TabMenu;

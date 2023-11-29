import { useState } from "react";
import { Card, Col, ListGroup, Row, Tab, Image } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import iconCog from "../../../common/assets/images/icons/gray-cog.svg";
import iconCogActive from "../../../common/assets/images/icons/gray-cog-active.svg";
import iconKey from "../../../common/assets/images/icons/gray-key.svg";
import iconKeyActive from "../../../common/assets/images/icons/gray-key-active.svg";
import iconLock from "../../../common/assets/images/icons/gray-lock.svg";
import iconLockActive from "../../../common/assets/images/icons/gray-lock-active.svg";
import { TabItem } from "../../../common/component/TabMenu";

import ConfigurationApplication from "./ConfigurationApplication";
import ConfigurationAuthentication from "./ConfigurationAuthentication";
import ConfigurationSSL from "./ConfigurationSSL";

import useStore from "../../../common/zustand/Store";
import {
    Configuration as IConfiguration,
    ConfigurationType,
    GlobalConfigurationType,
} from "../../../common/zustand/interface/ConfigurationInterface";
import generateUniqueId from "../../../common/helper/UniqueId";
import { ConfigurationFields } from "..";

type ConfigTabItem = TabItem & { icon: string[] };

const ConfigurationTab = () => {
    const { t } = useTranslation();

    const { configuration, addNewConfiguration, updateConfiguration } =
        useStore((state) => ({
            configuration: state.configuration,
            addNewConfiguration: state.addNewConfiguration,
            updateConfiguration: state.updateConfiguration,
        }));

    // On save config filds
    const handleSaveFields = (
        fields: ConfigurationFields,
        configType: GlobalConfigurationType
    ) => {
        // Iterate through the fields
        const config = configuration.find(({ name }) => name === configType);

        // check if the config is not found
        if (!config) {
            const newConfig: IConfiguration = {
                uuid: generateUniqueId("config-application"),
                name: configType,
                title: configType,
                data: fields,
                type: ConfigurationType.GLOBAL,
                order: 0,
            };

            // add the config
            addNewConfiguration(newConfig);
        } else {
            const updatedConfig: IConfiguration = {
                ...config,
                name: configType,
                title: configType,
                data: fields,
                type: ConfigurationType.GLOBAL,
            };

            // update the config
            updateConfiguration(updatedConfig);
        }
    };

    // Get the configuration list based on the type
    const getConfigurationList = (configType: GlobalConfigurationType) => {
        return configuration.filter(
            ({ type, name }) =>
                type === ConfigurationType.GLOBAL && name === configType
        );
    };

    // Prepare primary tabs list
    const tabs: ConfigTabItem[] = [
        {
            icon: [iconCog, iconCogActive],
            title: GlobalConfigurationType.APPLICATION,
            component: (
                <ConfigurationApplication
                    handleSaveFields={handleSaveFields}
                    configurationList={getConfigurationList(
                        GlobalConfigurationType.APPLICATION
                    )}
                />
            ),
        },
        {
            icon: [iconKey, iconKeyActive],
            title: GlobalConfigurationType.AUTHENTICATION,
            component: (
                <ConfigurationAuthentication
                    handleSaveFields={handleSaveFields}
                    configurationList={getConfigurationList(
                        GlobalConfigurationType.AUTHENTICATION
                    )}
                />
            ),
        },
        {
            icon: [iconLock, iconLockActive],
            title: GlobalConfigurationType.SSL,
            component: (
                <ConfigurationSSL
                    handleSaveFields={handleSaveFields}
                    configurationList={getConfigurationList(
                        GlobalConfigurationType.SSL
                    )}
                />
            ),
        },
    ];

    // Prepare activetab state
    const [activeTab, setActiveTab] = useState(tabs[0].title);

    return (
        <Tab.Container
            activeKey={activeTab}
            onSelect={(tab) => {
                if (tab) {
                    setActiveTab(tab);
                }
            }}
        >
            <Row id="configuration-tab" className="h-100">
                <Col xs={3} md={4} lg={3}>
                    <Row className="flex-column h-100">
                        <Col xs={12} className="pe-0">
                            <ListGroup className="text-rg configuration-tab-buttons">
                                {tabs.map((tab) => {
                                    const isActive = activeTab === tab.title;

                                    return (
                                        <ListGroup.Item
                                            action
                                            key={tab.title}
                                            eventKey={tab.title}
                                            className={`px-25 py-21 text-uppercase rounded-0 d-flex align-items-end ${
                                                isActive
                                                    ? "bg-transparent fw-bold border-end-0"
                                                    : "bg-cultured fw-lighter"
                                            }`}
                                        >
                                            <Image
                                                aria-label={`icon-${
                                                    tab.icon[isActive ? 1 : 0]
                                                }`}
                                                src={tab.icon[isActive ? 1 : 0]}
                                            />
                                            <div
                                                className={`ms-3 text-${
                                                    isActive
                                                        ? "davy-gray"
                                                        : "philippine-gray"
                                                }`}
                                            >
                                                {t(
                                                    `configuration.main.tab.${tab.title}`
                                                )}
                                            </div>
                                        </ListGroup.Item>
                                    );
                                })}
                            </ListGroup>
                        </Col>

                        <Col
                            xs={12}
                            className="flex-grow-1 pe-0 border-end-light-gray"
                        />

                        <Col xs={12} className="pe-0 pb-1" />
                    </Row>
                </Col>

                {/* Menu's tab component */}
                <Col xs={9} md={8} lg={9} className="ps-0">
                    <Card
                        className="border-start-0 rounded-0 configuration-tab-content"
                        aria-label="secondary-menu"
                    >
                        <Card.Body className="px-100 py-35">
                            <Tab.Content>
                                {tabs.map((tab) => (
                                    <Tab.Pane
                                        key={tab.title}
                                        eventKey={tab.title}
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

export type { ConfigTabItem };
export default ConfigurationTab;

import { useTranslation } from "react-i18next";
import { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import TabMenu, { TabItem } from "../../../../common/component/TabMenu";
import EmobiqModal, {
    EmobiqModalSize,
} from "../../../../common/component/helper/EmobiqModal";
import ApiAuthenticationInfoTable from "../ApiAuthenticationInfoTable";

interface ApiModuleCreateProps {
    show: boolean;
    handleClose: () => void;
}

enum AuthenticationInfoTab {
    tokenEndpoint,
    refreshTokenEndpoint,
    invalidateTokenEndpoint,
}

const ApiAuthenticationInfo = ({ show, handleClose }: ApiModuleCreateProps) => {
    const { t } = useTranslation();

    const onCloseModal = () => {
        // close modal
        handleClose();
    };

    const [primaryActiveTab, setPrimaryActiveTab] = useState("");

    const bodyText = (key: string): string => {
        return `api.dashboard.modalAuthInfo.body.${key}`;
    };

    // This will build modal content for each tab,
    // in which will contain a form field for URI and a table for parameter descriptions
    const modalContentForTab = (tab: AuthenticationInfoTab) => {
        const parameterKeys: {
            [tab in AuthenticationInfoTab]: string[];
        } = {
            [AuthenticationInfoTab.tokenEndpoint]: [
                "grantTypePassword",
                "scope",
                "username",
                "password",
            ],
            [AuthenticationInfoTab.refreshTokenEndpoint]: [
                "grantTypeRefreshToken",
                "scope",
                "refreshToken",
            ],
            [AuthenticationInfoTab.invalidateTokenEndpoint]: ["refreshToken"],
        };

        const tabName = AuthenticationInfoTab[tab];

        return (
            <div>
                <InputGroup className="mb-4 border-half rounded-1 border-chinese-silver">
                    <InputGroup.Text
                        className="text-rg text-spanish-gray bg-dark-platinum
                                   border-half border-chinese-silver rounded-1 z-index-1"
                    >
                        {t(
                            `api.dashboard.modalAuthInfo.endpoints.${tabName}.method`
                        )}
                    </InputGroup.Text>
                    <Form.Control
                        readOnly
                        aria-label={`uri-field-${tabName}`}
                        value={t(
                            `api.dashboard.modalAuthInfo.endpoints.${tabName}.uri`
                        )}
                        className="text-rg text-spanish-gray border-0 border-chinese-silver"
                    />
                </InputGroup>
                <ApiAuthenticationInfoTable
                    label={`table-headers-${tabName}`}
                    tableName={bodyText("headers.title")}
                    headers={[
                        {
                            name: bodyText("headers.tableHead.key"),
                            columnWidth: "20%",
                        },
                        {
                            name: bodyText("headers.tableHead.value"),
                            columnWidth: "30%",
                        },
                        {
                            name: bodyText("headers.tableHead.description"),
                            columnWidth: "50%",
                        },
                    ]}
                    body={[
                        [
                            bodyText("headers.tableBody.authorization.key"),
                            bodyText("headers.tableBody.authorization.value"),
                            bodyText(
                                "headers.tableBody.authorization.description"
                            ),
                        ],
                    ]}
                />
                <ApiAuthenticationInfoTable
                    label={`table-parameters-${tabName}`}
                    tableName={bodyText("parameters.title")}
                    headers={[
                        {
                            name: bodyText("headers.tableHead.key"),
                            columnWidth: "20%",
                        },
                        {
                            name: bodyText("headers.tableHead.value"),
                            columnWidth: "30%",
                        },
                        {
                            name: bodyText("headers.tableHead.description"),
                            columnWidth: "50%",
                        },
                    ]}
                    body={parameterKeys[tab].map((key) => [
                        bodyText(`parameters.tableBody.${key}.key`),
                        bodyText(`parameters.tableBody.${key}.value`),
                        bodyText(`parameters.tableBody.${key}.description`),
                    ])}
                />
            </div>
        );
    };

    const primaryTabs: TabItem[] = [
        {
            title: "api.dashboard.modalAuthInfo.tabs.tokenEndpoint",
            component: modalContentForTab(AuthenticationInfoTab.tokenEndpoint),
        },
        {
            title: "api.dashboard.modalAuthInfo.tabs.refreshTokenEndpoint",
            component: modalContentForTab(
                AuthenticationInfoTab.refreshTokenEndpoint
            ),
        },
        {
            title: "api.dashboard.modalAuthInfo.tabs.invalidateTokenEndpoint",
            component: modalContentForTab(
                AuthenticationInfoTab.invalidateTokenEndpoint
            ),
        },
    ];

    return (
        <EmobiqModal
            show={show}
            modalHeaderTitle="api.dashboard.modalAuthInfo.title"
            handleClose={onCloseModal}
            size={EmobiqModalSize.xl}
        >
            <TabMenu
                primary={{
                    tabs: primaryTabs,
                    activeTab: primaryActiveTab,
                    onTabChange: setPrimaryActiveTab,
                }}
            />
        </EmobiqModal>
    );
};

export default ApiAuthenticationInfo;
export { AuthenticationInfoTab };

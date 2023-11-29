import { useState } from "react";
import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

import ApiPlaceholder from "../../../common/assets/images/api-placeholder.svg";
import ApiPlaceholderActive from "../../../common/assets/images/api-placeholder-active.svg";
import BreadCrumb from "../../../common/component/BreadCrumb";
import CreateModulePlaceholder from "../../../common/component/CreateModulePlaceholder";

import useStore from "../../../common/zustand/Store";
import { FolderType } from "../../../common/zustand/interface/FolderInterface";
import ApiAuthenticationInfo from "./modals/ApiAuthenticationInfo";
import { ButtonVariant } from "../../../common/component/helper/EmobiqModal";

import ApiCreate from "./modals/ApiCreate";
import ApiRename from "./modals/ApiRename";
import ApiDelete from "./modals/ApiDelete";
import ApiMenu from "./ApiMenu";
import ApiList from "./ApiList";
import ApiConfigurationDropdown from "./ApiConfigurationDropdown";
import useActiveConfiguration from "../../../common/hooks/ActiveConfiguration";
import {
    ApiConfigurationData,
    AuthType,
    ConfigurationType,
} from "../../../common/zustand/interface/ConfigurationInterface";

const ApiDashboard = () => {
    const { t } = useTranslation();

    const [createModalVisible, setCreateVisibility] = useState<boolean>(false);
    const [deleteModalVisible, setDeleteVisibility] = useState<boolean>(false);
    const [renameModalVisible, setRenameVisibility] = useState<boolean>(false);
    const [authInfoModalVisible, setAuthInfoVisibility] =
        useState<boolean>(false);

    const showCreateModal = () => setCreateVisibility(true);
    const hideCreateModal = () => setCreateVisibility(false);
    const showRenameModal = () => setRenameVisibility(true);
    const hideRenameModal = () => setRenameVisibility(false);
    const showDeleteModal = () => setDeleteVisibility(true);
    const hideDeleteModal = () => setDeleteVisibility(false);

    const showAuthInfoModal = () => setAuthInfoVisibility(true);
    const hideAuthInfoModal = () => setAuthInfoVisibility(false);

    const { api, folder, selectedApiUuid, selectedApiFolderUuid } = useStore(
        (state) => ({
            api: state.api,
            folder: state.folder,
            selectedApiUuid: state.selectedApiUuid,
            selectedApiFolderUuid: state.selectedApiFolderUuid,
        })
    );

    // Get currently active API configuration
    const activeConfiguration = useActiveConfiguration(ConfigurationType.API);

    // Prepare api list
    const apiActionAndFolder = [
        ...api,
        ...folder.filter((f) => f.type === FolderType.API),
    ];

    // prepare hasApiData variable
    const hasApiData = apiActionAndFolder.length > 0;

    // selected folder or api
    const selected = apiActionAndFolder.find(
        ({ uuid }) => uuid === (selectedApiUuid || selectedApiFolderUuid)
    );

    return (
        <Row>
            <ApiList />

            <Col md={10}>
                {/* FIXME: The grid layout here is a mess. Please fix the grid css from the root layout. */}
                {/* FIXME: Adding flex-column & flex-grow & h-100 to allow component to fill up remaining space in the screen. However, this should be implemented in higher level. */}

                <Row className="flex-column h-100">
                    <Col xs={12}>
                        {hasApiData && (
                            <>
                                <Row className="justify-space-between align-items-center py-3 border-bottom g-0">
                                    <Col>
                                        <div
                                            className="text-md text-uppercase fw-bold text-granite-gray"
                                            aria-label="api-dashboard-header-title"
                                        >
                                            {selected
                                                ? selected.name // use selected endpoint name
                                                : t(
                                                      "api.dashboard.header.title"
                                                  )}
                                        </div>
                                    </Col>
                                    <Col className="text-end">
                                        {/* Only show these buttons if there is a selected API */}
                                        {selected && selected.folder_uuid && (
                                            <>
                                                <Button
                                                    aria-label="header-delete-button"
                                                    variant={
                                                        ButtonVariant.OUTLINE_LIGHT_EMOBIQ_BRAND
                                                    }
                                                    className="text-sm"
                                                    onClick={showDeleteModal}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faTrash}
                                                    />
                                                    <span className="ms-2 d-none d-sm-inline">
                                                        {t(
                                                            "common.button.delete"
                                                        )}
                                                    </span>
                                                </Button>
                                                <Button
                                                    aria-label="header-rename-button"
                                                    variant={
                                                        ButtonVariant.OUTLINE_LIGHT_EMOBIQ_BRAND
                                                    }
                                                    onClick={showRenameModal}
                                                    className="text-sm mx-3"
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faEdit}
                                                    />
                                                    <span className="ms-2 d-none d-sm-inline">
                                                        {t(
                                                            "common.button.rename"
                                                        )}
                                                    </span>
                                                </Button>
                                            </>
                                        )}

                                        <Button
                                            aria-label="header-create-button"
                                            variant={
                                                ButtonVariant.OUTLINE_LIGHT_EMOBIQ_BRAND
                                            }
                                            className="text-sm"
                                            onClick={showCreateModal}
                                        >
                                            <FontAwesomeIcon icon={faCog} />
                                            <span className="ms-2 d-none d-sm-inline">
                                                {t("common.button.create")}
                                            </span>
                                        </Button>
                                    </Col>
                                </Row>

                                <Row className="justify-space-between align-items-center py-2 border-bottom g-0">
                                    <Col xs={12} md={6} xl={8}>
                                        {selected && (
                                            <BreadCrumb
                                                selectedItem={selected}
                                                module="api"
                                            />
                                        )}
                                    </Col>

                                    <Col xs={12} md={6} xl={4}>
                                        <Form.Group controlId="authentication">
                                            <Stack
                                                direction="horizontal"
                                                gap={2}
                                            >
                                                <Button
                                                    aria-label="auth-info-button"
                                                    onClick={showAuthInfoModal}
                                                    variant={
                                                        ButtonVariant.EMOBIQ_BRAND
                                                    }
                                                    /* This button will be hidden from view, however it will still exist in DOM.
                                                     * Attempting to toggle by inserting/removing this component
                                                     * from DOM will cause layout inconsistency within other items in this row,
                                                     * so we will only control this visibility class attribute */
                                                    className={`p-1 d-flex ${
                                                        (
                                                            activeConfiguration?.data as ApiConfigurationData
                                                        )?.authType ===
                                                        AuthType.OAUTH2
                                                            ? "visible"
                                                            : "invisible"
                                                    }`}
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faCog}
                                                    />
                                                </Button>
                                                <Form.Label className="text-rg m-0 text-granite-gray">
                                                    {t(
                                                        "api.dashboard.header.label.authentication"
                                                    )}
                                                </Form.Label>
                                                <ApiConfigurationDropdown />
                                            </Stack>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <ApiRename
                                    show={renameModalVisible}
                                    handleClose={hideRenameModal}
                                />
                            </>
                        )}
                    </Col>

                    <Col xs={12} className="flex-grow-1 mt-4">
                        {selectedApiUuid ? (
                            <ApiMenu />
                        ) : (
                            <CreateModulePlaceholder
                                image={ApiPlaceholder}
                                onHoverImage={ApiPlaceholderActive}
                                onClick={showCreateModal}
                            />
                        )}
                    </Col>
                </Row>

                <ApiCreate
                    show={createModalVisible}
                    handleClose={hideCreateModal}
                />
                <ApiDelete
                    show={deleteModalVisible}
                    handleClose={hideDeleteModal}
                />
                <ApiAuthenticationInfo
                    show={authInfoModalVisible}
                    handleClose={hideAuthInfoModal}
                />
            </Col>
        </Row>
    );
};

export default ApiDashboard;

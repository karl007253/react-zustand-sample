import { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
    faTrash,
    faEdit,
    faDatabase,
    faTable,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import DatabasePlaceholder from "../../../common/assets/images/database-placeholder.svg";
import DatabasePlaceholderActive from "../../../common/assets/images/database-placeholder-active.svg";

import useStore from "../../../common/zustand/Store";

import CreateModulePlaceholder from "../../../common/component/CreateModulePlaceholder";
import BreadCrumb from "../../../common/component/BreadCrumb";

import { DATABASE_PARENT } from "../../../common/data/Constant";

import DatabaseCreate from "./modals/DatabaseCreate";
import DatabaseRename from "./modals/DatabaseRename";
import DatabaseDelete from "./modals/DatabaseDelete";
import DatabaseConfiguration from "./modals/DatabaseConfiguration";
import DatabaseMenu from "./DatabaseMenu";
import DatabaseList from "./DatabaseList";

const DatabaseDashboard = () => {
    const { t } = useTranslation();

    const [createModalVisible, setCreateVisibility] = useState<boolean>(false);
    const [renameModalVisible, setRenameVisibility] = useState<boolean>(false);
    const [deleteModalVisible, setDeleteVisibility] = useState<boolean>(false);
    const [configurationModalVisible, setConfigurationVisibility] =
        useState<boolean>(false);

    const showCreateModal = () => setCreateVisibility(true);
    const hideCreateModal = () => setCreateVisibility(false);
    const showRenameModal = () => setRenameVisibility(true);
    const hideRenameModal = () => setRenameVisibility(false);
    const showDeleteModal = () => setDeleteVisibility(true);
    const hideDeleteModal = () => setDeleteVisibility(false);
    const showConfigurationModal = () => setConfigurationVisibility(true);
    const hideConfigurationModal = () => setConfigurationVisibility(false);

    const {
        database,
        databaseTable,
        selectedDatabaseUuid,
        selectedDatabaseTableUuid,
    } = useStore((state) => ({
        database: state.database,
        databaseTable: state.databaseTable,
        selectedDatabaseUuid: state.selectedDatabaseUuid,
        selectedDatabaseTableUuid: state.selectedDatabaseTableUuid,
    }));

    // Prepare database and table
    const databaseAndTable = [...database, ...databaseTable];

    // Check if there's selected database or table
    const selected =
        databaseAndTable.find(
            ({ uuid }) =>
                uuid === (selectedDatabaseUuid || selectedDatabaseTableUuid)
        ) ?? null;

    // Is this for creating database
    //   No database or table selected
    //   The database selected is Parent Database
    const isDatabaseCreate =
        !(selectedDatabaseUuid || selectedDatabaseTableUuid) ||
        selectedDatabaseUuid === DATABASE_PARENT;

    return (
        <Row>
            <DatabaseList />
            <Col md={10}>
                <Row className="flex-column h-100">
                    <Col xs={12}>
                        <>
                            <Row className="justify-space-between align-items-center py-3 border-bottom g-0">
                                <Col>
                                    <div
                                        className="text-md text-uppercase fw-bold text-granite-gray"
                                        aria-label="database-dashboard-header-title"
                                    >
                                        {selected
                                            ? selected.name
                                            : t(
                                                  "database.dashboard.header.title"
                                              )}
                                    </div>
                                </Col>
                                <Col className="text-end">
                                    {selected && (
                                        <>
                                            <Button
                                                aria-label="header-delete-button"
                                                variant="outline-light-emobiq-brand text-sm"
                                                onClick={showDeleteModal}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                />
                                                <span className="ms-2 d-none d-sm-inline">
                                                    {t("common.button.delete")}
                                                </span>
                                            </Button>
                                            <Button
                                                aria-label="header-rename-button"
                                                variant="outline-light-emobiq-brand text-sm"
                                                className="mx-3"
                                                onClick={showRenameModal}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faEdit}
                                                />
                                                <span className="ms-2 d-none d-sm-inline">
                                                    {t("common.button.rename")}
                                                </span>
                                            </Button>
                                        </>
                                    )}

                                    <Button
                                        aria-label="header-create-button"
                                        variant="outline-light-emobiq-brand text-sm"
                                        onClick={showCreateModal}
                                    >
                                        <FontAwesomeIcon
                                            icon={
                                                isDatabaseCreate
                                                    ? faDatabase
                                                    : faTable
                                            }
                                        />
                                        <span className="ms-2 d-none d-sm-inline">
                                            {t("common.button.create")}
                                        </span>
                                    </Button>
                                </Col>
                            </Row>

                            <Row className="justify-space-between align-items-center py-2 border-bottom g-0 breadcrumb-row">
                                <Col xs={12} md={8} lg={9}>
                                    <BreadCrumb
                                        selectedItem={selected}
                                        module="database"
                                        rootPath="database"
                                    />
                                </Col>
                                {/* Display the configuration button if the selected is a database */}
                                {selectedDatabaseUuid && (
                                    <Col className="text-end">
                                        <Button
                                            aria-label="header-configuration-button"
                                            variant="outline-light-emobiq-brand text-sm"
                                            onClick={showConfigurationModal}
                                        >
                                            <FontAwesomeIcon
                                                icon={faDatabase}
                                            />
                                            <span className="ms-2 d-none d-sm-inline">
                                                {t(
                                                    "common.button.configuration"
                                                )}
                                            </span>
                                        </Button>
                                    </Col>
                                )}
                            </Row>
                        </>
                    </Col>
                    <Col xs={12} className="flex-grow-1 mt-4">
                        {selectedDatabaseTableUuid ? (
                            <DatabaseMenu />
                        ) : (
                            <CreateModulePlaceholder
                                image={DatabasePlaceholder}
                                onHoverImage={DatabasePlaceholderActive}
                                onClick={showCreateModal}
                            />
                        )}
                    </Col>
                </Row>

                <DatabaseCreate
                    show={createModalVisible}
                    handleClose={hideCreateModal}
                />

                <DatabaseRename
                    show={renameModalVisible}
                    handleClose={hideRenameModal}
                />

                <DatabaseDelete
                    show={deleteModalVisible}
                    handleClose={hideDeleteModal}
                />

                <DatabaseConfiguration
                    show={configurationModalVisible}
                    handleClose={hideConfigurationModal}
                />
            </Col>
        </Row>
    );
};

export default DatabaseDashboard;

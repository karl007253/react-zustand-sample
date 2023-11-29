import { Button, Col, Form, Row, Stack } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

// TODO: Need to find another package (the latest update of this is 2020-02-17)
import BootstrapSwitchButton from "bootstrap-switch-button-react";

import SchedulerPlaceholder from "../../../common/assets/images/scheduler-placeholder.svg";
import SchedulerPlaceholderActive from "../../../common/assets/images/scheduler-placeholder-active.svg";

import useStore from "../../../common/zustand/Store";
import {
    Folder,
    FolderType,
} from "../../../common/zustand/interface/FolderInterface";
import { SchedulerStatus } from "../../../common/zustand/interface/SchedulerInterface";

import CreateModulePlaceholder from "../../../common/component/CreateModulePlaceholder";
import BreadCrumb from "../../../common/component/BreadCrumb";
import { ButtonVariant } from "../../../common/component/helper/EmobiqModal";

import SchedulerCreate from "./modals/SchedulerCreate";
import SchedulerRename from "./modals/SchedulerRename";
import SchedulerDelete from "./modals/SchedulerDelete";
import SchedulerList from "./SchedulerList";
import SchedulerMenu from "./SchedulerMenu";
import SchedulerConfigurationDropdown from "./SchedulerConfigurationDropdown";

interface FolderStatus {
    folderUuid: string;
    folderName: string;
    status: string;
}

const SchedulerDashboard = () => {
    const { t } = useTranslation();

    // initialize modal state to false/hide
    const [createModalVisible, setCreateVisibility] = useState<boolean>(false);
    const [renameModalVisible, setRenameVisibility] = useState<boolean>(false);
    const [deleteModalVisible, setDeleteVisibility] = useState<boolean>(false);
    const [enableSetting, setEnableSetting] = useState<boolean>(false);
    const [enableModify, setEnableModify] = useState<boolean>(false);

    // handle request to change the initial state of modal
    const showCreateModal = () => setCreateVisibility(true);
    const hideCreateModal = () => setCreateVisibility(false);
    const showRenameModal = () => setRenameVisibility(true);
    const hideRenameModal = () => setRenameVisibility(false);
    const showDeleteModal = () => setDeleteVisibility(true);
    const hideDeleteModal = () => setDeleteVisibility(false);

    // accessing the folder and scheduler data from store
    const {
        scheduler,
        folder,
        selectedSchedulerUuid,
        selectedSchedulerFolderUuid,
        updateSchedulerStatus,
        updateFolderStatus,
    } = useStore((state) => ({
        scheduler: state.scheduler,
        folder: state.folder,
        selectedSchedulerUuid: state.selectedSchedulerUuid,
        selectedSchedulerFolderUuid: state.selectedSchedulerFolderUuid,
        setSelectedSchedulerUuid: state.setSelectedSchedulerUuid,
        setSelectedSchedulerFolderUuid: state.setSelectedSchedulerFolderUuid,
        updateSchedulerStatus: state.updateSchedulerStatus,
        updateFolderStatus: state.updateFolderStatus,
    }));

    // Prepare scheduler list
    const schedulerActionAndFolder = [
        ...scheduler,
        ...folder.filter((f) => f.type === FolderType.SCHEDULER),
    ];

    // prepare hasSchedulerData variable
    const hasSchedulerData = schedulerActionAndFolder.length > 0;

    // selected folder or scheduler
    const selected = schedulerActionAndFolder.find(
        ({ uuid }) =>
            uuid === (selectedSchedulerUuid || selectedSchedulerFolderUuid)
    );

    const filterSchedulerFolder = (
        folders: Folder[],
        folderList: FolderStatus[],
        parent: string | null
    ) => {
        if (parent) {
            const parentFolder = folders.find((item) => item.uuid === parent);
            if (parentFolder) {
                const parentFolderUuid = parentFolder.folder_uuid;
                const currentStatus =
                    parentFolder.data?.status || SchedulerStatus.DISABLED;
                const folderData: FolderStatus = {
                    folderUuid: parentFolder.uuid,
                    folderName: parentFolder.name,
                    status: currentStatus,
                };
                folderList.push(folderData);
                if (parentFolderUuid) {
                    filterSchedulerFolder(
                        folders,
                        folderList,
                        parentFolderUuid
                    );
                }
            }
        }
        return folderList;
    };

    useEffect(() => {
        if (selected?.folder_uuid) {
            if (selectedSchedulerFolderUuid || selectedSchedulerUuid) {
                let currentStatus: SchedulerStatus = SchedulerStatus.ENABLED;
                const folderList: FolderStatus[] = [];
                // get selected status
                const selectedFolders = filterSchedulerFolder(
                    folder,
                    folderList,
                    selected?.folder_uuid
                );
                if (selectedFolders.length > 0) {
                    if (
                        selectedFolders[selectedFolders.length - 1]
                            .folderUuid === selected.folder_uuid
                    ) {
                        // showing selected data status
                        setEnableSetting(
                            selected.data?.status === SchedulerStatus.ENABLED
                        );
                        setEnableModify(true);
                    } else {
                        if (
                            // set status to disabled if parentfolder status is disable
                            selectedFolders[selectedFolders.length - 2]
                                .status === SchedulerStatus.DISABLED
                        ) {
                            currentStatus = SchedulerStatus.DISABLED;
                        }
                        // set status to disabled if parentfolder's subfolder status is disabled
                        for (let i = selectedFolders.length - 2; i >= 0; i--) {
                            if (
                                selectedFolders[i].status ===
                                SchedulerStatus.DISABLED
                            ) {
                                currentStatus = SchedulerStatus.DISABLED;
                            }
                        }
                        // set status to enable if parentfolder and subfolders are enabled
                        setEnableSetting(
                            currentStatus === SchedulerStatus.ENABLED
                        );
                        setEnableModify(
                            currentStatus === SchedulerStatus.ENABLED
                        );
                    }
                }
            }
        }
    }, [selectedSchedulerFolderUuid, selectedSchedulerUuid]);

    const handleEnableSettings = (enable: boolean) => {
        if (enableModify) {
            const status =
                enable === true
                    ? SchedulerStatus.ENABLED
                    : SchedulerStatus.DISABLED;

            if (selectedSchedulerFolderUuid) {
                updateFolderStatus(status);
            } else if (selectedSchedulerUuid) {
                updateSchedulerStatus(status);
            }
        }
    };

    return (
        <Row>
            <SchedulerList />

            <Col>
                <Row className="flex-column h-100">
                    <Col xs={12}>
                        {hasSchedulerData && (
                            <>
                                <Row className="justify-space-between align-items-center py-3 border-bottom g-0">
                                    <Col>
                                        <div
                                            className="text-md text-uppercase fw-bold text-granite-gray"
                                            aria-label="scheduler-dashboard-header-title"
                                        >
                                            {selected
                                                ? selected.name // use selected endpoint name
                                                : t(
                                                      "scheduler.dashboard.header.title"
                                                  )}
                                        </div>
                                    </Col>
                                    <Col>
                                        {selected && selected.folder_uuid && (
                                            <div
                                                className="settings text-sm text-left"
                                                aria-label="scheduler-setting-toggle"
                                            >
                                                <span className="label ms-2 d-none d-sm-inline">
                                                    {t(
                                                        "scheduler.dashboard.label.settings"
                                                    )}
                                                </span>
                                                <BootstrapSwitchButton
                                                    disabled={!enableModify}
                                                    key={
                                                        !enableModify
                                                            ? "disable-switch"
                                                            : "enable-switch"
                                                    }
                                                    checked={
                                                        enableSetting
                                                            ? selected.data
                                                                  ?.status ===
                                                              SchedulerStatus.ENABLED
                                                            : false
                                                    }
                                                    onChange={(
                                                        enable: boolean
                                                    ) =>
                                                        handleEnableSettings(
                                                            enable
                                                        )
                                                    }
                                                    onlabel={t(
                                                        "scheduler.dashboard.label.enabled"
                                                    )}
                                                    offlabel={t(
                                                        "scheduler.dashboard.label.disabled"
                                                    )}
                                                    size="sm"
                                                    onstyle="danger"
                                                    // eslint-disable-next-line react/style-prop-object
                                                    style="switchtoggle"
                                                    aria-label="switch-setting-toggle"
                                                />
                                            </div>
                                        )}
                                    </Col>
                                    <Col className="text-end">
                                        {/* Only show these buttons if there is a selected Scheduler */}
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
                                                    className="text-sm mx-3"
                                                    onClick={showRenameModal}
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
                                    <Col xs={12} md={6} lg={9}>
                                        {selected && (
                                            <BreadCrumb
                                                module="scheduler"
                                                selectedItem={selected}
                                            />
                                        )}
                                    </Col>
                                    <Col xs={12} md={6} lg={3}>
                                        <Row className="align-items-right">
                                            <Col xs={12} sm={1} />
                                            <Col xs={12} sm={11}>
                                                <Form.Group controlId="configuration">
                                                    <Stack
                                                        direction="horizontal"
                                                        gap={2}
                                                    >
                                                        <Form.Label
                                                            className="text-sm m-0 text-granite-gray"
                                                            aria-label="configuration-dropdown"
                                                        >
                                                            {t(
                                                                "scheduler.dashboard.label.configuration"
                                                            )}
                                                        </Form.Label>
                                                        <SchedulerConfigurationDropdown />
                                                    </Stack>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </>
                        )}
                    </Col>
                    <Col xs={12} className="flex-grow-1 mt-4">
                        {selectedSchedulerUuid ? (
                            <SchedulerMenu />
                        ) : (
                            // calling handler to show the create modal from button on image placeholder
                            <CreateModulePlaceholder
                                image={SchedulerPlaceholder}
                                onHoverImage={SchedulerPlaceholderActive}
                                onClick={showCreateModal}
                            />
                        )}
                    </Col>
                </Row>
                {/* including reusable modal in the scheduler create component */}
                <SchedulerCreate
                    show={createModalVisible}
                    handleClose={hideCreateModal}
                />
                <SchedulerRename
                    show={renameModalVisible}
                    handleClose={hideRenameModal}
                />
                <SchedulerDelete
                    show={deleteModalVisible}
                    handleClose={hideDeleteModal}
                />
            </Col>
        </Row>
    );
};

export default SchedulerDashboard;

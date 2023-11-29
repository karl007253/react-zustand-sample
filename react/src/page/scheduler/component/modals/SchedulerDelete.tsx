import { Form, Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import useToast from "../../../../common/hooks/Toast";
import useStore from "../../../../common/zustand/Store";
import EmobiqModal, {
    ButtonVariant,
} from "../../../../common/component/helper/EmobiqModal";

import { FolderType } from "../../../../common/zustand/interface/FolderInterface";

interface SchedulerModuleDeleteProps {
    show: boolean;
    handleClose: () => void;
}

const SchedulerDelete = ({ show, handleClose }: SchedulerModuleDeleteProps) => {
    const { t } = useTranslation();
    const toastMessage = useToast(true);

    const {
        selectedScheduler,
        selectedFolder,
        selectedSchedulerUuid,
        selectedSchedulerFolderUuid,
        deleteScheduler,
        deleteFolder,
    } = useStore((state) => ({
        selectedScheduler: state.scheduler.find(
            (a) => a.uuid === state.selectedSchedulerUuid
        ),
        selectedFolder: state.folder.find(
            (f) => f.uuid === state.selectedSchedulerFolderUuid
        ),
        selectedSchedulerUuid: state.selectedSchedulerUuid,
        selectedSchedulerFolderUuid: state.selectedSchedulerFolderUuid,
        deleteScheduler: state.deleteScheduler,
        deleteFolder: state.deleteFolder,
    }));

    // Get the selected scheduler/folder
    const selected = selectedSchedulerUuid ? selectedScheduler : selectedFolder;

    const handleDeleteButtonClick = () => {
        let type = "";

        if (selectedSchedulerFolderUuid) {
            type = "folder";
            deleteFolder(FolderType.SCHEDULER);
        } else if (selectedSchedulerUuid) {
            type = "action";
            deleteScheduler();
        }

        if (type) {
            toastMessage(
                t(
                    `scheduler.dashboard.modal.delete.form.message.success.${type}`
                ),
                toast.TYPE.SUCCESS
            );
        }

        // Close the modal
        handleClose();
    };

    const onCloseModal = () => {
        handleClose();
    };

    return (
        <EmobiqModal
            show={show}
            modalHeaderTitle={t("scheduler.dashboard.modal.delete.title", {
                type: selectedSchedulerUuid ? "Scheduler" : "Folder",
            })}
            handleClose={onCloseModal}
            modalFooterButton={[
                {
                    name: "common.button.cancel",
                    variant: ButtonVariant.OUTLINE_EMOBIQ_BRAND,
                    handleClick: onCloseModal,
                },
                {
                    name: "common.button.delete",
                    variant: ButtonVariant.EMOBIQ_BRAND,
                    handleClick: handleDeleteButtonClick,
                },
            ]}
        >
            <div>
                <Form>
                    <Container>
                        <Row>
                            <Col xs={12}>
                                <Form.Label>
                                    {t(
                                        "scheduler.dashboard.modal.delete.form.message.confirm",
                                        { name: `"${selected?.name}"` }
                                    )}
                                </Form.Label>
                            </Col>
                        </Row>
                    </Container>
                </Form>
            </div>
        </EmobiqModal>
    );
};

export default SchedulerDelete;

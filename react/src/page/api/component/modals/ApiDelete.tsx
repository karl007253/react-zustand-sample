import { Form, Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import useToast from "../../../../common/hooks/Toast";
import useStore from "../../../../common/zustand/Store";
import EmobiqModal, {
    ButtonVariant,
} from "../../../../common/component/helper/EmobiqModal";

import { FolderType } from "../../../../common/zustand/interface/FolderInterface";

interface ApiModuleDeleteProps {
    show: boolean;
    handleClose: () => void;
}

const ApiDelete = ({ show, handleClose }: ApiModuleDeleteProps) => {
    const { t } = useTranslation();
    const toastMessage = useToast(true);

    const {
        selectedApi,
        selectedFolder,
        selectedApiUuid,
        selectedApiFolderUuid,
        deleteApi,
        deleteFolder,
    } = useStore((state) => ({
        selectedApi: state.api.find((a) => a.uuid === state.selectedApiUuid),
        selectedFolder: state.folder.find(
            (f) => f.uuid === state.selectedApiFolderUuid
        ),
        selectedApiUuid: state.selectedApiUuid,
        selectedApiFolderUuid: state.selectedApiFolderUuid,
        deleteApi: state.deleteApi,
        deleteFolder: state.deleteFolder,
    }));

    // Get the selected api/folder
    const selected = selectedApiUuid ? selectedApi : selectedFolder;

    const handleDeleteButtonClick = () => {
        let type = "";

        if (selectedApiFolderUuid) {
            type = "folder";
            deleteFolder(FolderType.API);
        } else if (selectedApiUuid) {
            type = "action";
            deleteApi();
        }

        if (type) {
            toastMessage(
                t(`api.dashboard.modal.delete.form.message.success.${type}`),
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
            modalHeaderTitle={t("api.dashboard.modal.delete.title", {
                type: selectedApiUuid ? "API" : "Folder",
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
                                        "api.dashboard.modal.delete.form.message.confirm",
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

export default ApiDelete;

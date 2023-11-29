import { Form, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import * as Yup from "yup";
import { useFormik, validateYupSchema, yupToFormErrors } from "formik";
import useToast from "../../../../common/hooks/Toast";

import { Folder } from "../../../../common/zustand/interface/FolderInterface";
import { Scheduler } from "../../../../common/zustand/interface/SchedulerInterface";
import useStore from "../../../../common/zustand/Store";

import EmobiqModal, {
    ButtonVariant,
} from "../../../../common/component/helper/EmobiqModal";
import { SPECIAL_CHARACTERS_REGEX } from "../../../../common/data/Constant";

interface RenameSchedulerForm {
    name: string;
}

interface SchedulerModuleRenameProps {
    show: boolean;
    handleClose: () => void;
}

const SchedulerRename = ({ show, handleClose }: SchedulerModuleRenameProps) => {
    const { t } = useTranslation();

    const toastMessage = useToast(true);

    const {
        schedulerList,
        folderList,
        selectedSchedulerUuid,
        selectedSchedulerFolderUuid,
        selectedScheduler,
        selectedFolder,

        updateSchedulerName,
        updateFolderName,
    } = useStore((state) => ({
        schedulerList: state.scheduler,
        folderList: state.folder,
        selectedSchedulerUuid: state.selectedSchedulerUuid,
        selectedSchedulerFolderUuid: state.selectedSchedulerFolderUuid,

        selectedScheduler: state.scheduler.find(
            (a) => a.uuid === state.selectedSchedulerUuid
        ),
        selectedFolder: state.folder.find(
            (f) => f.uuid === state.selectedSchedulerFolderUuid
        ),

        updateSchedulerName: state.updateSchedulerName,
        updateFolderName: state.updateFolderName,
    }));

    // Get the selected scheduler or folder
    const selected: Scheduler | Folder | undefined = selectedSchedulerUuid
        ? selectedScheduler
        : selectedFolder;

    // Configure form to update a scheduler or folder
    const renameSchedulerForm = useFormik<RenameSchedulerForm>({
        enableReinitialize: true,

        initialValues: {
            name: selected?.name || "",
        },

        onSubmit: async (values, formikHelpers) => {
            const { resetForm } = formikHelpers;
            let type = "";

            if (selectedSchedulerUuid) {
                updateSchedulerName(values.name);
                type = "action";
            } else if (selectedSchedulerFolderUuid) {
                updateFolderName(selectedSchedulerFolderUuid, values.name);
                type = "folder";
            }

            if (type) {
                // show success message
                toastMessage(
                    t(
                        `scheduler.dashboard.modal.rename.form.message.success.${type}`
                    ),
                    toast.TYPE.SUCCESS
                );
            }

            // clear name
            resetForm();

            // close modal
            handleClose();
        },

        validate: async (values) => {
            try {
                const validationSchema = Yup.object({
                    name: Yup.string()
                        .required(
                            "scheduler.dashboard.modal.rename.form.error.required.name"
                        )
                        .test({
                            message: "common.error.nameSpace",
                            test: (value) => !value?.includes(" "),
                        })
                        .test({
                            message: "common.error.nameExist",
                            test: (value) => {
                                const isFolder = Boolean(
                                    selectedSchedulerFolderUuid
                                );

                                // Get the list base from what is selected (scheduler/folder)
                                const checkList: (Folder | Scheduler)[] =
                                    isFolder ? folderList : schedulerList;

                                // Get the selected item uuid
                                const selectedUuid = isFolder
                                    ? selectedSchedulerFolderUuid
                                    : selectedSchedulerUuid;

                                // Get the item from the combined list (scheduler and folder)
                                const selectedItem:
                                    | Folder
                                    | Scheduler
                                    | undefined = checkList.find(
                                    (item) => item.uuid === selectedUuid
                                );

                                // Filter the items
                                const items = checkList.filter((item) => {
                                    return (
                                        // Should be the same parent
                                        item.folder_uuid ===
                                            selectedItem?.folder_uuid &&
                                        // Make sure we're not validating the same scheduler/folder
                                        item.uuid !== selectedItem?.uuid &&
                                        // Check if this is the item
                                        item.name === value
                                    );
                                });

                                // If this is zero meaning there's no match
                                // so the name is unique
                                return items.length === 0;
                            },
                        })
                        .matches(
                            SPECIAL_CHARACTERS_REGEX,
                            "common.error.specialCharactersDetected"
                        ),
                });
                await validateYupSchema(values, validationSchema);

                return {};
            } catch (error) {
                const validationError = error as Yup.ValidationError;

                const errorMessages = validationError.errors;

                toastMessage(t(errorMessages[0]), toast.TYPE.ERROR);

                return yupToFormErrors(validationError);
            }
        },

        validateOnChange: false,
        validateOnBlur: false,
    });

    const onCloseModal = () => {
        handleClose();
        renameSchedulerForm.resetForm();
    };

    return (
        <EmobiqModal
            show={show}
            handleClose={onCloseModal}
            modalHeaderTitle={t("scheduler.dashboard.modal.rename.title", {
                type: selectedSchedulerUuid ? "Scheduler" : "Folder",
            })}
            modalFooterButton={[
                {
                    name: t("common.button.cancel"),
                    variant: ButtonVariant.OUTLINE_EMOBIQ_BRAND,
                    handleClick: onCloseModal,
                },
                {
                    name: t("common.button.rename"),
                    variant: ButtonVariant.EMOBIQ_BRAND,
                    handleClick: renameSchedulerForm.submitForm,
                },
            ]}
        >
            <div>
                <Form onSubmit={renameSchedulerForm.handleSubmit}>
                    <Form.Group controlId="name">
                        <Row className="align-items-center">
                            <Col xs={12} sm={3}>
                                <Form.Label className="text-rg m-0 text-philippine-gray">
                                    {t(
                                        "scheduler.dashboard.modal.rename.form.label.name"
                                    )}
                                </Form.Label>
                            </Col>
                            <Col xs={12} sm={9}>
                                <Form.Control
                                    className="text-rg"
                                    type="text"
                                    placeholder="Name"
                                    value={renameSchedulerForm.values.name}
                                    onChange={renameSchedulerForm.handleChange}
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                </Form>
            </div>
        </EmobiqModal>
    );
};

export default SchedulerRename;

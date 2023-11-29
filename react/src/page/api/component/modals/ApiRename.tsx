import { Form, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import * as Yup from "yup";
import { useFormik, validateYupSchema, yupToFormErrors } from "formik";
import useToast from "../../../../common/hooks/Toast";

import { Folder } from "../../../../common/zustand/interface/FolderInterface";
import { Api } from "../../../../common/zustand/interface/ApiInterface";
import useStore from "../../../../common/zustand/Store";

import EmobiqModal, {
    ButtonVariant,
} from "../../../../common/component/helper/EmobiqModal";
import { SPECIAL_CHARACTERS_REGEX } from "../../../../common/data/Constant";

interface RenameApiForm {
    name: string;
}

interface ApiModuleRenameProps {
    show: boolean;
    handleClose: () => void;
}

const ApiRename = ({ show, handleClose }: ApiModuleRenameProps) => {
    const { t } = useTranslation();

    const toastMessage = useToast(true);

    const {
        apiList,
        folderList,
        selectedApiUuid,
        selectedApiFolderUuid,
        selectedApi,
        selectedFolder,

        updateApiName,
        updateFolderName,
    } = useStore((state) => ({
        apiList: state.api,
        folderList: state.folder,
        selectedApiUuid: state.selectedApiUuid,
        selectedApiFolderUuid: state.selectedApiFolderUuid,

        selectedApi: state.api.find((a) => a.uuid === state.selectedApiUuid),
        selectedFolder: state.folder.find(
            (f) => f.uuid === state.selectedApiFolderUuid
        ),

        updateApiName: state.updateApiName,
        updateFolderName: state.updateFolderName,
    }));

    // Get the selected api or folder
    const selected: Api | Folder | undefined = selectedApiUuid
        ? selectedApi
        : selectedFolder;

    // Configure form to update a api or folder
    const renameApiForm = useFormik<RenameApiForm>({
        enableReinitialize: true,

        initialValues: {
            name: selected?.name || "",
        },

        onSubmit: async (values, formikHelpers) => {
            const { resetForm } = formikHelpers;
            let type = "";

            if (selectedApiUuid) {
                updateApiName(values.name);
                type = "action";
            } else if (selectedApiFolderUuid) {
                updateFolderName(selectedApiFolderUuid, values.name);
                type = "folder";
            }

            if (type) {
                // show success message
                toastMessage(
                    t(
                        `api.dashboard.modal.rename.form.message.success.${type}`
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
                            "api.dashboard.modal.rename.form.error.required.name"
                        )
                        .test({
                            message: "common.error.nameSpace",
                            test: (value) => !value?.includes(" "),
                        })
                        .test({
                            message:
                                "api.dashboard.modal.rename.form.error.nameExist",
                            test: (value) => {
                                const isFolder = Boolean(selectedApiFolderUuid);

                                // Get the list base from what is selected (api/folder)
                                const checkList: (Folder | Api)[] = isFolder
                                    ? folderList
                                    : apiList;

                                // Get the selected item uuid
                                const selectedUuid = isFolder
                                    ? selectedApiFolderUuid
                                    : selectedApiUuid;

                                // Get the item from the combined list (api and folder)
                                const selectedItem: Folder | Api | undefined =
                                    checkList.find(
                                        (item) => item.uuid === selectedUuid
                                    );

                                // Filter the items
                                const items = checkList.filter((item) => {
                                    return (
                                        // Should be the same parent
                                        item.folder_uuid ===
                                            selectedItem?.folder_uuid &&
                                        // Make sure we're not validating the same api/folder
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
        renameApiForm.resetForm();
    };

    return (
        <EmobiqModal
            show={show}
            handleClose={onCloseModal}
            modalHeaderTitle={t("api.dashboard.modal.rename.title", {
                type: selectedApiUuid ? "API" : "Folder",
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
                    handleClick: renameApiForm.submitForm,
                },
            ]}
        >
            <div>
                <Form onSubmit={renameApiForm.handleSubmit}>
                    <Form.Group controlId="name">
                        <Row className="align-items-center">
                            <Col xs={12} sm={3}>
                                <Form.Label className="text-rg m-0 text-philippine-gray">
                                    {t(
                                        "api.dashboard.modal.rename.form.label.name"
                                    )}
                                </Form.Label>
                            </Col>
                            <Col xs={12} sm={9}>
                                <Form.Control
                                    className="text-rg"
                                    type="text"
                                    placeholder="Name"
                                    value={renameApiForm.values.name}
                                    onChange={renameApiForm.handleChange}
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                </Form>
            </div>
        </EmobiqModal>
    );
};

export default ApiRename;

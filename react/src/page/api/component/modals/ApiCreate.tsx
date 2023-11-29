import { useFormik, validateYupSchema, yupToFormErrors } from "formik";
import { Col, Form, Row, Stack } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import * as Yup from "yup";
import useToast from "../../../../common/hooks/Toast";

import {
    Folder,
    FolderType,
} from "../../../../common/zustand/interface/FolderInterface";
import { Api } from "../../../../common/zustand/interface/ApiInterface";
import useStore from "../../../../common/zustand/Store";

import EmobiqModal, {
    ButtonVariant,
} from "../../../../common/component/helper/EmobiqModal";
import generateUniqueId from "../../../../common/helper/UniqueId";

import {
    API_PREFIX,
    FOLDER_PREFIX,
    SPECIAL_CHARACTERS_REGEX,
} from "../../../../common/data/Constant";

enum ApiType {
    FOLDER = "folder",
    ACTION = "action",
}

interface CreateApiForm {
    type: ApiType;
    name: string;
}

interface ApiModuleCreateProps {
    show: boolean;
    handleClose: () => void;
}

const ApiModuleCreate = ({ show, handleClose }: ApiModuleCreateProps) => {
    const { t } = useTranslation();

    const toastMessage = useToast(true);

    const {
        apiList,
        selectedApiUuid,
        selectedApiFolderUuid,
        folderList,

        addNewApi,
        addNewFolder,
        setSelectedApiUuid,
        setSelectedApiFolderUuid,
    } = useStore((state) => ({
        apiList: state.api,
        folderList: state.folder,
        selectedApiUuid: state.selectedApiUuid,
        selectedApiFolderUuid: state.selectedApiFolderUuid,

        addNewApi: state.addNewApi,
        addNewFolder: state.addNewFolder,
        setSelectedApiUuid: state.setSelectedApiUuid,
        setSelectedApiFolderUuid: state.setSelectedApiFolderUuid,
    }));

    // Configure form to create or update a user
    const createApiForm = useFormik<CreateApiForm>({
        initialValues: {
            type: ApiType.ACTION,
            name: "",
        },

        onSubmit: async (values, formikHelpers) => {
            const { resetForm } = formikHelpers;

            // If selectedApiFolder is found, create new api under the folder.
            // Else if a selectedApi is found, create new api as its sibling.
            const folderUuid =
                selectedApiFolderUuid ||
                apiList.find(({ uuid }) => uuid === selectedApiUuid)
                    ?.folder_uuid;

            if (values.type === ApiType.ACTION) {
                // prepare api data
                const apiData: Api = {
                    uuid: generateUniqueId(API_PREFIX),
                    name: values.name,
                    title: values.name,
                    order: 0,
                    folder_uuid: folderUuid,
                };

                // add api with data
                addNewApi(apiData);

                // set new data as selected
                setSelectedApiUuid(apiData.uuid);
            } else {
                // prepare folder data
                const folderData: Folder = {
                    uuid: generateUniqueId(FOLDER_PREFIX),
                    name: values.name,
                    title: values.name,
                    order: 0,
                    type: FolderType.API, // pass type
                    folder_uuid: folderUuid,
                };

                // add folder with data
                addNewFolder(folderData);

                // set new data as selected
                setSelectedApiFolderUuid(folderData.uuid);
            }

            // show success message
            toastMessage(
                t(
                    `api.dashboard.modal.create.form.message.success.${values.type}`
                ),
                toast.TYPE.SUCCESS
            );

            // clear name
            resetForm();

            // close modal
            handleClose();
        },

        validate: async (values) => {
            try {
                // Form validation
                const validationSchema = Yup.object({
                    name: Yup.string()
                        .required(
                            "api.dashboard.modal.create.form.error.required.name"
                        )
                        // test case for empty spacing
                        .test({
                            message: "common.error.nameSpace",
                            test: (value) => !value?.includes(" "),
                        })
                        // test case for name duplicates
                        .test({
                            message:
                                "api.dashboard.modal.create.form.error.nameExist",
                            test: (value) => {
                                // Prepare list of items to check
                                // if creating a folder, use folderList; otherwise, use apiList
                                const checkList: (Folder | Api)[] =
                                    values.type === ApiType.FOLDER
                                        ? folderList
                                        : apiList;

                                // Variable if selected item is a folder
                                const isFolder = Boolean(selectedApiFolderUuid);

                                // Prepare selected item (Action/Folder) variable
                                const selectedUuid = isFolder
                                    ? selectedApiFolderUuid
                                    : selectedApiUuid;

                                // Find action/folder items in the same folder
                                const items = checkList.filter((item) => {
                                    if (selectedUuid) {
                                        // if selected is a "folder", use its id
                                        // if "api", use its parent folder id
                                        const checkId = isFolder
                                            ? selectedUuid
                                            : apiList.find(
                                                  (api) =>
                                                      api.uuid === selectedUuid
                                              )?.folder_uuid;
                                        return item.folder_uuid === checkId;
                                    }
                                    return !item.folder_uuid;
                                });

                                // Check if value (name) is in the list of items gathered from the same folder
                                return !items.some(
                                    ({ name }) => name === value
                                );
                            },
                        })
                        .matches(
                            SPECIAL_CHARACTERS_REGEX,
                            "common.error.specialCharactersDetected"
                        ),
                });

                // Trigger form validation
                await validateYupSchema(values, validationSchema);

                // Return an empty object if there's no validation error
                return {};
            } catch (error) {
                const validationError = error as Yup.ValidationError;

                // set variable for error(s)
                const errorMessages = validationError.errors;

                // Show validation error in a toast with the type of ERROR of the first error message found
                toastMessage(t(errorMessages[0]), toast.TYPE.ERROR);

                // Return validation error to indicate the failure of form validation
                return yupToFormErrors(validationError);
            }
        },

        validateOnChange: false,
        validateOnBlur: false,
    });

    // modal close handler
    const onCloseModal = () => {
        // close modal
        handleClose();

        // clear fields once modal is closed
        createApiForm.resetForm();
    };

    return (
        <EmobiqModal
            show={show}
            modalHeaderTitle={t("api.dashboard.modal.create.title")}
            handleClose={onCloseModal}
            modalFooterButton={[
                {
                    name: "common.button.cancel",
                    variant: ButtonVariant.OUTLINE_EMOBIQ_BRAND,
                    handleClick: onCloseModal,
                },
                {
                    name: "common.button.create",
                    variant: ButtonVariant.EMOBIQ_BRAND,
                    handleClick: createApiForm.submitForm,
                },
            ]}
        >
            <Form onSubmit={createApiForm.handleSubmit}>
                <Stack gap={4}>
                    <Form.Group controlId="type">
                        <Row className="align-items-center">
                            <Col xs={12} sm={3}>
                                <Form.Label className="text-rg m-0 text-philippine-gray">
                                    {t(
                                        "api.dashboard.modal.create.form.label.type"
                                    )}
                                </Form.Label>
                            </Col>
                            <Col xs={12} sm={9}>
                                <Form.Select
                                    className="text-rg"
                                    onChange={createApiForm.handleChange}
                                    value={createApiForm.values.type}
                                >
                                    <option value={ApiType.ACTION}>
                                        {t(
                                            "api.dashboard.modal.create.form.select.options.action"
                                        )}
                                    </option>
                                    <option value={ApiType.FOLDER}>
                                        {t(
                                            "api.dashboard.modal.create.form.select.options.folder"
                                        )}
                                    </option>
                                </Form.Select>
                            </Col>
                        </Row>
                    </Form.Group>
                    <Form.Group controlId="name">
                        <Row className="align-items-center">
                            <Col xs={12} sm={3}>
                                <Form.Label className="text-rg m-0 text-philippine-gray">
                                    {t(
                                        "api.dashboard.modal.create.form.label.name"
                                    )}
                                </Form.Label>
                            </Col>
                            <Col xs={12} sm={9}>
                                <Form.Control
                                    className="text-rg"
                                    placeholder={t(
                                        "api.dashboard.modal.create.form.label.name"
                                    )}
                                    onChange={createApiForm.handleChange}
                                    value={createApiForm.values.name}
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                </Stack>
            </Form>
        </EmobiqModal>
    );
};

export { ApiType };
export default ApiModuleCreate;

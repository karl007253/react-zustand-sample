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
import { Scheduler } from "../../../../common/zustand/interface/SchedulerInterface";
import useStore from "../../../../common/zustand/Store";

import EmobiqModal, {
    ButtonVariant,
} from "../../../../common/component/helper/EmobiqModal";
import generateUniqueId from "../../../../common/helper/UniqueId";

import {
    SCHEDULER_PREFIX,
    FOLDER_PREFIX,
    SPECIAL_CHARACTERS_REGEX,
} from "../../../../common/data/Constant";

enum SchedulerType {
    FOLDER = "folder",
    ACTION = "action",
}

interface CreateSchedulerForm {
    type: SchedulerType;
    name: string;
}

interface SchedulerModuleCreateProps {
    show: boolean;
    handleClose: () => void;
}

const SchedulerCreate = ({ show, handleClose }: SchedulerModuleCreateProps) => {
    const { t } = useTranslation();

    const toastMessage = useToast(true);

    const {
        schedulerList,
        selectedSchedulerUuid,
        selectedSchedulerFolderUuid,
        folderList,

        addNewScheduler,
        addNewFolder,
        setSelectedSchedulerUuid,
        setSelectedSchedulerFolderUuid,
    } = useStore((state) => ({
        schedulerList: state.scheduler,
        folderList: state.folder,
        selectedSchedulerUuid: state.selectedSchedulerUuid,
        selectedSchedulerFolderUuid: state.selectedSchedulerFolderUuid,

        addNewScheduler: state.addNewScheduler,
        addNewFolder: state.addNewFolder,
        setSelectedSchedulerUuid: state.setSelectedSchedulerUuid,
        setSelectedSchedulerFolderUuid: state.setSelectedSchedulerFolderUuid,
    }));

    // Configure form to create or update a user
    const createSchedulerForm = useFormik<CreateSchedulerForm>({
        initialValues: {
            type: SchedulerType.ACTION,
            name: "",
        },

        onSubmit: async (values, formikHelpers) => {
            const { resetForm } = formikHelpers;

            // If selectedSchedulerFolder is found, create new scheduler under the folder.
            // Else if a selectedScheduler is found, create new scheduler as its sibling.
            const folderUuid =
                selectedSchedulerFolderUuid ||
                schedulerList.find(({ uuid }) => uuid === selectedSchedulerUuid)
                    ?.folder_uuid;

            if (values.type === SchedulerType.ACTION) {
                // prepare scheduler data
                const schedulerData: Scheduler = {
                    uuid: generateUniqueId(SCHEDULER_PREFIX),
                    name: values.name,
                    title: values.name,
                    order: 0,
                    folder_uuid: folderUuid,
                };

                // add scheduler with data
                addNewScheduler(schedulerData);

                // set new data as selected
                setSelectedSchedulerUuid(schedulerData.uuid);
            } else {
                // prepare folder data
                const folderData: Folder = {
                    uuid: generateUniqueId(FOLDER_PREFIX),
                    name: values.name,
                    title: values.name,
                    order: 0,
                    type: FolderType.SCHEDULER, // pass type
                    folder_uuid: folderUuid,
                };

                // add folder with data
                addNewFolder(folderData);

                // set new data as selected
                setSelectedSchedulerFolderUuid(folderData.uuid);
            }

            // show success message
            toastMessage(
                t(
                    `scheduler.dashboard.modal.create.form.message.success.${values.type}`
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
                            "scheduler.dashboard.modal.create.form.error.required.name"
                        )
                        // test case for empty spacing
                        .test({
                            message: "common.error.nameSpace",
                            test: (value) => !value?.includes(" "),
                        })
                        // test case for name duplicates
                        .test({
                            message: "common.error.nameExist",
                            test: (value) => {
                                // Prepare list of items to check
                                // if creating a folder, use folderList; otherwise, use schedulerList
                                const checkList: (Folder | Scheduler)[] =
                                    values.type === SchedulerType.FOLDER
                                        ? folderList
                                        : schedulerList;

                                // Variable if selected item is a folder
                                const isFolder = Boolean(
                                    selectedSchedulerFolderUuid
                                );

                                // Prepare selected item (Action/Folder) variable
                                const selectedUuid = isFolder
                                    ? selectedSchedulerFolderUuid
                                    : selectedSchedulerUuid;

                                // Find action/folder items in the same folder
                                const items = checkList.filter((item) => {
                                    if (selectedUuid) {
                                        // if selected is a "folder", use its id
                                        // if "schedule", use its parent folder id
                                        const checkId = isFolder
                                            ? selectedUuid
                                            : schedulerList.find(
                                                  (scheduler) =>
                                                      scheduler.uuid ===
                                                      selectedUuid
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
        createSchedulerForm.resetForm();
    };

    return (
        <EmobiqModal
            show={show}
            modalHeaderTitle={t("scheduler.dashboard.modal.create.title")}
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
                    handleClick: createSchedulerForm.submitForm,
                },
            ]}
        >
            <Form onSubmit={createSchedulerForm.handleSubmit}>
                <Stack gap={4}>
                    <Form.Group controlId="type">
                        <Row className="align-items-center">
                            <Col xs={12} sm={3}>
                                <Form.Label className="text-rg m-0 text-philippine-gray">
                                    {t(
                                        "scheduler.dashboard.modal.create.form.label.type"
                                    )}
                                </Form.Label>
                            </Col>
                            <Col xs={12} sm={9}>
                                <Form.Select
                                    className="text-rg"
                                    onChange={createSchedulerForm.handleChange}
                                    value={createSchedulerForm.values.type}
                                >
                                    <option value={SchedulerType.ACTION}>
                                        {t(
                                            "scheduler.dashboard.modal.create.form.select.options.action"
                                        )}
                                    </option>
                                    <option value={SchedulerType.FOLDER}>
                                        {t(
                                            "scheduler.dashboard.modal.create.form.select.options.folder"
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
                                        "scheduler.dashboard.modal.create.form.label.name"
                                    )}
                                </Form.Label>
                            </Col>
                            <Col xs={12} sm={9}>
                                <Form.Control
                                    className="text-rg"
                                    placeholder={t(
                                        "scheduler.dashboard.modal.create.form.label.name"
                                    )}
                                    onChange={createSchedulerForm.handleChange}
                                    value={createSchedulerForm.values.name}
                                />
                            </Col>
                        </Row>
                    </Form.Group>
                </Stack>
            </Form>
        </EmobiqModal>
    );
};

export { SchedulerType };
export default SchedulerCreate;

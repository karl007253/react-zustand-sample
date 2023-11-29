import { Col, Form, Row, Stack } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import useToast from "../../../../common/hooks/Toast";

import useStore from "../../../../common/zustand/Store";

import EmobiqModal, {
    ButtonVariant,
} from "../../../../common/component/helper/EmobiqModal";

interface DatabaseRenameProps {
    show: boolean;
    handleClose: () => void;
}

const DatabaseDelete = ({ show, handleClose }: DatabaseRenameProps) => {
    const { t } = useTranslation();
    const toastMessage = useToast(true);

    const {
        selectedDatabaseUuid,
        selectedDatabaseTableUuid,
        selectedDatabase,
        selectedDatabaseTable,

        deleteDatabase,
        deleteDatabaseTable,
    } = useStore((state) => ({
        selectedDatabaseUuid: state.selectedDatabaseUuid,
        selectedDatabaseTableUuid: state.selectedDatabaseTableUuid,

        selectedDatabase: state.database.find(
            ({ uuid }) => uuid === state.selectedDatabaseUuid
        ),
        selectedDatabaseTable: state.databaseTable.find(
            ({ uuid }) => uuid === state.selectedDatabaseTableUuid
        ),

        deleteDatabase: state.deleteDatabase,
        deleteDatabaseTable: state.deleteDatabaseTable,
    }));

    // Get the selected database/table
    const selected = selectedDatabaseUuid
        ? selectedDatabase
        : selectedDatabaseTable;

    const onDeleteModal = () => {
        let type = "";
        if (selectedDatabaseUuid) {
            type = "database";
            deleteDatabase();
        } else if (selectedDatabaseTableUuid) {
            type = "table";
            deleteDatabaseTable();
        }

        toastMessage(
            t(`database.dashboard.modal.delete.form.message.success.${type}`),
            toast.TYPE.SUCCESS
        );

        handleClose();
    };

    const onCloseModal = () => {
        handleClose();
    };

    return (
        <EmobiqModal
            show={show}
            modalHeaderTitle={
                selectedDatabaseUuid
                    ? t("database.dashboard.modal.delete.title.database")
                    : t("database.dashboard.modal.delete.title.table")
            }
            handleClose={onCloseModal}
            modalFooterButton={[
                {
                    name: "common.button.no",
                    variant: ButtonVariant.OUTLINE_EMOBIQ_BRAND,
                    handleClick: onCloseModal,
                },
                {
                    name: "common.button.yes",
                    variant: ButtonVariant.EMOBIQ_BRAND,
                    handleClick: onDeleteModal,
                },
            ]}
        >
            <Form>
                <Stack gap={4}>
                    <Form.Group controlId="name">
                        <Row className="align-items-center">
                            <Col xs={12}>
                                <Form.Label>
                                    {selectedDatabaseUuid
                                        ? t(
                                              "database.dashboard.modal.delete.form.message.confirm.database",
                                              { name: `"${selected?.name}"` }
                                          )
                                        : t(
                                              "database.dashboard.modal.delete.form.message.confirm.table",
                                              { name: `"${selected?.name}"` }
                                          )}
                                </Form.Label>
                            </Col>
                        </Row>
                    </Form.Group>
                </Stack>
            </Form>
        </EmobiqModal>
    );
};

export default DatabaseDelete;

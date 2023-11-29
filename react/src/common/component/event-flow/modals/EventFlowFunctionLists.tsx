import { useTranslation } from "react-i18next";
import EmobiqModal, { ButtonVariant } from "../../helper/EmobiqModal";
import { FunctionListsProps } from "../data/Functions";
import FunctionList from "../FunctionList";

/**
 * Modal for event flow functions
 * @returns {Component}
 */

type EventFlowFunctionListsProps = {
    show: boolean;
    handleClose: () => void;
    functionLists: FunctionListsProps;
    onClick?: (key: string) => void;
};

const EventFlowFunctionLists = ({
    show,
    handleClose,
    functionLists,
    onClick,
}: EventFlowFunctionListsProps) => {
    const { t } = useTranslation();
    return (
        <EmobiqModal
            show={show}
            modalHeaderTitle={t("eventFlow.tabs.action.modal.functions.title")}
            handleClose={handleClose}
            modalFooterButton={[
                {
                    name: "common.button.cancel",
                    variant: ButtonVariant.OUTLINE_EMOBIQ_BRAND,
                    handleClick: handleClose,
                },
            ]}
        >
            <FunctionList
                functionLists={functionLists}
                isClickable
                onClick={onClick}
            />
        </EmobiqModal>
    );
};

export default EventFlowFunctionLists;

import { useTranslation } from "react-i18next";

/**
 * Loader for event flow
 */
type EventFlowLoaderProps = {
    loading: boolean;
};

const EventFlowLoader = ({ loading }: EventFlowLoaderProps) => {
    const { t } = useTranslation();
    return loading ? (
        <div className="overlay-less-priority">
            <div className="loader-updater">{t("eventFlow.loader.title")}</div>
        </div>
    ) : null;
};

export default EventFlowLoader;

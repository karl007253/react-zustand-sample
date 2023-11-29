import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useEffect } from "react";
import useStore from "../zustand/Store";
import useToast from "./Toast";

/**
 * Retrieve app data refresh details during a session refresh
 */
const useAppDataRefresh = () => {
    const toastMessage = useToast(true);
    const { t } = useTranslation();

    // Get the query string
    const segments = useParams();

    // Get fetch methods from state
    const {
        getApplicationByApplicationCode,
        getReleasesAndBuildByApplicationCode,
    } = useStore((state) => ({
        getApplicationByApplicationCode: state.getApplicationByApplicationCode,
        getReleasesAndBuildByApplicationCode:
            state.getReleasesAndBuildByApplicationCode,
    }));

    // Display "App Not Found" error message in toast
    const showAppNotFoundMessage = () => {
        toastMessage(t("common.error.application.not.found"), toast.TYPE.ERROR);
    };

    // Display "Releases and Build Not Found" error message in toast
    const showReleaseAndBuildNotFoundMessage = () => {
        toastMessage(
            t("common.error.releaseAndBuild.not.found"),
            toast.TYPE.ERROR
        );
    };

    useEffect(() => {
        // Get the application_code / app
        const appCode = segments.appid;

        // example format of the url param: http://localhost:3000/...<?app=163066112782698>
        // Fetch the application data by using application_code
        // if app code is not provided or an invalid app code is provided, display error in a toast
        if (appCode) {
            getApplicationByApplicationCode(appCode).catch(() => {
                showAppNotFoundMessage();
            });
            getReleasesAndBuildByApplicationCode(appCode).catch(() => {
                showReleaseAndBuildNotFoundMessage();
            });
        } else {
            showAppNotFoundMessage();
        }
    }, []);
};

export default useAppDataRefresh;

import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import useStore from "../zustand/Store";

/**
 * Set title of a page
 * @param {string | undefined} title title of a page
 */
const useDocumentTitle = (title?: string) => {
    const { t, i18n } = useTranslation();

    // Get the application data from store
    const { applicationData } = useStore((state) => ({
        applicationData: state.applicationData,
    }));

    useEffect(() => {
        // Use the default if no title is provided
        const defaultTitle = t("page.title.default");
        let newTitle = defaultTitle;

        const appName = applicationData?.appname
            ? `${applicationData.appname} / `
            : "";

        // Use the title if provided
        if (title) {
            // Use the locale if the title is a valid key in locale. ELse, use the provided title.
            const pageTitle = `page.title.${title}`;
            newTitle = i18n.exists(pageTitle)
                ? `${t(pageTitle, { appName })} - ${defaultTitle}`
                : title;
        }

        // Set page title
        document.title = newTitle;
    }, [applicationData]);
};

export default useDocumentTitle;

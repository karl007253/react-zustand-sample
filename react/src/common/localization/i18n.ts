import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import httpBackend from "i18next-http-backend";

// to config localization & only en is supported by default
i18next
    .use(initReactI18next)
    .use(httpBackend)
    .init({
        lng: "en",
        fallbackLng: "en",
        supportedLngs: ["en"],
        backend: {
            loadPath: "/locales/{{lng}}.json",
        },
        interpolation: {
            escapeValue: false,
        },
    })
    .catch((error) => {
        // eslint-disable-next-line
        console.error(error);
    });

export default i18next;

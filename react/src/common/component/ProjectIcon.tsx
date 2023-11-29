import { Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import defaultAppIcon from "../assets/images/app-icon.png";
import { APP_ICON_FILE_TYPE, APP_ICON_MAX_SIZE } from "../data/Constant";
import useToast from "../hooks/Toast";
import useStore from "../zustand/Store";

const ProjectIcon = () => {
    const { appid } = useParams();
    const { t } = useTranslation();

    const toastMessage = useToast(true);

    // Input file element reference. We will use this to trigger file picker programmatically.
    const appIconInputRef = useRef<HTMLInputElement | null>(null);

    const getIconPath = (applicationCode?: string, iconFileName?: string) => {
        // We append a random query parameter here (using epoch milliseconds) to force browser to
        // re-render image even with the same file name.
        // This shall not affect the file path
        return `${
            process.env.REACT_APP_STORAGE_URL
        }/app/${applicationCode}/${iconFileName}?t=${Date.now()}`;
    };

    const [appIconUrl, setAppIconUrl] = useState<string | null>(null);

    const { uploadAppIcon, applicationData } = useStore((state) => ({
        uploadAppIcon: state.uploadAppIcon,
        applicationData: state.applicationData,
    }));

    useEffect(() => {
        // We append a random query parameter here (using epoch milliseconds) to force browser to
        // re-render image even with the same file name.
        // This shall not affect the file path
        setAppIconUrl(
            applicationData && applicationData.icon
                ? getIconPath(appid, applicationData.icon)
                : null
        );
    }, [applicationData]);

    // Function to trigger image picking dialog
    const pickImageFile = () => {
        appIconInputRef?.current?.click();
    };

    // Handling function for when a file is chosen for upload
    const handleOnIconChanged: (file?: File) => void = async (file) => {
        if (!appid) {
            // App ID not supplied
            return;
        }

        if (!file) {
            // File doesn't exist or not selected
            toastMessage(
                t("module.error.icon.noFileSelected"),
                toast.TYPE.ERROR
            );
            return;
        }

        if (!APP_ICON_FILE_TYPE.includes(file.type)) {
            // File type is not supported
            toastMessage(
                t("module.error.icon.fileTypeNotSupported"),
                toast.TYPE.ERROR
            );
            return;
        }

        if (file.size > APP_ICON_MAX_SIZE) {
            // File is over the size limit
            toastMessage(t("module.error.icon.overFileSize"), toast.TYPE.ERROR);
            return;
        }

        const { success, data, message } = await uploadAppIcon(appid, file);

        if (success && data) {
            // Shows message received from the successful request.
            toastMessage(message, toast.TYPE.SUCCESS);
            // Successful upload, obtain image link from data.
            setAppIconUrl(getIconPath(appid, data));
        } else {
            toastMessage(message, toast.TYPE.ERROR);
        }
    };

    const handleImageLoadError = () => {
        setAppIconUrl(defaultAppIcon);
    };

    // Function to do when icon file is changed
    const onAppIconFilePicked = async (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const imageFile = event.target.files?.[0];

        handleOnIconChanged(imageFile);
    };

    return (
        <Row className="app-icon" onClick={pickImageFile}>
            <figure className="app-icon-fig position-relative m-0 p-0">
                <img
                    aria-label="app-icon-image"
                    src={appIconUrl ?? defaultAppIcon}
                    alt={t("module.logo.icon.alt")}
                    onError={handleImageLoadError}
                />
                <figcaption className="app-icon-figcaption position-absolute bottom-0 start-0">
                    <FontAwesomeIcon
                        className="camera-icon position-absolute text-center"
                        icon={faCamera}
                    />
                </figcaption>
                {/* This input element is hidden from view,
                    but we will use its file picking functionality by its ref tag */}
                <input
                    type="file"
                    hidden
                    name="app-icon-field"
                    aria-label="app-icon-field"
                    ref={appIconInputRef}
                    accept={APP_ICON_FILE_TYPE.join(",")}
                    onChange={onAppIconFilePicked}
                />
            </figure>
            <p className="app-icon-title text-center text-philippine-gray text-xs">
                {t("module.logo.title")}
            </p>
        </Row>
    );
};

export default ProjectIcon;

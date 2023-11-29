import { useTranslation } from "react-i18next";
import { Stack } from "react-bootstrap";

type CardStorageProps = {
    title: string;
    memory?: number;
};

export const CardStorage = ({ title, memory }: CardStorageProps) => {
    const { t } = useTranslation();

    return (
        <Stack
            direction="horizontal"
            className="storage"
            data-testid={`storage-${title}`}
        >
            <div className="d-flex align-items-center p-3">
                <span className="label text-rg">{t(title)}</span>
            </div>
            <div className="ms-auto p-3">
                <span className="d-flex align-items-center value text-xxxl">
                    {memory ?? " - "}MB
                </span>
            </div>
        </Stack>
    );
};

export default CardStorage;

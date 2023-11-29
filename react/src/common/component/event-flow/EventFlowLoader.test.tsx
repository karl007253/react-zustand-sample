import { render, screen } from "@testing-library/react";
import { useTranslation } from "react-i18next";

import EventFlowLoader from "./EventFlowLoader";

describe("Api: EventFlowLoader", () => {
    const { t } = useTranslation();

    beforeEach(() => render(<EventFlowLoader loading />));

    it("should display Loading when loading props is true", () => {
        expect(
            screen.getByText(t("eventFlow.loader.title"))
        ).toBeInTheDocument();
    });
});

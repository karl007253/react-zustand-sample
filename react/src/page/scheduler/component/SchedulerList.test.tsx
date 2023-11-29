import { MemoryRouter } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import { useTranslation } from "react-i18next";

import SchedulerList from "./SchedulerList";

describe("Component: SchedulerList", () => {
    const { t } = useTranslation();

    beforeEach(() => {
        render(<SchedulerList />, { wrapper: MemoryRouter });
    });

    it("should have the input form", () => {
        expect(
            screen.getByPlaceholderText(t("module.search.placeholder"))
        ).toBeInTheDocument();
    });

    it("should show the tree list", () => {
        expect(screen.getByRole("tree")).toBeInTheDocument();
    });
});

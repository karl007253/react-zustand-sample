import { fireEvent, render, screen } from "@testing-library/react";
import { useTranslation } from "react-i18next";

import FunctionList from "./FunctionList";
import { Functions as functionLists } from "../../data/Functions";

describe("Component: FunctionList", () => {
    const { t } = useTranslation();
    beforeEach(() => render(<FunctionList functionLists={functionLists} />));

    it("should have the input form", () => {
        expect(
            screen.getByPlaceholderText(t("common.text.search"))
        ).toBeInTheDocument();
    });

    it("should be able to change the search keyword and collapse the accordion that includes the searched value", async () => {
        const searchInput = screen.getByPlaceholderText(
            t("common.text.search")
        );
        const searchText = "con";
        fireEvent.change(searchInput, { target: { value: searchText } });

        expect(
            screen.getByPlaceholderText(t("common.text.search"))
        ).toHaveValue(searchText);

        const searchResult = await screen.findAllByText(
            new RegExp(searchText, "i")
        );
        expect(searchResult.length).toBeGreaterThan(1);
    });
});

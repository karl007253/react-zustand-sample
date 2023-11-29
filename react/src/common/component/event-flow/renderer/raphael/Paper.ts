import Raphael from "raphael";
import {
    global,
    RaphaelPaperWithEventsProps,
    RaphaelPaperWithIdProps,
} from "./Variables";
import { generateId } from "./Helper";

/**
 * Creates a Raphael paper
 * @param {HTMLDivElement} container
 * @param {RaphaelPaperWithEventsProps} props
 * @returns {Raphael}
 */
const createPaper = (
    container: HTMLDivElement,
    props: RaphaelPaperWithEventsProps
) => {
    const { width, height } = props;

    // Create the raphael paper and generate id
    const paper: RaphaelPaperWithIdProps = Raphael(container, width, height); // type cast to RaphaelPaperWithIdProps for additional custom id property
    paper.id = generateId("paper");

    // Add the id to the container
    container.setAttribute("id", paper.id);

    // Store this instance
    global.papers[paper.id] = paper;

    return paper;
};

export default createPaper;

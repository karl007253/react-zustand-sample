import { Stack } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronRight,
    faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

const LogItem = ({ message }: { message: string }) => {
    return (
        <Stack
            direction="horizontal"
            className="border-bottom border-danger mb-2 pb-2 text-rg align-items-baseline text-white"
        >
            <FontAwesomeIcon
                icon={faTimesCircle}
                size="sm"
                className="text-tart-orange"
            />
            <FontAwesomeIcon
                icon={faChevronRight}
                size="sm"
                className="text-tart-orange mx-3"
            />
            {message}
        </Stack>
    );
};

const TestLogList = ({ logs }: { logs: string[] }) => {
    return (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
            {logs.length > 0 &&
                logs.map((log, key) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <LogItem key={key} message={log} />
                ))}
        </>
    );
};

export default TestLogList;

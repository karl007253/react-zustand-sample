import Message from "./component/Message";
import useDocumentTitle from "../../common/hooks/DocumentTitle";

const NotFound = () => {
    useDocumentTitle("not.found");

    return <Message />;
};

export default NotFound;

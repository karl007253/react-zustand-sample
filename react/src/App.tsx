import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Route from "./Route";

const App = () => {
    return (
        <>
            <Route />

            <ToastContainer
                position={toast.POSITION.BOTTOM_LEFT}
                hideProgressBar
            />
        </>
    );
};

export default App;

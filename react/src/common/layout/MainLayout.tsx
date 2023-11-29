import Header from "../component/Header";
import Navbar from "../component/Navbar";

type MainLayoutProps = {
    children: JSX.Element | JSX.Element[];
};

const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <div id="main-content">
            <header className="sticky-top">
                <Header />
                <Navbar />
            </header>

            <section id="body">{children}</section>
        </div>
    );
};

export default MainLayout;

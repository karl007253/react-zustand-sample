import { Stack, Container } from "react-bootstrap";

import NavModule from "../component/NavModule";

import { ModuleType } from "../data/Type";

type ModuleLayoutProps = {
    children: JSX.Element | JSX.Element[];
    module: ModuleType;
};

const ModuleLayout = ({ children, module }: ModuleLayoutProps) => {
    return (
        <Container className="pt-10" fluid>
            <Stack direction="horizontal" className="align-items-start">
                <NavModule module={module} />
                <div className="flex-grow-1 flex-column">{children}</div>
            </Stack>
        </Container>
    );
};

export default ModuleLayout;

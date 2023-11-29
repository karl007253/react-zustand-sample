import { Container } from "react-bootstrap";

type ServiceLayoutProps = {
    children: JSX.Element | JSX.Element[];
};

const ServiceLayout = ({ children }: ServiceLayoutProps) => {
    return (
        <Container className="pt-10" fluid>
            <div className="service-container flex-grow-1">{children}</div>
        </Container>
    );
};

export default ServiceLayout;

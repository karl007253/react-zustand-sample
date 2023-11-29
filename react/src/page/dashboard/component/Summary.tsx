import { Row, Col } from "react-bootstrap";

import { useParams } from "react-router-dom";
import CardSummary from "./CardSummary";
import useStore from "../../../common/zustand/Store";

// TODO : Complete the implementation of summary

const Summary = () => {
    const { api, database, scheduler } = useStore((state) => ({
        api: state.api,
        database: state.database,
        scheduler: state.scheduler,
    }));

    const { appid } = useParams();

    return (
        <Row className="mb-5">
            <Col lg={4}>
                <CardSummary
                    title="dashboard.summary.title.api"
                    img="api"
                    url={`/module/${appid}/api`}
                    dataArray={api}
                />
            </Col>
            <Col lg={4}>
                <CardSummary
                    title="dashboard.summary.title.database"
                    img="database"
                    url={`/module/${appid}/database`}
                    dataArray={database}
                />
            </Col>
            <Col lg={4}>
                <CardSummary
                    title="dashboard.summary.title.scheduler"
                    img="scheduler"
                    url={`/module/${appid}/scheduler`}
                    dataArray={scheduler}
                />
            </Col>
        </Row>
    );
};

export default Summary;

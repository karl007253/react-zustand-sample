import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { Col, Row } from "react-bootstrap";
import useDocumentTitle from "../../common/hooks/DocumentTitle";

import { API_TOKEN } from "../../common/data/Constant";
import useCookies from "../../common/hooks/Cookie";

const Auth = () => {
    useDocumentTitle("auth");

    // Retrieve the token and state from url
    const [linkSearchParams] = useSearchParams();
    const token = linkSearchParams.get("token");
    const redirectState = linkSearchParams.get("state");
    const paramsState = new URLSearchParams(`?${redirectState}`);
    const returnUrl = paramsState.get("returnUrl") || "/";
    const hours = paramsState.get("hours") || "";

    const apiTokenCookies = useCookies(API_TOKEN);

    useEffect(() => {
        if (token) {
            // Store the token in the cookies
            apiTokenCookies.set(token, {
                hours: hours ? parseInt(hours, 10) : null,
                storeExpiry: true,
            });

            // Redirect to returnUrl
            window.location.href = returnUrl;
        }
    }, [token]);

    return (
        <Row>
            <Col>
                <div>Redirecting...</div>
            </Col>
        </Row>
    );
};

export default Auth;

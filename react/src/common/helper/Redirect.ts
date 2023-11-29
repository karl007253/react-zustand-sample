/**
 * Redirects to login page
 */
const redirectToLogin = () => {
    // Fill returnUrl state with current page url and redirectUri with auth page url
    const encodedState = encodeURIComponent(
        `returnUrl=${window.location.href}`
    );
    const encodedRedirectUri = encodeURIComponent(
        `${process.env.REACT_APP_SERVER_FRONTEND_URL}/auth`
    );

    window.location.href = `${process.env.REACT_APP_MAIN_FRONTEND_URL}/login/authorize?redirect_uri=${encodedRedirectUri}&state=${encodedState}`;
};

export default redirectToLogin;

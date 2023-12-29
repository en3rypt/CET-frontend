import { useRouteError } from "react-router-dom";

interface RouteError {
    statusText?: string;
    message?: string;
}

function ErrorPage() {
    const error = useRouteError() as RouteError;

    let errorMessage = '';
    if (typeof error === 'object' && error !== null) {
        errorMessage = error.statusText || error.message || '';
    }

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{errorMessage}</i>
            </p>
        </div>
    );

}

export default ErrorPage;

const CLIENT_ID = '0a4a82f98973453f87737e20f44f957c';
const scopes = 'user-read-recently-played'
import Button from './button'

function redirectToLogin() {
    const redirectLink = window.origin + '/login'
    const state = getParameterByName('returnTo') || '/graphiql'
    // Right now we just pass the path as the state, use at your own risk, strongly recommend the following:
    // generate a random string or encode the hash of some client state (e.g., a cookie) in this state variable, you can validate the response to additionally ensure that the request and response originated in the same browser
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&scopes=${scopes}&redirect_uri=${encodeURIComponent(redirectLink)}&state=${encodeURIComponent(state)}&response_type=token`
    window.location = authUrl;
}

// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

export function getParamsFromHash() {
    const hash = window.location.hash.substring(1);
    const params = {};
    hash.split('&').map(hk => {
        const temp = hk.split('=');
        params[temp[0]] = temp[1]
    });
    return params
}

const LoginCta = (
    <Button size="large" onClick={redirectToLogin}>
        <img src="/static/Spotify_White.png"/>
        Login
    </Button>
)

export const PendingState = ({needLogin, loading}) => {
    return (
        <div className="root">
            <div className="copy">Login To Explore Spotify API the GraphQL Way!</div>
            {LoginCta}
            { /*language=CSS*/ }
            <style jsx>{`
                .root {
                    height: 100vh;
                    width: 100vw;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-direction: column;
                }
                :global(.Typist), .copy {
                    font-size: 1.5em;
                    max-width: 400px;
                    text-align: center;
                    margin-bottom: 1em;
                }
                :global(img) { width: 1em; height: 1em; margin-right: .25em; }
            `}</style>
        </div>
    )
}
import Router from 'next/router'
import Cookies from 'js-cookie'

// too lazy to make a NOC so using this for checking auth redirects
function checkLogin({req, res}) {
    if (res) {
        const {path} = req
        const needLogin = !req.cookies['spotify-token']
        if (needLogin) {
            res.redirect(`/login?returnTo=${encodeURIComponent(path)}`)
            return
        }
    }
    else if (!Cookies.get('spotify-token')) {
        Router.replace(`/login?returnTo=${encodeURIComponent(window.location.pathname)}`)
        return
    }
}

export default checkLogin
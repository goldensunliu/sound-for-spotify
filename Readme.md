### A Spotify Web App Experiment
Built on React/Next.js + GraphQL + Spotify Web API

Set `CLIENT_ID` in `spotify-config.js` to your own app

Optional: Set `APOLLO_ENGINE_API_KEY` in `spotify-config.js` to enable Apollo Engine for:
* Performance tracing
* Schema management
* Error tracking
* Caching

Make sure your app has the correct URL path for `/login` whitelisted
### Develop
```
npm run dev
```
### Production Build & Start
```
npm build && npm run start
```


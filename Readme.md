### A Web App For Exploring Spotify Data
This is a mobile-first responsive single page application providing a great browsing experiences exposing data not accessible through the official apps

Built using [React/Next.js](https://github.com/zeit/next.js) + [Apollo GraphQL](https://www.apollographql.com/docs/) + [Spotify Web API](https://beta.developer.spotify.com/documentation/web-api/reference/)

### Develop

##### Set App Configuration
1. [Set up and obtain your Spotify App Client ID](https://beta.developer.spotify.com/dashboard/applications)

2. White-list **http://localhost:3000/login** in your app settings
![](https://user-images.githubusercontent.com/1348993/35358882-25c621b4-0126-11e8-9e70-75c51a617a3c.png)
3. Set **`CLIENT_ID`** in `spotify-config.js` to your app's client ID

4. Optional [Apollo Engine](https://www.apollographql.com/engine/) Step: 
   * [Setup Service With Apollo Engine](https://www.apollographql.com/engine/)
   * Set **`APOLLO_ENGINE_API_KEY`** in `spotify-config.js` to your service API key:
   * Enjoy:
       * Performance tracing
       * Schema management
       * Error tracking
       * Caching
##### Local Build
```
npm run dev
```
hit up [http://localhost:3000/](http://localhost:3000/)
### Production Build & Start
```
npm build && npm run start
```


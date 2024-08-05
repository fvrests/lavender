![illustration of a starry landscape with a screencap of the lavender app & the lavender logo](./promo/promo-marquee-1400@2x.png)

# lavender new tab 🌙

## features

lavender is a soft, minimal new tab for your browser featuring:

- live time & weather updates
- 10 background colors in calming pastel and rich dark tones
- dynamic light / dark mode for adaptive viewing
- alternative UI layouts
- location-based weather fetching
- metric units & 24-hour time formatting
- options sync between devices using the chrome extension (optional)

## chrome extension

download at the [Chrome Web Store](https://chrome.google.com/webstore/detail/lavender-new-tab/ffobepdbanoiodmfimpmanafepclokbc). also installable to Brave and other Chromium-based browsers.

## firefox extension

> pending review

## web

- visit the [lavender site](https://lavender.fvrests.dev) to preview the app and customize your theme options
- set as your browser homepage or new tab page to pair lavender with any web platform

## manual installation

### setup

- clone or download lavender

  ```sh
  git clone git@github.com:fvrests/lavender.git && cd lavender
  ```

- sign up for [OpenWeather API](https://home.openweathermap.org/users/sign_up) and generate a new API key (you'll be using the Current Weather Data API - the free tier should be sufficient)

- within the `.env.example` file, paste your key directly after "VITE_WEATHER_KEY=" and rename the file to `.env`

  ```sh
  # .env
  VITE_WEATHER_KEY=<api_key>
  ```

- install dependencies and build lavender (generating the necessary `dist` folder)

  ```sh
  pnpm install && pnpm build
  ```

### platform-specific instructions

**web**

- paste the preview address from the terminal into your browser to view lavender locally. the build address defaults to [http://localhost:4173](http://localhost:4173)

**Chrome (& Chromium)**

- navigate to [chrome://extensions](chrome://extensions) (or the extensions page for your Chromium browser) and turn on developer mode (in the top right corner)
- click "load unpacked" at the top and select the `dist` folder of lavender

**firefox**

- navigate to [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox) and click "load temporary add-on". select the `dist/manifest.json` file from lavender

### open lavender

opening a new tab should now load lavender ✨ enjoy!

## contributing

**development**

- clone or download lavender

  ```sh
  git clone git@github.com:fvrests/lavender.git && cd lavender
  ```

- to run the local server with test weather data for development, install [Bun](https://bun.sh/docs/installation) and run the server

  ```sh
  pnpm dev:server
  ```

- install dependencies and start the dev server for lavender

  ```sh
  pnpm install && pnpm dev
  ```

**preview**

- build and preview lavender (generating the necessary `dist` folder)

  ```sh
  pnpm build && pnpm preview
  ```

- follow [platorm-specific instructions](#platform-specific-instructions) to load your local build

## permissions & licensing

the extension requires the following permissions:

| permission             | usage                                                                                       |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| local & chrome storage | store user settings. optionally, sync between devices with chrome storage.                  |
| geolocation            | fetch weather - data is used to query [OpenWeather API](https://openweathermap.org/find?q=) |

this project is licensed under MIT. please feel free to browse the source code or use snippets for your own projects.

[privacy policy](https://github.com/fvrests/lavender/blob/main/privacy-policy.md) | [terms of use](https://github.com/fvrests/lavender/blob/main/terms-of-use.md)

feedback & suggestions are always welcome!

by [fvrests](https://fvrests.dev)

[support my work 💛](https://ko-fi.com/fvrests)

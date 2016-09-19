#TvrboMobX

## Features
TvrboReact is a boilerplate that features the state of the art technologies from the React ecosystem. It provides out of the box support and examples for the following:

* **React** - Facebook's approach to scalable and performant web apps
* **MobX** - State management made simple
* **React Router** - Routing library for React
* **React i18Next** - Providing tools for template extraction, gettext files translation and more.
* **Webpack** - Module and asset bundler
* **Webpack Dev Server**
* **React Hot Loader**
* **NodeJS**
* **ExpressJS**
* **ES6** Javascript (Babel)
* **Sass**
* **Autoprefixer**
* **Mongoose**
* **nconf**
* **Universal (Server-side) rendering**
* **PM2**

## Getting Started
Here's how you get started:

### Requirements
Make sure you have `node` and `npm` installed. In mac, you can run:

	brew install node


### Clone the Repository

	git clone https://github.com/TvrboPro/TvrboMobX.git

<!--<h5>Second way: Yeoman Generator</h5>
<p>(This fork is still untested)</p>

<h5>Second way: Yeoman Generator</h5>
<ol>
    <li><code>npm install -g yo</code></li>
    <li><code>npm install -g TvrboPro/TvrboReact</code></li>
    <li>In your app's folder: <code>yo react-redux-fullstack</code></li>
</ol>
-->

### Install the dependences

	npm install

<!-- Using the yeoman generator should install the dependencies automatically.-->

You should now be able to run `make info` and see the full list of commands available to you.

### Live development

	make dev

Then, go to `http://localhost:8080` in your browser and start developing with hot loading!

### Build for production

	make

Will package all the assets into the `public` folder.

### Server management (in production)

	make run

Will start the app and serve whatever is in the `public` folder. Stop it by hitting `Ctrl+C`. This is a good way to check the real performance of your app in production conditions.

You can also use a process management tool like **[PM2](http://pm2.keymetrics.io/)**:

	make start

	# or
	make restart

	# or
	make stop


### Localization
#### Template extraction

	make po-extract

Will extract the strings contained within `t("Translatable text inside t(...)")` and will generate/update the necessary template files for translation.

For every supported language defined in `app/config.lang.js`, a folder will be created on `app/locales/` with the templates inside `translation.json` and `translation.po` files.

**NOTE**: Only `app/locales/../translation.json` will be used by the server. The `.po` files are intended for non technical translators, and they need to be **compiled** back to the corresponding `json` file.

Running this command will not wipe existing strings. Contents that are no longer used will be moved to the `translation_old.json` file.

#### Compiling from a .po file

	make po-compile

Reads all the `.po` files inside `app/locales/<lang>/` and compiles their content into the corresponding `translate.json` file.

### Deploy to Heroku
To deploy the app to Heroku, follow these steps:

* [Download the Heroku toolbelt](https://toolbelt.heroku.com) and create a [Heroku account](https://www.heroku.com)
* Log in with `heroku login`
* Run `git init`
* Run `heroku create <APP_NAME>`
* Run `git push heroku master`
* Open `https://APP_NAME.herokuapp.com` in your browser

### Project structure

	app
		api               >  Implement here the API to interact with the database
		locales           >  Translation files
		media             >  Media files that will be copied to 'public/media' on run
		states            >  Define your store(s) and methods here
		styles            >  Provide styling (Sass) for your components
		tests             >  Write your own tests here
		views             >  JSX components intended to be rendered as pages
		widgets           >  Smaller JSX components intended for encapsulation and reuse

		client.jsx        >  The entry point of the client JS
		config.js         >  Server settings (not suitable for Webpack bundling)
		config.lang.js    >  Static JS settings
		routes.jsx        >  Define your URL routes here
		server.jsx        >  The entry point of the server
		state.client.js   >  Get the initial state and inject it into the client
		state.server.js   >  Generate the initial state for the server side render

	index.js             >  The start script for the server
	gulp.lang.js         >  Performs the translation template extraction and compilation
	makefile             >  Build, debug and run targets are defined here
	webpack.*.config.js  >  Webpack development and production settings

	public               >  Folder where everything is packaged and served from

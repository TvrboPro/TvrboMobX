.DEFAULT_GOAL := build
.PHONY: build

PATH  := node_modules/.bin:$(PATH)
SHELL := /bin/bash

####################################
## MAIN

info:
	@echo "Available make commands:"
	@echo
	@echo "  $$ make              Compile JS/Jade files into 'public'"
	@echo "  $$ make dev          Compile, watch and hot reload"
	@echo "  $$ make run          Build and start the server for production"
	@echo
	@echo "  $$ make start        Start the app server (pm2)"
	@echo "  $$ make stop         Stop the app server (pm2)"
	@echo "  $$ make restart      Stop and start the app server (pm2)"
	@echo
	@echo "  $$ make install      Install the NPM packages"
	@echo "  $$ make info         What you are reading"
	@echo

clean:
	@echo
	@echo "# Cleaning ./public"
	@rm -Rf ./public


####################################
## BUILD TARGETS

build: media
	@echo
	@echo "# Running webpack"
	NODE_ENV='production' NODE_PATH=$NODE_PATH:./app MYAPP_DEBUG= webpack --progress --colors -p --config webpack.prod.config.js

media:
	@mkdir -p public

	@if [ "`node -e \"var config = require('./app/config'); console.log(config.DEBUG ? 'debug' : '')\"`" ]; then \
		make mediacopy; \
	else \
		make mediamin; \
	fi

mediamin:
	@echo
	@echo "Minifying media files to public/media"

	@find ./app/media -type d | while read dir; do \
		mkdir -p $${dir/.\/app\//./public/}; \
	done

	@find ./app/media -type f | while read f; do \
		imagemin --plugin=pngquant $$f > $${f/.\/app\//./public/}; \
	done

mediacopy:
	@echo
	@echo "# Copying media files to public/media"
	cp -a ./app/media ./public


####################################
## DEVELOPMENT TARGETS

dev: media
	@echo
	@echo "# Running Webpack Watch + Nodemon"
	@make launch &
	webpack-dev-server --progress --colors &
	NODE_PATH=$NODE_PATH:./app nodemon --watch app/api --watch app/models --watch app/lib --watch app/reducers .

launch:
	@sleep 3
	@echo "# Launching http://localhost:8080"
	@node -e "require('open')('http://localhost:8080');"

install:
	npm install

test:
	mocha --require ./app/tests/starter.js --require ./app/tests/helper.js ./app --recursive

po-extract:
	gulp --gulpfile gulp.lang.js extract

po-compile:
	gulp --gulpfile gulp.lang.js compile

todo:
	@notes app || echo 'Install notes with npm install -g'

####################################
## SERVER TARGETS

run: build
	@echo
	@echo "# Starting server"
	NODE_ENV='production' NODE_PATH=$NODE_PATH:./app MYAPP_DEBUG= node .

start:
	NODE_ENV='production' NODE_PATH=$NODE_PATH:./app MYAPP_DEBUG= pm2 start process.yml
	pm2 dump

stop:
	pm2 stop process.yml

restart:
	@make stop
	@make start

# shredbeat

> Music beat reacts to [keyboard shredding](https://www.urbandictionary.com/define.php?term=keyboard%20shredding) speed.

<img src="https://github.com/miguelmota/shredbeat/blob/master/screenshot.png?raw=true" width="400">

[https://shredbeat.com](https://shredbeat.com)

Note: this is an MVP

## Supported platforms

Supports Mac OS X and Linux.

Works with [SoundCloud](https://soundcloud.com), [Hype Machine](http://hypem.com/), [Mixcloud](https://www.mixcloud.com/), and [Fanburst](https://fanburst.com/) playlist urls.

## How it works

It listens to system wide [global keypress](https://github.com/miguelmota/global-keypress) events to determine how fast you're typing. The faster you type, the faster and louder the music will play.

## Development

install

```bash
npm install
```

start

```bash
npm run start
```

start in development mode

```bash
npm run start:dev
```

watch and build browser files

```bash
npm run watch
```

## Releases

Build release for each platform

```bash
npm run build
```

Download stable release for Mac OS X

[https://shredbeat.com/releases/shredbeat.zip](https://shredbeat.com/releases/shredbeat.zip)

<!--
Go to [Releases](https://github.com/miguelmota/shredbeat/releases) page to download latest build.
-->

## Resources

- [electron](http://electron.atom.io)

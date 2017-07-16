# shredbeat

> Music beat reacts to your [keyboard shredding](https://www.urbandictionary.com/define.php?term=keyboard%20shredding) speed 🤘

<img src="https://github.com/miguelmota/shredbeat/blob/master/screenshot.png?raw=true" width="500">

[https://shredbeat.com](https://shredbeat.com)

Note: this is a WIP

## Supported platforms

Supports Mac OS X and Linux.

Works with [YouTube](https://www.youtube.com/), [SoundCloud](https://soundcloud.com), [Hype Machine](http://hypem.com/), [Mixcloud](https://www.mixcloud.com/), and [Fanburst](https://fanburst.com/) playlist urls.

## How it works

Shredbeat listens to system wide [global keypress](https://github.com/miguelmota/global-keypress) events to determine how fast you're typing. The faster you type, the faster and louder the music will play.

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

also available on NPM

```bash
npm install -g shredbeat
```

Run

```bash
shredbeat
```

## Resources

- [electron](http://electron.atom.io)

# License

MIT

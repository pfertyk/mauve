<div align="center"><img src="https://raw.githubusercontent.com/pfertyk/mauve/master/resources/icon.png" alt="Mauve" width="200"></div>
<h1 align="center">Mauve</h1>
<h3 align="center">A very simple Markdown viewer</h3>
<div align="center">
<a href="https://travis-ci.org/pfertyk/mauve">
<img alt="Build Status" src="https://travis-ci.org/pfertyk/mauve.svg?branch=master" />
</a>
</div>

## Installation

```
# clone the repository and install dependencies
git clone https://github.com/pfertyk/mauve
cd mauve
npm install

# run the application
npm start
```

Binaries for Linux are available [here](https://github.com/pfertyk/mauve/releases).

## Features

Mauve implements a minimal set of features, including:

* displaying Markdown files
* reloading the view when the file is modified
* drag and drop support

## Why Mauve?

There are other Markdown viewers. Most of them run a server process to host the rendered files or can only be installed as a browser addon. This is complicated.

There is also [Electron Markdownify](https://github.com/amitmerchant1990/electron-markdownify). It supports exporting to PDF, themes, split view and other features. It is also complicated.

Mauve is simple. It does one thing: it displays Markdown files. If you want just that, try Mauve.

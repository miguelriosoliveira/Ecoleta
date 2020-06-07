<h1 align="center">
    <img alt="NextLevelWeek" title="#NextLevelWeek" src=".github/logo.svg" width="250px" />
</h1>

<h4 align="center">
	NextLevelWeek 1.0 by
   <a href="https://rocketseat.com.br/">Rocketseat</a> 🚀
</h4>

<p align="center">

   <a href="https://www.linkedin.com/in/miguelriosoliveira/">
      <img alt="Made by Miguel Rios" src="https://img.shields.io/badge/Made%20by-Miguel%20Rios-informational">
   </a>

   <a href="https://github.com/miguelriosoliveira/ecoleta/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/miguelriosoliveira/ecoleta?label=Last%20commit">
  </a>

   <img alt="GitHub languages count" src="https://img.shields.io/github/languages/count/miguelriosoliveira/ecoleta">

</p>

## 📝 Project

Ecoleta is a project developed by the purpose to connect people with institutions/companies which collects waste like electronics, cardboard papers, batteries, organics, etc.

The name, alongside the purpose of this project, was given because we developed this project in the same week of <b>[World Environment Week](https://www.worldenvironmentday.global/)</b>.

<h1 align="center">
    <img alt="Example" title="Example" src=".github/capa.svg" width="500px" />
</h1>

## ⚠️ Requirements

To run this application you have to install (if you don't have already installed) the follow programs:

- <b>In your computer</b>:
  - [Node js and npm](https://nodejs.org/en/download/)
  - [Expo cli](https://expo.io/tools#cli)
- <b>In your smartphone</b>:
  - The [expo](https://expo.io/) app, available on [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent) and [App Store](https://apps.apple.com/br/app/expo-client/id982107779)
    <br></br>

## ▶️ Start application

To start the application, you need follow the steps below:

### 🤖 Server:

- Go to `server` folder and run:
  - <b>`yarn knex:migrate`</b>
  - <b>`yarn knex:seed`</b>
  - <b>`yarn dev`</b>

### 💻 Web App:

- Go to `web` folder and run <b>`yarn start`</b>
- Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
- Now you can use the web application.
- <b>To see available points, you need to use mobile app, in `web` we just create the collection points.</b>

### 📱 Mobile App:

- Go to `mobile` folder and run <b>`expo start`</b> and your brownser will open a page with a qrcode.
- Open `expo` app and scan the qrcode.
- Wait and your app be ready and then you can use it.
- <b>To see points at map, you first need to create a collection point in `web` app, after that, you can find a point at mobile app.</b>

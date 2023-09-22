# Opening Knight

## Introduction

Opening Knight is an application designed to help chess enthusiasts explore and learn opening move sequences through effective repetition.

## MVP Features

- **User Authentication:**
  - User Sign-up, Log-in, and Log-out functionality using Firebase for secure authentication.

- **Navigation Management:**
  - Implemented React Router to streamline navigation within the app.
  - Established secure protected routes to control access exclusively for authenticated users.

- **Chess Opening Database:**
  - Leveraged the power of the Lichess Masters Database API to offer users the ability to access opening variations theorized by professional chess players since 1952.

- **Opening Repertoire Practice:**
  - Enable users to actively practice chess opening sequences from both sides of the board.

## Dependencies

- npm
- React Router
- React Chessboard
- Chess.js
- Firebase
- Google's Material UI

## Environment Set-up

1. Clone this repository.
2. Install dependencies with:
    ```
    npm install
    ```
3. Configure REACT_APP_BASE_URL in .env to point to the Opening Knight backend API host.
4. Start the application by running:
    ```
    npm run start
    ```

## Author

This application was developed by [Olive Henzel Lavine](https://linkedin.com/in/olive-lavine) as a capstone project for [Ada Developers Academy](https://adadevelopersacademy.org/).

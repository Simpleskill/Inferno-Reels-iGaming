# Inferno Reels Slot Game

## Project Overview
Inferno Reels is a slot game developed using PixiJS, Webpack, TypeScript and TweenJS. This game features a 3x3 grid slot machine with engaging animations and a responsive design to provide a seamless gaming experience across various devices.

## Technologies Used

### PixiJS 8.2
- **Why PixiJS?**
  - PixiJS is a powerful 2D rendering library that leverages WebGL and HTML5 Canvas. It provides excellent performance and a robust set of features for developing interactive graphics and games.
  - **Version 8.2**: The latest version, ensuring we benefit from the most recent improvements and bug fixes.
  - **Features**: Hardware acceleration, advanced text rendering, and a flexible API make it ideal for game development.
    - **Letterbox scale (RESPONSIVENESS SYSTEM)**: Letterbox scaling maximizes the game size to fit the screen while maintaining its aspect ratio and centering it, adding black bars where needed

### Webpack 5.2
- **Why Webpack?**
  - Webpack is a module bundler that simplifies the process of managing and bundling JavaScript files and assets.
  - **Ease of Builds**: It automates many build steps, such as transpiling TypeScript, bundling modules, and optimizing the final output for deployment.
  - **Features**: Code splitting, hot module replacement, and extensive plugin system enhance the development workflow.

### TypeScript 5.2
- **Why TypeScript?**
  - TypeScript is a statically typed superset of JavaScript that adds optional static types, interfaces, and other features to improve code quality and maintainability.
  - **Version 5.2**: Provides the latest language features and type-checking capabilities, ensuring robust and error-free code.
  - **Benefits**: Enhanced IDE support, better code refactoring, and early detection of potential bugs.

### Tween.js 23.1.2
- **Why Tween.js?**
  - Tween.js is a simple but powerful tweening engine that allows you to create smooth animations by interpolating numeric properties over time.
  - **Version 23.1.2**: Ensures compatibility with the latest features and improvements.
  - **Features**: 
    - **Ease of Use**: Tween.js provides a straightforward API for creating animations.
    - **Custom Easing Functions**: You can define custom easing functions to control the speed and acceleration of animations.
    - **Chaining Tweens**: Allows for complex animation sequences by chaining multiple tweens together.
  - **Usage in Inferno Reels**:
    - **Reel Animations**: Smoothly animate the position and blur of the slot machine reels.
    - **Winning Line Effects**: Create pulsing effects on winning lines to enhance visual feedback for players.
    - **Generic Tweening**: Used for various UI and game element animations to improve the overall user experience.

## Installation and Setup
To run this project locally, follow these steps:

1. **Clone the Repository**:
   ```sh
   git clone https://github.com/Simpleskill/Inferno-Reels-iGaming.git
   cd Inferno-Reels-iGaming

    Install Dependencies:
        npm install

    Run project:
        npm run start

    Open the website:
        http://localhost:1234/
    ```


## Features
- **Responsive Design**: Ensures the game works seamlessly on mobile and desktop devices.
- **Tween Animations**: Smooth animations for reels and symbols using TWEEN.js.
- **Modular Code**: Clean and maintainable code structure with TypeScript and modular design.


## Contact
For any inquiries or feedback, please contact:

- **Author**: André Castro
- **Email**: [andre.castro@example.com](mailto:andre.castro@example.com)
- **LinkedIn**: [André Castro](https://www.linkedin.com/in/andre-castro)







***************************************************
                    THE TEST
***************************************************


To create a simple 3 reel slot machine using JavaScript ES5 or ES6.

We realise everyone has different levels of skill and experience when it comes to development, so we have split the test into 3 sections. If you do not have the knowledge to complete them all then that's ok, we just want to see how you approach the problem and get a feel for how you code.

As a hint have a look for ‘Slot Machine’ in the search engine of your choice. If you have any questions, please feel free to get in touch with your point of contact. We’ll get back to you as soon as possible. We are not expected super graphics, this is not the point of the exercise. https://www.leovegas.com/en-row/game/fire-joker is a great point of reference to see the kind of game needed here.

No Sounds required

Required Tasks

· Spin button that triggers the reel spin.

· Spinning Reels which will display a random outcome when the spin button is pressed. (You can make them appear to spin if you wish). Reels are to display 3 symbols per reel, with 3 different types of symbol (e.g. cherry, banana, melon).

· Use of tweens / animations for reel spinning and should simple winning symbols

Optional Tasks

· We would like you to make the canvas auto fit to the current window size, so the game works on all mobile devices and desktop machines.

· Have your game handle pixel ratio and load higher res graphics if required.

· Feel free to work with Pixi.js or any other framework you like to work with.

Artwork can be programmer art or anything you find around on the web.

Review Criteria

We will be looking for:

    · Modular/Code organisation.

    · Generic where appropriate.

    · Use of inheritance.

    · Clarity/Self documenting.

    · Indenting.

    · Use of camel case.

    · Demonstrate understanding of JS scope.

    · Optimised code.

    · Use of callbacks / timers.

    · Basic Error Handling.

Submission

The contents of an accompanying README.md should contain:

    · A covering note explaining the technology choices you have made.

    · Any instructions required to run your solution and tests in a Windows environment.

A link to the git repository or some other code sharing platform showing your commit history.

----------------------------------------------------

# DETAILS


**Dependencies**

    "pixi.js": "8.2.0",
    "parcel-bundler": "^1.6.1",
    "@babel/core": "^7.21.3",
    "@babel/plugin-proposal-class-properties": "^7.10.1",
    "copy-webpack-plugin": "^11.0.0",
    "html-webpack-plugin": "^5.5.0",
    "npm-run-all": "^4.1.5",
    "rimraf": "^4.1.1",
    "terser-webpack-plugin": "^5.3.6",
    "ts-loader": "^9.4.2",
    "typescript": "^5.5.2",
    "webpack": "^5.75.0",
    "webpack-cli": "^5.0.1",
    "webpack-dev-server": "^4.11.1"
    

**Art**

    Generated using Midjourney AI
    Assets edited in photoshop



    
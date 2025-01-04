# Typing Speed Game

Welcome to the Typing Speed Game! This web-based game is designed to help you improve your typing speed and accuracy with randomly generated quotes. Test your skills, track your typing speed in words per minute (WPM) and characters per minute (CPM), and try to minimize your mistakes.

## Features
- Fetches random quotes to provide fresh typing content for every game.
- Displays real-time typing speed metrics: WPM, CPM, and mistakes.
- Provides a timer and a reset button to restart the game.
- Simple and responsive UI for a seamless typing experience.

## Usage
- **Start Typing**: After opening the game, start typing the displayed text.
- **Track Progress**: Monitor the WPM, CPM, and mistakes counters in real-time.
- **Reset Game**: Click the "Try Again" button to reset the timer and load a new quote.

## How It Works
- The game fetches 50 random quotes from the [Quotable API](https://quotable.io/) based on the configured character limits.
- Each character typed is compared with the quote to check for accuracy and is logged as correct or incorrect.
- At the end of the timer or once the quote is fully typed, the game displays the final results.

## Technologies Used
- **HTML**: For the structure of the game interface.
- **CSS**: For styling and responsive design.
- **JavaScript**: For game logic, including typing validation and API integration.
- **[Quotable API](https://quotable.io/)**: Provides random quotes to serve as typing content.


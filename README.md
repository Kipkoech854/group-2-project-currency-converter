Currency Converter App
Overview
The Currency Converter app allows users to convert an amount from one currency to another, view the conversion result, and keep track of recent conversions. The app provides an interactive interface where users can select currencies from a predefined list, enter an amount, and instantly view the converted result.

Additionally, users can toggle the display of a history of recent conversions, which is stored locally in the browser and persists across sessions. The app uses the Frankfurter API to fetch real-time exchange rates.

Features
Currency Conversion: Convert between different currencies using real-time exchange rates.

Recent Conversions History: View and toggle a list of recent conversions, including the amount, currencies used, result, and timestamp.

Persistent History: The conversion history is stored in the browser's localStorage, meaning it persists even after the app is closed or refreshed.

Responsive Interface: The app is designed to be user-friendly and responsive, allowing users to easily convert currencies on both desktop and mobile devices.

Graphical Display: The app integrates a graph displaying historical exchange rate data.

Key Components
Currency Selection:

A dropdown menu lets users choose the source (fromCurrency) and target (toCurrency) currencies from a predefined list of popular currencies (USD, EUR, GBP, JPY, AUD, CAD, CNY, INR, SGD, ZAR).

Amount Input:

Users can input the amount to convert. The app will automatically fetch and display the converted amount.

Conversion Result:

The conversion result is displayed under the input fields, showing the converted amount in the target currency.

Conversion History:

Users can view their recent conversions, which are displayed along with the amount, currencies used, the result, and the timestamp.

A button allows users to toggle the display of the history.

The history is limited to the most recent 20 conversions and can be cleared.

Graphical Display:

The app fetches and displays historical exchange rate data in a graphical format, allowing users to visualize currency trends over a selected period.

How It Works
When the user selects a source currency (fromCurrency) and a target currency (toCurrency) and enters an amount, the app fetches real-time exchange rates from the Frankfurter API.

The result is calculated and displayed to the user.

Each successful conversion is saved in the history, along with the timestamp.

The history is stored in the browser's localStorage, making it available across app sessions.

The user can view, toggle, and clear the conversion history as needed.

The app also displays a graph showing the exchange rates over a period of time.

API Used
Frankfurter API: Provides real-time exchange rate data for currency conversions.

Installation
Clone the repository to your local machine:

bash
Copy
Edit
git clone https://github.com/yourusername/currency-converter.git
Navigate into the project folder:

bash
Copy
Edit
cd currency-converter
Install the dependencies:

bash
Copy
Edit
npm install
Start the app:

bash
Copy
Edit
npm start
The app should now be running on http://localhost:3000.

Development
Folder Structure
src/: Contains all the source code for the app.

App.css: The styling for the app.

App.js: The main component that handles user interaction and API calls.

GraphDisplay.js: A component for displaying historical exchange rates in a graph format.

index.js: The entry point of the React application.

Dependencies
React: A JavaScript library for building user interfaces.

Chart.js: A library for creating graphical representations of data (used to render the exchange rate graph).

chart.js/auto: Automatically imports all the necessary chart types.

To Do
Add additional error handling for edge cases, such as invalid API responses.

Improve the UI design for better mobile responsiveness.

Allow users to select different periods for the exchange rate graph.

Screenshots
(Include any relevant screenshots of the app in action here)

License
This project is licensed under the MIT License.
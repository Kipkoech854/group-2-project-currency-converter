# Currency Converter

A simple currency converter application built with React. This project allows users to convert amounts between different currencies using real-time exchange rates.

## Features

- Select currencies from a dropdown menu.
- Input an amount to convert.
- View the converted amount in the selected currency.
- Swap the selected currencies with a button click.

## Project Structure

```
currency-converter
├── src
│   ├── components
│   │   ├── CurrencySelect.jsx
│   │   └── SwapButton.jsx
│   ├── constants
│   │   └── currencies.js
│   ├── hooks
│   │   └── useExchangeRate.js
│   ├── styles
│   │   └── index.css
│   ├── App.jsx
│   └── main.jsx
├── public
│   └── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd currency-converter
   ```

3. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and go to `http://localhost:3000` (or the port specified in the terminal).

3. Use the currency converter interface to select currencies and convert amounts.

## Contributing

Feel free to submit issues or pull requests for improvements or bug fixes.

## License

This project is licensed under the MIT License.
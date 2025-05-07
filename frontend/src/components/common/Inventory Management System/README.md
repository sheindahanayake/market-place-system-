# Inventory Management System

## Overview
The Inventory Management System is a web application designed to manage and track device repairs. It allows users to submit repair details through a form and view the submitted data in a report format.

## Project Structure
```
Inventory Management System
├── frontend
│   ├── public
│   │   └── index.html
│   ├── src
│   │   ├── components
│   │   │   ├── common
│   │   │   │   ├── Hero.jsx        # Component for submitting device repair details
│   │   │   │   └── ViewReport.jsx  # Component for viewing submitted repair data
│   │   │   └── App.jsx             # Main application component with routing
│   │   ├── assets
│   │   │   └── images              # Directory for image assets
│   │   ├── styles
│   │   │   └── index.css           # Global styles for the application
│   │   ├── utils
│   │   │   └── api.js              # Utility functions for API calls
│   │   └── index.js                # Entry point for the React application
├── package.json                     # Configuration file for npm
├── README.md                        # Documentation for the project
└── .gitignore                       # Specifies files to be ignored by Git
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd Inventory Management System
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage
1. Start the development server:
   ```
   npm start
   ```
2. Open your browser and go to `http://localhost:3000` to access the application.

## Features
- Submit device repair details through a user-friendly form.
- View submitted repair data in a structured report format.
- Responsive design for optimal viewing on various devices.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.
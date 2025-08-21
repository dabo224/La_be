# Université Project

This project is a web application for the Université de Labé, designed to facilitate user registration and event management. Below are the details regarding the structure and functionality of the application.

## Project Structure

```
université
├── src
│   ├── template
│   │   ├── inscription.ejs       # HTML structure for user registration page
│   │   └── events.ejs            # HTML structure for displaying events published by users
│   ├── routes
│   │   └── events.js              # Routes related to events (GET and POST requests)
│   ├── controllers
│   │   └── eventsController.js     # Business logic for events management
│   └── models
│       └── event.js               # Event model defining the schema for events
├── package.json                    # Configuration file for npm dependencies and scripts
├── app.js                          # Main entry point of the application
└── README.md                       # Documentation for the project
```

## Features

- **User Registration**: Users can register through the inscription page.
- **Event Management**: Users can view events published by others, with details such as title, date, and description.
- **Responsive Design**: The application is designed to be user-friendly and responsive.

## Setup Instructions

1. **Clone the Repository**:
   ```
   git clone <repository-url>
   cd université
   ```

2. **Install Dependencies**:
   ```
   npm install
   ```

3. **Run the Application**:
   ```
   node app.js
   ```
   The application will be available at `http://localhost:3000`.

## Usage

- Navigate to the registration page to create a new account.
- After registration, users can access the events page to view published events.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.
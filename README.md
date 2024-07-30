# Data Replication Service

This project is a data replication service that periodically transfers data from a middleman database to a live database. The goal is to ensure that live data is protected from being deleted or modified maliciously, while still allowing multiple users to interact with the middleman database.

## Features

- **Data Transfer**: Periodically replicates data from a middleman database to a live database.
- **Data Protection**: Ensures that live data is only accessible and modifiable by authorized users.
- **Automatic Cleanup**: Removes replicated entries from the middleman database to maintain data integrity.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Database Schema](#database-schema)
- [License](#license)

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/data-replication-service.git
    cd data-replication-service
    ```

2. Install dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the root directory and add your database credentials:
    ```env
    DB_USER=your_database_username
    DB_PASS=your_database_password
    DB_HOST=your_database_host
    ```

## Usage

1. Run the service:
    ```sh
    node index.js
    ```

2. The service will start replicating data every 5 minutes. Logs will be printed to the console to indicate the progress and status of the replication process.

## Configuration

The service uses environment variables to configure database connections. Make sure to provide the following variables in your `.env` file:

- `DB_USER`: The username for the database.
- `DB_PASS`: The password for the database.
- `DB_HOST`: The host address of the database.

## Database Schema
```sh
this is 100% changeable.
```
The `website_bans` table schema used in both the middleman and live databases is defined as follows:

- `ban_id` (INTEGER, Primary Key, Auto Increment)
- `banned_steamid` (STRING, Not Null)
- `admin_steamid` (STRING, Not Null)
- `reason` (STRING, Not Null)
- `banned_date` (INTEGER, Not Null)
- `unban_date` (INTEGER, Not Null)
- `ban_data` (TEXT, Default: "No extra data provided by the admin")
- `status` (INTEGER, Not Null, Default: 0, Validate: isIn [[0, 1, 2, 3]])
- `status_data` (STRING, Not Null, Default: "No extra information provided")
- `developer_notes` (TEXT, Allow Null)
- `replicated` (INTEGER, Not Null, Default: false)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

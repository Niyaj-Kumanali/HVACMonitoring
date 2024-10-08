# HVAC Monitoring

## Overview

The HVAC Monitoring project provides a comprehensive solution for monitoring and managing HVAC systems. It features interactive dashboards and widgets for visualizing real-time data, analyzing system performance, and ensuring optimal operation of HVAC systems.

## Features

- **Real-Time Monitoring**: Track HVAC system performance in real-time with dynamic dashboards.
- **Interactive Widgets**: Utilize various widgets to view and analyze data, including temperature, humidity, and system status.
- **Data Visualization**: Advanced charts and graphs to visualize HVAC data trends and historical performance.
- **Alerts and Notifications**: Configure alerts for system anomalies and performance issues.
- **User Management**: Role-based access control for different levels of users.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (for development)
- [PostgreSQL](https://www.postgresql.org/) (for relational data)
- [InfluxDB](https://www.influxdata.com/) (for time-series data)

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Niyaj-Kumanali/HVACMonitoring.git
    ```

2. Navigate to the project directory:
    ```bash
    cd HVACMonitoring
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Set up PostgreSQL and InfluxDB:
    - **PostgreSQL**: Install PostgreSQL and set up your database. Ensure that your database configuration is correctly set in your backend configuration files or deployment environment.
    - **InfluxDB**: Install InfluxDB and set up your time-series data store. Ensure that your InfluxDB configuration is correctly set in your backend configuration files or deployment environment.

5. Configure environment variables:
    - Create a `.env` file in the root directory with the following content:
        ```env
        VITE_API_URL=http://localhost:4000/api
        ```

6. Run the development server:
    ```bash
    npm run dev
    ```

## Usage

- **Access the Dashboard**: Open your web browser and go to `http://localhost:3000` to access the frontend dashboard.
- **View Data**: Navigate through the different widgets and charts to view real-time and historical data.
- **Configure Alerts**: Set up and manage alerts through the dashboard settings.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any inquiries or issues, please contact [niyajkumanali@gmail.com](mailto:niyajkumanali@gmail.com).

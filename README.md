# 💸 FinTrax: Personal Finance Management

<div align="center">
  <img src="https://img.shields.io/badge/Status-Active-success?style=for-the-badge" alt="Status" />
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Spring_Boot-3.1.12-6DB33F?style=for-the-badge&logo=spring-boot" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/MongoDB-Latest-47A248?style=for-the-badge&logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Plaid_API-Integrated-00B393?style=for-the-badge" alt="Plaid API" />
</div>

<div align="center">
  <br />
  <img src="https://assets-global.website-files.com/636a6f81a287f5628189d717/63c9ce90a51cd77d5af56f20_Expense-Tracker-p-800.webp" alt="FinTrax Screenshot" width="600px" style="border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.15);" />
  <br />
  <br />
</div>

## ✨ Overview

**FinTrax** is a modern personal finance management application that helps users track expenses, monitor income, and understand their spending habits. FinTrax integrates with the Plaid API to securely connect with users' bank accounts and automatically import transaction data.

## 🚀 Features

- **Bank Account Integration** - Connect securely to financial institutions via Plaid
- **Transaction Management** - View, add, edit, and categorize transactions
- **Financial Dashboard** - Visual breakdown of income and expenses
- **Data Visualization** - Interactive charts to understand spending patterns
- **Responsive Design** - Beautiful interface that works on any device
- **Dark/Light Mode** - Toggle between themes based on user preference

## 🛠️ Technology Stack

### Frontend
- **React** - Modern UI framework
- **CSS3** - Custom styling with CSS variables
- **Chart.js** - For data visualization
- **React Plaid Link** - For bank account integration

### Backend
- **Java Spring Boot** - API and business logic
- **Spring Security** - Authentication and authorization
- **MongoDB** - NoSQL database for flexible data storage
- **Maven** - Dependency management

### Third-Party Services
- **Plaid API** - Secure banking data aggregation

## 🔧 Getting Started

### Prerequisites
- Java 11+
- Node.js 14+ and npm/yarn
- MongoDB
- Plaid Developer Account

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/plaid-finance-app.git

# Navigate to project directory
cd plaid-finance-app

# Build with Maven
./mvnw clean install

# Run Spring Boot application
./mvnw spring-boot:run
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd plaid-finance-frontend/fintrax

# Install dependencies
npm install

# Start development server
npm start
```

### Configuration
Create an `.env` file in the `plaid-finance-frontend/fintrax` directory:

```
REACT_APP_API_URL=http://localhost:8080/api
```

Update `application.properties` with your Plaid API credentials:

```properties
plaid.client.id=YOUR_CLIENT_ID
plaid.secret=YOUR_SECRET
plaid.environment=sandbox
```

## 📊 Application Architecture

<div align="center">
  <img src="https://miro.medium.com/max/1400/1*ESPjx4XjiYEB2VvRYVNmyA.png" alt="Architecture Diagram" width="600px" style="border-radius: 8px; margin: 20px 0;" />
</div>

The application follows a standard client-server architecture:

1. **Frontend (React)** - Provides the user interface and communicates with the backend API
2. **Backend (Spring Boot)** - Handles business logic, data persistence, and integration with Plaid
3. **Database (MongoDB)** - Stores user data, transactions, and account information
4. **Plaid API** - Provides secure access to banking information

## 🔒 Security

FinTrax takes security seriously:

- Sensitive data is never stored directly
- Plaid handles all bank credentials
- Spring Security provides API protection
- All communications are encrypted with HTTPS
- API keys and secrets are stored securely in environment variables

## 🌱 Future Enhancements

- Budget planning and tracking
- Expense forecasting
- Goal setting and monitoring
- Mobile application
- Multi-currency support
- Investment tracking

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Plaid](https://plaid.com/) for their excellent financial API
- [Chart.js](https://www.chartjs.org/) for visualization components
- [React](https://reactjs.org/) and [Spring Boot](https://spring.io/projects/spring-boot) communities

---

<div align="center">
  <p>Made with ❤️ by Wesley Axline</p>
  <p>© 2025 FinTrax. All rights reserved.</p>
</div>

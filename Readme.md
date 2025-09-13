# Personal Finance Assistant

A full-stack MERN application designed to help users track, manage, and understand their financial activities. Users can log income and expenses, categorize transactions, and view summaries of their spending habits through an interactive analytics chart.
The app features advanced OCR capabilities to extract expense data from uploaded receipts (images and PDFs).

## ✨ Live Demo

**[View Live Project](https://personal-finance-assistant-rouge.vercel.app/)** 
*(Note: The free backend server may take 30-60 seconds to "wake up" on the first visit.)*

## 📸 Screenshots

*The Main Dashboard, showing the analytics chart and transaction list.*
![Dashboard Screenshot](https://github.com/sakshigithubssuk/Personal-Finance-assistant/tree/main/Demo) 


## Key Features

*   **Secure User Authentication:** Full registration and login system using JWT for security.
*   **Transaction Management:** Manually create, read, and list income & expense transactions.
*   **Dynamic Date Range Filtering:** Filter all transactions and analytics by a user-selected date range.
*   **Advanced Analytics Chart:** A clean, interactive bar chart visualizing income vs. expenses grouped by category.
*   **OCR Receipt Scanning:** Upload a receipt (image or PDF) to automatically parse individual line items and their prices, creating multiple transactions at once.
*   **Bonus - PDF History Upload:** Upload a PDF bank statement in a specific format to parse and import a full transaction history in bulk.

## Technologies Used

*   **Frontend:** React (with Vite), Chart.js, Axios
*   **Backend:** Node.js, Express, MongoDB (with Mongoose)
*   **Authentication:** JSON Web Tokens (JWT), Bcrypt
*   **File Processing:** Multer, Tesseract.js (for OCR), pdf-parse

## Setup and Installation

Follow these instructions to run the project locally on your machine.

### Prerequisites

*   Node.js (update nvm version (20.19.5))
*   npm 
*   MongoDB (either a local instance or a free cluster on MongoDB Atlas)

### Backend Setup

1.  **Navigate to the backend directory:**
    ```sh
    cd backend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Create a `.env` file:**
    In the `backend` folder, create a new file named `.env` and add the following environment variables.

    ```
    MONGO_URI=your mongo_uri
    JWT_SECRET=your_super_secret_jwt_key
    ```

4.  **Start the server:**
    ```sh
    npm start
    ```
    The backend server will be running on `http://localhost:5000`.(locally)

### Frontend Setup

1.  **Open a new terminal** and navigate to the frontend directory:
    ```sh
    cd frontend
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```
  
3.  **(Optional for Deployment) Create a `.env.local` file:**
    If you are deploying, create a `.env.local` file in the `frontend` folder to point to your live backend URL.
    ```
    VITE_API_URL=https://personal-finance-assistant-3r7t.onrender.com


    ```
    *Note: For local development, this is not needed as a proxy is often used.*


4.  **Start the React application:**
    ```sh
    npm run dev
    ```
    The frontend will be running on `http://localhost:5173` 

---




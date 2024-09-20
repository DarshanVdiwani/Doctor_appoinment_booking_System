
# Doctor Appointnment Booking System

This is a full-stack web application using the MERN (MongoDB, Express, React, Node.js) stack with integrated Razorpay integration. The project contains both frontend and backend code within this repository.



---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/DarshanVdiwani/Doctor_appoinment_booking_System.git
cd Doctor_appoinment_booking_System
```

---

### 2. Backend Setup

1. Navigate to the `Backend` directory:

   ```bash
   cd Backend
   ```

2. Install backend dependencies:

   ```bash
   npm install
   ```

3. Edit a `.env` file in the `Backend` directory.


4. Start the backend server:

   ```bash
   npm start
   ```

   The backend server will run on `node index.js`.

---

### 3. Frontend Setup

1. Navigate to the `Frontend` directory:

   ```bash
   cd ../Frontend
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the `Frontend` directory with the following content:

   ```
   VITE_CLOUD_NAME =   // add here your cloude name
   VITE_UPLOAD_PRESET = doctor-booking-system  // add your VITE_UPLOAD_PRESET
   ```

4. **Update Razorpay Key in Code**:
   - Open `Src/Pages/Doctors/SidePanel.js`.
   - Update the `RAZORPAY_KEY_ID` with your Razorpay Key wherever it is used.

5. Start the frontend server:

   ```bash
   npm run dev
   ```


---

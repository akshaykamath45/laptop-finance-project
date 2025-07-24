# Laptop Finance Project

A web application for users to apply for laptop loans, check eligibility, track application status, and manage EMI payments.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [User Flow](#user-flow)
3. [Backend/API Details](#backendapi-details)
4. [API Call Summary](#api-call-summary)
5. [Local Setup](#local-setup)
6. [File Structure](#file-structure)

---

## Project Overview

This project allows users to:

- Browse laptops and view details
- Sign up and log in
- Apply for a loan for a selected laptop
- Check eligibility and view EMI schedule
- Confirm and submit loan applications
- Track application status
- Make EMI payments

The frontend is a vanilla JS/HTML/CSS app. The backend is expected to be a REST API (not included in this repo) running at `http://localhost:9090`.

---

## User Flow

### 1. **Signup & Login**
- **signup.html**: User creates an account (API: `/user-db/add`)
- **login.html**: User logs in (API: `/user-db/login`)
- **Admin Login**: Admin logs in using special credentials (API: `/user-db/login`).

### 2. **Browse Products**
- **products.html**: User browses available laptops (API: `/laptop-db/all`)
- **product-detail.html**: User views details of a selected laptop

### 3. **Apply for Loan**
- **application-form.html**: User fills out application form (personal, employment, location info)
- **eligibility-result.html**: System checks eligibility and shows loan summary & EMI schedule (API: `/eligibility-db/check`)
- **loan-confirmation.html**: User reviews all details and confirms application

### 4. **Submit Loan Application**
- On confirmation, the app:
  - Submits loan data (API: `/loan-db/add`)
  - Submits EMI schedule (API: `/emi-db/add` for each EMI)
  - Redirects to application status page

### 5. **Track Application**
- **application-status.html**: User sees status of their loan (API: `/loan-db/status?customerId=...`)
- **my-applications.html**: User sees all their applications

### 6. **EMI Payment**
- **emi-payment.html**: User pays EMI (API: `/emi-db/pay`)

### 7. **Admin Dashboard & Actions**
- **dashboard.html**: Admin dashboard after login.
  - View all customers (API: `/user-db/all`)
  - View all loan applications (API: `/loan-db/all`)
  - View application details (API: `/loan-db/:id`)
  - Approve or reject loan applications (API: `/loan-db/approve`, `/loan-db/reject`)
- **all-applications.html**: Admin can see a list of all loan applications.
- **application-detail.html**: Admin can view details of a specific application and take action (approve/reject).
- **view-loan-application.html**: Admin can view a single application in detail.

---

## Backend/API Details

**Base URL:** `http://localhost:9090`

### User APIs

| Endpoint              | Method | Purpose                | Payload/Params                |
|-----------------------|--------|------------------------|-------------------------------|
| `/user-db/add`        | POST   | Register new user      | `{...userData}`               |
| `/user-db/login`      | POST   | User login             | `{email, password}`           |
| `/user-db/:id`        | GET    | Get user details       | `:id` = user/customer ID      |
| `/user-db/all`        | GET    | Get all customers      | -                             |

### Laptop APIs

| Endpoint              | Method | Purpose                | Payload/Params                |
|-----------------------|--------|------------------------|-------------------------------|
| `/laptop-db/all`      | GET    | List all laptops       | -                             |
| `/laptop-db/:id`      | GET    | Get laptop details     | `:id` = laptop ID             |

### Loan Application APIs

| Endpoint              | Method | Purpose                | Payload/Params                |
|-----------------------|--------|------------------------|-------------------------------|
| `/loan-db/add`        | POST   | Submit loan application| `{...loanData}`               |
| `/loan-db/status`     | GET    | Get loan status        | `customerId` query param      |
| `/loan-db/all`        | GET    | List all applications  | -                             |
| `/loan-db/:id`        | GET    | Get application detail | `:id` = application ID        |
| `/loan-db/approve`    | POST   | Approve application    | `{applicationId}`             |
| `/loan-db/reject`     | POST   | Reject application     | `{applicationId, reason}`     |

### Eligibility APIs

| Endpoint                  | Method | Purpose                | Payload/Params                |
|---------------------------|--------|------------------------|-------------------------------|
| `/eligibility-db/check`   | POST   | Check eligibility      | `{...applicationData}`        |

### EMI APIs

| Endpoint              | Method | Purpose                | Payload/Params                |
|-----------------------|--------|------------------------|-------------------------------|
| `/emi-db/add`         | POST   | Add EMI schedule       | `{...emiData}`                |
| `/emi-db/pay`         | POST   | Pay EMI                | `{loanId, emiNumber, amount}` |
| `/emi-db/status`      | GET    | Get EMI status         | `loanId` query param          |

---

## API Call Summary

| Page/Action                | API Call(s) Made                                                                 |
|----------------------------|----------------------------------------------------------------------------------|
| Signup                     | `POST /user-db/add`                                                              |
| Login                      | `POST /user-db/login`                                                            |
| Product List               | `GET /laptop-db/all`                                                             |
| Product Detail             | `GET /laptop-db/:id`                                                             |
| Application Form Submit    | (May store locally, then check eligibility)                                      |
| Eligibility Check          | `POST /eligibility-db/check`                                                     |
| Loan Confirmation Submit   | `POST /loan-db/add`<br>`POST /emi-db/add` (for each EMI in schedule)             |
| Application Status         | `GET /loan-db/status?customerId=...`                                             |
| EMI Payment                | `POST /emi-db/pay`                                                               |
| Admin Dashboard            | `GET /user-db/all`, `GET /loan-db/all`                                           |
| Admin View Application     | `GET /loan-db/:id`                                                               |
| Admin Approve Application  | `POST /loan-db/approve`                                                          |
| Admin Reject Application   | `POST /loan-db/reject`                                                           |

---

## Local Setup

1. **Clone the repo**
   ```sh
   git clone <repo-url>
   cd laptop-finance-2/laptop-finance-project
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```

3. **Start Backend**
   - Ensure your backend REST API is running at `http://localhost:9090`
   - (Backend code is not included in this repo)

4. **Open Frontend**
   - Open `index.html` in your browser (or use a local server for best results)

---

## File Structure

```
laptop-finance-project/
  all-applications.html/js      # Admin: view all applications
  application-detail.html/js    # Admin: view application details and approve/reject
  dashboard.html/js             # Admin dashboard (view customers, applications)
  view-loan-application.html/js # Admin: view single application
  application-form.html/js      # User: loan application form
  application-status.html/js    # User: track application status
  dashboard.html/js             # User dashboard
  eligibility-result.html/js    # Show eligibility & EMI schedule
  emi-payment.html/js           # Pay EMI
  index.html                    # Landing page
  loan-confirmation.html/js     # Confirm and submit loan
  login.html/js                 # Login page
  my-applications.html/js       # User: view all their applications
  product-detail.html/js        # Laptop details
  products.html/js              # Laptop list
  script.js                     # Shared scripts
  signup.html/js                # Signup page
  styles.css                    # Styles
  user-detail.html/js           # User details
```

---

## Notes

- All data is stored in the backend except for temporary selections (e.g., selected laptop, eligibility result) which are kept in `localStorage` between steps.
- The backend must be running for the app to function.
- API endpoints and payloads must match backend expectations.
- Admin users have access to additional pages and actions, including viewing all customers, all loan applications, and the ability to approve or reject applications.
- Admin actions are performed via dedicated API endpoints for application approval and rejection.

---

Let me know if you want a diagram or more details on any specific flow! 
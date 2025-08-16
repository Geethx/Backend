# 🏥 Medicine Backend API Testing Guide

This guide will help you test all endpoints in your NestJS Medicine Backend application.

## 📋 **Prerequisites**

1. **PostgreSQL Database Setup**

   - Install PostgreSQL
   - Create a database named `medicine_db`
   - Update your `.env` file with database credentials

2. **Environment Variables**
   Create a `.env` file in your project root with:
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=medicine_db
   JWT_SECRET=your_jwt_secret_key_here
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_here
   PORT=3000
   ```

## 🚀 **Quick Start**

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Development Server

```bash
npm run start:dev
```

### 3. Access Swagger Documentation

Open your browser and go to: `http://localhost:3000/api`

## 📊 **All Available Endpoints**

### **Authentication** (2 endpoints)

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT tokens

### **Users** (1 endpoint)

- `GET /users/:id` - Get user profile

### **Doctors** (7 endpoints)

- `POST /doctor/:userId` - Create doctor profile
- `GET /doctor` - Get all doctors
- `GET /doctor/:id` - Get doctor by ID
- `GET /doctor/:id/time-slots` - Get doctor available time slots
- `GET /doctor/me/time-slots` - Get logged-in doctor's time slots (JWT Protected)
- `PATCH /doctor/:id` - Update doctor
- `DELETE /doctor/:id` - Delete doctor

### **Appointments** (5 endpoints)

- `POST /appointment` - Create appointment
- `GET /appointment/doctor/:doctorId` - Get appointments by doctor
- `PATCH /appointment/:id/accept` - Accept appointment
- `PATCH /appointment/:id/reject` - Reject appointment
- `PATCH /appointment/:id/status` - Update appointment status

**Total: 15 endpoints**

## 🧪 **Testing Methods**

### **Method 1: Automated Test Script**

Run the automated test script:

```bash
node test-endpoints.js
```

### **Method 2: Postman Collection**

1. Import `Medicine-Backend-API.postman_collection.json` into Postman
2. Set the `baseUrl` variable to `http://localhost:3000`
3. Run the "Login User" request first to get the auth token
4. The token will be automatically set for protected endpoints

### **Method 3: Swagger UI**

1. Go to `http://localhost:3000/api`
2. Click "Authorize" and enter your JWT token
3. Test endpoints directly from the browser

### **Method 4: cURL Commands**

#### Authentication

```bash
# Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

#### Users

```bash
# Get user profile
curl -X GET http://localhost:3000/users/1
```

#### Doctors

```bash
# Create doctor with time slots
curl -X POST http://localhost:3000/doctor/1 \
  -H "Content-Type: application/json" \
  -d '{"specialization":"Cardiology","experience":5,"licenseNumber":"DOC123456","availableTimeSlots":["09:00-10:00","14:00-15:00","16:00-17:00"]}'

# Get all doctors
curl -X GET http://localhost:3000/doctor

# Get doctor by ID
curl -X GET http://localhost:3000/doctor/1

# Get doctor time slots
curl -X GET http://localhost:3000/doctor/1/time-slots

# Get logged-in doctor's time slots (requires JWT token)
curl -X GET http://localhost:3000/doctor/me/time-slots \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Update doctor with new time slots
curl -X PATCH http://localhost:3000/doctor/1 \
  -H "Content-Type: application/json" \
  -d '{"specialization":"Neurology","availableTimeSlots":["10:00-11:00","15:00-16:00"]}'

# Delete doctor
curl -X DELETE http://localhost:3000/doctor/1
```

#### Appointments

```bash
# Create appointment
curl -X POST http://localhost:3000/appointment \
  -H "Content-Type: application/json" \
  -d '{"patientName":"John Doe","patientEmail":"john@example.com","appointmentDate":"2024-01-15T10:00:00Z","doctorId":"test-doctor-id"}'

# Get appointments by doctor
curl -X GET http://localhost:3000/appointment/doctor/1

# Accept appointment
curl -X PATCH http://localhost:3000/appointment/1/accept

# Reject appointment
curl -X PATCH http://localhost:3000/appointment/1/reject

# Update appointment status
curl -X PATCH http://localhost:3000/appointment/1/status \
  -H "Content-Type: application/json" \
  -d '{"status":"CONFIRMED"}'
```

## 🔍 **Testing Checklist**

### **Pre-Testing Setup**

- [ ] PostgreSQL database is running
- [ ] Environment variables are configured
- [ ] Server is running on port 3000
- [ ] Swagger docs are accessible at `/api`

### **Authentication Testing**

- [ ] User registration works
- [ ] User login returns JWT tokens
- [ ] Invalid credentials are rejected

### **Public Endpoints Testing**

- [ ] User profile retrieval
- [ ] Doctor CRUD operations
- [ ] Doctor time slots retrieval
- [ ] Appointment CRUD operations

### **Protected Endpoints Testing**

- [ ] Logged-in doctor can access their own time slots
- [ ] Invalid/missing tokens are rejected
- [ ] Each doctor only sees their own time slots

### **Error Handling Testing**

- [ ] 404 for non-existent resources
- [ ] 400 for invalid data
- [ ] 401 for unauthorized access
- [ ] 500 for server errors

## 🐛 **Common Issues & Solutions**

### **Database Connection Issues**

- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database `medicine_db` exists

### **JWT Token Issues**

- Check `JWT_SECRET` and `JWT_REFRESH_SECRET` in `.env`
- Ensure tokens are included in Authorization header
- Verify token format: `Bearer <token>`

### **CORS Issues**

- CORS is enabled globally in `main.ts`
- Check if frontend origin is allowed

### **Validation Errors**

- Check DTO validation rules
- Ensure required fields are provided
- Verify data types match expectations

## 📈 **Performance Testing**

### **Load Testing with Artillery**

```bash
npm install -g artillery
artillery quick --count 100 --num 10 http://localhost:3000/doctor
```

### **Memory Usage Monitoring**

```bash
npm run start:debug
# Monitor memory usage in browser dev tools
```

## 🔒 **Security Testing**

### **JWT Token Security**

- Test with expired tokens
- Test with invalid tokens
- Test with missing tokens

### **Input Validation**

- Test with SQL injection attempts
- Test with XSS payloads
- Test with oversized payloads

## 📝 **API Documentation**

The complete API documentation is available at:

- **Swagger UI**: `http://localhost:3000/api`
- **OpenAPI JSON**: `http://localhost:3000/api-json`

## 🎯 **Next Steps**

1. **Add Unit Tests**: Create comprehensive unit tests for each service
2. **Add Integration Tests**: Test database interactions
3. **Add E2E Tests**: Test complete user workflows
4. **Add API Rate Limiting**: Implement rate limiting for production
5. **Add Logging**: Implement structured logging
6. **Add Monitoring**: Set up health checks and metrics

---

**Happy Testing! 🚀**

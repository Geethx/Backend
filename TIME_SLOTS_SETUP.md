# 🕐 Doctor Time Slots Feature Setup Guide

This guide explains how to set up and use the doctor time slots feature in your Medicine Backend and Flutter app.

## 📋 **Backend Setup**

### **1. Database Schema**

The doctor entity already includes the `availableTimeSlots` field:

```typescript
@Column('simple-array', { nullable: true })
availableTimeSlots?: string[];
```

### **2. API Endpoints**

The following endpoints are available for managing doctor time slots:

#### **Create Doctor with Time Slots**

```bash
POST /doctor/:userId
Content-Type: application/json

{
  "specialization": "Cardiology",
  "experience": 5,
  "licenseNumber": "DOC123456",
  "availableTimeSlots": ["09:00-10:00", "14:00-15:00", "16:00-17:00"]
}
```

#### **Get Doctor Time Slots**

```bash
GET /doctor/:id/time-slots
```

**Response:**

```json
{
  "doctorId": "uuid",
  "doctorName": "Dr. John Doe",
  "availableTimeSlots": ["09:00-10:00", "14:00-15:00", "16:00-17:00"]
}
```

#### **Update Doctor Time Slots**

```bash
PATCH /doctor/:id
Content-Type: application/json

{
  "availableTimeSlots": ["10:00-11:00", "15:00-16:00"]
}
```

### **3. Testing the Backend**

Run the automated test script:

```bash
node test-endpoints.js
```

Or use the provided Postman collection: `Medicine-Backend-API.postman_collection.json`

## 📱 **Flutter Setup**

### **1. Add HTTP Package**

Add the http package to your `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0
  provider: ^6.0.5
```

### **2. Files to Add**

Copy these files to your Flutter project:

1. **`doctor_time_slots_service.dart`** - Service for API calls
2. **`availableTimeSlot.dart`** - Updated widget to display time slots
3. **`example_usage.dart`** - Example of how to use the widget

### **3. Update Base URL**

In `doctor_time_slots_service.dart`, update the base URL to match your backend:

```dart
static const String baseUrl = 'http://your-backend-url:3000';
```

### **4. Using the Widget**

#### **Show Current User's Time Slots**

```dart
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (context) => const AvailableTimeSlot(),
  ),
);
```

#### **Show Specific Doctor's Time Slots**

```dart
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (context) => const AvailableTimeSlot(
      doctorId: 'doctor-uuid-here',
    ),
  ),
);
```

## 🚀 **Complete Workflow**

### **Step 1: Start Backend Server**

```bash
# Set up environment variables
cp env.example .env
# Edit .env with your database credentials

# Install dependencies
npm install

# Start the server
npm run start:dev
```

### **Step 2: Create a Doctor with Time Slots**

```bash
# First, register a user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"doctor@example.com","password":"password123","name":"Dr. John Doe"}'

# Then create a doctor profile with time slots
curl -X POST http://localhost:3000/doctor/1 \
  -H "Content-Type: application/json" \
  -d '{
    "specialization":"Cardiology",
    "experience":5,
    "licenseNumber":"DOC123456",
    "availableTimeSlots":["09:00-10:00","14:00-15:00","16:00-17:00"]
  }'
```

### **Step 3: Test the API**

```bash
# Get doctor time slots
curl -X GET http://localhost:3000/doctor/1/time-slots
```

### **Step 4: Use in Flutter App**

```dart
// In your Flutter app
import 'availableTimeSlot.dart';

// Navigate to time slots
Navigator.push(
  context,
  MaterialPageRoute(
    builder: (context) => const AvailableTimeSlot(doctorId: '1'),
  ),
);
```

## 📊 **Data Format**

### **Time Slot Format**

Time slots should be in the format: `"HH:MM-HH:MM"`
Examples:

- `"09:00-10:00"`
- `"14:30-15:30"`
- `"16:00-17:00"`

### **API Response Format**

```json
{
  "doctorId": "uuid-string",
  "doctorName": "Dr. John Doe",
  "availableTimeSlots": ["09:00-10:00", "14:00-15:00", "16:00-17:00"]
}
```

## 🔧 **Customization**

### **Adding Time Slot Validation**

You can add validation to ensure time slots are in the correct format:

```typescript
// In create-doctor.dto.ts
@IsArray()
@ArrayMinSize(1)
@ValidateNested({ each: true })
@Type(() => String)
@Matches(/^\d{2}:\d{2}-\d{2}:\d{2}$/, { each: true })
availableTimeSlots?: string[];
```

### **Adding Time Slot Business Logic**

You can add methods to check for conflicts or validate time slots:

```typescript
// In doctor.service.ts
async validateTimeSlots(timeSlots: string[]): Promise<boolean> {
  // Add your validation logic here
  return true;
}
```

## 🐛 **Troubleshooting**

### **Common Issues**

1. **CORS Errors**

   - Ensure CORS is enabled in your backend
   - Check if the frontend URL is allowed

2. **Database Connection Issues**

   - Verify PostgreSQL is running
   - Check database credentials in `.env`

3. **Time Slots Not Saving**

   - Ensure the `availableTimeSlots` field is included in the request
   - Check that the field is properly validated

4. **Flutter HTTP Errors**
   - Verify the backend URL is correct
   - Check if the backend server is running
   - Ensure the http package is added to pubspec.yaml

### **Debug Steps**

1. **Check Backend Logs**

   ```bash
   npm run start:dev
   # Look for any error messages
   ```

2. **Test API Directly**

   ```bash
   curl -X GET http://localhost:3000/doctor/1/time-slots
   ```

3. **Check Flutter Console**
   - Look for any error messages in the Flutter console
   - Check network requests in the debug console

## 📈 **Next Steps**

1. **Add Time Slot Conflicts Detection**

   - Check for overlapping appointments
   - Validate against existing bookings

2. **Add Time Zone Support**

   - Store time slots with timezone information
   - Convert to user's local timezone

3. **Add Recurring Time Slots**

   - Support for weekly schedules
   - Handle holidays and exceptions

4. **Add Time Slot Booking**
   - Integrate with appointment system
   - Real-time availability updates

---

**Happy Coding! 🚀**

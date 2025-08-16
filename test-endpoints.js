const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
let authToken = '';
let refreshToken = '';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123',
  name: 'Test User',
};

const testDoctor = {
  specialization: 'Cardiology',
  experience: 5,
  licenseNumber: 'DOC123456',
  availableTimeSlots: ['09:00-10:00', '14:00-15:00', '16:00-17:00'],
};

const testAppointment = {
  patientName: 'John Doe',
  patientEmail: 'john@example.com',
  appointmentDate: '2024-01-15T10:00:00Z',
  doctorId: 'test-doctor-id',
};

async function testEndpoint(method, endpoint, data = null, headers = {}) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    console.log(`✅ ${method} ${endpoint} - Status: ${response.status}`);
    return response.data;
  } catch (error) {
    console.log(
      `❌ ${method} ${endpoint} - Error: ${error.response?.status || error.message}`,
    );
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting API Endpoint Tests...\n');

  // 1. Test Authentication Endpoints
  console.log('📋 Testing Authentication Endpoints:');
  console.log('=====================================');

  // Register user
  const registerResponse = await testEndpoint(
    'POST',
    '/auth/register',
    testUser,
  );

  // Login user
  const loginResponse = await testEndpoint('POST', '/auth/login', {
    email: testUser.email,
    password: testUser.password,
  });

  if (loginResponse) {
    authToken = loginResponse.access_token;
    refreshToken = loginResponse.refresh_token;
    console.log('🔑 Authentication successful, tokens received\n');
  }

  // 2. Test User Endpoints
  console.log('📋 Testing User Endpoints:');
  console.log('==========================');
  await testEndpoint('GET', '/users/1');

  // 3. Test Doctor Endpoints
  console.log('\n📋 Testing Doctor Endpoints:');
  console.log('============================');
  await testEndpoint('POST', '/doctor/1', testDoctor);
  await testEndpoint('GET', '/doctor');
  await testEndpoint('GET', '/doctor/1');
  await testEndpoint('GET', '/doctor/1/time-slots');

  // Test the new secure endpoint for logged-in doctor
  await testEndpoint('GET', '/doctor/me/time-slots', null, {
    Authorization: `Bearer ${authToken}`,
  });

  await testEndpoint('PATCH', '/doctor/1', {
    specialization: 'Neurology',
    availableTimeSlots: ['10:00-11:00', '15:00-16:00'],
  });
  await testEndpoint('DELETE', '/doctor/1');

  // 4. Test Appointment Endpoints
  console.log('\n📋 Testing Appointment Endpoints:');
  console.log('==================================');
  await testEndpoint('POST', '/appointment', testAppointment);
  await testEndpoint('GET', '/appointment/doctor/1');
  await testEndpoint('PATCH', '/appointment/1/accept');
  await testEndpoint('PATCH', '/appointment/1/reject');
  await testEndpoint('PATCH', '/appointment/1/status', { status: 'CONFIRMED' });

  console.log('\n🎉 All endpoint tests completed!');
  console.log('\n📊 Summary:');
  console.log('- Authentication: 2 endpoints');
  console.log('- Users: 1 endpoint');
  console.log('- Doctors: 7 endpoints (including secure time slots)');
  console.log('- Appointments: 5 endpoints');
  console.log('\nTotal: 15 endpoints tested');
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get(`${BASE_URL}/api`);
    console.log(
      '✅ Server is running and Swagger docs available at http://localhost:3000/api',
    );
    return true;
  } catch (error) {
    console.log(
      '❌ Server is not running. Please start the server first with: npm run start:dev',
    );
    return false;
  }
}

// Run the tests
async function main() {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runTests();
  }
}

main().catch(console.error);

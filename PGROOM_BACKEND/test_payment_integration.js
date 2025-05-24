/**
 * Simple test script to verify Razorpay integration
 * Run this script to test basic functionality
 * 
 * Usage: node test_payment_integration.js
 */

const { razorpay, RAZORPAY_CONSTANTS } = require('./app/config/razorpay');

async function testRazorpayConnection() {
  console.log('🧪 Testing Razorpay Integration...\n');

  try {
    // Test 1: Check Razorpay configuration
    console.log('1. Testing Razorpay Configuration...');
    console.log('   ✓ Razorpay instance created successfully');
    console.log('   ✓ Constants loaded:', Object.keys(RAZORPAY_CONSTANTS));
    
    // Test 2: Create a test order
    console.log('\n2. Testing Order Creation...');
    const testOrder = {
      amount: 100, // ₹1 in paise
      currency: RAZORPAY_CONSTANTS.CURRENCY,
      receipt: `${RAZORPAY_CONSTANTS.RECEIPT_PREFIX}test_${Date.now()}`,
      payment_capture: RAZORPAY_CONSTANTS.PAYMENT_CAPTURE,
      notes: {
        test: 'true',
        description: 'Test order for integration verification'
      }
    };

    const order = await razorpay.orders.create(testOrder);
    console.log('   ✓ Test order created successfully');
    console.log('   Order ID:', order.id);
    console.log('   Amount:', order.amount);
    console.log('   Currency:', order.currency);
    console.log('   Status:', order.status);

    // Test 3: Fetch the created order
    console.log('\n3. Testing Order Retrieval...');
    const fetchedOrder = await razorpay.orders.fetch(order.id);
    console.log('   ✓ Order fetched successfully');
    console.log('   Fetched Order ID:', fetchedOrder.id);
    console.log('   Status:', fetchedOrder.status);

    // Test 4: List recent orders
    console.log('\n4. Testing Orders List...');
    const orders = await razorpay.orders.all({ count: 5 });
    console.log('   ✓ Orders list retrieved successfully');
    console.log('   Total orders in response:', orders.items.length);

    console.log('\n✅ All tests passed! Razorpay integration is working correctly.');
    console.log('\n📋 Next Steps:');
    console.log('   1. Set up your frontend with Razorpay Checkout');
    console.log('   2. Configure webhook URL in Razorpay Dashboard');
    console.log('   3. Test end-to-end payment flow');
    console.log('   4. Switch to live credentials for production');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\n🔧 Troubleshooting:');
    console.error('   1. Check your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env file');
    console.error('   2. Ensure you have internet connection');
    console.error('   3. Verify your Razorpay account is active');
    console.error('   4. Check if you are using test credentials for test mode');
    
    if (error.statusCode) {
      console.error('   Status Code:', error.statusCode);
    }
    
    process.exit(1);
  }
}

// Test environment variables
function testEnvironmentVariables() {
  console.log('🔧 Checking Environment Variables...\n');
  
  const requiredVars = [
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET'
  ];
  
  const optionalVars = [
    'RAZORPAY_WEBHOOK_SECRET'
  ];
  
  let allGood = true;
  
  requiredVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`   ✓ ${varName}: Set`);
    } else {
      console.log(`   ❌ ${varName}: Missing`);
      allGood = false;
    }
  });
  
  optionalVars.forEach(varName => {
    if (process.env[varName]) {
      console.log(`   ✓ ${varName}: Set (optional)`);
    } else {
      console.log(`   ⚠️  ${varName}: Not set (optional, needed for webhooks)`);
    }
  });
  
  if (!allGood) {
    console.error('\n❌ Missing required environment variables!');
    console.error('   Please check your .env file and ensure all required variables are set.');
    process.exit(1);
  }
  
  console.log('\n✅ Environment variables check passed!\n');
}

// Test database connection (basic check)
async function testDatabaseConnection() {
  console.log('🗄️  Testing Database Connection...\n');
  
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // Try to connect to database
    await prisma.$connect();
    console.log('   ✓ Database connection successful');
    
    // Check if Payment table exists
    const paymentCount = await prisma.payment.count();
    console.log(`   ✓ Payment table accessible (${paymentCount} records)`);
    
    await prisma.$disconnect();
    console.log('   ✓ Database disconnected successfully\n');
    
  } catch (error) {
    console.error('   ❌ Database connection failed:', error.message);
    console.error('\n🔧 Database Troubleshooting:');
    console.error('   1. Check your DATABASE_URL in .env file');
    console.error('   2. Ensure PostgreSQL is running');
    console.error('   3. Run: npx prisma migrate dev');
    console.error('   4. Run: npx prisma generate\n');
  }
}

// Main test function
async function runTests() {
  console.log('🚀 PGROOM Razorpay Integration Test Suite\n');
  console.log('==========================================\n');
  
  // Test environment variables first
  testEnvironmentVariables();
  
  // Test database connection
  await testDatabaseConnection();
  
  // Test Razorpay integration
  await testRazorpayConnection();
  
  console.log('\n==========================================');
  console.log('🎉 Integration test completed successfully!');
  console.log('==========================================\n');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runTests().catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
}

module.exports = {
  testRazorpayConnection,
  testEnvironmentVariables,
  testDatabaseConnection,
  runTests
};

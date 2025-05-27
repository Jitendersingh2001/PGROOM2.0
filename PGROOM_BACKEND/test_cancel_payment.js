/**
 * Test script for cancel payment functionality
 * This script tests the cancel payment API endpoint
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/pgrooms/v1';

async function testCancelPayment() {
  try {
    console.log('🧪 Testing Cancel Payment Functionality...\n');

    // First, let's get a list of payments to find a pending one
    console.log('📋 Fetching payments list...');
    const paymentsResponse = await axios.post(`${BASE_URL}/payment/list`, {
      page: 1,
      limit: 10,
      status: 'Pending'
    });

    if (!paymentsResponse.data.success || !paymentsResponse.data.data.data.length) {
      console.log('❌ No pending payments found to test cancellation');
      console.log('💡 Create a pending payment first to test this functionality');
      return;
    }

    const pendingPayment = paymentsResponse.data.data.data[0];
    console.log(`✅ Found pending payment: ID ${pendingPayment.id}, Amount: ₹${pendingPayment.amount}`);

    // Test cancel payment
    console.log('\n🔄 Testing cancel payment...');
    const cancelResponse = await axios.post(`${BASE_URL}/payment/cancel`, {
      paymentId: pendingPayment.id,
      reason: 'Testing cancel payment functionality'
    });

    if (cancelResponse.data.success) {
      console.log('✅ Payment cancelled successfully!');
      console.log(`📊 Updated payment status: ${cancelResponse.data.data.payment.status}`);
      console.log(`🕒 Updated at: ${cancelResponse.data.data.payment.updatedAt}`);
    } else {
      console.log('❌ Failed to cancel payment:', cancelResponse.data.message);
    }

    // Verify the payment status was updated
    console.log('\n🔍 Verifying payment status...');
    const verifyResponse = await axios.get(`${BASE_URL}/payment/${pendingPayment.id}`);
    
    if (verifyResponse.data.success) {
      const updatedPayment = verifyResponse.data.data;
      console.log(`✅ Payment status verified: ${updatedPayment.status}`);
      
      if (updatedPayment.status === 'Failed') {
        console.log('🎉 Cancel payment functionality working correctly!');
      } else {
        console.log('⚠️  Payment status not updated as expected');
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      console.log('💡 Make sure the backend server is running on port 3000');
    }
  }
}

// Test error cases
async function testErrorCases() {
  try {
    console.log('\n🧪 Testing Error Cases...\n');

    // Test with invalid payment ID
    console.log('🔄 Testing with invalid payment ID...');
    try {
      await axios.post(`${BASE_URL}/payment/cancel`, {
        paymentId: 99999,
        reason: 'Testing invalid ID'
      });
    } catch (error) {
      if (error.response?.status === 400 || error.response?.status === 404) {
        console.log('✅ Correctly handled invalid payment ID');
      } else {
        console.log('⚠️  Unexpected error for invalid payment ID:', error.response?.data);
      }
    }

    // Test with missing payment ID
    console.log('🔄 Testing with missing payment ID...');
    try {
      await axios.post(`${BASE_URL}/payment/cancel`, {
        reason: 'Testing missing ID'
      });
    } catch (error) {
      if (error.response?.status === 400) {
        console.log('✅ Correctly handled missing payment ID');
      } else {
        console.log('⚠️  Unexpected error for missing payment ID:', error.response?.data);
      }
    }

  } catch (error) {
    console.error('❌ Error case test failed:', error.message);
  }
}

// Run tests
async function runTests() {
  await testCancelPayment();
  await testErrorCases();
  console.log('\n🏁 Tests completed!');
}

runTests();

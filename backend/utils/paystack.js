// ============================================
// FILE: backend/utils/paystack.js - FIXED
// ============================================
import axios from 'axios';
import dotenv from 'dotenv';

// ✅ Ensure dotenv is loaded
dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// ✅ Validate Paystack key on load
if (!PAYSTACK_SECRET_KEY) {
  console.error('❌ PAYSTACK_SECRET_KEY is not defined in .env file!');
} else if (!PAYSTACK_SECRET_KEY.startsWith('sk_test_') && !PAYSTACK_SECRET_KEY.startsWith('sk_live_')) {
  console.error('❌ PAYSTACK_SECRET_KEY format is invalid! Should start with sk_test_ or sk_live_');
} else {
  console.log('✅ Paystack configured:', {
    keyPrefix: PAYSTACK_SECRET_KEY.substring(0, 10) + '...',
    keyLength: PAYSTACK_SECRET_KEY.length,
    environment: PAYSTACK_SECRET_KEY.startsWith('sk_test_') ? 'TEST' : 'LIVE'
  });
}

/**
 * Initialize Paystack payment transaction
 * @param {Object} data - Payment data
 * @param {string} data.email - Customer email
 * @param {number} data.amount - Amount in kobo (multiply naira by 100)
 * @param {string} data.reference - Unique payment reference
 * @param {string} data.callback_url - URL to redirect after payment
 * @returns {Promise<Object>} - Paystack response with authorization_url
 */
export const initializePayment = async (data) => {
  try {
    // ✅ Validate secret key before making request
    if (!PAYSTACK_SECRET_KEY) {
      throw new Error('Paystack secret key is not configured. Check your .env file.');
    }

    console.log('💳 Initializing Paystack payment:', {
      email: data.email,
      amount: `₦${(data.amount / 100).toFixed(2)}`,
      reference: data.reference
    });

    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email: data.email,
        amount: data.amount, // Amount in kobo (₦1 = 100 kobo)
        reference: data.reference,
        callback_url: data.callback_url,
        metadata: data.metadata || {},
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer'], // ✅ Enable all channels
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('✅ Paystack payment initialized:', {
      reference: data.reference,
      authorization_url: response.data.data.authorization_url
    });

    return response.data;
  } catch (error) {
    console.error('❌ Paystack initialization error:', {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    throw new Error(
      error.response?.data?.message || 'Failed to initialize payment'
    );
  }
};

/**
 * Verify Paystack payment transaction
 * @param {string} reference - Payment reference to verify
 * @returns {Promise<Object>} - Paystack verification response
 */
export const verifyPayment = async (reference) => {
  try {
    if (!PAYSTACK_SECRET_KEY) {
      throw new Error('Paystack secret key is not configured. Check your .env file.');
    }

    console.log('🔍 Verifying payment:', reference);

    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    console.log('✅ Payment verified:', {
      reference,
      status: response.data.data.status,
      amount: `₦${(response.data.data.amount / 100).toFixed(2)}`
    });

    return response.data;
  } catch (error) {
    console.error('❌ Paystack verification error:', {
      reference,
      message: error.response?.data?.message || error.message,
      status: error.response?.status
    });
    
    throw new Error(
      error.response?.data?.message || 'Failed to verify payment'
    );
  }
};

/**
 * Generate unique payment reference
 * Format: TECH-{timestamp}-{random}
 * @returns {string} - Unique reference
 */
export const generateReference = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9).toUpperCase();
  return `TECH-${timestamp}-${random}`;
};

/**
 * Convert Naira to Kobo (Paystack requires amount in kobo)
 * @param {number} naira - Amount in Naira
 * @returns {number} - Amount in Kobo
 */
export const nairaToKobo = (naira) => {
  return Math.round(naira * 100);
};

/**
 * Convert Kobo to Naira
 * @param {number} kobo - Amount in Kobo
 * @returns {number} - Amount in Naira
 */
export const koboToNaira = (kobo) => {
  return kobo / 100;
};
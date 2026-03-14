const crypto = require('crypto')
const axios  = require('axios')

const SANDBOX_URL    = 'https://sandbox.jazzcash.com.pk/ApplicationAPI/API/2.0/Purchase/DoMWalletTransaction'
const PRODUCTION_URL = 'https://payments.jazzcash.com.pk/ApplicationAPI/API/2.0/Purchase/DoMWalletTransaction'

/**
 * Generate HMAC-SHA256 secure hash for JazzCash request
 * The hash is built from sorted key=value pairs joined by &
 */
function generateHash(params, integritySalt) {
  // Sort keys alphabetically, build the string
  const hashString = integritySalt + '&' +
    Object.keys(params)
      .filter(k => k !== 'pp_SecureHash' && params[k] !== '')
      .sort()
      .map(k => params[k])
      .join('&')

  return crypto
    .createHmac('sha256', integritySalt)
    .update(hashString)
    .digest('hex')
    .toUpperCase()
}

/**
 * Verify the hash in a JazzCash callback response
 */
function verifyHash(params, integritySalt) {
  const receivedHash = params.pp_SecureHash
  if (!receivedHash) return false
  const computed = generateHash(params, integritySalt)
  return computed === receivedHash
}

/**
 * Format amount for JazzCash (must be in paisa, i.e. Rs × 100, then zero-padded to 12 chars)
 */
function formatAmount(amountInRs) {
  return String(Math.round(amountInRs * 100)).padStart(12, '0')
}

/**
 * Generate JazzCash transaction reference number (must be unique per transaction)
 */
function generateTxnRefNo(orderId) {
  const ts  = Date.now().toString().slice(-10)
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `T${ts}${rnd}`
}

/**
 * Get current datetime in JazzCash format: YYYYMMDDHHmmss
 */
function getJCDateTime() {
  const now = new Date()
  return now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0')
}

/**
 * Initiate a JazzCash mobile wallet payment
 * @param {object} options - { orderId, amount, phone, description }
 * @returns {object} JazzCash API response + txnRefNo
 */
async function initiatePayment({ orderId, amount, phone, description }) {
  const {
    JAZZCASH_MERCHANT_ID,
    JAZZCASH_PASSWORD,
    JAZZCASH_INTEGRITY_SALT,
    JAZZCASH_RETURN_URL,
    JAZZCASH_ENV,
  } = process.env

  if (!JAZZCASH_MERCHANT_ID || !JAZZCASH_PASSWORD || !JAZZCASH_INTEGRITY_SALT) {
    throw new Error('JazzCash credentials not configured in .env')
  }

  const txnRefNo  = generateTxnRefNo(orderId)
  const txnDateTime = getJCDateTime()

  // Expiry: 1 hour from now
  const expiry = new Date(Date.now() + 60 * 60 * 1000)
  const expiryStr = expiry.getFullYear().toString() +
    String(expiry.getMonth() + 1).padStart(2, '0') +
    String(expiry.getDate()).padStart(2, '0') +
    String(expiry.getHours()).padStart(2, '0') +
    String(expiry.getMinutes()).padStart(2, '0') +
    String(expiry.getSeconds()).padStart(2, '0')

  const params = {
    pp_Version:          '2.0',
    pp_TxnType:          'MWALLET',
    pp_Language:         'EN',
    pp_MerchantID:       JAZZCASH_MERCHANT_ID,
    pp_Password:         JAZZCASH_PASSWORD,
    pp_TxnRefNo:         txnRefNo,
    pp_Amount:           formatAmount(amount),
    pp_TxnCurrency:      'PKR',
    pp_TxnDateTime:      txnDateTime,
    pp_BillReference:    `BILLREF${orderId}`,
    pp_Description:      description || `Order ${orderId}`,
    pp_TxnExpiryDateTime: expiryStr,
    pp_ReturnURL:        JAZZCASH_RETURN_URL || 'http://localhost:3000/payment/callback',
    pp_MobileNumber:     phone.replace(/[^0-9]/g, ''), // digits only
    ppmpf_1:             orderId, // custom field — store orderId
    ppmpf_2:             '',
    ppmpf_3:             '',
    ppmpf_4:             '',
    ppmpf_5:             '',
  }

  // Generate secure hash
  params.pp_SecureHash = generateHash(params, JAZZCASH_INTEGRITY_SALT)

  const apiUrl = JAZZCASH_ENV === 'production' ? PRODUCTION_URL : SANDBOX_URL

  const response = await axios.post(apiUrl, params, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
  })

  return {
    txnRefNo,
    jazzCashResponse: response.data,
    // pp_ResponseCode '000' means success / accepted
    success: response.data?.pp_ResponseCode === '000',
    message: response.data?.pp_ResponseMessage || 'Request sent to JazzCash',
  }
}

/**
 * Verify a JazzCash callback (POST from JazzCash to your return URL)
 */
function verifyCallback(callbackParams) {
  const { JAZZCASH_INTEGRITY_SALT } = process.env
  if (!JAZZCASH_INTEGRITY_SALT) return { valid: false }

  const valid = verifyHash(callbackParams, JAZZCASH_INTEGRITY_SALT)
  const success = callbackParams.pp_ResponseCode === '000'

  return {
    valid,
    success,
    txnRefNo: callbackParams.pp_TxnRefNo,
    orderId:  callbackParams.ppmpf_1,
    amount:   callbackParams.pp_Amount,
    message:  callbackParams.pp_ResponseMessage,
  }
}

module.exports = { initiatePayment, verifyCallback, generateHash, verifyHash }

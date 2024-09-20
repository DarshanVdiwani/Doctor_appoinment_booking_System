import express from 'express'
import { authenticate } from './../auth/verifyToken.js'
import { getCheckoutSession,bookingStatusUpdate } from '../Controllers/bookingController.js'

const router = express.Router()

router.post('/checkout-session/:doctorId', authenticate, getCheckoutSession)
router.put('/success-session/:orderId', authenticate, bookingStatusUpdate)

export default router


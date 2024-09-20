import User from '../models/UserSchema.js';
import Doctor from '../models/DoctorSchema.js';
import Booking from '../models/BookingSchema.js';
import Razorpay from 'razorpay';

export const getCheckoutSession = async (req, res) => {
    // console.log('Hello');
    try {
        const doctor = await Doctor.findById(req.params.doctorId);
        // console.log('userId', req.userId)
        const user = await User.findById(req.userId);
        const { bookingDate } = req.body;

        // Ensure user exists before proceeding
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Initialize Razorpay instance with your API key and secret
        const razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        });

        // Create an order with Razorpay
        const order = await razorpay.orders.create({
            amount: doctor.ticketPrice * 100, // amount in paise (1 INR = 100 paise)
            currency: 'INR',
            payment_capture: 1 // Auto capture payment
        });

        // console.log(user);

        const booking = new Booking({
            doctor: doctor._id,
            user: user._id,
            ticketPrice: doctor.ticketPrice,
            razorpayOrderId: order.id,
            bookingDate: bookingDate,
        });

        await booking.save();

        res.status(200).json({ success: true, message: 'Successfully created Razorpay order', order });
    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ success: false, message: "Error creating Razorpay order" });
    }
};


export const bookingStatusUpdate = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        const { status } = req.body;

        // Find the booking using the razorpayOrderId
        const booking = await Booking.findOne({ razorpayOrderId: orderId });

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found." });
        }

        // Update the booking status to 'paid'
        booking.status = status;
        await booking.save();

        return res.status(200).json({ success: true, message: "Booking status updated successfully." });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: "Failed to update booking status." });
    }
};
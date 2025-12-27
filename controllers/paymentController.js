const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/booking');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

console.log('RAZORPAY KEY:', process.env.RAZORPAY_KEY_ID);


/**
 * GET /payments/:bookingId
 * Create Razorpay order
 */
exports.getCheckout = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId).populate('home');

    if (!booking) return res.redirect('/bookings');

    if (booking.user.toString() !== req.session.user.userId.toString()) {
      return res.redirect('/');
    }

    if (booking.status !== 'pending') {
      return res.redirect(`/bookings/${booking._id}`);
    }

    const order = await razorpay.orders.create({
      amount: booking.totalPrice * 100, // paise
      currency: 'INR',
      receipt: booking._id.toString()
    });

    res.render('payments/checkout', {
      pageTitle: 'Payment',
      booking,
      orderId: order.id,
      razorpayKey: process.env.RAZORPAY_KEY_ID,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
    });

  } catch (err) {
    console.log(err);
    res.redirect('/bookings');
  }
};

/**
 * POST /payments/verify
 * Verify payment & mark booking paid
 */
exports.postVerifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId
    } = req.body;

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.redirect(`/bookings/${bookingId}`);
    }

    const booking = await Booking.findById(bookingId);
    booking.status = 'paid';
    await booking.save();

    res.redirect(`/bookings/${bookingId}`);

  } catch (err) {
    console.log(err);
    res.redirect('/bookings');
  }
};

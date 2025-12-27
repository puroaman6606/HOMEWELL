const Booking = require('../models/booking');
const Home = require('../models/home');

/**
 * POST /bookings
 * Create booking (Reserve only)
 */
exports.postCreateBooking = async (req, res) => {
  try {
    const { homeId, checkIn, checkOut, guests } = req.body;

    const home = await Home.findById(homeId);
    if (!home) {
      return res.redirect('/');
    }

    const nights =
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

    if (nights <= 0) {
      return res.redirect('back');
    }

    const totalPrice = nights * home.rent;

    const booking = new Booking({
      home: homeId,
      user: req.session.user.userId,   // ✅ FIX
      checkIn,
      checkOut,
      guests,
      totalPrice
    });

    await booking.save();

    res.redirect('/bookings');

  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

/**
 * GET /bookings
 * Show all bookings of logged-in user
 */
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.session.user.userId
    })
      .populate('home')
      .sort({ createdAt: -1 });

    res.render('bookings/bookings', {   // ✅ LIST VIEW
      pageTitle: 'My Bookings',
      bookings,                         // ✅ ARRAY
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
    });

  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

/**
 * GET /bookings/:bookingId
 * Booking details (payment-ready)
 */
exports.getBookingDetails = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate('home');

    if (!booking) {
      return res.redirect('/bookings');
    }

    // Security check
    if (booking.user.toString() !== req.session.user.userId.toString()) {
      return res.redirect('/');
    }

    res.render('bookings/bookings-details', {  // ✅ DETAILS VIEW
      pageTitle: 'Booking Details',
      booking,                                // ✅ SINGLE OBJECT
      isLoggedIn: req.isLoggedIn,
      user: req.session.user
    });

  } catch (err) {
    console.log(err);
    res.redirect('/bookings');
  }
};


exports.postCancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.bookingId;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.redirect('/bookings');
    }

    // Security: only owner can cancel
    if (booking.user.toString() !== req.session.user.userId.toString()) {
      return res.redirect('/');
    }

    // Already cancelled
    if (booking.status === 'cancelled') {
      return res.redirect(`/bookings/${bookingId}`);
    }

    // Cancel booking
    booking.status = 'cancelled';
    await booking.save();

    res.redirect(`/bookings/${bookingId}`);

  } catch (err) {
    console.log(err);
    res.redirect('/bookings');
  }
};

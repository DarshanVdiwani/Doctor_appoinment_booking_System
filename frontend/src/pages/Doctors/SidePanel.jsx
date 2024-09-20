import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BASE_URL, token } from './../../config';
import { toast } from 'react-toastify';
import convertTime from '../../utils/convertTime';

const SidePanel = ({ doctorId, ticketPrice, timeSlots }) => {

    const [showModal, setShowModal] = React.useState(false);
    const [bookingDate, setBookingDate] = useState(new Date());

    const minDate = new Date();

    const bookingHandler = async () => {
        try {


            const res = await fetch(`${BASE_URL}/bookings/checkout-session/${doctorId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    bookingDate: bookingDate, 
                })
    

            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to book appointment. Please try again.');
            }

            if (data.order.id) {
                const options = {
                    key: "rzp_test_bVMiP9CNDWIwaS",
                    amount: ticketPrice * 100, // Convert ticket price to paise (1 INR = 100 paise)
                    currency: 'INR',
                    name: 'Diwani Hospital',
                    description: 'Doctor Appointment Booking',
                    order_id: data.order.id,
                    prefill: {
                        name: 'User Name', // Pre-fill user details if needed
                        email: 'user@example.com',
                        contact: '9999999999'
                    },
                    theme: {
                        color: '#3399cc'
                    },
                    handler: async (response) => {
                        setShowModal(false)
                        if (response.razorpay_payment_id) {
                            toast.success('Payment successful');
                            await updateBookingStatus(data.order.id);
                        } else {
                            toast.error('Payment failed or cancelled');
                        }
                    }
                };

                const razorpayInstance = new window.Razorpay(options);
                razorpayInstance.open();
            }
        } catch (err) {
            console.error(err);
            toast.error(err.message || 'Failed to book appointment. Please try again.');
        }
    };

    const updateBookingStatus = async (orderId) => {
        try {
            const res = await fetch(`${BASE_URL}/bookings/success-session/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ status: 'approved' })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to update booking status in the database.');
            }
        } catch (err) {
            toast.error(err.message || 'Failed to update booking status in the database.');
        }
    };

    return (
        <div className="shadow-2xl p-3 lg:p-5 rounded-md">
            <div className='flex items-center justify-between'>
                <p className='text_para mt-0 font-semibold'>
                    Ticket Price
                </p>
                <span className='text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor font-bold'>
                    {ticketPrice} Rs
                </span>
            </div>
            <div className="mt-[30px]">
                <p className='text_para mt-0 font-semibold text-headingColor'>Available Time slots:</p>
                <ul className="mt-3">
                    {timeSlots?.map((item, index) => (
                        <li key={index} className="flex items-center justify-between mb-2">
                            <p className='text-[15px] leading-6 text-textColor font-semibold '>
                                {item.day.charAt(0).toUpperCase() + item.day.slice(1)}
                            </p>
                            <p className='text-[15px] leading-6 text-textColor font-semibold '>
                                {convertTime(item.startingTime)} - {convertTime(item.endingTime)}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>

            {/* <button onClick={bookingHandler} className='btn px-2 w-full rounded-md'>
                Book Appointment
            </button> */}

            <button onClick={() => setShowModal(true)} className='btn px-2 w-full rounded-md'>
                Book Appointment
            </button>

            {showModal ? (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*header*/}
                                <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                                    <h2 class="heading text-center">Book Date </h2>
                                    <button
                                        className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                                        onClick={() => setShowModal(false)}
                                    >
                                    </button>
                                </div>
                                {/*body*/}
                                <div className="relative p-6 flex-auto">
                                    <p className="my-4 text-blueGray-500 text-lg leading-relaxed">
                                        <p className="form_label">Select Date*</p>
                                        <DatePicker 
                                            className='form_input' 
                                            selected={bookingDate}
                                            minDate={minDate} 
                                            onChange={(date) => setBookingDate(date)} />
                                    </p>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={bookingHandler}
                                    >
                                        Book Appointment
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}


        </div>
    );
};

export default SidePanel;
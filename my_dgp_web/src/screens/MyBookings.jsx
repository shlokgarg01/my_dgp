import React, { useEffect, useState } from 'react'
import Colors from '../utils/Colors';
import { BASE_URL } from '../config/Axios';
import HamburgerMenu from '../components/components/HamburgerMenu';

const MyBookings = () => {
    const [bookingData, setBookingData] = useState(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'short', year: 'numeric' };
        return date.toLocaleDateString('en-GB', options); // Format as 21 Oct 2024
    };

    const fetchBookingData = async () => {
        const id = localStorage.getItem('userId');
        try {
            const response = await fetch(`${BASE_URL}/api/v1/bookings/customer?_id=${id}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Accept-Encoding': 'gzip'
                }
            });

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            setBookingData(data);
        } catch (error) {
            //   setError(error.message);
        } finally {
            //   setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookingData();
    }, []);

    return (
        <div>
            <div style={{position:'sticky',top:0,backgroundColor:'white',padding:10}} >
                <div><HamburgerMenu /></div><div style={{ textAlign: 'center', fontSize: 20, fontWeight: '600' }} >My Bookings</div>
            </div>
            <div style={{padding:20}} >
                <ul style={{ listStyleType: 'none', padding: 0, marginTop: 20 }}>
                    {bookingData?.bookings.map(booking => (
                        <li key={booking.id} style={{ borderRadius: 10, margin: '20px 0', padding: '10px', backgroundColor: Colors.WHITE }}>
                            <h3 style={{ fontSize: 16, fontWeight: '600' }} >{booking?.service?.name} for {booking?.subService?.name} </h3>
                            <div style={{ fontWeight: '300', fontSize: 14 }} >{formatDate(booking.date)} • {booking?.status?.charAt(0).toUpperCase() + booking?.status?.slice(1).toLowerCase()} </div>
                            <div style={{ fontWeight: '300', fontSize: 14 }} >₹{booking.totalPrice.toFixed(2)}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default MyBookings
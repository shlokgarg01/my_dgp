import React from 'react'
import LogoHeader from '../components/components/LogoHeader'
import Colors from '../utils/Colors';

const MyBookings = () => {
    const bookings = [
        {
            id: 1,
            serviceName: "Photography for nature",
            date: "2024-10-20",
            duration: "30 minutes",
            price: "25"
        },
        {
            id: 2,
            serviceName: "Videography for nature",
            date: "2024-10-21",
            duration: "60 minutes",
            price: "60"
        },
    ];

    return (
        <div style={{ padding: 20 }}>
            <LogoHeader backAction={() => { }} showLogo={false} heading={'My Bookings'} />
            <div>
                <ul style={{ listStyleType: 'none', padding: 0 ,marginTop:30}}>
                    {bookings.map(booking => (
                        <li key={booking.id} style={{ borderRadius:10,margin: '20px 0', padding: '10px',backgroundColor:Colors.LIGHT_GRAY }}>
                            <h3 style={{fontSize:16,fontWeight:'bold'}} >{booking.serviceName}</h3>
                            <div><strong>Date:</strong> {booking.date}</div>
                            <div><strong>Duration:</strong> {booking.duration}</div>
                            <div><strong>Price:</strong> {booking.price}</div>
                        </li>
                    ))}
                </ul>
            </div>   
        </div>
    )
}

export default MyBookings
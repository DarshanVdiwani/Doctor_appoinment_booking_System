import { Link } from "react-router-dom"

const checkoutSuccess = () => {
    return (
        <div className="mt-12">
            <div className="container">
                <h1>Booking Successful!</h1>
                <p>Your appointment has been successfully booked.</p>
                {/* You can include additional details here, such as booking summary */}
            </div>
        </div>
    )
}

export default checkoutSuccess

import { useMoveBack } from "../../hooks/useMoveBack";
import Button from "../../ui/Button";
import ButtonGroup from "../../ui/ButtonGroup";
import ButtonText from "../../ui/ButtonText"
import Heading from "../../ui/Heading"
import Row from "../../ui/Row"
import Spinner from "../../ui/Spinner";
import BookingDataBox from "../bookings/BookingDataBox"
import { useBooking } from "../bookings/useBooking";
import { useCheckout } from "./useCheckout";

function CheckoutBooking() {
    const { booking, isLoading } = useBooking();
    const { checkout, isCheckingOut } = useCheckout();
    const moveBack = useMoveBack();

    if (isLoading || isCheckingOut) return <Spinner />

    const { id: bookingId } = booking;

    function handleCheckout() {
        { checkout(bookingId) }
    }

    return (
        <>
            <Row type="horizontal">
                <Heading as="h1">Booking #{bookingId} summary to check out</Heading>
                <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
            </Row>

            <BookingDataBox booking={booking} />

            <ButtonGroup>
                <Button onClick={handleCheckout} disabled={isLoading || isCheckingOut}>Check out booking #{bookingId}</Button>
                <Button variation="secondary" onClick={moveBack}>
                    Back
                </Button>
            </ButtonGroup>
        </>
    )
}

export default CheckoutBooking

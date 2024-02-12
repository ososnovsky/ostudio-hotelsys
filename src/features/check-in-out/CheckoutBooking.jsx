import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
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
import InvoicePDF from '../../ui/InvoicePDF';
import { formatCurrency } from '../../utils/helpers';

function CheckoutBooking() {
    const { booking, isLoading } = useBooking();
    const { checkout, isCheckingOut } = useCheckout();
    const moveBack = useMoveBack();

    if (isLoading || isCheckingOut) return <Spinner />

    const {
        id: bookingId,
        created_at,
        startDate,
        endDate,
        numNights,
        numGuests,
        cabinPrice,
        extrasPrice,
        totalPrice,
        hasBreakfast,
        observations,
        isPaid,
        guests: { fullName: guestName, email, country, countryFlag, nationalID },
        cabins: { name: cabinName },
    } = booking;

    function handleCheckout() {
        { checkout(bookingId) }
    }

    const invoiceData = {
        date: new Date().toISOString().split('T')[0],
        invoiceNumber: bookingId,
        checkInDate: startDate,
        checkOutDate: endDate,
        numberOfNights: numNights,
        guestName,
        guestEmail: email,
        numberOfGuests: numGuests,
        roomName: cabinName,
        roomPrice: formatCurrency(cabinPrice),
        extrasPrice: formatCurrency(extrasPrice),
        totalPrice: formatCurrency(totalPrice),
    }

    return (
        <>
            <Row type="horizontal">
                <Heading as="h1">Booking #{bookingId} summary to check out</Heading>
                <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
            </Row>

            <BookingDataBox booking={booking} />

            <ButtonGroup>
                <PDFDownloadLink
                    style={{
                        border: '1px solid var(--color-grey-200)',
                        color: 'var(--color-grey-600)',
                        fontSize: '1.4rem',
                        padding: '1.2rem 1.6rem',
                        fontWeight: '500',
                        background: 'var(--color-grey-0)',
                        borderRadius: 'var(--border-radius-sm)',
                        boxShadow: 'var(--shadow-sm)',
                    }}
                    document={<InvoicePDF invoiceData={invoiceData} />}
                    fileName={`invoice#${bookingId}.pdf`}
                >
                    {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Download PDF invoice')}
                </PDFDownloadLink>
                <Button onClick={handleCheckout} disabled={isLoading || isCheckingOut}>Check out booking #{bookingId}</Button>
                <Button variation="secondary" onClick={moveBack}>
                    Back
                </Button>
            </ButtonGroup >
            <PDFViewer>
                <InvoicePDF invoiceData={invoiceData} />
            </PDFViewer>
        </>
    )
}

export default CheckoutBooking;

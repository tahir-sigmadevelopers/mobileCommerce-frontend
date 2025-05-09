import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useState } from "react"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import { useNewOrderMutation } from "../redux/api/OrderAPI"
import { resetCart } from "../redux/reducers/cartReducers"
import { RootState } from "../redux/store"
import { NewOrderRequest } from "../types/api-types"
import { responseToast } from "../utils/features"


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY)

const CheckOutForm = () => {

    const stripe = useStripe()
    const elements = useElements()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user } = useSelector((state: RootState) => state.userReducer)


    const { shippingInfo, cartItems, subtotal, tax, discount, shippingCharges, total } = useSelector((state: RootState) => state.cartReducer)


    const [isProcessing, setIsProcessing] = useState<boolean>(false)

    const [newOrder] = useNewOrderMutation()

    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!stripe || !elements) return

        setIsProcessing(true)
        const orderData: NewOrderRequest = {
            shippingInfo,
            orderItems: cartItems,
            subtotal,
            total,
            tax,
            discount,
            shippingCharges,
            user: user?._id!
        }

        const { paymentIntent, error } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: window.location.origin },
            redirect: "if_required"
        })

        if (error) {
            setIsProcessing(false)
            return toast.error(error.message! || "Something went wrong");
        }

        if (paymentIntent!.status === "succeeded") {
            const res = await newOrder(orderData)
            dispatch(resetCart());
            responseToast(res, navigate, "/orders")
        }
        setIsProcessing(false)


        // setTimeout(() => {
        //     setIsProcessing(false)
        // }, 2000);
    }

    return (
        <div className="checkout-container">
            <form onSubmit={submitHandler}>
                <PaymentElement />
                <button disabled={isProcessing} > {isProcessing ? "Processing..." : "Pay"}</button>
            </form>
        </div>

    )
}

const CheckOut = () => {

    const location = useLocation()


    const clientSecret: string | undefined = location.state


    if (!clientSecret) return <Navigate to={"/shipping"} />





    return (
        <Elements options={{ clientSecret }} stripe={stripePromise}>
            <CheckOutForm />
        </Elements>
    )
}

export default CheckOut
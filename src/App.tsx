import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { lazy, Suspense, useEffect } from "react"
import Loader from "./components/loader"
import Header from "./components/header"
import { Toaster } from "react-hot-toast"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "./firebase"
import { useDispatch, useSelector } from "react-redux"
import { userExist, userNotExist } from "./redux/reducers/userReducers"
import { getUser } from "./redux/api/UserAPI"
import { UserReducerInitialState } from "./types/reducer-types"
import ProtectedRoute from "./components/ProtectedRoute"

const Home = lazy(() => import("./pages/home"))
const Cart = lazy(() => import("./pages/cart"))
const Search = lazy(() => import("./pages/search"))
const Shipping = lazy(() => import("./pages/shipping"))
const Login = lazy(() => import("./pages/login"))
const Orders = lazy(() => import("./pages/orders"))
const OrderDetails = lazy(() => import("./pages/order-details"))
const NotFound = lazy(() => import("./pages/not-found"))
const Checkout = lazy(() => import("./pages/checkout"))

// Admin Routes 

const Dashboard = lazy(() => import("./pages/admin/dashboard"));
const Products = lazy(() => import("./pages/admin/products"));
const Customers = lazy(() => import("./pages/admin/customers"));
const Transaction = lazy(() => import("./pages/admin/transaction"));
const Barcharts = lazy(() => import("./pages/admin/charts/barcharts"));
const Piecharts = lazy(() => import("./pages/admin/charts/piecharts"));
const Linecharts = lazy(() => import("./pages/admin/charts/linecharts"));
const Coupon = lazy(() => import("./pages/admin/apps/coupon"));
const Stopwatch = lazy(() => import("./pages/admin/apps/stopwatch"));
const Toss = lazy(() => import("./pages/admin/apps/toss"));
const NewProduct = lazy(() => import("./pages/admin/management/newproduct"));
const ProductManagement = lazy(
  () => import("./pages/admin/management/productmanagement")
);
const TransactionManagement = lazy(
  () => import("./pages/admin/management/transactionmanagement")
);


const App = () => {
  const dispatch = useDispatch()
  const { user, loading } = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer)

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await getUser(user.uid)

        dispatch(userExist(data.user))
      } else {
        dispatch(userNotExist())
        console.log("Not Logged in");
      }
    })
  }, [])

  return loading ? < Loader /> : (
    <Router>
      <Header user={user} />
      <Suspense fallback={<Loader />} >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/search" element={<Search />} />

          {/* Not Logged In Route  */}

          <Route path="/login" element={<ProtectedRoute isAuthenticated={user ? false : true}><Login /></ProtectedRoute>} />

          {/* Logged In User Routes  */}

            <Route path="/shipping" element={<Shipping />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/order/:id" element={<OrderDetails />} />
            <Route path="/pay" element={<Checkout />} />

          {/* Admin Routes  */}

          <Route
            element={
              <ProtectedRoute isAuthenticated={true} admin={user?.role === "admin" ? true : false} adminOnly={true} />
            }
          >
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/product" element={<Products />} />
            <Route path="/admin/customer" element={<Customers />} />
            <Route path="/admin/transaction" element={<Transaction />} />

            {/* Charts */}
            <Route path="/admin/chart/bar" element={<Barcharts />} />
            <Route path="/admin/chart/pie" element={<Piecharts />} />
            <Route path="/admin/chart/line" element={<Linecharts />} />

            {/* Apps */}
            <Route path="/admin/app/coupon" element={<Coupon />} />
            <Route path="/admin/app/stopwatch" element={<Stopwatch />} />
            <Route path="/admin/app/toss" element={<Toss />} />

            {/* Management */}
            <Route path="/admin/product/new" element={<NewProduct />} />

            <Route path="/admin/product/:id" element={<ProductManagement />} />

            <Route path="/admin/transaction/:id" element={<TransactionManagement />} />
          </Route>
          <Route path="*" element={<NotFound />} />

        </Routes>
      </Suspense >
      <Toaster position="bottom-center" />
    </Router >
  )
}

export default App
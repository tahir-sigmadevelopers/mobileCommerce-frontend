import { ReactElement, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Column } from "react-table";
import AdminSidebar from "../../components/admin/AdminSidebar";
import TableHOC from "../../components/admin/TableHOC";
import { useAllProductsQuery } from "../../redux/api/ProductAPI";
import { server } from "../../redux/store";
import toast from "react-hot-toast";
import { CustomEror } from "../../types/api-types";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../types/reducer-types";
import { Skeleton } from "../../components/loader";

interface DataType {
  image: ReactElement;
  title: string;
  price: number;
  stock: number;
  action: ReactElement;
}

const columns: Column<DataType>[] = [
  {
    Header: "image",
    accessor: "image",
  },
  {
    Header: "Title",
    accessor: "title",
  },
  {
    Header: "Price",
    accessor: "price",
  },
  {
    Header: "Stock",
    accessor: "stock",
  },
  {
    Header: "Action",
    accessor: "action",
  },
];



const Products = () => {
  const { user } = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer)
  const {isLoading, error, data } = useAllProductsQuery(user?._id!)


  if (error) {
    const err = error as CustomEror;
    toast.error(err.data.message)
  }

  const [rows, setRows] = useState<DataType[]>([]);

  useEffect(() => {
    if (data) setRows(data.products.map((product) => ({ image: <img src={`${server}/${product.image}`} />, title: product.title, price: product.price, stock: product.stock, action: <Link to={`/admin/product/${product._id}`}>Manage</Link> })));
  }, [data])


  const Table = TableHOC<DataType>(
    columns,
    rows,
    "dashboard-product-box",
    "Products",
    rows.length > 6
  )();

  return (
    <div className="admin-container">
      <AdminSidebar />
      <main>{isLoading ? <Skeleton length={20} /> : Table}</main>
      <Link to="/admin/product/new" className="create-product-btn">
        <FaPlus />
      </Link>
    </div>
  );
};

export default Products;

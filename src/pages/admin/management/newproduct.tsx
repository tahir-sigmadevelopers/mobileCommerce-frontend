import { ChangeEvent, FormEvent, useState } from "react";
import AdminSidebar from "../../../components/admin/AdminSidebar";
import { useSelector } from "react-redux";
import { UserReducerInitialState } from "../../../types/reducer-types";
import { useNewProductMutation } from "../../../redux/api/ProductAPI";
import toast from "react-hot-toast";
import { responseToast } from "../../../utils/features";
import { useNavigate } from "react-router-dom";

const NewProduct = () => {
  const { user } = useSelector((state: { userReducer: UserReducerInitialState }) => state.userReducer)
  const [title, setTitle] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [price, setPrice] = useState<number>(1000);
  const [stock, setStock] = useState<number>(1);
  const [imagePrev, setImagePrev] = useState<string>("");
  const [image, setImage] = useState<File>();

  const navigate = useNavigate()

  const [newProduct] = useNewProductMutation()

  const changeImageHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file: File | undefined = e.target.files?.[0];

    const reader: FileReader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setImagePrev(reader.result);
          setImage(file);
        }
      };
    }
  };


  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !category || !price || stock < 0 || !image) return toast.error("Please Fill All Fields");
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("category", category);
      formData.append("price", price.toString());
      formData.append("stock", stock.toString());
      formData.append("image", image);
      const res = await newProduct({ id: user?._id!, formData });

      responseToast(res, navigate, "/admin/product")

    } catch (error) {
      console.error(error);
      toast.error("Something Went Wrong!");
    }
  }
  return (
    <div className="admin-container">
      <AdminSidebar />
      <main className="product-management">
        <article>
          <form onSubmit={submitHandler}>
            <h2>New Product</h2>
            <div>
              <label>Title</label>
              <input
                required
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <label>Price</label>
              <input
                required
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
            </div>
            <div>
              <label>Stock</label>
              <input
                required
                type="number"
                placeholder="Stock"
                value={stock}
                onChange={(e) => setStock(Number(e.target.value))}
              />
            </div>

            <div>
              <label>Category</label>
              <input
                required
                type="text"
                placeholder="eg. laptop, camera etc"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>

            <div>
              <label>Image</label>
              <input
                required type="file" onChange={changeImageHandler} />
            </div>

            {imagePrev && <img src={imagePrev} alt="New Image" />}
            <button type="submit" style={{ margin: "5px 10px 80px 10px" }}>Create</button>
          </form>
        </article>
      </main>
    </div>
  );
};

export default NewProduct;

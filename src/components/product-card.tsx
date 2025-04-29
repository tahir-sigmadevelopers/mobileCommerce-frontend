import { FaPlus } from "react-icons/fa"
import { server } from "../redux/store"
import { CartItem } from "../types/types"

type ProductProps = {
  price: number,
  title: string,
  productId: string,
  handler: (cartItem: CartItem) => string | undefined,
  stock: number,
  image: string,
  // quantity: number,
}

const ProductCard = ({ image, productId, stock, price, title, handler }: ProductProps) => {

  console.log(image);


  return (
    <div className="product-card">
      <img src={`${server}/${image}`} height={100} width={100} alt={title} />
      <p>{title}</p>
      <span>${price}</span>
      <div>
        <button onClick={() => handler({ productId, image, stock, price, title, quantity: 1 })}>
          <FaPlus />
        </button>
      </div>
    </div >
  )
}

export default ProductCard
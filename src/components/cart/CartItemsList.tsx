import { Button, InputNumber, List, Statistic } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useCartStore, type CartItem } from "~/stores/cartStore";

const CartItemsList = ({
  items,
  listClassName,
}: {
  items: CartItem[];
  listClassName?: string;
}) => {
  const { changeItemQty, deleteItem } = useCartStore((state) => ({
    changeItemQty: state.changeItemQty,
    deleteItem: state.deleteItem,
  }));
  const totalAmount = items.reduce((prev, curr) => {
    prev += curr.qty * curr.price;
    return prev;
  }, 0);
  return (
    <>
      <div className={listClassName}>
        <List
          dataSource={items}
          renderItem={(item, index) => (
            <List.Item>
              <span>{String(index + 1) + "."}</span>
              <span className="ml-2 flex-grow">{item.name}</span>
              <InputNumber
                size="small"
                className="mr-2 w-24"
                min={0}
                max={item.stock}
                onChange={(val) => val && changeItemQty(item.id, val)}
                addonBefore={<span>Qty</span>}
                value={item.qty}
              />
              <Button
                className="mr-2"
                icon={<DeleteOutlined />}
                onClick={() => deleteItem(item.id)}
              />
              <img
                className="max-h-36 w-20"
                alt={item.name}
                src={item.image ?? "/placeholder.jpeg"}
              />
            </List.Item>
          )}
        />
      </div>
      <Statistic title="Total amount (PLN)" value={totalAmount} />
    </>
  );
};

export default CartItemsList;

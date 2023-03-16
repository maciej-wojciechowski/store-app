import { List, Statistic, Typography } from "antd";
import { type CartItem } from "~/stores/cartStore";

function CartItemsList({
  items,
  totalAmount,
}: {
  items: CartItem[];
  totalAmount: number;
}) {
  return (
    <div className="w-96">
      <div className="max-h-[300px] overflow-auto">
        <List
          dataSource={items}
          renderItem={(item, index) => (
            <List.Item>
              <span>{String(++index) + "."}</span>
              <span className="ml-2 flex-grow">{item.name}</span>
              <span className="w-16 justify-self-end">
                {"Pcs: " + String(item.pcs)}{" "}
              </span>
              <img
                className="max-h-36 w-20"
                alt={item.name}
                src={item.image ?? "/placeholder.jpeg"}
              />
            </List.Item>
          )}
        />
      </div>
      <Statistic title={"Total amount (PLN)"} value={totalAmount} />
    </div>
  );
}

export default CartItemsList;

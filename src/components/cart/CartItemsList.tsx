import { InputNumber, List, Statistic } from "antd";
import { useCartStore, type CartItem } from "~/stores/cartStore";

function CartItemsList({ items }: { items: CartItem[] }) {
  const changeItemPcs = useCartStore((state) => state.changeItemPcs);
  const totalAmount = items.reduce((prev, curr) => {
    prev += curr.pcs * curr.price;
    return prev;
  }, 0);
  return (
    <div className="w-96">
      <div className="max-h-[300px] overflow-auto">
        <List
          dataSource={items}
          renderItem={(item, index) => (
            <List.Item>
              <span>{String(++index) + "."}</span>
              <span className="ml-2 flex-grow">{item.name}</span>
              <InputNumber
                size="small"
                className="mr-2 w-24"
                min={0}
                max={item.stock}
                onChange={(val) => val && changeItemPcs(item.id, val)}
                addonBefore={<span>pcs</span>}
                value={item.pcs}
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
      <Statistic title={"Total amount (PLN)"} value={totalAmount} />
    </div>
  );
}

export default CartItemsList;

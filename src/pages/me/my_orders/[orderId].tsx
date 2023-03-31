import { OrderItem } from "@prisma/client";
import { Descriptions, Divider, List, Spin } from "antd";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

const OrderItem = ({
  orderItem,
  index,
}: {
  orderItem: OrderItem;
  index: number;
}) => {
  const { data: shopItemData } = api.shopItem.getItemById.useQuery(
    orderItem.shopItemId
  );
  return (
    <List.Item>
      {shopItemData ? (
        <>
          <List.Item.Meta
            title={`${++index}. ${shopItemData.name}`}
            description={`Quantity: ${orderItem.quantity} Total price: ${orderItem.price}`}
          />

          <img
            src={
              shopItemData.images.length
                ? shopItemData.images[0]
                : "/placeholder.jpeg"
            }
            alt={shopItemData.name}
            className="max-h-36 w-20"
          />
        </>
      ) : (
        <Spin />
      )}
    </List.Item>
  );
};

const OrderPage = () => {
  const {
    query: { orderId },
  } = useRouter();
  const { data: orderData } = api.order.getOrderById.useQuery(
    typeof orderId === "string" ? orderId : "",
    {
      enabled: typeof orderId === "string",
    }
  );

  return (
    <div>
      <div className="m-10 mx-auto max-w-[600px]">
        <Descriptions className="mb-10" title="Order Info" bordered column={1}>
          <Descriptions.Item label="Order ID">
            {orderData?.id}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            {orderData?.status}
          </Descriptions.Item>
          <Descriptions.Item label="Delivery">
            {orderData?.delivery}
          </Descriptions.Item>
          <Descriptions.Item label="Total price">
            {`${String(orderData?.totalPrice)} PLN`}
          </Descriptions.Item>
          <Descriptions.Item label="Created at">
            {orderData?.createdAt.toLocaleDateString()}
            {"  "}
            {orderData?.createdAt.toLocaleTimeString()}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {orderData?.address.split(",").join(", ")}
          </Descriptions.Item>
        </Descriptions>
        <Divider orientation="left">Order items</Divider>
        <List
          dataSource={orderData?.items}
          className=""
          renderItem={(item, index) => {
            return <OrderItem orderItem={item} key={item.id} index={index} />;
          }}
        />
      </div>
    </div>
  );
};

export default OrderPage;

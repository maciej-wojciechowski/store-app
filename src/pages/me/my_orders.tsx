import { List, Typography } from "antd";
import { EyeFilled } from "@ant-design/icons";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "~/utils/api";

const MyOrders = () => {
  const { data: sessionData } = useSession();
  const { data: orderData } = api.order.getUserOrderList.useQuery(
    sessionData?.user?.id ?? "",
    {
      enabled: !!sessionData?.user,
    }
  );
  if (!sessionData?.user) {
    return <div>Log in to see your orders</div>;
  }

  return (
    <div className="p-10">
      <Typography.Title className="pb-6 text-center" level={3}>
        My orders
      </Typography.Title>
      <List
        itemLayout="vertical"
        className="mx-auto w-[600px]"
        dataSource={orderData}
        renderItem={(item, index) => (
          <List.Item
            extra={
              <Link href={`my_orders/${item.id}`}>
                <EyeFilled className="text-2xl [&_svg]:w-20" />
              </Link>
            }
          >
            <List.Item.Meta
              title={`${++index}. ${item.id}`}
              description={`Status: ${item.status}`}
            />
            <div className="flex flex-col">
              <span>
                <b>Created at:</b> {item.createdAt.toDateString()}{" "}
                {item.createdAt.toLocaleTimeString()}
              </span>
              <span>
                <b>Total price:</b> {item.totalPrice} PLN
              </span>
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default MyOrders;

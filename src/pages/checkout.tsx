import { Button, Descriptions, message, Radio, Select, Typography } from "antd";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Address, { type AddressForm } from "~/components/Address";
import CartItemsList from "~/components/cart/CartItemsList";
import { type DELIVERY_COSTS } from "~/consts";
import {
  getDeliveryCostWithKey,
  getDeliveryLabelsForSelect,
} from "~/helpers/selectsHelpers";
import { useCartStore } from "~/stores/cartStore";
import { api } from "~/utils/api";
import { myNotification } from "~/utils/notification";

const deliveryOptions = getDeliveryLabelsForSelect();
const DEFAULT_DELIVERY = getDeliveryCostWithKey("post");

const Checkout: NextPage = () => {
  const { data: sessionData } = useSession();
  const { items, emptyCart } = useCartStore();
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();

  const createOrder = api.order.create.useMutation({
    onError: () =>
      void messageApi.error({
        content: "Error while creating order",
      }),
    onSuccess: () => {
      void messageApi.success({ content: "Order created" }).then(() => {
        emptyCart();
        void router.push("me/my_orders");
      });
    },
  });
  const address = api.user.getUserProfile.useQuery(
    { userId: sessionData?.user.id ?? "" },
    { enabled: !!sessionData?.user }
  );

  const { handleSubmit: triggerForm, control } = useForm<AddressForm>();

  const [delivery, setDeliveryCost] = useState(DEFAULT_DELIVERY);
  const [whichAddress, setWhichAddress] = useState<"my" | "custom">("my");

  if (!sessionData?.user) {
    return <div>Log in to checkout</div>;
  }

  const handleCreateOrder = async () => {
    const payload = {
      orderItems: items.map((item) => ({ id: item.id, quantity: item.qty })),
      userId: sessionData.user.id,
      delivery: delivery.key,
    };
    if (whichAddress === "custom") {
      // in this way we trigger the validation
      await triggerForm(
        // success form
        (data) => {
          void messageApi.loading({
            content: "Creating order...",
          });
          createOrder.mutate({
            ...payload,
            address: Object.values(data).join(","),
          });
        },
        // error form
        () => {
          myNotification.error({
            message: "Error",
            description: "Address is not valid",
          });
        }
      )();
    } else {
      createOrder.mutate(payload);
    }
  };

  const onDeliveryChange = (value: keyof typeof DELIVERY_COSTS) => {
    setDeliveryCost(getDeliveryCostWithKey(value));
  };

  return (
    <div className="p-4">
      {contextHolder}
      <Typography.Title className="text-center" level={3}>
        Checkout
      </Typography.Title>
      <div className="mx-auto mb-20 flex w-[600px] flex-col">
        <CartItemsList items={items} addToTotalAmount={delivery.cost}>
          <div className="my-10 flex justify-between">
            <div>
              <label className="mr-3">Delivery:</label>
              <Select
                className="w-28"
                onChange={onDeliveryChange}
                value={delivery.key}
                options={deliveryOptions}
                defaultValue={delivery.key}
              />
            </div>
            <span>{delivery.cost} PLN</span>
          </div>
          <Radio.Group
            className="mx-auto mt-6"
            onChange={({ target: { value } }) =>
              setWhichAddress(value as typeof whichAddress)
            }
            value={whichAddress}
          >
            <Radio value={"my"}>Use profile address</Radio>
            <Radio value={"custom"}>Use different address</Radio>
          </Radio.Group>
          <div className="mx-auto mt-6 mb-12 w-60">
            {whichAddress === "my" ? (
              <div>
                <Descriptions title="User address" column={1}>
                  <Descriptions.Item label="House / Flat number">
                    {address.data?.house_number}
                  </Descriptions.Item>
                  <Descriptions.Item label="Street">
                    {address.data?.street}
                  </Descriptions.Item>
                  <Descriptions.Item label="City">
                    {address.data?.city}
                  </Descriptions.Item>
                  <Descriptions.Item label="Zip-code">
                    {address.data?.zip_code}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    {address.data?.phone}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            ) : (
              <Address control={control} noBtn={true} />
            )}
          </div>
        </CartItemsList>
        <Button
          disabled={items.length <= 0}
          onClick={() => void handleCreateOrder()}
          className="ml-auto -mt-10"
          type="primary"
        >
          ORDER
        </Button>
      </div>
    </div>
  );
};

export default Checkout;

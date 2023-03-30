import { Button, Descriptions, Radio, Select, Typography } from "antd";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
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

const deliveryOptions = getDeliveryLabelsForSelect();
const DEFAULT_DELIVERY = getDeliveryCostWithKey("post");

const Checkout: NextPage = () => {
  const { data: sessionData } = useSession();
  const { items } = useCartStore();

  const createOrder = api.order.create.useMutation();
  const address = api.user.getUserProfile.useQuery(
    { userId: sessionData?.user.id ?? "" },
    { enabled: !!sessionData?.user }
  );

  const {
    handleSubmit,
    control,
    reset: resetForm,
    formState: { dirtyFields, isDirty },
    getValues,
  } = useForm<AddressForm>();

  const [delivery, setDeliveryCost] = useState(DEFAULT_DELIVERY);
  const [whichAddress, setWhichAddress] = useState<"my" | "custom">("my");

  if (!sessionData?.user) {
    return <div>Log in to checkout</div>;
  }

  const handleCreateOrder = () => {
    createOrder.mutate({
      orderItems: items.map((item) => ({ id: item.id, quantity: item.qty })),
      userId: sessionData.user.id,
      delivery: delivery.key,
    });
  };

  const onDeliveryChange = (value: keyof typeof DELIVERY_COSTS) => {
    setDeliveryCost(getDeliveryCostWithKey(value));
  };

  return (
    <div className="p-4">
      <Typography.Title className="text-center" level={3}>
        Checkout
      </Typography.Title>
      <div className="relative mx-auto w-[600px]">
        <CartItemsList items={items} addToTotalAmount={delivery.cost}>
          <div className="flex justify-between">
            <Select
              className="w-28"
              onChange={onDeliveryChange}
              value={delivery.key}
              options={deliveryOptions}
              defaultValue={delivery.key}
            />
            <span>{delivery.cost} PLN</span>
          </div>
        </CartItemsList>
        <Radio.Group
          onChange={({ target: { value } }) =>
            setWhichAddress(value as typeof whichAddress)
          }
          value={whichAddress}
        >
          <Radio value={"my"}>Use profile address</Radio>
          <Radio value={"custom"}>Use different address</Radio>
        </Radio.Group>
        <div>
          {whichAddress === "my" ? (
            <div>
              <Descriptions column={1}>
                <Descriptions.Item label="Street">
                  {address.data?.street}
                </Descriptions.Item>
                <Descriptions.Item label="House / Flat number">
                  {address.data?.house_number}
                </Descriptions.Item>
                <Descriptions.Item label="Zip-code">
                  {address.data?.zip_code}
                </Descriptions.Item>
                <Descriptions.Item label="City">
                  {address.data?.city}
                </Descriptions.Item>
                <Descriptions.Item label="Phone">
                  {address.data?.phone}
                </Descriptions.Item>
              </Descriptions>
            </div>
          ) : (
            <div>
              <Address control={control} isDirty={isDirty} noBtn={true} />
            </div>
          )}
        </div>
        <Button
          onClick={handleCreateOrder}
          className="absolute right-0 bottom-0"
          type="primary"
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Checkout;

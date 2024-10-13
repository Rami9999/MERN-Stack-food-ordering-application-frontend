import { useCreateMyRestaurant, useGetMyRestaurant, useGetMyRestaurantOrders, useUpdateMyRestaurant } from '@/api/MyRestaurant'
import OrderItemCard from '@/components/OrderItemCard';
import { Tabs } from '@/components/ui/tabs';
import ManageRestaurantForm from '@/forms/manage-restaurant-form/ManageRestaurantForm'
import { TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';

const ManageRestaurantPage = () => {
  const {createRestaurant, isLoading:isCreateLoading} = useCreateMyRestaurant();
  const {updateRestaurant, isLoading:isUpdateLoading} = useUpdateMyRestaurant();
  const {restaurant} = useGetMyRestaurant();
  const {orders} = useGetMyRestaurantOrders();

  const isEditing = !!restaurant;
  return (
    <Tabs defaultValue='orders'>
      <TabsList>
        <TabsTrigger value="orders">
          Orders
        </TabsTrigger>
        <TabsTrigger value="manage-restaurant">
          Manage Restaurant
        </TabsTrigger>
      </TabsList>
      <TabsContent value='orders' className='space-y-5 bg-gray-50 pg-10 rounded-md'>
        <h2 className='text-2xl font-bold'>
          {orders?.length} active Orders
        </h2>
        {orders?.map((order)=>(
          <OrderItemCard order={order} />
        ))}
      </TabsContent>

      <TabsContent value='manage-restaurant'>
        <ManageRestaurantForm restaurant={restaurant} 
          isLoading={isCreateLoading || isUpdateLoading} 
          onSave={isEditing? updateRestaurant:createRestaurant}/>
      </TabsContent>
    </Tabs>
    /**/
  )
}

export default ManageRestaurantPage
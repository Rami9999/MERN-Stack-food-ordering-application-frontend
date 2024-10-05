import { useCreateMyRestaurant, useGetMyRestaurant, useUpdateMyRestaurant } from '@/api/MyRestaurant'
import ManageRestaurantForm from '@/forms/manage-restaurant-form/ManageRestaurantForm'

const ManageRestaurantPage = () => {
  const {createRestaurant, isLoading:isCreateLoading} = useCreateMyRestaurant();
  const {updateRestaurant, isLoading:isUpdateLoading} = useUpdateMyRestaurant();
  const {restaurant} = useGetMyRestaurant();

  const isEditing = !!restaurant;
  return (
    <ManageRestaurantForm restaurant={restaurant} 
    isLoading={isCreateLoading || isUpdateLoading} 
    onSave={isEditing? updateRestaurant:createRestaurant}/>
  )
}

export default ManageRestaurantPage
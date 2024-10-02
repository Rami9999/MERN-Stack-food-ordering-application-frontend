import { useCreateMyRestaurant, useGetMyRestaurant } from '@/api/MyRestaurant'
import ManageRestaurantForm from '@/forms/manage-restaurant-form/ManageRestaurantForm'

const ManageRestaurantPage = () => {
  const {createRestaurant, isLoading} = useCreateMyRestaurant();
  const {restaurant} = useGetMyRestaurant();
  return (
    <ManageRestaurantForm restaurant={restaurant} isLoading={isLoading} onSave={createRestaurant}/>
  )
}

export default ManageRestaurantPage
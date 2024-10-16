import { useCreateCheckoutSession } from "@/api/OrderApi";
import { useGetRestaurant } from "@/api/RestaurantApi";
import CheckoutButton from "@/components/CheckoutButton";
import MenuItemComponent from "@/components/MenuItemComponent";
import OrderSummary from "@/components/OrderSummary";
import RestaurantInfo from "@/components/RestaurantInfo";
import { Card, CardFooter } from "@/components/ui/card";
import { UserFormData } from "@/forms/user-profile-form/UserProfileForm";
import { MenuItem } from "@/types";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { useState } from "react";
import { useParams } from "react-router-dom"


export type CartItem = {
    _id:string,
    name:string,
    price:number,
    quantity:number
}

const DetailsPage = () => {
    const {restaurantId} = useParams();
    const {restaurant,isLoading} = useGetRestaurant(restaurantId);
    const {createCheckoutSession,isLoading:isCheckoutLoading} = useCreateCheckoutSession();

    const [cartItems,setCartItems] = useState<CartItem[]>(()=>{
        const storedCartItems = sessionStorage.getItem(`cartItems-${restaurantId}`);
        return storedCartItems ? JSON.parse(storedCartItems):[];
    });


    const addToCart = (menuItem:MenuItem) =>{
        setCartItems((prevCartItems)=>{
            const isExisted = prevCartItems.find((cartItem)=>cartItem._id ===menuItem._id);

            let updatedCartItems;
            if(isExisted)
            {
                updatedCartItems = prevCartItems.map((cartItem)=>cartItem._id ===menuItem._id 
                ? {...cartItem,quantity:cartItem.quantity++}
                :cartItem);
            }else{
                updatedCartItems = [
                    ...prevCartItems,{
                        _id:menuItem._id,
                        name:menuItem.name,
                        price:menuItem.price,
                        quantity:1
                    }
                ];
            }
            
            sessionStorage.setItem(`cartItems-${restaurantId}`,JSON.stringify(updatedCartItems));
            return updatedCartItems;
        });

    };

    const removeFromCart = (cartItem:CartItem) =>{
        setCartItems((prevCartItems)=>{
            let updatedCartItems = prevCartItems.filter((item)=>item._id !==cartItem._id);
            sessionStorage.setItem(`cartItems-${restaurantId}`,JSON.stringify(updatedCartItems));
            return updatedCartItems
        });

    };

    const onCheckout = async (userFormData:UserFormData)=>{
        if(!restaurant)
        {
            return;
        }

        const checkoutData = {
            cartItems: cartItems.map((cartItem)=>({
                menuItemId:cartItem._id,
                name:cartItem.name,
                quantity:cartItem.quantity.toString(),
            })),
            restaurantId:restaurant._id,
            deliveryDetails:{
                name:userFormData.name,
                city:userFormData.city,
                country:userFormData.country,
                addressLine1:userFormData.addressLine1,
                email:userFormData.email as string,
            },
        };

        const data = await createCheckoutSession(checkoutData);
        window.location.href = data.url
    }

    if(isLoading || !restaurant){
        return "Loading...";
    }
  return (
    <div className="flex flex-col gap-10">
        <AspectRatio ratio={16/5}>
            <img src={restaurant.imageUrl} className="rounded-md object-cover h-full w-full" />
        </AspectRatio>
        <div className="grid md:grid-cols-[4fr_2fr] gap-5 md:px-32">
            <div className="flex flex-col gap-4">
                <RestaurantInfo  restaurant={restaurant}/>
                <span className="text-2xl font-bold tracking-tight">Menu</span>
                {restaurant.menuItems.map((menuItem)=>(
                    <MenuItemComponent menuItem={menuItem} addToCart={()=>addToCart(menuItem)}  />
                ))}
            </div>
            <div >
                <Card>
                    <OrderSummary restaurant={restaurant} cartItems={cartItems} removeFromCart={removeFromCart} />
                    <CardFooter>
                        <CheckoutButton disabled={cartItems.length===0}
                         onCheckout={onCheckout}
                          isLoading={isCheckoutLoading}/>
                    </CardFooter>
                </Card> 
            </div>
        </div>
    </div>
  )
}

export default DetailsPage
import DishImage from "../assets/images/burger.png";
export const RestDish = Array.from({ length: 50 }, (_, index) => ({
     title: `Burger ${index + 1}`,
    imageSource: DishImage, // Default image
    isMainTitleCenter: true,
    isWishListButton: false,
   
    onPress: () => console.log(`Ordered from Restaurant ${index + 1}`),
  }));
  

  
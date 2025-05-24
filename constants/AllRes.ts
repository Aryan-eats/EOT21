import restaurantImage from "../assets/images/restaurant.png";
import dishImage from "../assets/images/burger.png";

// Sample dish name pool
const dishNames = [
  "Spicy Burger", "Cheese Pizza", "Grilled Sandwich", "Paneer Tikka", "Veg Biryani",
  "Chicken Wings", "Fish Curry", "Tandoori Chicken", "Mushroom Pasta", "Dal Makhani",
  "Butter Chicken", "Veggie Wrap", "Chicken Shawarma", "Chole Bhature", "Noodles Bowl",
  "Mutton Kebab", "Palak Paneer", "BBQ Paneer Pizza", "Stuffed Paratha", "Pav Bhaji"
];

function getRandomDishes() {
  const shuffled = [...dishNames].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 5).map(name => ({
    name,
    image: dishImage,
  }));
}

export const AllRes = Array.from({ length: 50 }, (_, index) => ({
  title: `Restaurant ${index + 1}`,
  secondSubTitle: "Serves Veg & Non-Veg",
  imageSource: restaurantImage,
  time: `${15 + (index % 10)} mins`,
  distance: `${2 + (index % 5)}.${index % 10} km`,
  deliveryTime: `${20 + (index % 15)}-${35 + (index % 15)} mins`,
  isAddButton: true,
  buttonTitle: "Order Now",
  isPopular: index % 3 === 0,
  topDishes: getRandomDishes(),
  slotTimings: "10:00 AM , 12:00 PM , 02:00 PM , 04:00 PM , 06:00 PM , 08:00 PM , 10:00 PM",
}));

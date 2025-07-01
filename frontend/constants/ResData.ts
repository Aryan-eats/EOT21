import restaurantImage from "../assets/images/restaurant.png";
import dishImage from "../assets/images/burger.png"; // Same image for all dishes

export const coupons = [
  {
    id: 1,
    code: "WELCOME50",
    discount: "50%",
    description: "Get 50% off on your first order",
    minOrder: "₹200",
    validUntil: "31 Dec 2024",
    isActive: true
  },
  {
    id: 2,
    code: "SAVE100",
    discount: "₹100",
    description: "Flat ₹100 off on orders above ₹500",
    minOrder: "₹500",
    validUntil: "15 Apr 2024",
    isActive: true
  },
  {
    id: 3,
    code: "FIRST25",
    discount: "25%",
    description: "25% off on your first order",
    minOrder: "₹150",
    validUntil: "30 Jun 2024",
    isActive: true
  },
  {
    id: 4,
    code: "WEEKEND20",
    discount: "20%",
    description: "20% off on weekend orders",
    minOrder: "₹300",
    validUntil: "31 Mar 2024",
    isActive: true
  },
  {
    id: 5,
    code: "FREESHIP",
    discount: "Free Delivery",
    description: "Free delivery on orders above ₹400",
    minOrder: "₹400",
    validUntil: "30 May 2024",
    isActive: true
  }
];

export const ResData = Array.from({ length: 50 }, (_, index) => ({
    title: `Restaurant ${index + 1}`,
    firstSubTitle: "Fast Food, Indian",
    secondSubTitle: "Serves Veg & Non-Veg",
    imageSource: restaurantImage, // Default image
    isTitleInsideImage: false,
    isDistanceTime: true,
    time: `${15 + (index % 10)} mins`, // Varies between 15-24 mins
    distance: `${2 + (index % 5)}.${index % 10} km`, // Random distances
    // isAddButton: true,
    buttonTitle: "Order Now",
    onPress: () => console.log(`Ordered from Restaurant ${index + 1}`),
    rating: (4 + Math.random()).toFixed(1),
    review: "The KFC burger is a delightful treat! Juicy, perfectly crispy chicken paired with fresh toppings and a soft bun – it's a burst of flavor in every bite. Simple, satisfying, and worth every penny! 🍔✨",
    items: Array.from({ length: 5 }, (_, itemIndex) => ({
      name: `Popular Item ${itemIndex + 1}`,
      price: `${100 + itemIndex * 20}₹`, // Prices vary from 100₹ to 180₹
      imageSource: dishImage, // Same dish image for all items
      type: itemIndex % 2 === 0 ? 'Veg' : 'Non-Veg', // Alternate mock type
    })),
  }));
  

  
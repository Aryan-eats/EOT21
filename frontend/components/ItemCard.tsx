import { View, Image, Text, TouchableOpacity, Dimensions } from "react-native"
import { memo } from "react";
import { wp, hp, fs, isTablet } from "@/lib/responsive";

const { width } = Dimensions.get('window');

interface ItemCardProps {
    isTitleInsideImage?: boolean;
    titleInsideImage?: string;
    subTitleInsideImage?: string;
    title?: string;
    firstSubTitle?: string;
    secondSubTitle?: string;
    isDistanceTime?: boolean;
    time?: string;
    distance?: string;
    imageSource: string;
    isAddButton?: boolean;
    buttonTitle?: string;
    isMainTitleCenter?: boolean;
    isWishListButton?: boolean;
    onPress?: () => void;
    whishListButtonOnPress?: () => void;
    addButtonOnPress?: () => void;
    isWishlisted?: boolean;
}

const ItemCard = memo(({
    isTitleInsideImage=false,
    titleInsideImage,
    subTitleInsideImage,
    title,
    firstSubTitle,
    secondSubTitle,
    isDistanceTime=false,
    time,
    distance,
    imageSource,
    isAddButton=false,
    buttonTitle,
    isWishListButton=true,
    isMainTitleCenter=false,
    onPress,
    whishListButtonOnPress,
    addButtonOnPress,
    isWishlisted=false
}: ItemCardProps) => {
    
    // Responsive card width
    const cardWidth = isTablet() ? wp(25) : wp(42);
    const imageHeight = isTablet() ? hp(15) : hp(12);
    
    return(
        <TouchableOpacity 
          className="bg-white rounded-2xl shadow-md overflow-hidden"
          style={{ 
            width: cardWidth, 
            minHeight: isTablet() ? hp(25) : hp(20)
          }}
          onPress={onPress}
          activeOpacity={0.7}
        >
        {/* Image + Overlay */}
        <View className="relative w-full" style={{ height: imageHeight }}>
          <Image 
            className="w-full h-full rounded-t-2xl" 
            source={typeof imageSource === 'string' ? { uri: imageSource } : imageSource}
            resizeMode="cover"
          />
          
          {/* Title inside image (discounts, offers) */}
          {isTitleInsideImage && (
            <View className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded-md">
              <Text 
                className="text-white font-bold" 
                style={{ fontSize: fs(12) }}
              >
                {titleInsideImage}
              </Text>
              <Text 
                className="text-white" 
                style={{ fontSize: fs(10) }}
              >
                {subTitleInsideImage}
              </Text>
            </View>
          )}
      
          {/* Bookmark Icon (optional) */}
          {isWishListButton && (
            <TouchableOpacity 
              className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-sm" 
              onPress={whishListButtonOnPress}
              style={{ 
                width: wp(8), 
                height: wp(8),
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text 
                style={{ 
                  color: isWishlisted ? '#FF7A00' : 'black', 
                  fontSize: fs(14)
                }}
              >
                {isWishlisted ? '🔖' : '🔖'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      
        {/* Restaurant Name */}
        {title && (
          <View className={`w-full px-2 ${isMainTitleCenter ? 'flex-1 justify-center items-center' : 'flex-row justify-start items-center'}`}>
            <Text 
              className={`text-black font-bold ${isMainTitleCenter ? 'text-center' : ''}`}
              style={{ fontSize: fs(14) }}
              numberOfLines={2}
            >
              {title}
            </Text>
          </View>
        )}
        
        {/* Time & Distance */}
        {isDistanceTime && (
          <View className="flex-row items-center px-2 mt-1 space-x-1">
            <Text className="text-gray-500" style={{ fontSize: fs(11) }}>⏳ {time}</Text>
            <Text className="text-gray-500" style={{ fontSize: fs(11) }}>📍 {distance}</Text>
          </View>
        )}
      
        {/* Subtitle (optional) */}
        {firstSubTitle && (
          <Text 
            className="text-gray-600 px-2 mt-1" 
            style={{ fontSize: fs(12) }}
            numberOfLines={1}
          >
            {firstSubTitle}
          </Text>
        )}
        {secondSubTitle && (
          <Text 
            className="text-gray-500 px-2" 
            style={{ fontSize: fs(10) }}
            numberOfLines={1}
          >
            {secondSubTitle}
          </Text>
        )}
      
        {/* Add Button */}
        {isAddButton && (
          <TouchableOpacity 
            className="absolute bottom-2 right-2 bg-white px-3 py-1 rounded-md shadow"
            onPress={addButtonOnPress}
          >
            <Text 
              className="text-black font-bold" 
              style={{ fontSize: fs(12) }}
            >
              {buttonTitle}
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    )
});

ItemCard.displayName = 'ItemCard';

export default ItemCard;
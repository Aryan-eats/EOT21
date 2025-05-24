import { View, Image, Text, TouchableOpacity } from "react-native"

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

const ItemCard = ({
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
   
    return(
        <TouchableOpacity 
          className="w-44 min-h-44 bg-white rounded-2xl shadow-md overflow-hidden"  
          onPress={onPress}
        >
        {/* Image + Overlay */}
        <View className="relative w-full h-28">
          <Image className="w-full h-full rounded-t-2xl" source={typeof imageSource === 'string' ? { uri: imageSource } : imageSource} />
          
          {/* Title inside image (discounts, offers) */}
          {isTitleInsideImage && (
            <View className="absolute bottom-2 left-2 bg-black/60 px-2 py-1 rounded-md">
              <Text className="text-black text-sm font-bold">{titleInsideImage}</Text>
              <Text className="text-black text-xs">{subTitleInsideImage}</Text>
            </View>
          )}
      
          {/* Bookmark Icon (optional) */}
          {
            isWishListButton &&
            <TouchableOpacity className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-sm" onPress={whishListButtonOnPress}>
              <Text style={{ color: isWishlisted ? '#FF7A00' : 'black', fontWeight: 'bold', fontSize: 18 }}>{isWishlisted ? '🔖' : '🔖'}</Text>
            </TouchableOpacity>
          }
        </View>
      
        {/* Restaurant Name */}
        {
          title && (
            <View className={`w-full ${isMainTitleCenter ? 'flex-1 justify-center items-center' : 'flex-row justify-start'} items-center`}>
              <Text className={`text-black text-base font-bold px-2 ${isMainTitleCenter && 'text-center'}`}>{title}</Text>
            </View>
          )
        }
        
      
        {/* Time & Distance */}
        {isDistanceTime && (
          <View className="flex-row items-center px-2 space-x-2 mt-1">
            <Text className="text-gray-500 text-sm">⏳ {time}</Text>
            <Text className="text-gray-500 text-sm">📍 {distance}</Text>
          </View>
        )}
      
        {/* Subtitle (optional) */}
        {firstSubTitle && <Text className="text-gray-600 text-sm px-2 mt-1">{firstSubTitle}</Text>}
        {secondSubTitle && <Text className="text-gray-500 text-xs px-2">{secondSubTitle}</Text>}
      
        {/* Add Button */}
        {isAddButton && (
          <TouchableOpacity 
            className="absolute bottom-2 right-2 bg-white px-3 py-1 rounded-md shadow"
            onPress={addButtonOnPress}
          >
            <Text className="text-black text-sm font-bold">{buttonTitle}</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
      
    )
}

export default ItemCard;
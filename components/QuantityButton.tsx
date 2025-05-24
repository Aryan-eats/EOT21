import {useState} from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

interface QuantityButtonProps {
    orderQuantity?: number;
}

const QuantityButton = ({ orderQuantity }: QuantityButtonProps) => {

    const [quantity, setQuantity] = useState(orderQuantity || 1);

    return (
        <View className="w-16 h-8 flex flex-row items-center justify-between border border-orange-500 rounded-lg shadow-md px-2 bg-white">
            <TouchableOpacity className="text-orange-500 text-lg h-full px-1" onPress={() => setQuantity(quantity - 1)} disabled={quantity <= 1}>
                <Text className="text-orange-500 text-lg">-</Text>
            </TouchableOpacity>

            <Text className="text-black text-lg">{quantity}</Text>

            <TouchableOpacity className="text-orange-500 text-lg h-full px-1" onPress={() => setQuantity(quantity + 1)} disabled={quantity >= 10}>
                <Text className="text-orange-500 text-lg">+</Text>
            </TouchableOpacity>
        </View>
    )
}

export default QuantityButton;
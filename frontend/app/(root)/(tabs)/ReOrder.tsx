import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function Rides() {
  return (
    <SafeAreaView
      className="flex-1 items-center justify-center bg-white dark:bg-black">
      <Text className="items-center justify-between text-5xl text-amber-950">History</Text>
    </SafeAreaView>
  );
}

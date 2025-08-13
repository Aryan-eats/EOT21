import { ButtonProps } from "@/types/type";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { memo } from "react";
import { wp, hp, fs, isTablet } from "@/lib/responsive";

const getBgVariantStyle = (variant: ButtonProps["bgVariant"]) => {
  switch (variant) {
    case "secondary":
      return "bg-gray-500";
    case "danger":
      return "bg-red-500";
    case "success":
      return "bg-green-500";
    case "outline":
      return "bg-transparent border-neutral-300 border-[0.5px]";
    default:
      return "bg-primary-50";
  }
};

const getTextVariantStyle = (variant: ButtonProps["textVariant"]) => {
    switch (variant) {
      case "primary":
        return "text-black";
      case "secondary":
        return "text-gray-500";
      case "danger":
        return "text-red-500";
      case "success":
        return "text-green-500";
      default:
        return "text-white";
    }
};

const CustomButton = memo(({
  onPress,
  title,
  bgVariant = "primary",
  textVariant,
  IconLeft,
  IconRight,
  className,
  disabled = false,
  loading = false,
  ...props
}: ButtonProps & { disabled?: boolean; loading?: boolean }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={disabled || loading}
    className={`w-full rounded-full flex flex-row justify-center items-center shadow-md shadow-neutral-400/70 ${getBgVariantStyle(
      bgVariant
    )} ${disabled || loading ? 'opacity-50' : ''} ${className}`}
    style={{
      paddingVertical: isTablet() ? hp(2) : hp(1.5),
      paddingHorizontal: wp(4),
      minHeight: isTablet() ? hp(7) : hp(6),
    }}
    activeOpacity={disabled || loading ? 1 : 0.7}
    {...props}
  >
    {loading ? (
      <ActivityIndicator 
        size="small" 
        color={textVariant === "primary" ? "#000" : "#fff"} 
      />
    ) : (
      <>
        {IconLeft && <IconLeft />}
        <Text 
          className={`font-bold ${getTextVariantStyle(textVariant)}`}
          style={{ fontSize: fs(16) }}
        >
          {title}
        </Text>
        {IconRight && <IconRight />}
      </>
    )}
  </TouchableOpacity>
));

CustomButton.displayName = 'CustomButton';

export default CustomButton;

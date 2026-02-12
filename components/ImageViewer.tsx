import { Image } from "expo-image";
import { ImageSourcePropType, StyleSheet } from "react-native";
const PlaceHolderImage = require("@/assets/images/background-image.png");

type Props = {
  imgSource: ImageSourcePropType;
  selectedImage: string | undefined;
  onReset?: boolean;
};

export default function ImageViewer({
  imgSource,
  selectedImage,
  onReset,
}: Props) {
  const imageSource = selectedImage ? { uri: selectedImage } : imgSource;

  const resetImage = onReset ? PlaceHolderImage : imageSource;
  return <Image style={styles.Image} source={resetImage} />;
}

const styles = StyleSheet.create({
  Image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});

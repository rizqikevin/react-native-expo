import Button from "@/components/Button";
import CircleButton from "@/components/CircleButton";
import EmojiList from "@/components/EmojiList";
import EmojiPicker from "@/components/EmojiPicker";
import EmojiSticker from "@/components/EmojiSticker";
import IconButton from "@/components/IconButton";
import ImageViewer from "@/components/ImageViewer";
import domtoimage from "dom-to-image";
import * as ImagePicker from "expo-image-picker";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef, useState } from "react";
import { ImageSourcePropType, Platform, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { captureRef } from "react-native-view-shot";

const PlaceHolderImage = require("@/assets/images/background-image.png");

export default function Main() {
  const imageRef = useRef<View>(null);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined,
  );
  const [showAppOptions, setShowAppOptions] = useState<boolean>(false);
  const [modalIsVisible, setModalIsVisible] = useState<boolean>(false);
  const [pickedEmoji, setPickedEmoji] = useState<
    ImageSourcePropType | undefined
  >(undefined);
  const [resetImage, setResetImage] = useState<boolean>(true);
  const [permissionRequest, requestPermission] = MediaLibrary.usePermissions();

  useEffect(() => {
    if (!permissionRequest?.granted) {
      requestPermission();
    }
  }, [permissionRequest?.granted, requestPermission]);

  const pickImageAsync = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setShowAppOptions(true);
      setResetImage(false);
    } else {
      alert("You did not select any image");
    }
  };

  const onReset = () => {
    setShowAppOptions(false);
    setSelectedImage(undefined);
    setResetImage(true);
    setPickedEmoji(undefined);
  };

  const onAddSticker = () => {
    setModalIsVisible(true);
  };

  const onModalClose = () => {
    setModalIsVisible(false);
  };

  const onSaveImageAsync = async () => {
    if (Platform.OS !== "web") {
      try {
        const localUri = await captureRef(imageRef, {
          height: 440,
          quality: 1,
        });

        await MediaLibrary.saveToLibraryAsync(localUri);

        if (localUri) {
          alert("Pictures Saved");
        }
      } catch (e) {
        console.log("failed to saved pictures", e);
      }
    } else {
      try {
        if (!imageRef.current) {
          return;
        }

        const dataUri = await domtoimage.toJpeg(
          imageRef.current as unknown as Node,
          {
            quality: 0.95,
            width: 320,
            height: 440,
          },
        );

        let link = document.createElement("a");
        link.download = "sticker-smash.jpeg";
        link.href = dataUri;
        link.click();
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <View ref={imageRef} collapsable={false}>
            <ImageViewer
              imgSource={PlaceHolderImage}
              selectedImage={selectedImage}
              onReset={resetImage}
            />
            {pickedEmoji && (
              <EmojiSticker imageSize={40} stickerSource={pickedEmoji} />
            )}
          </View>
        </View>
        {showAppOptions ? (
          <View style={styles.optionContainer}>
            <View style={styles.optionShow}>
              <IconButton icon="refresh" label="Reset" onPress={onReset} />
              <CircleButton onPress={onAddSticker} />
              <IconButton
                icon="save-alt"
                label="Save"
                onPress={onSaveImageAsync}
              />
            </View>
          </View>
        ) : (
          <View style={styles.footerContainer}>
            <Button
              theme="primary"
              label="Choose a photo"
              onPress={pickImageAsync}
            />
            {/* <Button
              label="Use this photo"
              onPress={() => setShowAppOptions(true)}
            /> */}
          </View>
        )}
        <EmojiPicker isVisible={modalIsVisible} onClose={onModalClose}>
          <EmojiList onSelect={setPickedEmoji} onCloseModal={onModalClose} />
        </EmojiPicker>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
  },
  imageContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: "center",
  },
  optionContainer: {
    position: "absolute",
    bottom: 80,
  },
  optionShow: {
    alignItems: "center",
    flexDirection: "row",
  },
});

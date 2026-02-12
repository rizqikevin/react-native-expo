import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { PropsWithChildren } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type Props = PropsWithChildren<{
  isVisible: boolean;
  onClose: () => void;
}>;
export default function EmojiPicker({ isVisible, onClose, children }: Props) {
  return (
    <View>
      <Modal animationType="slide" visible={isVisible} transparent={true}>
        <View style={styles.modalContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Choose a Sticker</Text>
            <Pressable onPress={onClose}>
              <MaterialIcons name="close" color="#fff" size={22} />
            </Pressable>
          </View>
          {children}
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    height: "25%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    borderTopRightRadius: 18,
    borderTopLeftRadius: 18,
    backgroundColor: "#25292e",
  },
  titleContainer: {
    height: "16%",
    backgroundColor: "#464C55",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    paddingHorizontal: 20,
  },
  title: {
    color: "#fff",
    fontSize: 16,
  },
});

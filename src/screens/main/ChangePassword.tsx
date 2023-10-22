import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useState } from "react";
import { Box, VStack } from "native-base";
import Header from "../../components/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigations/config";
import InputLabel from "../../components/InputLabel";
import CustomButton from "../../components/CustomButton";
import { RootState, useAppDispatch, useAppSelector } from "../../store";
import { removeLoading, setLoading } from "../../store/loading.reducer";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { firebaseDb } from "../../firebase";
import { setUser } from "../../store/user.reducer";
import { onInputChange } from "../../utils/forms";

type Props = {} & NativeStackScreenProps<RootStackParams, "Password">;

const ChangePassword = (props: Props) => {
  const { navigation } = props;
  const user = useAppSelector((state: RootState) => state.user.user);
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    oldpassword: "",
    password: "",
    repassword: "",
  });

  const handleUpdate = async () => {
    dispatch(setLoading());
    try {
      if (user?.password !== formData.oldpassword) {
        Alert.alert("Sai mật khẩu cũ");
      } else {
        if (formData.password.length < 8) {
          Alert.alert("Mật khẩu mới phải tối thiểu 8 ký tự");
        } else {
          if (formData.password == formData.oldpassword) {
            Alert.alert("Hãy nhập mật khẩu mới khác với mật khẩu cũ");
          } else {
            if (formData.password !== formData.repassword) {
              Alert.alert("Nhập lại mật khẩu chưa đúng");
            } else {
              const newUser = {
                ...user,
                password: formData.password,
              };
              await updateDoc(doc(firebaseDb, "users", user?.phone!), newUser);
              await dispatch(setUser(newUser));
              navigation.goBack();
            }
          }
        }
      }
    } catch (err) {
      Alert.alert("Lỗi đăng nhập");
      console.error(err);
    } finally {
      dispatch(removeLoading());
    }
  };
  return (
    <Box flex={1} bgColor={"#fff"}>
      <Header.BasicHeader
        title="Thông tin cá nhân"
        handleBtnBack={() => navigation.goBack()}
      />
      <VStack flex={1} space={4} mt={8} px={4}>
        <InputLabel
          label="Mật khẩu cũ"
          placeholder="Nhập lại mật khẩu cũ"
          showIcon={true}
          secureTextEntry={true}
          borderWidth={1}
          value={formData.oldpassword}
          onChangeText={onInputChange("oldpassword", setFormData, formData)}
        />
        <InputLabel
          label="Mật khẩu mới"
          placeholder="Nhập lại mật khẩu mới"
          showIcon={true}
          secureTextEntry={true}
          borderWidth={1}
          value={formData.password}
          onChangeText={onInputChange("password", setFormData, formData)}
        />
        <InputLabel
          label="Nhập lại mật khẩu"
          placeholder="Nhập lại mật khẩu mới"
          showIcon={true}
          borderWidth={1}
          secureTextEntry={true}
          value={formData.repassword}
          onChangeText={onInputChange("repassword", setFormData, formData)}
        />
      </VStack>
      <Box mb={10} px={6}>
        <CustomButton btnText="Lưu" handleBtn={handleUpdate} />
      </Box>
    </Box>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({});

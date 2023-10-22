import { StyleSheet, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { Box, HStack, Text, VStack } from "native-base";
import InputLabel from "../../components/InputLabel";
import CustomButton from "../../components/CustomButton";
import BoxContainer from "../../components/BoxContainer";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParams, RootStackParams } from "../../navigations/config";
import { useDispatch } from "react-redux";
import { removeLoading, setLoading } from "../../store/loading.reducer";
import {
  fillProfileSchema,
  onInputChange,
  signUpSchema,
} from "../../utils/forms";
import { firebaseAuth, firebaseDb } from "../../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { setUser } from "../../store/user.reducer";
import { RecaptchaVerifier } from "firebase/auth";

type Props = {} & NativeStackScreenProps<RootStackParams, "Auth"> & any;

type ISignUp = {
  phone: string;
  password: string;
  repassword: string;
};

const SignUp = (props: Props) => {
  const { navigation } = props;
  const dispatch = useDispatch();
  firebaseAuth.languageCode = "it";

  const [formData, setFormData] = useState<ISignUp>({
    phone: "",
    password: "",
    repassword: "",
  });

  const handleLoginScreen = () => {
    navigation.navigate("Login");
  };

  const handleSignUp = async () => {
    // Loading
    dispatch(setLoading());
    // Validate
    try {
      console.log(
        "🚀 ~ file: SignUp.tsx:47 ~ handleSignUp ~ formData:",
        formData
      );
      await signUpSchema.validate(formData);
      if (formData.password !== formData.repassword) {
        throw Error("Nhập lại mật khẩu chưa đúng");
      } else {
        const docRef = doc(firebaseDb, "users", formData.phone);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          throw Error("Số điện thoại đã tồn tại");
        }
        /**
         * * * * * * * * * * * * * * * * * * *
         * TODO: Move to OTP if didn't exist *
         * * * * * * * * * * * * * * * * * * *
         */
        navigation.navigate("PostAuth", {
          phone: formData.phone,
          password: formData.password,
        });
      }
    } catch (err: any) {
      Alert.alert(err.message);
    } finally {
      dispatch(removeLoading());
    }
  };
  return (
    <BoxContainer justifyContent={"center"} alignItems={"center"} px={6}>
      <VStack flex={1} justifyContent={"center"} space={4}>
        <InputLabel
          label="Số điện thoại"
          placeholder="Nhập số điện thoại/Email"
          value={formData.phone}
          onChangeText={onInputChange("phone", setFormData, formData)}
        />
        <InputLabel
          label="Nhập mật khẩu"
          placeholder="Nhập mật khẩu"
          showIcon={true}
          secureTextEntry={true}
          value={formData.password}
          onChangeText={onInputChange("password", setFormData, formData)}
        />
        <InputLabel
          label="Nhập lại mật khẩu"
          placeholder="Nhập lại mật khẩu"
          showIcon={true}
          secureTextEntry={true}
          value={formData.repassword}
          onChangeText={onInputChange("repassword", setFormData, formData)}
        />
        <Box mt={8}>
          <CustomButton btnText={"Đăng ký"} handleBtn={handleSignUp} />
        </Box>
      </VStack>
      <HStack mb={16} space={1}>
        <Text fontWeight={400}>Bạn đã có tài khoản?</Text>
        <TouchableOpacity onPress={handleLoginScreen}>
          <Text
            fontWeight={500}
            fontSize={14}
            color={"primary.600"}
            textDecorationLine={"underline"}
          >
            Đăng nhập
          </Text>
        </TouchableOpacity>
      </HStack>
    </BoxContainer>
  );
};

export default SignUp;

const styles = StyleSheet.create({});

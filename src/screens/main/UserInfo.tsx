import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Box, VStack } from "native-base";
import Header from "../../components/Header";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigations/config";
import InputLabel from "../../components/InputLabel";
import { RootState, useAppDispatch, useAppSelector } from "../../store";
import { EGender } from "../../type/user";
import PickGender from "../../components/PickGender";
import { fillProfileSchema, onInputChange } from "../../utils/forms";
import CustomButton from "../../components/CustomButton";
import DateTimePicker from "@react-native-community/datetimepicker";
import DatePickerFormModal from "../../components/DatePickerFormModal";
import { TouchableOpacity } from "react-native-gesture-handler";
import { removeLoading, setLoading } from "../../store/loading.reducer";
import moment from "moment";
import { doc, updateDoc } from "firebase/firestore";
import { firebaseDb } from "../../firebase";
import { setUser } from "../../store/user.reducer";

type Props = {} & NativeStackScreenProps<RootStackParams, "UserInfo">;

type IProfileForm = {
  fullname: string;
  birthday: Date;
  gender: any;
};

const UserInfo = (props: Props) => {
  const { navigation } = props;
  const user = useAppSelector((state: RootState) => state.user.user);
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<IProfileForm>({
    fullname: user?.fullname!,
    birthday: new Date(user?.birthday!),
    gender: user?.gender!,
  });
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };
  const handleUpdate = async () => {
    dispatch(setLoading());
    try {
      await fillProfileSchema.validate(formData);
      const newUser: any = {
        ...user,
        ...formData,
        birthday: formData.birthday.toISOString(),
      };
      await updateDoc(doc(firebaseDb, "users", user?.phone!), newUser);
      await dispatch(setUser(newUser));
      navigation.goBack();
    } catch (err) {
      console.log("Lỗi hệ thống");
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
          label="Họ tên"
          placeholder="Nhập tên"
          value={formData.fullname}
          onChangeText={onInputChange<IProfileForm>(
            "fullname",
            setFormData,
            formData
          )}
          borderWidth={1}
        />
        <TouchableOpacity onPress={showDatePicker}>
          <InputLabel
            label="Ngày sinh"
            placeholder="Nhập ngày sinh"
            borderWidth={1}
            value={moment(formData.birthday).format("DD - MM - YYYY")}
            editable={false}
          />
        </TouchableOpacity>
        <PickGender
          gender={formData.gender}
          setGender={onInputChange<IProfileForm>(
            "gender",
            setFormData,
            formData
          )}
          disabled={false}
        />
      </VStack>
      <Box mb={10} px={6}>
        <CustomButton btnText="Lưu" handleBtn={handleUpdate} />
      </Box>
      <DatePickerFormModal
        // value={formData.birthday}
        value={formData.birthday}
        onChange={onInputChange<IProfileForm>(
          "birthday",
          setFormData,
          formData
        )}
        isShowModal={isDatePickerVisible}
        ExitBtn={() => (
          <Box w={"100%"}>
            <CustomButton btnText="Lưu" handleBtn={hideDatePicker} />
          </Box>
        )}
      />
    </Box>
  );
};

export default UserInfo;

const styles = StyleSheet.create({});

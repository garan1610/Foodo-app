import { StyleSheet } from "react-native";
import React, { useState } from "react";
import { Box, Center, Column, FormControl, Text } from "native-base";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TouchableOpacity } from "react-native-gesture-handler";
import moment from "moment";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

type Props = {
  value: Date;
  onChange: (value: Date) => void;
  isShowModal: Boolean;
  ExitBtn: React.FC;
};

const DatePickerFormModal = ({
  value,
  onChange,
  isShowModal,
  ExitBtn,
}: Props) => {
  const handleConfirm = (date: Date) => {
    onChange(date);
  };
  return (
    <Box
      bgColor={"gray.100"}
      position={"absolute"}
      top={0}
      bottom={0}
      left={0}
      right={0}
      justifyContent={"center"}
      alignItems={"center"}
      display={isShowModal ? "block" : "none"}
    >
      <DateTimePicker
        mode="date"
        display="spinner"
        value={value}
        onChange={(event: DateTimePickerEvent, date: Date | undefined) =>
          handleConfirm(date as Date)
        }
      />
      <ExitBtn />
    </Box>
  );
};

export default DatePickerFormModal;

const styles = StyleSheet.create({});

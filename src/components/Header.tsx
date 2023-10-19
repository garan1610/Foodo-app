import { StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Box, HStack, Icon, Input, Text, VStack, useTheme } from "native-base";
import {
  Add,
  ArrowLeft2,
  FilterSearch,
  Location,
  SearchNormal,
} from "iconsax-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { setUser } from "../store/user.reducer";
import { RootState, useAppSelector } from "../store";
import { useNavigation } from "@react-navigation/native";

const HomeHeader = ({
  name = "Jack 5M",
  handleSearch,
  handleFilter = () => {},
}: any) => {
  const insets = useSafeAreaInsets();
  const user = useAppSelector((state: RootState) => state.user.user);
  const navigation = useNavigation<any>();

  return (
    <Box
      bgColor={"primary.600"}
      px={4}
      py={2}
      style={{ paddingTop: insets.top }}
    >
      <VStack space={2}>
        <HStack alignItems={"center"} justifyContent={"space-between"}>
          <TouchableOpacity onPress={handleFilter}>
            <HStack space={1}>
              <Box>
                <FilterSearch size="24" color="#fff" />
              </Box>
              <Text fontSize={16} color="#fff">
                Bộ lọc
              </Text>
            </HStack>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Profile");
            }}
          >
            <Box size={8} borderRadius={100} overflow={"hidden"}>
              <Image
                source={{
                  uri: user?.avatarUrl
                    ? user?.avatarUrl
                    : "https://assets.stickpng.com/images/585e4bf3cb11b227491c339a.png",
                }}
                style={{ width: 32, height: 32 }}
              />
            </Box>
          </TouchableOpacity>
        </HStack>
        <SearchingBar handleSearch={handleSearch} />
      </VStack>
    </Box>
  );
};

const SearchingBar = ({ handleSearch }: any) => {
  const { colors } = useTheme();
  const [textSearch, setTextSearch] = useState("");
  return (
    <Box mb={2}>
      <Input
        value={textSearch}
        onChangeText={setTextSearch}
        backgroundColor={"#fff"}
        borderRadius={100}
        px={1.5}
        py={3}
        placeholder="Tìm kiếm"
        placeholderTextColor={colors.muted[400]}
        onEndEditing={() => handleSearch(textSearch)}
        InputLeftElement={
          <TouchableOpacity>
            <Icon
              as={<SearchNormal size="16" color={colors.muted[400]} />}
              size={5}
              ml="2"
              color="muted.400"
            />
          </TouchableOpacity>
        }
      />
    </Box>
  );
};

type Props = {
  handleBtnBack?: any;
  handleAdd?: any;
  handleDone?: any;
  handleSearch?: any;
  title: string;
  bgColor?: string;
};

const BasicHeader = (props: Props) => {
  const insets = useSafeAreaInsets();
  // set when have user
  const user = true;
  const {
    title,
    handleBtnBack = null,
    handleAdd = null,
    handleDone = null,
    handleSearch = null,
    bgColor = "primary.600",
  } = props;
  return (
    <Box bgColor={bgColor} px={4} py={2} style={{ paddingTop: insets.top }}>
      <HStack alignItems={"center"} justifyContent={"space-between"}>
        {handleBtnBack ? (
          <TouchableOpacity onPress={handleBtnBack}>
            <ArrowLeft2 size="32" color="#fff" />
          </TouchableOpacity>
        ) : (
          <Box size={8} />
        )}
        <Text fontSize={16} fontWeight={500} color="#fff" paddingTop={4}>
          {title}
        </Text>

        {handleAdd && (
          <TouchableOpacity onPress={handleAdd}>
            <Add size="32" color="#fff" />
          </TouchableOpacity>
        )}
        {handleDone && (
          <TouchableOpacity onPress={handleAdd}>
            <Text fontSize={16} fontWeight={500}>
              Xong
            </Text>
          </TouchableOpacity>
        )}
        {!handleAdd && !handleDone && <Box size={8} />}
      </HStack>
      {handleSearch && <SearchingBar />}
    </Box>
  );
};

export default {
  BasicHeader,
  HomeHeader,
};

const styles = StyleSheet.create({});

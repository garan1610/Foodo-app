import {
  StyleSheet,
  RefreshControl,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Box, Center, FlatList, Text, VStack, useTheme } from "native-base";
import Header from "../../components/Header";
import { Bookmark as BookmarkIcon } from "iconsax-react-native";
import ItemCard from "../../components/ItemCard";
import { IRestaurant } from "../../type/restaurant";
import { RootState, useAppDispatch, useAppSelector } from "../../store";
import { doc, getDoc } from "firebase/firestore";
import { firebaseDb } from "../../firebase";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { removeLoading, setLoading } from "../../store/loading.reducer";

type Props = {};

const Bookmark = (props: Props) => {
  const isFocused = useIsFocused();
  const dispatch = useAppDispatch();
  const { colors } = useTheme();
  const user = useAppSelector((state: RootState) => state.user.user);

  const [listRes, setListRes] = useState<IRestaurant[]>([]);
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);

  const fetchBookmarkRes = async () => {
    try {
      dispatch(setLoading());
      let list: any = [];
      const resArr: any = user?.bookmark.map(async (resId) => {
        const resRef = doc(firebaseDb, "restaurants", resId);
        const resSnap = await getDoc(resRef);
        // TODO: remove id, it will added when created.
        // console.log(resArr);
        list.push({ ...resSnap.data(), id: resId });
        // setListRes((prevState) => [...prevState, resSnap.data() as IRestaurant]);
      });
      await Promise.all(resArr);
      setListRes(list);
    } catch (err) {
      console.log(err);
    } finally {
      dispatch(removeLoading());
    }
  };

  useEffect(() => {
    fetchBookmarkRes();
  }, [isFocused]);
  return (
    <Box flex={1} bgColor={"#fff"}>
      <Header.BasicHeader title="Đã lưu" />
      {listRes.length > 0 ? (
        <Box flex={1}>
          <VStack p={4} flex={1} space={4}>
            {listRes.map((res) => (
              <Box key={res.id}>
                <ItemCard restaurant={res} />
              </Box>
            ))}
            {/* <FlatList
              data={listRes}
              renderItem={({ item }) => <ItemCard restaurant={item} />}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}

                />
              }
            /> */}
          </VStack>
        </Box>
      ) : (
        <Center flex={1}>
          <Box>
            <Ionicons
              name={"bookmark"}
              size={64}
              color={colors.coolGray[300]}
            />
          </Box>
          <Box>
            <Text fontWeight={400} fontSize={14} color={colors.coolGray[400]}>
              Bạn chưa lưu mục nào
            </Text>
          </Box>
        </Center>
      )}
    </Box>
  );
};

export default Bookmark;

const styles = StyleSheet.create({});

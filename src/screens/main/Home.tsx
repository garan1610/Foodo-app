import { Alert, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Box, VStack } from "native-base";
import Header from "../../components/Header";
import ItemCard from "../../components/ItemCard";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParams } from "../../navigations/config";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { firebaseDb } from "../../firebase";
import { IRestaurant } from "../../type/restaurant";
import PopUpFilter from "../../components/PopUpFilter";
import { RootState, useAppDispatch, useAppSelector } from "../../store";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { createRes, restaurantSample } from "../../data/mockup";
import { removeLoading, setLoading } from "../../store/loading.reducer";
import { removeDau } from "../../utils/utils";

type Props = {} & NativeStackScreenProps<RootStackParams, "TabNav">;

const Home = (props: Props) => {
  const [listRes, setListRes] = useState<IRestaurant[]>([]);
  const [allRes, setAllRes] = useState<IRestaurant[]>([]);
  const [showModal, setShowModal] = useState(false);
  const user = useAppSelector((state: RootState) => state.user.user);
  const dispatch = useAppDispatch();

  const handleSearch = async (textSearch: string) => {
    dispatch(setLoading());
    // Validate
    try {
      if (textSearch) {
        const newRes = allRes.filter((res) =>
          removeDau(res.name)
            .toLowerCase()
            .includes(removeDau(textSearch).toLowerCase())
        );
        setListRes(newRes);
      } else {
        setListRes(allRes);
      }
    } catch (err: any) {
      Alert.alert(err.message);
    } finally {
      dispatch(removeLoading());
    }
  };

  const fetchAllRestaurant = async () => {
    const queryRes = await getDocs(collection(firebaseDb, "restaurants"));
    const restaurants: IRestaurant[] = [];
    queryRes.forEach((doc: any) => {
      restaurants.push({ ...doc.data() });
    });
    setListRes(restaurants);
    setAllRes(restaurants);

    // setListRes(restaurantSample);
    // setAllRes(restaurantSample);
  };

  useEffect(() => {
    // createRes();
    fetchAllRestaurant();
    console.log(user);
  }, []);

  const handleFilterBtn = (district: string, category: string) => {
    try {
      dispatch(setLoading());
      let newRestaurant = [];
      if (district && category) {
        newRestaurant = allRes.filter(
          (res) => res.category.includes(category) && res.district == district
        );
      } else if (district && !category) {
        newRestaurant = allRes.filter((res) => res.district == district);
      } else if (category && !district) {
        newRestaurant = allRes.filter((res) => res.category.includes(category));
      } else {
        newRestaurant = [...allRes];
      }
      setListRes(newRestaurant);
      setShowModal(false);
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(removeLoading());
    }
  };

  return (
    <Box flex={1} bgColor={"#fff"}>
      <Header.HomeHeader
        handleSearch={handleSearch}
        handleFilter={() => setShowModal(true)}
      />
      <PopUpFilter
        showModal={showModal}
        setShowModal={setShowModal}
        handleBtn={(district: string, category: string) => {
          dispatch(setLoading());
          handleFilterBtn(district, category);
        }}
      />
      <ScrollView>
        <VStack p={4} flex={1} space={4}>
          {listRes.map((res) => (
            <Box key={res.id}>
              <ItemCard restaurant={res} />
            </Box>
          ))}
        </VStack>
      </ScrollView>
      {/* <TouchableOpacity
        onPress={createRes}
        style={{ width: 100, height: 30, backgroundColor: "red" }}
      ></TouchableOpacity> */}
    </Box>
  );
};

export default Home;

const styles = StyleSheet.create({});

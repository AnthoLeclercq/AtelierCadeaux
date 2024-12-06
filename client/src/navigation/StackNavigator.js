import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import UserContext from "../context/userContext";

import Home from "../screens/home/Home";
import Alfred from "../screens/alfred/Alfred";
import Catalog from "../screens/catalog/Catalog";
import Results from "../screens/catalog/Results";
import ProductDetails from "../screens/product/ProductDetails"
import Authentication from "../screens/authentication/Authentication";
import Login from "../screens/authentication/login/Login";
import RegisterChoice from "../screens/authentication/register/RegisterChoice";
import RegisterUser from "../screens/authentication/register/user/RegisterUser";
import RegisterArtisan from "../screens/authentication/register/artisan/RegisterArtisan";
import ResetPassword from "../screens/authentication/reset/ResetPassword";
import Cart from "../screens/cart/Cart";
import VisitProfile from "../screens/profile/VisitProfile";
import Profile from "../screens/profile/Profile";
import EditProfile from "../screens/profile/EditProfile"
import Order from "../screens/order/Order"
import OrderDetails from "../screens/order/OrderDetails";
import Favorite from "../screens/favorite/Favorite"; 
import AddProduct from "../screens/manage/AddProduct"; 
import ModifyProduct from "../screens/manage/ModifyProduct"
import ManageProduct from "../screens/manage/ManageProduct";
import Settings from "../screens/settings/Settings"
import FAQ from "../screens/help/FAQ"
import Discussions from "../screens/discussion/Discussions";
import DiscussionDetails from "../screens/discussion/DiscussionsDetails";
import Comment from "../screens/comment/Comment"
import AddComment from "../screens/comment/AddComment";
import SuggestedProducts from "../screens/alfred/SuggestedProducts";

import { AntDesign, Ionicons, Entypo } from "@expo/vector-icons";
import ContextMap from "../screens/maps/ContextMap";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function AuthTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { height: 50 },
        tabBarActiveTintColor: "#E7BD06",
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <AntDesign name="home" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Catalog"
        component={Catalog}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <AntDesign name="appstore1" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Authentication"
        component={Authentication}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Entypo name="login" size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function ClientTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { height: 50 },
        tabBarActiveTintColor: "#E7BD06",
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <AntDesign name="home" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Catalog"
        component={Catalog}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <AntDesign name="appstore1" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={Cart}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="cart" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Favorite"
        component={Favorite}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="heart" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="person" size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

function ArtisanTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { height: 50 },
        tabBarActiveTintColor: "#E7BD06",
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <AntDesign name="home" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Catalog"
        component={Catalog}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <AntDesign name="appstore1" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="AddProduct"
        component={AddProduct}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="add-circle" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="ManageProduct"
        component={ManageProduct}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="cog" size={22} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({ color }) => <Ionicons name="person" size={22} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

const StackNavigator = () => {
  const { user } = useContext(UserContext);

  return (
    <Stack.Navigator>
      {user && user.role === "artisan" ? (
        <>
        <Stack.Screen name="ArtisanTabs" component={ArtisanTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Results" component={Results} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }} />
        <Stack.Screen name="AddProduct" component={AddProduct} options={{ headerShown: false }} />
        <Stack.Screen name="ModifyProduct" component={ModifyProduct} options={{ headerShown: false }} />
        <Stack.Screen name="VisitProfile" component={VisitProfile} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
        <Stack.Screen name="Order" component={Order} options={{ headerShown: false }} />
        <Stack.Screen name="OrderDetails" component={OrderDetails} options={{ headerShown: false }} />
        <Stack.Screen name="Discussions" component={Discussions} options={{ headerShown: false }} />
        <Stack.Screen name="DiscussionDetails" component={DiscussionDetails} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
        <Stack.Screen name="FAQ" component={FAQ} options={{ headerShown: false }} />
        <Stack.Screen name="Comment" component={Comment} options={{ headerShown: false }} />
        <Stack.Screen name="Alfred" component={Alfred} options={{ headerShown: false }} />
        <Stack.Screen name="ContextMap" component={ContextMap} options={{ headerShown: false }} />
        <Stack.Screen name="SuggestedProducts" component={SuggestedProducts} options={{ headerShown: false }} />
        </>
      ) : user && user.role === "client" ? (
        <>
        <Stack.Screen name="ClientTabs" component={ClientTabs} options={{ headerShown: false }} />
        <Stack.Screen name="Results" component={Results} options={{ headerShown: false }} />
        <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
        <Stack.Screen name="VisitProfile" component={VisitProfile} options={{ headerShown: false }} />
        <Stack.Screen name="Order" component={Order} options={{ headerShown: false }} />
        <Stack.Screen name="OrderDetails" component={OrderDetails} options={{ headerShown: false }} />
        <Stack.Screen name="Discussions" component={Discussions} options={{ headerShown: false }} />
        <Stack.Screen name="DiscussionDetails" component={DiscussionDetails} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
        <Stack.Screen name="FAQ" component={FAQ} options={{ headerShown: false }} />
        <Stack.Screen name="Comment" component={Comment} options={{ headerShown: false }} />
        <Stack.Screen name="AddComment" component={AddComment} options={{ headerShown: false }} />
        <Stack.Screen name="Alfred" component={Alfred} options={{ headerShown: false }} />
        <Stack.Screen name="ContextMap" component={ContextMap} options={{ headerShown: false }} />
        <Stack.Screen name="SuggestedProducts" component={SuggestedProducts} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen name="AuthTab" component={AuthTab} options={{ headerShown: false }} />
          <Stack.Screen name="ProductDetails" component={ProductDetails} options={{ headerShown: false }} />
          <Stack.Screen name="Results" component={Results} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
          <Stack.Screen name="RegisterChoice" component={RegisterChoice} options={{ headerShown: false }} />
          <Stack.Screen name="RegisterUser" component={RegisterUser} options={{ headerShown: false }} />
          <Stack.Screen name="RegisterArtisan" component={RegisterArtisan} options={{ headerShown: false }} />
          <Stack.Screen name="Comment" component={Comment} options={{ headerShown: false }} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false }} />
          <Stack.Screen name="ContextMap" component={ContextMap} options={{ headerShown: false }} />
          <Stack.Screen name="Alfred" component={Alfred} options={{ headerShown: false }} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;

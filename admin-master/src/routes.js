import React from "react";
import * as Icons from "@ant-design/icons";

// ============= pages ====================
const MyProfile = React.lazy(() => import("./pages/MyProfile"));
const Users = React.lazy(() => import("./pages/Users"));
const Hostels = React.lazy(() => import("./pages/Hostels"));
const Sellings = React.lazy(() => import("./pages/Sellings"));
const SharedPosts = React.lazy(() => import("./pages/SharedPosts"));

export const routes = [
  {
    path: "/my-profile",
    component: MyProfile,
  },
  {
    path: "/users",
    name: "QUẢN LÍ NGƯỜI DÙNG",
    component: Users,
    icon: Icons.UserOutlined
  },
  {
    path: "/hostels",
    name: "QUẢN LÍ PHÒNG TRỌ",
    component: Hostels,
    icon: Icons.HomeOutlined
  },
  {
    path: "/sellings",
    name: "QUẢN LÍ MUA BÁN",
    component: Sellings,
    icon: Icons.ShopOutlined
  },
  {
    path: "/posts",
    name: "QUẢN LÍ BÀI ĐĂNG",
    component: SharedPosts,
    icon: Icons.UnorderedListOutlined
  }
];
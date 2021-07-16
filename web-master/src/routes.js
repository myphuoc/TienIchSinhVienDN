import React from "react";
import * as Icons from "@ant-design/icons";

// ============= pages ====================
const MyProfile = React.lazy(() => import("./pages/MyProfile"));
const MyPosts = React.lazy(() => import("./pages/MyPosts"));
const Hostels = React.lazy(() => import("./pages/Hostels"));
const Sellings = React.lazy(() => import("./pages/Sellings"));
const SharedExperiences = React.lazy(() => import("./pages/SharedExperiences"));
const SharedPostDetails = React.lazy(() => import("./pages/SharedExperiences/SharedPostDetails"));

export const routes = [
  {
    path: "/my-posts",
    exact: true,
    isAuthenticated: true,
    component: MyPosts,
  },
  {
    path: "/hostels",
    exact: true,
    isVisible: true,
    name: "PHÒNG TRỌ",
    component: Hostels,
    icon: Icons.HomeOutlined,
  },
  {
    path: "/sellings",
    exact: true,
    isVisible: true,
    name: "GÓC MUA BÁN",
    component: Sellings,
    icon: Icons.ShopOutlined,
  },
  {
    path: "/experiences",
    exact: true,
    isVisible: true,
    name: "GÓC KINH NGHIỆM",
    component: SharedExperiences,
    icon: Icons.BulbOutlined,
  },
  {
    path: "/my-profile",
    exact: true,
    isAuthenticated: true,
    component: MyProfile,
  },
  {
    path: "/experiences/:id",
    exact: true,
    component: SharedPostDetails,
  },
];
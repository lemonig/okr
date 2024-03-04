import * as React from "react";
import Notification from "../apps/pages/notification";

const Login = React.lazy(() => import("../apps/pages/login"));
const BodyLayout = React.lazy(() => import("../apps/layout/lay-body"));
const Home = React.lazy(() => import("../apps/pages/home"));
const Map = React.lazy(() => import("../apps/pages/map"));
const Example = React.lazy(() => import("../apps/pages/example"));
const LoginToHome = React.lazy(() => import("../apps/pages/loginToHome"));
const CommentList = React.lazy(() => import("../apps/pages/commentList"));
const CommentDetail = React.lazy(() => import("../apps/pages/commentDetail"));
const Matrix = React.lazy(() => import("../apps/pages/matrix"));
const SeasonPool = React.lazy(() => import("../apps/pages/seasonPool"));
const ApartManager = React.lazy(() => import("../apps/pages/ApartManager"));
const UserManager = React.lazy(() => import("../apps/pages/UserManager"));
const CompanyOkr = React.lazy(() => import("../apps/pages/CompanyOkr"));

// const Notification = React.lazy(() => import("../apps/pages/notification"));

// import BodyLayout from '../apps/layout/lay-body';
// import Home from '../apps/pages/home';
// import Map from '../apps/pages/map';
// import Example from '../apps/pages/example/index.jsx';
// import LoginToHome from '../apps/pages/loginToHome/index';
// import CommentList from '../apps/pages/commentList';
// import CommentDetail from '../apps/pages/commentDetail';
// import CommentDetails from '../apps/pages/commentDetails';
// import Matrix from '../apps/pages/matrix';

/**
 * index: true 默认主路由不需要path
 * **/
const config = [
  {
    path: "/login",
    element: (
      <React.Suspense fallback={<>...</>}>
        <Login />,
      </React.Suspense>
    ),
  },
  {
    path: "blank",
    element: (
      <React.Suspense fallback={<>...</>}>
        <LoginToHome />,
      </React.Suspense>
    ),
  },
  {
    path: "/",
    element: (
      <React.Suspense fallback={<>...</>}>
        <BodyLayout />
      </React.Suspense>
    ),
    children: [
      {
        element: (
          <React.Suspense fallback={<>...</>}>
            <Home />,
          </React.Suspense>
        ),
        index: true,
      },
      {
        path: "seasonPool",
        element: (
          <React.Suspense fallback={<>...</>}>
            <SeasonPool />,
          </React.Suspense>
        ),
      },
      {
        path: "comment",
        element: (
          <React.Suspense fallback={<>...</>}>
            <CommentList />,
          </React.Suspense>
        ),
      },
      // {
      //   path: 'commentDetails',
      //   element: <CommentDetails />,
      //   children: [
      //     {
      //       path: ':id',
      //       element: <CommentDetail />,
      //       index: true
      //     }
      //   ]
      // },

      {
        path: "notification",
        element: <Notification />,
      },
      {
        path: "apartmentManager",
        element: <ApartManager />,
      },
      {
        path: "userManager",
        element: <UserManager />,
      },
      {
        path: "companyOkr",
        element: <CompanyOkr />,
      },
      {
        path: "commentDetail",
        element: (
          <React.Suspense fallback={<>...</>}>
            <CommentDetail />
          </React.Suspense>
        ),
      },
    ],
  },
  {
    path: "*",
    element: <Login />,
  },
];
export default config;

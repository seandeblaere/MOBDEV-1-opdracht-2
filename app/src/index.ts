import "./style/reset.css";
import "./style/main.css";
import { router } from "./core/router/index";
import "./components/app/App";

const routes = [
  {
    path: "/",
    component: "my-app",
    children: [
      {
        path: "/",
        component: "auth-container",
        action: async () => {
          await import("./components/auth/AuthContainer");
        },
        children: [
          {
            path: "trips",
            component: "trip-overview",
            action: async () => {
              await import("./components/pages/trips/TripOverview");
            },
          },
          {
            path: "trips/create",
            component: "trip-create",
            action: async () => {
              await import("./components/pages/trips/tripCreate");
            },
          },
          {
            path: "trips/:id",
            component: "trip-detail-container",
            action: async () => {
              await import("./components/pages/trips/tripDetailContainer");
            },
            children: [
              {
                path: "/",
                component: "trip-detail",
                action: async () => {
                  await import("./components/pages/trips/tripDetail");
                },
              },
              {
                path: "/edit",
                component: "trip-edit",
                action: async () => {
                  await import("./components/pages/trips/tripEdit");
                },
              },
              {
                path: "activities",
                component: "activity-overview",
                action: async () => {
                  await import(
                    "./components/pages/activities/ActivityOverview"
                  );
                },
              },
              {
                path: "activities/calender",
                component: "activity-calender",
                action: async () => {
                  await import(
                    "./components/pages/activities/activityCalender"
                  );
                },
              },
              {
                path: "activities/create",
                component: "activity-create",
                action: async () => {
                  await import("./components/pages/activities/activityCreate");
                },
              },
              {
                path: "activities/:activityId",
                component: "activity-detail-container",
                action: async () => {
                  await import(
                    "./components/pages/activities/activityDetailContainer"
                  );
                },
                children: [
                  {
                    path: "/",
                    component: "activity-detail",
                    action: async () => {
                      await import(
                        "./components/pages/activities/activityDetail"
                      );
                    },
                  },
                  {
                    path: "/edit",
                    component: "activity-edit",
                    action: async () => {
                      await import(
                        "./components/pages/activities/activityEdit"
                      );
                    },
                  },
                ],
              },
              {
                path: "notes",
                component: "note-overview",
                action: async () => {
                  await import("./components/pages/notes/NoteOverview");
                },
              },
              {
                path: "notes/create",
                component: "note-create",
                action: async () => {
                  await import("./components/pages/notes/noteCreate");
                },
              },
              {
                path: "notes/:noteId",
                component: "note-detail-container",
                action: async () => {
                  await import("./components/pages/notes/noteDetailContainer");
                },
                children: [
                  {
                    path: "/",
                    component: "note-detail",
                    action: async () => {
                      await import("./components/pages/notes/noteDetail");
                    },
                  },
                  {
                    path: "/edit",
                    component: "note-edit",
                    action: async () => {
                      await import("./components/pages/notes/noteEdit");
                    },
                  },
                ],
              },
              {
                path: "expenses",
                component: "expense-overview",
                action: async () => {
                  await import("./components/pages/expenses/ExpenseOverview");
                },
              },
              {
                path: "expenses/create",
                component: "expense-create",
                action: async () => {
                  await import("./components/pages/expenses/expenseCreate");
                },
              },
              {
                path: "expenses/:expenseId",
                component: "expense-detail-container",
                action: async () => {
                  await import(
                    "./components/pages/expenses/expenseDetailContainer"
                  );
                },
                children: [
                  {
                    path: "/",
                    component: "expense-detail",
                    action: async () => {
                      await import("./components/pages/expenses/expenseDetail");
                    },
                  },
                  {
                    path: "/edit",
                    component: "expense-edit",
                    action: async () => {
                      await import("./components/pages/expenses/expenseEdit");
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        path: "login",
        component: "login-page",
        action: async () => {
          await import("./components/auth/Login");
        },
      },
      {
        path: "register",
        component: "register-page",
        action: async () => {
          await import("./components/auth/register");
        },
      },
    ],
  },
];

router.setRoutes(routes);

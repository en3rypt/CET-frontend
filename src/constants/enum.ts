// create localStorageEnum

export enum LocalStorageEnum {
  AUTH_TOKEN = "AuthToken",
  USER_ID = "UserID",
  USER_NAME = "UserName",
  USER_EMAIL = "UserEmail",
}

export enum RoutePaths {
  HOME = "/",
  LOGIN = "/login",
  REGISTER = "/register",
  DASHBOARD = "/dashboard",
  PROJECTS = "/projects",
  ADD_PROJECT = "/add-project",
  EXPENSES = "/expenses",
  ADD_EXPENSE = "/add-expense",
}

export enum ApiRoutes {
  LOGIN = "/auth/login",
  REGISTER = "/auth/register",
  PROJECTS = "/project",
  EXPENSES = "/expenses",
  USER = "/user/profile",
  ADD_PROJECT = "/project",
  ADD_EXPENSE = "/expense",
}

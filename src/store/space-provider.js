import React, { createContext, useReducer } from "react";
import { spaceActions } from "./constants";

export const SpaceContext = createContext();
const spaceReducer = (state, action) => {
  switch (action.type) {
    case spaceActions.LOGIN:
      return {
        ...state,
        username: "emman",
        lastRatedAt: action.lastRatedAt || null,
        latestRating: action.latestRating || null,
      };
    case spaceActions.ADD_CATEGORY:
      return {
        ...state,
        categories: action.categories,
      };
    // case spaceActions.ADD_TODO:
    //   const updatedTodos = [...state];
    //   updatedTodos[action.index].checked = !updatedTodos[action.index].checked;
    //   return {
    //     ...state,
    //     todoList: updatedTodos,
    //   };
    // case spaceActions.DELETE_TODO:
      
    default:
      return state;
  }
};
const initialState = {
  username: "",
  todoList: [
    // {
    //   id: 1,
    //   title: "Task 1",
    //   category: "Music",
    //   checked: true,
    //   timeSpent: "3h",
    //   timeSpentError: false,
    // },
    // {
    //   id: 2,
    //   title: "Task 2",
    //   category: "Music",
    //   checked: false,
    //   timeSpent: "",
    //   timeSpentError: false,
    // },
    // {
    //   id: 3,
    //   title: "Task 3",
    //   category: "Music",
    //   checked: false,
    //   timeSpent: "",
    //   timeSpentError: false,
    // },
    // {
    //     id: 4,
    //     title: "Task 4",
    //     checked: false,
    //     timeSpent: "",
    //     timeSpentError: false,
    //     category: "Entertainment"
    // },
    // {
    //   id: 5,
    //   title: "Task 5",
    //   checked: false,
    //   timeSpent: "",
    //   timeSpentError: false,
    //   category: "Entertainment"
    // },
    // {
    //   id: 6,
    //   title: "Task 6",
    //   checked: false,
    //   timeSpent: "",
    //   timeSpentError: false,
    //   category: "Entertainment"
    // },
    // {
    //   id: 7,
    //   title: "Task 4",
    //   checked: false,
    //   timeSpent: "",
    //   timeSpentError: false,
    //   category: "Entertainment"
    // },
    // {
    //   id: 8,
    //   title: "Task 5",
    //   checked: false,
    //   timeSpent: "",
    //   timeSpentError: false,
    //   category: "Entertainment"
    // },
    // {
    //   id: 9,
    //   title: "Task 6",
    //   checked: false,
    //   timeSpent: "",
    //   timeSpentError: false,
    //   category: "Entertainment"
    // },
  ],
  categories: [
    // { name: "Music", points: 20 },
    // { name: "Coding", points: 30 },
    // { name: "Entertainment", points: 10 },
  ],
};
const SpaceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(spaceReducer, initialState);

  return (
    <SpaceContext.Provider value={{ state, dispatch }}>
      {children}
    </SpaceContext.Provider>
  );
};

export default SpaceProvider;

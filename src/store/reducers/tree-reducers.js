const initState = {
  id: null,
  name: "",
};

function treeReducer(state = initState, action) {
  switch (action.type) {
    case "SELECT_MAN":
      return {
        ...state,
        id: action.id,
        name: action.name,
      };

    default:
      return state;
  }
}

export default treeReducer;

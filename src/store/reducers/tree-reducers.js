const initState = {
  id: null
}

function treeReducer(state = initState, action) {
  // console.log(state);
  switch (action.type) {
    case 'SELECT_MAN':
      return {
        ...state,
        id: action.id
      }

      default:
        return state
  }

}





export default treeReducer
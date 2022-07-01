export const SELECT_MAN = 'SELECT_MAN'


export const treeActions = {
  selectPeople: (id) => {
    return {
      type: SELECT_MAN,
      id: id
    }
  }
}
export const SELECT_MAN = "SELECT_MAN";

export const treeActions = {
  selectPeople: (tree) => {
    return {
      type: SELECT_MAN,
      ...tree,
    };
  },
};

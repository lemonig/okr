import { _post, _download } from "@App/server/http";

export function listSubgoal(data,) {
  return _post(
    `/api/company/subgoal/list`,
    data,
  );
}

export function addSubgoal(data,) {
  return _post(
    `/api/company/subgoal/add`,
    data,
  );
}

export function updateSubgoal(data,) {
  return _post(
    `/api/company/subgoal/update`,
    data,
  );
}

export function deleteSubgoal(data,) {
  return _post(
    `/api/company/subgoal/delete`,
    data,
  );
}
export function getSubgoal(data,) {
  return _post(
    `/api/company/subgoal/detail`,
    data,
  );
}
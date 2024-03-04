import { _post, _download } from "@App/server/http";

export function listOkr(data) {
  return _post(
    `/api/company/objective/list`,
    data,
  );
}

export function addOkr(data,) {
  return _post(
    `/api/company/objective/add`,
    data,
  );
}

export function updateOkr(data,) {
  return _post(
    `/api/company/objective/update`,
    data,
  );
}

export function deleteOkr(data,) {
  return _post(
    `/api/company/objective/delete`,
    data,
  );
}
export function getOkr(data,) {
  return _post(
    `/api/company/objective/detail`,
    data,
  );
}


export function getWeightRate(data,) {
  return _post(
    `/api/companyWeight/get`,
    data,
  );
}
export function updateWightRate(data,) {
  return _post(
    `/api/companyWeight/update`,
    data,
  );
}
export function goalDeliver(data,) {
  return _post(
    `/api/company/goalDeliver`,
    data,
  );
}
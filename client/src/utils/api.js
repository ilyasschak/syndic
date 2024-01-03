import axios from "axios";

const BASE_URL = "http://localhost:5000";

export default function api(method, endpoint, data = null) {
    const url = `${BASE_URL}/${endpoint}`;

    return axios({
      method,
      url,
      data,
      withCredentials: true,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
}

import axios from 'axios';
type RequestMethod = 'GET' | 'GET_WITHOUT_AUTH' | 'POST' | 'POST_WITHOUT_AUTH' | 'PUT' | 'PATCH' | 'DELETE';
import { CET_HOST } from '@/constants/data';
import { LocalStorageEnum } from '@/constants/enum';

export interface IHttpResponse {
  isError: boolean;
  data?: any;
  error?: any;
}
export default function useAxios() {
  const response: IHttpResponse = { isError: false };
//   const { verifySessionToken } = useValidSessionToken();
  const baseURL: string | undefined = CET_HOST ;
  let token = localStorage.getItem(LocalStorageEnum.AUTH_TOKEN);
  const axiosInstance = axios.create({
    baseURL,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${String(token)}` : '',
    },
  });

  axiosInstance.interceptors.request.use(
    async (req: any) => {
    //   const refreshSessionToken = await verifySessionToken();
    //   if (refreshSessionToken) {
    //     token = localStorage.getItem(LocalStorageEnum.AUTH_TOKEN);
    //     id = localStorage.getItem(LocalStorageEnum.NANOID);
    //     req.headers.Authorization = token ? `Bearer ${String(token)}` : '';
    //     req.headers.client = `dapp:${id}:${localStorage.getItem(LocalStorageEnum.CONNECTED_WALLET_TYPE) || ''}`;
    //     return req;
    //   }
    return req;
    },
    function (error) {
      return Promise.reject(error);
    },
  );

  async function request(method: RequestMethod, endpoint = '', body = {}): Promise<IHttpResponse> {
    const url = `${baseURL}${endpoint}`;

    try {
      const reqBody = method !== 'GET' && JSON.stringify(body);
      if (method === 'GET') {
        const { data } = await axiosInstance.get(url, { params: body });
        response.data = data;
      } else if (method === 'GET_WITHOUT_AUTH') {
        const { data } = await axios.get(url, { params: body });
        response.data = data;
      } else if (method === 'DELETE') {
        const { data } = await axiosInstance.delete(url);
        response.data = data;
      } else if (method === 'POST') {
        const { data } = await axiosInstance.post(url, reqBody);
        response.data = data;
      } else if (method === 'POST_WITHOUT_AUTH') {
        const config = {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: '',
          },
        };
        const { data } = await axios.post(url, reqBody, config);
        response.data = data;
      } else if (method === 'PUT') {
        const { data } = await axiosInstance.put(url, reqBody);
        response.data = data;
      } else if (method === 'PATCH') {
        const { data } = await axiosInstance.patch(url, reqBody);
        response.data = data;
      }
      return response;
    } catch (error: any) {
      if (error?.response?.status === 401) {
        // const refreshSessionToken = await verifySessionToken();
        // if (refreshSessionToken) {
        //   return await request(method, endpoint, body);
        // }
        return { isError: true, error: error?.response?.data };
      } else {
        return { isError: true, error: error?.response?.data };
      }
    }

    return { isError: true };
  }

  async function getWithAuth(url: string, data?: any) {
    return await request('GET', url, data);
  }

  async function getWithoutAuth(url: string, data?: any) {
    return await request('GET_WITHOUT_AUTH', url, data);
  }
  async function postWithAuth(url: string, data: any) {
    return await request('POST', url, data);
  }
  async function postWithoutAuth(url: string, data?: any) {
    return await request('POST_WITHOUT_AUTH', url, data);
  }
  const putWithAuth = async (url: string, data: any) => {
    return await request('PUT', url, data);
  };
  const patchWithAuth = async (url: string, data: any) => {
    return await request('PATCH', url, data);
  };
  const deleteWithAuth = async (url: string) => {
    return await request('DELETE', url);
  };

  return { getWithAuth, getWithoutAuth, postWithAuth, postWithoutAuth, putWithAuth, patchWithAuth, deleteWithAuth };
}

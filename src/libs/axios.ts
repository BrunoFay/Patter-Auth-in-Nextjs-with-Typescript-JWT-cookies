import axios, { AxiosError } from "axios";
import { GetServerSidePropsContext } from "next";
import { parseCookies, setCookie } from "nookies";
import { signOut } from "../context/AuthContext";
import { AuthTokenError } from "../services/errors/AuthTokenError";

interface FailedRequestQueue {
  onSuccess: (token: string) => void
  onFailure: (err: AxiosError) => void
}

interface ServerError {
  error: boolean
  code: 'token.expired'
  message: string
}

let isRefreshing = false
let failedRequestsQueue: FailedRequestQueue[] = []

export function setupAPIClient(ctx: GetServerSidePropsContext | undefined = undefined) {
    let cookies = parseCookies(ctx)
    const Api = axios.create({
      baseURL:'http://localhost:3333',
      headers:{
        Authorization:`Bearer ${cookies['nextauth.token']}`
      }
    })
    Api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ServerError>) => {
        if (error.response?.status === 401) {
          if (error.response.data?.code === 'token.expired') {
            cookies = parseCookies()

            const { 'nextauth.refreshToken': refreshToken } = cookies
            const originalConfig = error.config

            if (!isRefreshing) {
              isRefreshing = true

              Api
                .post('/refresh', {
                  refreshToken,
                })
                .then((response) => {
                  const { token,refreshToken } = response.data

                  setCookie(ctx, 'nextauth.token', token, {
                    maxAge: 60 * 60 * 24 * 30, // 30 days
                    path: '/',
                  })
                  setCookie(
                    ctx,
                    'nextauth.refreshToken',
                    refreshToken,
                    {
                      maxAge: 60 * 60 * 24 * 30, // 30 days
                      path: '/',
                    },
                  )

                  Api.defaults.headers.Authorization = `Bearer ${token}`
                  failedRequestsQueue.forEach((request) => {
                    request.onSuccess(token)
                  })
                  failedRequestsQueue = []
                })
                .catch((err) => {
                  failedRequestsQueue.forEach((request) => request.onFailure(err))
                  failedRequestsQueue = []

                  if (process.browser) {
                    signOut();
                  }
                })
                .finally(() => {
                  isRefreshing = false
                })
            }

            return new Promise((resolve, reject) => {
              failedRequestsQueue.push({
                onSuccess: (token: string) => {
                  if (originalConfig?.headers) {
                    originalConfig.headers.Authorization = `Bearer ${token}`

                    resolve(Api(originalConfig))
                  }
                },
                onFailure: (err: AxiosError) => {
                  reject(err)
                },
              })
            })
          } else {
            if(process.browser) {
                signOut();
              }  else {
                return Promise.reject(new AuthTokenError())
              }
          }
        }

        return Promise.reject(error)
      },
    )
    return Api
}
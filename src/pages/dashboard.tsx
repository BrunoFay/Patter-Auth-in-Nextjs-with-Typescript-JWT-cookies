import React, { useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { withSSRAuth } from '../helpers/withSSRAuth'
import { useUserCan } from '../hooks/useUserCan'
import { setupAPIClient } from '../libs/axios'
import { Api } from '../libs/axiosClient'

export default function Dashboard() {
  const {user}= useContext(AuthContext)

  /* can validate by permissions and roles */
  const userCanSeeMetrics = useUserCan({
    permissions:['metrics.list']
  })

  useEffect(()=>{
    Api.get('/me').then(res=>console.log(res.data))

   },[])


  return (
    <>
      <div>dashboard: {user?.email}</div>
      {userCanSeeMetrics && <div>Metrics:</div>}
    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("/me");

  console.log(response.data);

  return {
    props: {},
  };
});


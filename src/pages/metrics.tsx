import { withSSRAuth } from '../helpers/withSSRAuth';
import { setupAPIClient } from '../libs/axios';

export default function Metrics() {


  return (
    <>
      <div>Metrics</div>



    </>
  )
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  const apiClient = setupAPIClient(ctx);
  const response = await apiClient.get("/me");

  console.log(response.data);

  return {
    props: {},
  }
},{
  permissions:['metrics.list'],
  roles:['administrator']
}
);


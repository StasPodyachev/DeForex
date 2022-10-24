import Layout from '../components/Layouts';
import Market from '../components/Market';
import type { NextPage } from 'next';
// import { unstable_getServerSession } from 'next-auth';
// import { getAuthOptions } from './api/auth/[...nextauth]';

const Home: NextPage = () => {
  return (
    <Layout title="Market">
      <Market/>
    </Layout>
  )
}

export default Home

// export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
//   return {
//     props: {
//       session: await unstable_getServerSession(req, res, getAuthOptions(req)),
//     },
//   };
// };
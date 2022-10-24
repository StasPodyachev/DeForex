import type { NextPage } from 'next';
import Layout from '../components/Layouts';
import Market from '../components/Market';

const Home: NextPage = () => {
  return (
    <Layout title="Market">
      <Market/>
    </Layout>
  )
}

export default Home
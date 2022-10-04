import type { NextPage } from 'next';
import dynamic from "next/dynamic";
const Layout = dynamic(() =>  import('../components/Layouts/Layout'),{ ssr: false });
const Market = dynamic(() =>  import('../components/Market/Market'),{ ssr: false });

const Home: NextPage = () => {
  return (
    <Layout title="Market">
      <Market/>
    </Layout>
  )
}

export default Home
import SignInContent from '../components/SignInContent';
import Layout from '../components/Layouts';
import type { GetServerSideProps, NextPage } from 'next';
import { getSession } from 'next-auth/react';

const SignIn: NextPage = ({session } : any) => {
  return (
    <Layout title="Sign In" >
      <SignInContent />
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);
  // if (session) {
  //   return {
  //     redirect: {
  //       destination: '/',
  //       permanent: false,
  //     },
  //   };
  // }

  return {
    props: { session },
  };
};

export default SignIn
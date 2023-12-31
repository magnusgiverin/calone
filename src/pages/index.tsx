
import Layout from "~/components/General/Layout";
import Welcome from "~/views/WelcomeView";
import Search from "~/views/SearchView";

const Home = () => {
  return (
      <Layout>
        <Welcome></Welcome>
        <Search></Search>
      </Layout>
  );
};

export default Home;

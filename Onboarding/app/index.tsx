import { Redirect } from "expo-router";
import './global.css';

const Home = () => {
    return <Redirect href="/auth/personal-details" />;
};

export default Home;
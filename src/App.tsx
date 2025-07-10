import { BrowserRouter as Router, Routes, Route } from "react-router";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import Photos from "./pages/Dashboard/Photos";
import ViewPhotos from "./pages/Dashboard/ViewPhotos";
import AboutUs from "./pages/Dashboard/Aboutus";
import AddTrip from "./pages/Trips/AddTrip";
import ViewTrips from "./pages/Trips/ViewTrips";
import BookForms from "./pages/Dashboard/BookForms";
import CreateDestination from "./pages/Dashboard/CreateDestination";
import ViewDestinations from "./pages/Dashboard/ViewDestinations";

export default function App() {
  return (
    <>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route element={<AppLayout />}>
            <Route index path="/" element={<Home />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/view-des" element={<ViewDestinations />} />
            <Route path="/create-trip" element={<AddTrip />} />
            <Route path="/trips" element={<ViewTrips />} />

            {/* Forms */}
            <Route path="/destination" element={<CreateDestination />} />

            {/* Tables */}
            <Route path="/clients" element={<BookForms />} />
            <Route path="/add-photos" element={<Photos />} />
            <Route path="/photos" element={<ViewPhotos />} />
            <Route path="/about" element={<AboutUs />} />

            {/* Ui Elements */}
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/avatars" element={<Avatars />} />
            <Route path="/badge" element={<Badges />} />
            <Route path="/buttons" element={<Buttons />} />
            <Route path="/images" element={<Images />} />
            <Route path="/videos" element={<Videos />} />

            {/* Charts */}
            <Route path="/line-chart" element={<LineChart />} />
            <Route path="/bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

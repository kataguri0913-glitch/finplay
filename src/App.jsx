import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { useFinStore } from "./store/useFinStore";
import Onboarding from "./screens/Onboarding";
import Home from "./screens/Home";
import Budget from "./screens/Budget";
import Save from "./screens/Save";
import Invest from "./screens/Invest";
import Profile from "./screens/Profile";
import { auth } from "./lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { loadCloudState } from "./lib/persistence";

function Protected() {
  const onboarded = useFinStore(s => s.onboarded);
  return onboarded ? <Layout><Routes>
    <Route path="/home" element={<Home/>}/>
    <Route path="/budget" element={<Budget/>}/>
    <Route path="/save" element={<Save/>}/>
    <Route path="/invest" element={<Invest/>}/>
    <Route path="/profile" element={<Profile/>}/>
    <Route path="*" element={<Navigate to="/home" replace/>}/>
  </Routes></Layout> : <Navigate to="/onboarding" replace/>;
}

export default function App() {
  const hydrate = useFinStore(s => s.hydrate);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, async () => {
      const cloud = await loadCloudState();
      if (cloud) hydrate(cloud);
    });
  }, [hydrate]);

  return <Routes>
    <Route path="/onboarding" element={<Onboarding/>}/>
    <Route path="/*" element={<Protected/>}/>
  </Routes>;
}
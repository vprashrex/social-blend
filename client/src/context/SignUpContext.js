import React, { useContext, useState } from "react";
import { useAuth } from "./AuthContext";

const SignUpProvider = React.createContext();

export function useSignUp() {
  return useContext(SignUpProvider);
}

export default function SignUpContext({ children }) {
  const { currentUser } = useAuth();

  const [currentLevel, setCurrentLevel] = useState(
    currentUser ? currentUser.currentLevel : 0
  );
  const [name, setName] = useState(currentUser ? currentUser.name : "");
  const [username, setUsername] = useState(
    currentUser ? currentUser.username : ""
  );
  const [brandName, setBrandName] = useState(
    currentUser ? currentUser.brandName : ""
  );
  const [email, setEmail] = useState(currentUser ? currentUser.email : "");
  const [about, setAbout] = useState(
    currentUser ? currentUser.about : "default"
  );
  const [pass, setPass] = useState("");
  const [location, setLocation] = useState(
    currentUser ? currentUser.location : ""
  );
  const [summarize, setSummarize] = useState(
    currentUser ? currentUser.heading : ""
  );
  const [description, setDescription] = useState(
    currentUser ? currentUser.about : ""
  );
  const [gender, setGender] = useState(currentUser ? currentUser.gender : "");
  const [handles, setHandles] = useState(
    currentUser ? currentUser.handles : []
  );
  const [niches, setNiches] = useState(currentUser ? currentUser.niches : []);
  const [profileImg, setProfileImg] = useState(
    currentUser ? currentUser.profileImg : ""
  );
  const [coverImg, setCoverImg] = useState(
    currentUser ? currentUser.coverImg : ""
  );
  const [contentImg1, setContentImg1] = useState(
    currentUser ? currentUser.contentImg1 : ""
  );
  const [contentImg2, setContentImg2] = useState(
    currentUser ? currentUser.contentImg2 : ""
  );
  const [contentImg3, setContentImg3] = useState(
    currentUser ? currentUser.contentImg3 : ""
  );
  const [packages, setPackages] = useState(
    currentUser ? currentUser.packages : []
  );
  const [faqs, setFaqs] = useState(currentUser ? currentUser.faqs : []);
  const [phone, setPhone] = useState(currentUser ? currentUser.phone : []);

  async function verfiyEmailCode(code) {
    const fetchCall = (await fetch("https://reqres.in/api/users/2")).json();
    return fetchCall;
  }

  const data = {
    uid: "",
    currentLevel,
    about: description,
    location,
    heading: summarize,
    gender,
    handles,
    niches,
    profileImg,
    coverImg,
    contentImg1,
    contentImg2,
    contentImg3,
    packages,
    faqs,
    username,
    email,
  };

  const value = {
    name,
    setName,
    email,
    setEmail,
    about,
    setAbout,
    pass,
    setPass,
    location,
    setLocation,
    verfiyEmailCode,
    summarize,
    setSummarize,
    description,
    setDescription,
    currentLevel,
    gender,
    handles,
    setHandles,
    setGender,
    niches,
    phone,
    setPhone,
    setNiches,
    profileImg,
    setProfileImg,
    coverImg,
    setCoverImg,
    username,
    setUsername,
    contentImg1,
    setContentImg1,
    contentImg2,
    setContentImg2,
    contentImg3,
    setContentImg3,
    packages,
    faqs,
    setFaqs,
    setPackages,
    setCurrentLevel,
    data,
    brandName,
    setBrandName,
  };

  return (
    <SignUpProvider.Provider value={value}>{children}</SignUpProvider.Provider>
  );
}

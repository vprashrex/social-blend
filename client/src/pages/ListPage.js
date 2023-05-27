import React from "react";
import { useParams } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
import { useGetReq } from "../hooks/useGetReq";
import ErrorCon from "../components/ErrorCon";
import Influencer from "../components/Home/Influencer";
import Loading from "../components/Loading";
import EditModal from "../components/InfluencersList/EditModal";

export default function ListPage() {
  const { id } = useParams();
  // const navigate = useNavigate();
  const { loading, error, userData } = useGetReq("lists/single-list", { id });

  // useEffect(() => {
  //   !loading && !userData && navigate("/");
  // }, [userData, loading]);

  return loading ? (
    <Loading />
  ) : userData ? (
    <>
      <ErrorCon error={error} />
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="mb-5 fw-bold">{userData.name}</h2>
          <button
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            className="btn btn-outline-dark d-flex gap-3 align-items-center fw-bold px-4"
          >
            <i className="bi bi-pencil" />
            <span>Edit</span>
          </button>
        </div>
        <div className="search-influencers">
          {userData.influencers.map((influencer) => {
            return <Influencer user={influencer} key={influencer.uid} />;
          })}
        </div>
      </div>
      <EditModal name={userData.name} />
    </>
  ) : (
    "Page not found"
  );
}

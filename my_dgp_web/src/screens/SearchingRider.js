import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-custom-alert";
import { useNavigate } from "react-router-dom";
import { clearErrors } from "../actions/BookingActions";
import Maps from "../images/google_maps.png";
import ProgressBar from "@ramonak/react-progress-bar";
import Colors from "../utils/Colors";

export default function SearchingRider() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loadingPercentage, setLoadingPercentage] = useState(10)
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(true)
  const { error, loading, success } = useSelector((state) => state.booking);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      toast.success("Your booking has been created successfully!");
      navigate("/");
    }
    // eslint-disable-next-line
  }, [dispatch, error, success]);

  // useEffect(() => {
  //   setLoadingPercentage(loadingPercentage >= 100 ? 10 : loadingPercentage + 10)
  // }, [loadingPercentage])

  return (
    <div style={{ height: "100%" }}>
      {/* <div style={{ width: "100%", height: "100%" }}>
        <img src={Maps} style={{ width: "100%", height: "55%" }} alt="" />
      </div> */}

      <div style={{ height: '45%', backgroundColor: Colors.WHITE, marginTop: 20, marginBottom: 20 }}>
      <ProgressBar completed={loadingPercentage} borderRadius="0" bgColor={Colors.GREEN} isLabelVisible={false} />
      </div>
    </div>
  );
}

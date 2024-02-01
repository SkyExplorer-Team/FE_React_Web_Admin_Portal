import React, { ReactNode } from "react";
import { Detector } from "react-detect-offline";
import NoConnection from "../assets/images/illustration_no_conn.svg";

interface CheckConnectionProps {
  children: ReactNode;
}

const CheckConnection: React.FC<CheckConnectionProps> = (props) => {
  const handleRetry = () => {
    window.location.reload();
  };
  return (
    <Detector
      render={({ online }) => (
        <div
          style={{
            display: "block",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
          }}
        >
          {online ? (
            props.children
          ) : (
            <div style={{ textAlign: "center" }}>
              <img src={NoConnection} alt="No Connection" />
              <p
                style={{
                  fontSize: "36px",
                  fontWeight: "700",
                  lineHeight: "54px",
                  color: "black",
                  marginTop: "41px",
                }}
              >
                No Connection
              </p>
              <p
                style={{
                  color: "var(--Neutral-500, #677084)",
                  fontSize: "16px",
                  fontWeight: "400",
                  lineHeight: "24px",
                  marginTop: "20px",
                }}
              >
                Check your wifi connection or celullar data and try <br />
                again to continue
              </p>
              <button
                className="btn btn-success"
                style={{
                  width: "382px",
                  background: "var(--Primary-500, #38A993)",
                  borderRadius: "var(--Corner-Radius-Radius-Button-14, 14px)",
                  padding:
                    "var(--Gap-and-Padding-Positive-GapPadding-18, 18px)",
                  fontSize: "18px",
                  color: "white",
                  marginTop: "40px",
                }}
                onClick={handleRetry}
              >
                Retry
              </button>
            </div>
          )}
        </div>
      )}
    />
  );
};

export default CheckConnection;

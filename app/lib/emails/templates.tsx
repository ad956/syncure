import { Html } from "@react-email/html";
import { getCurrentDateFormatted, getFormattedDate } from "@utils/get-date";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Html>
      <div
        style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "45px 30px 60px",
          background: "#f4f7ff",
          backgroundImage:
            "url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "800px 452px",
          backgroundPosition: "top center",
          fontSize: "14px",
          color: "#434343",
          fontFamily: "Poppins, sans-serif",
        }}
      >
        <header>
          <table style={{ width: "100%" }}>
            <tbody>
              <tr style={{ height: "0" }}>
                <td
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 5,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    alt="patient-fitness-tracker-logo"
                    src="https://res.cloudinary.com/doahnjt5z/image/upload/v1736323154/pft/pft_png_logo.png"
                    height="30px"
                    style={{ marginTop: "15px", marginRight: "10px" }}
                  />
                  <p
                    style={{
                      fontSize: "18px",
                      lineHeight: "30px",
                      fontWeight: "400",
                      color: "#111",
                    }}
                  >
                    Syncure
                  </p>
                </td>
                <td style={{ textAlign: "right" }}>
                  <span
                    style={{
                      fontSize: "16px",
                      lineHeight: "30px",
                      color: "#111",
                    }}
                  >
                    {getCurrentDateFormatted()}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </header>
        {children}
        <footer
          style={{
            width: "100%",
            maxWidth: "490px",
            margin: "20px auto 0",
            textAlign: "center",
            borderTop: "1px solid #e6ebf1",
          }}
        >
          <p
            style={{
              margin: "0",
              marginTop: "40px",
              fontSize: "16px",
              fontWeight: "600",
              color: "#434343",
            }}
          >
            Syncure
          </p>
          <p style={{ margin: "0", marginTop: "8px", color: "#434343" }}>
            Address 540, Vadodara, Gujarat.
          </p>
          <div style={{ margin: "0", marginTop: "16px" }}>
            <a href="" target="_blank" style={{ display: "inline-block" }}>
              <img
                width="36px"
                alt="Facebook"
                src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661502815169_682499/email-template-icon-facebook"
              />
            </a>
            <a
              href=""
              target="_blank"
              style={{ display: "inline-block", marginLeft: "8px" }}
            >
              <img
                width="36px"
                alt="Instagram"
                src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661504218208_684135/email-template-icon-instagram"
              />
            </a>
            <a
              href=""
              target="_blank"
              style={{ display: "inline-block", marginLeft: "8px" }}
            >
              <img
                width="36px"
                alt="Twitter"
                src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503043040_372004/email-template-icon-twitter"
              />
            </a>
            <a
              href=""
              target="_blank"
              style={{ display: "inline-block", marginLeft: "8px" }}
            >
              <img
                width="36px"
                alt="Youtube"
                src="https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661503195931_210869/email-template-icon-youtube"
              />
            </a>
          </div>
          <p style={{ margin: "0", marginTop: "16px", color: "#434343" }}>
            Copyright © 2024 Company. All rights reserved.
          </p>
        </footer>
      </div>
    </Html>
  );
}

export function OtpTemplate(name: string, otp: string) {
  return (
    <Layout>
      <main>
        <div
          style={{
            margin: "0",
            marginTop: "70px",
            padding: "92px 30px 115px",
            background: "#ffffff",
            borderRadius: "30px",
            textAlign: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: "489px", margin: "0 auto" }}>
            <h1
              style={{
                margin: "0",
                fontSize: "24px",
                fontWeight: "500",
                color: "#1f1f1f",
              }}
            >
              Your OTP
            </h1>
            <p
              style={{
                margin: "0",
                marginTop: "17px",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              Hey {name},
            </p>
            <p
              style={{
                margin: "0",
                marginTop: "17px",
                fontWeight: "500",
                letterSpacing: "0.56px",
              }}
            >
              Thank you for choosing Syncure . Use the following OTP to complete
              the verification process. OTP is valid for{" "}
              <span style={{ fontWeight: "600", color: "#1f1f1f" }}>
                5 minutes
              </span>
              . Do not share this code with others.
            </p>
            <p
              style={{
                margin: "0",
                marginTop: "60px",
                fontSize: "40px",
                fontWeight: "600",
                letterSpacing: "25px",
                color: "#ba3d4f",
              }}
            >
              {otp}
            </p>
          </div>
        </div>

        <p
          style={{
            maxWidth: "400px",
            margin: "0 auto",
            marginTop: "90px",
            textAlign: "center",
            fontWeight: "500",
            color: "#8c8c8c",
          }}
        >
          Need help? Ask at{" "}
          <a
            href="mailto:support@patientfitnesstracker.com"
            style={{ color: "#499fb6", textDecoration: "none" }}
          >
            support@patientfitnesstracker.com
          </a>{" "}
          or visit our{" "}
          <a
            href=""
            target="_blank"
            style={{ color: "#499fb6", textDecoration: "none" }}
          >
            Help Center
          </a>
        </p>
      </main>
    </Layout>
  );
}

export function UserActivityTemplate(user: UserLog) {
  return (
    <Layout>
      <main>
        <div
          style={{
            margin: "0",
            marginTop: "70px",
            padding: "92px 30px 115px",
            background: "#ffffff",
            borderRadius: "30px",
            textAlign: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: "489px", margin: "0 auto" }}>
            <h1
              style={{
                margin: "0",
                fontSize: "24px",
                fontWeight: "500",
                color: "#1f1f1f",
              }}
            >
              User {user.action} Notification
            </h1>
            <p
              style={{
                margin: "0",
                marginTop: "17px",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              Dear Admin,
            </p>
            <p
              style={{
                margin: "0",
                marginTop: "17px",
                fontWeight: "500",
                letterSpacing: "0.56px",
              }}
            >
              {user.action === "Login"
                ? "A user has logged into the Syncure application."
                : "A user just created an account for Syncure application."}
              Here are the details:
            </p>
            <div
              style={{
                marginTop: "30px",
                textAlign: "left",
                fontSize: "16px",
                color: "#333",
                fontWeight: "500",
              }}
            >
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Name:</strong> {user.name}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Action:</strong> {user.action}
              </p>
              <p>
                <strong>User Type:</strong> {user.userType}
              </p>
              <p>
                <strong>Timing:</strong> {new Date().toISOString()}
              </p>
              <p>
                <strong>Device:</strong> {user.device}
              </p>
              <p>
                <strong>IP Address:</strong> {user.ip}
              </p>
              <p>
                <strong>Location:</strong> {user.location}
              </p>
            </div>
          </div>
        </div>

        <p
          style={{
            maxWidth: "400px",
            margin: "0 auto",
            marginTop: "90px",
            textAlign: "center",
            fontWeight: "500",
            color: "#8c8c8c",
          }}
        >
          Need help? Ask at{" "}
          <a
            href="mailto:support@patientfitnesstracker.com"
            style={{ color: "#499fb6", textDecoration: "none" }}
          >
            support@patientfitnesstracker.com
          </a>{" "}
          or visit our{" "}
          <a
            href=""
            target="_blank"
            style={{ color: "#499fb6", textDecoration: "none" }}
          >
            Help Center
          </a>
        </p>
      </main>
    </Layout>
  );
}

export function AppointmentBookedTemplate({
  name,
  email,
  bookedAppointmentData,
  transaction_id,
}: {
  name: string;
  email: string;
  bookedAppointmentData: bookingAppointment;
  transaction_id: string | null;
}) {
  return (
    <Layout>
      <main>
        <div
          style={{
            margin: "0",
            marginTop: "70px",
            padding: "92px 30px 115px",
            background: "#f7f7f7",
            borderRadius: "30px",
            textAlign: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: "489px", margin: "0 auto" }}>
            <h1
              style={{
                margin: "0",
                fontSize: "24px",
                fontWeight: "500",
                color: "#1f1f1f",
              }}
            >
              Appointment Request Notification
            </h1>
            <p
              style={{
                margin: "0",
                marginTop: "17px",
                fontSize: "16px",
                fontWeight: "500",
                color: "#333",
              }}
            >
              Dear {name},
            </p>
            <p
              style={{
                margin: "0",
                marginTop: "17px",
                fontWeight: "500",
                letterSpacing: "0.56px",
                color: "#333",
              }}
            >
              Your appointment request for {bookedAppointmentData.disease} at{" "}
              {bookedAppointmentData.hospital.hospital_name} has been received.
            </p>
            <div
              style={{
                marginTop: "30px",
                textAlign: "left",
                fontSize: "16px",
                color: "#333",
                fontWeight: "500",
              }}
            >
              <p>
                <strong>Patient Name:</strong> {name}
              </p>
              <p>
                <strong>Email:</strong> {email}
              </p>
              <p>
                <strong>Transaction ID:</strong> {transaction_id}
              </p>
              <p>
                <strong>Transaction Date:</strong>{" "}
                {getFormattedDate(new Date())}
              </p>
              <p>
                <strong>Amount Paid:</strong>{" "}
                {bookedAppointmentData.hospital.appointment_charge}
              </p>
              <p>
                <strong>Hospital Name:</strong>{" "}
                {bookedAppointmentData.hospital.hospital_name}
              </p>
              <p>
                <strong>Disease:</strong> {bookedAppointmentData.disease}
              </p>
              <p>
                <strong>Description:</strong> {bookedAppointmentData.note}
              </p>
            </div>
            <div
              style={{
                marginTop: "30px",
                textAlign: "center",
                fontSize: "16px",
                color: "#333",
                fontWeight: "500",
              }}
            >
              <p>
                Your appointment request has been successfully received. Your
                hospital will review and confirm your appointment shortly.
              </p>
            </div>
          </div>
        </div>

        <p
          style={{
            maxWidth: "400px",
            margin: "0 auto",
            marginTop: "90px",
            textAlign: "center",
            fontWeight: "500",
            color: "#8c8c8c",
          }}
        >
          Need help? Ask at{" "}
          <a
            href="mailto:support@patientfitnesstracker.com"
            style={{ color: "#499fb6", textDecoration: "none" }}
          >
            support@patientfitnesstracker.com
          </a>{" "}
          or visit our{" "}
          <a
            href=""
            target="_blank"
            style={{ color: "#499fb6", textDecoration: "none" }}
          >
            Help Center
          </a>
        </p>
      </main>
    </Layout>
  );
}

export function NewAdminTemplate(admin: {
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  password: string;
}) {
  return (
    <Layout>
      <main>
        <div
          style={{
            margin: "0",
            marginTop: "70px",
            padding: "92px 30px 115px",
            background: "#ffffff",
            borderRadius: "30px",
            textAlign: "center",
          }}
        >
          <div style={{ width: "100%", maxWidth: "489px", margin: "0 auto" }}>
            <h1
              style={{
                margin: "0",
                fontSize: "24px",
                fontWeight: "500",
                color: "#1f1f1f",
              }}
            >
              Welcome to Syncure
            </h1>
            <p
              style={{
                margin: "0",
                marginTop: "17px",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              Hello {admin.firstname} {admin.lastname},
            </p>
            <p
              style={{
                margin: "0",
                marginTop: "17px",
                fontWeight: "500",
                letterSpacing: "0.56px",
              }}
            >
              Your admin account has been successfully created. Here are your
              account details:
            </p>
            <div style={{ marginTop: "30px", textAlign: "left" }}>
              <p>
                <strong>First Name:</strong> {admin.firstname}
              </p>
              <p>
                <strong>Last Name:</strong> {admin.lastname}
              </p>
              <p>
                <strong>Email:</strong> {admin.email}
              </p>
              <p>
                <strong>Username:</strong> {admin.username}
              </p>
              <p>
                <strong>Temporary Password:</strong> {admin.password}
              </p>
            </div>
            <p
              style={{
                margin: "0",
                marginTop: "30px",
                fontWeight: "500",
                color: "#ba3d4f",
              }}
            >
              For security reasons, please log in and change your password and
              username as per your preference.
            </p>
          </div>
        </div>

        <p
          style={{
            maxWidth: "400px",
            margin: "0 auto",
            marginTop: "90px",
            textAlign: "center",
            fontWeight: "500",
            color: "#8c8c8c",
          }}
        >
          Need help? Ask at{" "}
          <a
            href="mailto:support@patientfitnesstracker.com"
            style={{ color: "#499fb6", textDecoration: "none" }}
          >
            support@patientfitnesstracker.com
          </a>{" "}
          or visit our{" "}
          <a
            href=""
            target="_blank"
            style={{ color: "#499fb6", textDecoration: "none" }}
          >
            Help Center
          </a>
        </p>
      </main>
    </Layout>
  );
}

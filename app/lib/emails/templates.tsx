import { Html } from "@react-email/html";
import { getCurrentDateFormatted, getFormattedDate } from "@utils/get-date";

type bookingAppointment = {
  disease: string;
  note: string;
  hospital: {
    hospital_name: string;
    appointment_charge: number;
  };
};

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
            padding: "40px 30px",
            background: "#ffffff",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
          }}
        >
          <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
            {/* Success Header */}
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
              <table style={{ width: "80px", height: "80px", backgroundColor: "#10b981", borderRadius: "50%", margin: "0 auto 16px" }}>
                <tr>
                  <td style={{ textAlign: "center", verticalAlign: "middle", width: "80px", height: "80px" }}>
                    <span style={{ color: "white", fontSize: "36px", fontWeight: "bold", lineHeight: "80px" }}>✓</span>
                  </td>
                </tr>
              </table>
              <h1
                style={{
                  margin: "0",
                  fontSize: "24px",
                  fontWeight: "600",
                  color: "#1f2937",
                  marginBottom: "8px",
                }}
              >
                Appointment Confirmed!
              </h1>
              <p
                style={{
                  margin: "0",
                  fontSize: "16px",
                  color: "#6b7280",
                }}
              >
                Hi {name}, your appointment has been successfully booked
              </p>
            </div>

            {/* Appointment Details */}
            <div
              style={{
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "24px",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 16px 0",
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#374151",
                }}
              >
                Appointment Details
              </h2>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <tr>
                  <td
                    style={{
                      padding: "8px 0",
                      color: "#6b7280",
                      fontWeight: "500",
                      width: "35%",
                    }}
                  >
                    Hospital:
                  </td>
                  <td
                    style={{
                      padding: "8px 0",
                      color: "#374151",
                      fontWeight: "600",
                    }}
                  >
                    {bookedAppointmentData.hospital.hospital_name}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "8px 0",
                      color: "#6b7280",
                      fontWeight: "500",
                    }}
                  >
                    Condition:
                  </td>
                  <td
                    style={{
                      padding: "8px 0",
                      color: "#374151",
                      fontWeight: "600",
                    }}
                  >
                    {bookedAppointmentData.disease}
                  </td>
                </tr>
                {bookedAppointmentData.note && (
                  <tr>
                    <td
                      style={{
                        padding: "8px 0",
                        color: "#6b7280",
                        fontWeight: "500",
                      }}
                    >
                      Notes:
                    </td>
                    <td
                      style={{
                        padding: "8px 0",
                        color: "#374151",
                        fontWeight: "600",
                      }}
                    >
                      {bookedAppointmentData.note}
                    </td>
                  </tr>
                )}
              </table>
            </div>

            {/* Payment Details */}
            <div
              style={{
                backgroundColor: "#f0fdf4",
                border: "1px solid #bbf7d0",
                borderRadius: "8px",
                padding: "24px",
                marginBottom: "24px",
              }}
            >
              <h2
                style={{
                  margin: "0 0 16px 0",
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#166534",
                }}
              >
                Payment Confirmed
              </h2>
              <table style={{ width: "100%" }}>
                <tr>
                  <td
                    style={{
                      padding: "8px 0",
                      color: "#166534",
                      fontWeight: "500",
                      width: "35%",
                    }}
                  >
                    Amount Paid:
                  </td>
                  <td
                    style={{
                      padding: "8px 0",
                      color: "#166534",
                      fontWeight: "700",
                      fontSize: "18px",
                    }}
                  >
                    ₹{bookedAppointmentData.hospital.appointment_charge}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "8px 0",
                      color: "#166534",
                      fontWeight: "500",
                    }}
                  >
                    Transaction ID:
                  </td>
                  <td
                    style={{
                      padding: "8px 0",
                      color: "#166534",
                      fontWeight: "600",
                    }}
                  >
                    {transaction_id}
                  </td>
                </tr>
                <tr>
                  <td
                    style={{
                      padding: "8px 0",
                      color: "#166534",
                      fontWeight: "500",
                    }}
                  >
                    Date:
                  </td>
                  <td
                    style={{
                      padding: "8px 0",
                      color: "#166534",
                      fontWeight: "600",
                    }}
                  >
                    {getFormattedDate(new Date())}
                  </td>
                </tr>
              </table>
            </div>

            {/* Next Steps */}
            <div
              style={{
                backgroundColor: "#fef3c7",
                border: "1px solid #fbbf24",
                borderRadius: "8px",
                padding: "20px",
                textAlign: "center",
              }}
            >
              <h3
                style={{
                  margin: "0 0 12px 0",
                  fontSize: "16px",
                  fontWeight: "600",
                  color: "#92400e",
                }}
              >
                What&apos;s Next?
              </h3>
              <p
                style={{
                  margin: "0",
                  fontSize: "14px",
                  color: "#92400e",
                  lineHeight: "1.5",
                }}
              >
                The hospital will review and confirm your appointment. You&apos;ll receive a confirmation
                email with the exact date and time within 24 hours.
              </p>
            </div>
          </div>
        </div>

        <p
          style={{
            maxWidth: "400px",
            margin: "40px auto 0",
            textAlign: "center",
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          Need help? Contact us at{" "}
          <a
            href="mailto:support@syncure.com"
            style={{ color: "#3b82f6", textDecoration: "none" }}
          >
            support@syncure.com
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
import createOrderId from "./create-order-id";

declare global {
  interface Window {
    Razorpay: any;
  }
}

async function processPayment(
  name: string,
  email: string,
  description: string,
  amount: string
): Promise<{
  success: boolean;
  message: string;
  transaction_id: string | null;
}> {
  try {
    const orderId: string = await createOrderId(amount);
    return new Promise((resolve, reject) => {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: parseFloat(amount) * 100,
        currency: "INR",
        name,
        description,
        order_id: orderId,
        handler: async function (response: any) {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          try {
            const result = await fetch("/api/payment/verify", {
              method: "POST",
              body: JSON.stringify(data),
              headers: { "Content-Type": "application/json" },
            });
            const res = await result.json();
            if (res.isOk) {
              resolve({
                success: true,
                message: res.message,
                transaction_id: response.razorpay_payment_id,
              });
            } else {
              reject({
                success: false,
                message: res.message,
                transaction_id: response.razorpay_payment_id,
              });
            }
          } catch (error) {
            reject({
              success: false,
              message: "Payment verification failed",
              transaction_id: response.razorpay_payment_id,
            });
          }
        },
        prefill: {
          name,
          email,
        },
        theme: {
          color: "#3399cc",
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        paymentObject.close();
        console.log("Payment failed:", response.error);
        reject({
          success: false,
          message: response.error.description,
          transaction_id: response.razorpay_payment_id,
        });
      });
      paymentObject.open();
    });
  } catch (error) {
    return {
      success: false,
      message: "Payment Failed",
      transaction_id: null,
    };
  }
}

export default processPayment;
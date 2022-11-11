import { commonLayout } from "../../../../components/common/Layout";
import { ProtectedPage } from "../../../../types/auth-required";

const CancelPaymentPage: ProtectedPage = () => (
  <div>
    <h1>Payment Cancelled</h1>
  </div>
);

CancelPaymentPage.getLayout = commonLayout;

export default CancelPaymentPage;

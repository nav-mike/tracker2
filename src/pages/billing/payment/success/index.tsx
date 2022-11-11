import { commonLayout } from "../../../../components/common/Layout";
import { ProtectedPage } from "../../../../types/auth-required";

const SuccessPaymentPage: ProtectedPage = () => (
  <div>
    <h1>Payment Success</h1>
  </div>
);

SuccessPaymentPage.getLayout = commonLayout;

export default SuccessPaymentPage;

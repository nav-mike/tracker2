import Head from "next/head";
import { getCodeList } from "country-list";
import Select from "react-select";
import Layout from "../../components/common/Layout";
import { ProtectedPage } from "../../types/auth-required";
import Link from "next/link";

const NewLandingPage: ProtectedPage = () => {
  return (
    <>
      <Head>
        <title>New Landing Page</title>
      </Head>

      <div className="p-4">
        <h1 className="text-2xl">New Landing Page</h1>
        <form className="form">
          <div className="form-controls">
            <label htmlFor="name" className="form-control-left">
              Name:
            </label>
            <input type="text" id="name" className="form-control" />
          </div>
          <div className="form-controls">
            <label htmlFor="countries" className="form-control-left">
              Countries:
            </label>
            <Select
              isMulti
              options={Object.entries(getCodeList()).map(([code, name]) => ({
                value: code,
                label: `${name} [${code}]`,
              }))}
              id="countries"
            />
          </div>
          <div className="form-controls">
            <label htmlFor="offersCount" className="form-control-left">
              Offers count:
            </label>
            <input type="number" id="offersCount" className="form-control" />
          </div>
          <div className="form-controls">
            <label htmlFor="url" className="form-control-left">
              URL:
            </label>
            <input type="text" id="url" className="form-control" />
          </div>
          <div className="form-controls">
            <Link href="/landing">
              <a className="form-control-left button">Cancel</a>
            </Link>
            <button type="submit" className="button button-primary">
              Create
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

NewLandingPage.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export default NewLandingPage;

import Head from "next/head";
import { getCodeList } from "country-list";
import Select from "react-select";
import Layout from "../../components/common/Layout";
import { ProtectedPage } from "../../types/auth-required";
import Link from "next/link";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import ErrorInputMessage from "../../components/form/ErrorInputMessage";

type Inputs = {
  name: string;
  countries: string[];
  offersCount?: number;
  url: string;
};

const NewLandingPage: ProtectedPage = () => {
  const {
    control,
    register,
    handleSubmit: onSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const handleSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  console.log(errors);

  return (
    <>
      <Head>
        <title>New Landing Page</title>
      </Head>

      <div className="p-4">
        <h1 className="text-2xl">New Landing Page</h1>
        <form className="form" onSubmit={onSubmit(handleSubmit)}>
          <div className="form-controls">
            <label htmlFor="name" className="form-control-left">
              Name:
            </label>
            <div className="flex flex-col">
              <input
                type="text"
                id="name"
                className={`form-control ${
                  errors.name ? "border-red-500" : ""
                }`}
                {...register("name", { required: true, maxLength: 80 })}
              />
              {errors.url && (
                <ErrorInputMessage>
                  Offer name is required and the max length is 80 symbols
                </ErrorInputMessage>
              )}
            </div>
          </div>
          <div className="form-controls">
            <label htmlFor="countries" className="form-control-left">
              Countries:
            </label>
            <Controller
              name="countries"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  isMulti
                  options={Object.entries(getCodeList()).map(
                    ([code, name]) => ({
                      value: code,
                      label: `${name} [${code}]`,
                    })
                  )}
                  id="countries"
                />
              )}
            />
          </div>
          <div className="form-controls">
            <label htmlFor="offersCount" className="form-control-left">
              Offers count:
            </label>
            <input
              type="number"
              id="offersCount"
              className="form-control"
              {...register("offersCount", { required: false })}
            />
          </div>
          <div className="form-controls">
            <label htmlFor="url" className="form-control-left">
              URL:
            </label>
            <div className="flex flex-col">
              <input
                type="text"
                id="url"
                className={`form-control ${errors.url ? "border-red-500" : ""}`}
                {...register("url", { required: true, maxLength: 200 })}
              />
              {errors.url && (
                <ErrorInputMessage>
                  URL is required and the max length is 200 symbols
                </ErrorInputMessage>
              )}
            </div>
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

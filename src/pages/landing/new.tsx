import Head from "next/head";
import { getCodeList } from "country-list";
import Select from "react-select";
import { commonLayout } from "../../components/common/Layout";
import { ProtectedPage } from "../../types/auth-required";
import Link from "next/link";
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import ErrorInputMessage from "../../components/form/ErrorInputMessage";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";

type Inputs = {
  name: string;
  countries?: { label: string; value: string }[];
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
  const createLandingPage = trpc.useMutation("landingPages.create");
  const router = useRouter();

  const handleSubmit: SubmitHandler<Inputs> = (data) => {
    const landingPage = {
      ...data,
      countries: data.countries?.map((country) => country.value.toUpperCase()),
      offersCount: data.offersCount ? +data.offersCount : null,
    };
    createLandingPage
      .mutateAsync(landingPage)
      .then(() => router.push("/landing"))
      .catch((err) => console.log(err));
  };

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
                  Landing page name is required and the max length is 80 symbols
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
                      label: `${name} [${code.toUpperCase()}]`,
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

NewLandingPage.getLayout = commonLayout;

export default NewLandingPage;

import { FC } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import Link from "next/link";
import ErrorInputMessage from "./ErrorInputMessage";
import { useCountries } from "../../hooks/useCountries";

export type FormInputs = {
  name: string;
  countries?: { label: string; value: string }[];
  url: string;
};

export type LandingPageType = {
  id: string;
  name: string;
  countries: string[];
  url: string;
};

interface ILandingFormProps {
  landingPage?: LandingPageType;
  onSubmit: SubmitHandler<FormInputs>;
}

const LandingForm: FC<ILandingFormProps> = ({ landingPage, onSubmit }) => {
  const {
    control,
    register,
    handleSubmit: onSubmitForm,
    formState: { errors },
  } = useForm<FormInputs>();
  const { countriesOptions, findCountry } = useCountries();

  return (
    <form className="form" onSubmit={onSubmitForm(onSubmit)}>
      <div className="form-controls">
        <label htmlFor="name" className="form-control-left">
          Name:
        </label>
        <div className="flex flex-col">
          <input
            type="text"
            id="name"
            className={`form-control ${errors.name ? "border-red-500" : ""}`}
            defaultValue={landingPage?.name}
            {...register("name", { required: true, maxLength: 80 })}
          />
          {errors.name && (
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
          defaultValue={landingPage?.countries.map(findCountry)}
          name="countries"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              isMulti
              options={countriesOptions}
              id="countries"
            />
          )}
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
            defaultValue={landingPage?.url}
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
        <Link href="/landings">
          <a className="form-control-left button">Cancel</a>
        </Link>
        <button type="submit" className="button button-primary">
          Save
        </button>
      </div>
    </form>
  );
};

export default LandingForm;

import Link from "next/link";
import { FC } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { useCountries } from "../../hooks/useCountries";
import ErrorInputMessage from "./ErrorInputMessage";

export type FormInputs = {
  name: string;
  countries?: { label: string; value: string }[];
  pathId: string;
};

export type CampaignType = {
  id: string;
  name: string;
  countries: string[];
  pathId: string;
};

interface ICampaignFormProps {
  campaign?: CampaignType;
  onSubmit: SubmitHandler<FormInputs>;
}

const CampaignForm: FC<ICampaignFormProps> = ({ campaign, onSubmit }) => {
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
            defaultValue={campaign?.name}
            {...register("name", { required: true, maxLength: 80 })}
          />
          {errors.name && (
            <ErrorInputMessage>
              Campaign name is required and the max length is 80 symbols
            </ErrorInputMessage>
          )}
        </div>
      </div>

      <div className="form-controls">
        <label htmlFor="countries" className="form-control-left">
          Countries:
        </label>
        <Controller
          defaultValue={campaign?.countries.map(findCountry)}
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
        <Link href="/campaigns">
          <a className="form-control-left button">Cancel</a>
        </Link>
        <button type="submit" className="button button-primary">
          Save
        </button>
      </div>
    </form>
  );
};

export default CampaignForm;

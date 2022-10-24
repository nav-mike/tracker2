import { LandingPage, OfferPage } from "@prisma/client";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { useCountries } from "../../hooks/useCountries";
import { trpc } from "../../utils/trpc";
import ErrorInputMessage from "./ErrorInputMessage";

export type FormInputs = {
  name: string;
  countries?: { label: string; value: string }[];
  paths: { landingPageId: string; offerPageId: string }[];
};

export type CampaignType = {
  id: string;
  name: string;
  countries: string[];
  paths: { landingPageId: string; offerPageId: string }[];
};

interface ICampaignFormProps {
  campaign?: CampaignType;
  onSubmit: SubmitHandler<FormInputs>;
}

const CampaignForm: FC<ICampaignFormProps> = ({ campaign, onSubmit }) => {
  const [landingPagesData, setLandingPagesData] = useState<LandingPage[]>([]);
  const [offerPagesData, setOfferPagesData] = useState<OfferPage[]>([]);
  const landingPages = trpc.useQuery(["landingPages.index"]);
  const offerPages = trpc.useQuery(["offerPages.index"]);
  const {
    control,
    register,
    handleSubmit: onSubmitForm,
    formState: { errors },
  } = useForm<FormInputs>();
  const { countriesOptions, findCountry } = useCountries();

  useEffect(() => {
    if (landingPages.data) setLandingPagesData(landingPages.data);
  }, [landingPages.data]);

  useEffect(() => {
    if (offerPages.data) setOfferPagesData(offerPages.data);
  }, [offerPages.data]);

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
        <label htmlFor="paths" className="form-control-left">
          Paths:
        </label>
        <div className="" id="paths">

        </div>
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

import { LandingPage, OfferPage } from "@prisma/client";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Select from "react-select";
import { BsPlusSquare } from "react-icons/bs";
import { useCountries } from "../../hooks/useCountries";
import { trpc } from "../../utils/trpc";
import ErrorInputMessage from "./ErrorInputMessage";

type Path = { id?: string; landingPageId: string; offerPageId: string };

export type FormInputs = {
  name: string;
  countries?: { label: string; value: string }[];
  paths: Path[];
};

export type CampaignType = {
  id: string;
  name: string;
  countries: string[];
  paths: Path[];
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
  const [paths, setPaths] = useState<Path[]>(campaign?.paths ?? []);
  useEffect(() => {
    if (landingPages.data) setLandingPagesData(landingPages.data);
  }, [landingPages.data]);

  useEffect(() => {
    if (offerPages.data) setOfferPagesData(offerPages.data);
  }, [offerPages.data]);

  const handleAddPath = () => {
    setPaths((prev) => [...prev, { landingPageId: "", offerPageId: "" }]);
  };

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
        <div className="flex flex-col gap-4" id="paths">
          <button
            className="text-gray-300 active:text-gray-500"
            title="Add path to campaign"
            type="button"
            onClick={handleAddPath}
          >
            <BsPlusSquare size="2em" />
          </button>
          {paths.map((path, index) => (
            <div key={path.id || index} className="flex flex-row gap-2">
              <select
                defaultValue={path.landingPageId}
                name="paths.landingPageId"
              >
                {landingPagesData.map((landingPage) => (
                  <option key={landingPage.id} value={landingPage.id}>
                    {landingPage.name}
                  </option>
                ))}
              </select>

              <select defaultValue={path.offerPageId} name="paths.offerPageId">
                {offerPagesData.map((offerPage) => (
                  <option key={offerPage.id} value={offerPage.id}>
                    {offerPage.name}
                  </option>
                ))}
              </select>
            </div>
          ))}
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

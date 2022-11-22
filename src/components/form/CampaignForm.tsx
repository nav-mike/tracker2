import { LandingPage, OfferPage } from "@prisma/client";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import {
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import Select from "react-select";
import { BsPlusSquare } from "react-icons/bs";
import { BiMinusCircle } from "react-icons/bi";
import { useCountries } from "../../hooks/useCountries";
import { trpc } from "../../utils/trpc";
import ErrorInputMessage from "./ErrorInputMessage";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const campaignSchema = z.object({
  name: z.string().min(1).max(80),
  countries: z.array(z.object({ label: z.string(), value: z.string() })),
  cost: z.number().min(0).optional().default(0),
  revenue: z.number().min(0).optional().default(0),
  paths: z.array(
    z.object({
      id: z.string().optional(),
      landingPageId: z.string(),
      offerPageId: z.string(),
    })
  ),
});

type Path = { id?: string; landingPageId: string; offerPageId: string };

export type FormInputs = {
  name: string;
  countries?: { label: string; value: string }[];
  cost?: number;
  revenue?: number;
  paths: Path[];
};

export type CampaignType = {
  id: string;
  name: string;
  countries: string[];
  cost: number;
  revenue: number;
  paths: Path[];
};

interface ICampaignFormProps {
  campaign?: CampaignType;
  onSubmit: SubmitHandler<FormInputs>;
}

const CampaignForm: FC<ICampaignFormProps> = ({ campaign, onSubmit }) => {
  const [landingPagesData, setLandingPagesData] = useState<LandingPage[]>([]);
  const [offerPagesData, setOfferPagesData] = useState<OfferPage[]>([]);
  const landingPages = trpc.useQuery(["landingPages.select-data"]);
  const offerPages = trpc.useQuery(["offerPages.select-data"]);
  const { countriesOptions, findCountry } = useCountries();
  const {
    control,
    register,
    handleSubmit: onSubmitForm,
    formState: { errors },
  } = useForm<FormInputs>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: campaign?.name,
      countries: campaign?.countries.map(findCountry),
      cost: campaign?.cost,
      revenue: campaign?.revenue,
      paths: campaign?.paths.map((path) => ({
        id: path.id,
        landingPageId: path.landingPageId,
        offerPageId: path.offerPageId,
      })),
    },
  });
  const { fields, append, remove } = useFieldArray({ name: "paths", control });

  useEffect(() => {
    if (landingPages.data) setLandingPagesData(landingPages.data);
  }, [landingPages.data]);

  useEffect(() => {
    if (offerPages.data) setOfferPagesData(offerPages.data);
  }, [offerPages.data]);

  const handleAddPath = () => {
    append({
      id: "",
      landingPageId: landingPagesData[0]?.id ?? "",
      offerPageId: offerPagesData[0]?.id ?? "",
    });
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
        <label htmlFor="cost" className="form-control-left">
          Cost:
        </label>
        <div className="flex flex-col">
          <input
            type="number"
            id="cost"
            className={`form-control ${errors.cost ? "border-red-500" : ""}`}
            defaultValue={campaign?.cost ?? 0}
            {...register("cost", { min: 0, valueAsNumber: true })}
          />
          {errors.cost && (
            <ErrorInputMessage>
              Cost should be more or equal to 0
            </ErrorInputMessage>
          )}
        </div>
      </div>

      <div className="form-controls">
        <label htmlFor="revenue" className="form-control-left">
          Revenue:
        </label>
        <div className="flex flex-col">
          <input
            type="number"
            id="revenue"
            className={`form-control ${errors.revenue ? "border-red-500" : ""}`}
            defaultValue={campaign?.revenue ?? 0}
            {...register("revenue", { min: 0, valueAsNumber: true })}
          />
          {errors.revenue && (
            <ErrorInputMessage>
              Revenue should be more or equal to 0
            </ErrorInputMessage>
          )}
        </div>
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

          {fields.map((item, index) => (
            <div key={item.id} className="flex flex-row gap-2">
              <Controller
                render={({ field }) => (
                  <select {...field}>
                    {landingPagesData.map((landingPage) => (
                      <option key={landingPage.id} value={landingPage.id}>
                        {landingPage.name}
                      </option>
                    ))}
                  </select>
                )}
                defaultValue={item.landingPageId}
                name={`paths.${index}.landingPageId`}
                control={control}
              />

              <Controller
                render={({ field }) => (
                  <select {...field}>
                    {offerPagesData.map((offerPage) => (
                      <option key={offerPage.id} value={offerPage.id}>
                        {offerPage.name}
                      </option>
                    ))}
                  </select>
                )}
                defaultValue={item.offerPageId}
                name={`paths.${index}.offerPageId`}
                control={control}
              />

              <button
                type="button"
                className="text-gray-300 hover:text-gray-500"
                onClick={() => remove(index)}
              >
                <BiMinusCircle />
              </button>
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

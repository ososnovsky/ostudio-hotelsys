import styled from "styled-components";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { differenceInDays } from "date-fns";

import { useCabins } from '../cabins/useCabins';
import { useCreateBooking } from "./useCreateBooking";
import { useSettings } from "../settings/useSettings";

import Input from "../../ui/Input";
import Form from "../../ui/Form";
import FormRow from "../../ui/FormRow";
import Button from "../../ui/Button";
import Textarea from "../../ui/Textarea";
import Spinner from "../../ui/Spinner";
import Checkbox from "../../ui/Checkbox";

const StyledSelect = styled.select`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-sm);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
`;

function CreateBookingForm({ onCloseModal }) {

  const queryClient = useQueryClient();
  const { createBooking, isCreating } = useCreateBooking();
  const [addBreakfast, setAddBreakfast] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const { settings, isLoading: isLoadingSettings } = useSettings();

  const { register, handleSubmit, reset, getValues, formState } = useForm();
  const { errors } = formState;

  const { cabins, isLoading: isLoadingCabins } = useCabins();

  const guestsList = queryClient.getQueryData(["allGuests"])

  if (isCreating || isLoadingCabins || isLoadingSettings) return <Spinner />;

  function onSubmit(data) {
    const numNights = differenceInDays(
      new Date(data.endDate),
      new Date(data.startDate)
    );

    //cabinPrice
    const reservedCabin = cabins
      .filter((cabin) => cabin.id === Number(data.cabinId))
      .at(0);
    const cabinPrice =
      (reservedCabin.regularPrice - reservedCabin.discount) * numNights;

    const cabinCapacity = reservedCabin.maxCapacity;

    //Validations
    if (numNights < 1) {
      toast.error('Start date must be before end date');
      return;
    }
    if (numNights < settings.minBookingLength) {
      toast.error(
        `Minimum nights per booking are ${settings.minBookingLength}`
      );
      return
    }
    if (numNights > settings.maxBookingLength) {
      toast.error(
        `Maximum nights per booking are ${settings.maxBookingLength}`
      );
      return
    }
    if (data.numGuests > cabinCapacity) {
      toast.error(
        `Maximum guests are ${cabinCapacity}`
      );
      return
    }

    //extrasPrice
    const extrasPrice = addBreakfast
      ? settings.breakfastPrice * numNights * data.numGuests
      : 0;

    //totalPrice
    const totalPrice = cabinPrice + extrasPrice;

    const finalData = {
      ...data,
      cabinPrice,
      extrasPrice,
      totalPrice,
      isPaid,
      numNights,
      cabinId: Number(data.cabinId),
      numGuests: Number(data.numGuests),
      guestId: Number(data.guestId),
      hasBreakfast: addBreakfast,
      status: 'unconfirmed',
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
    };
    createBooking(finalData, {
      onSuccess: (data) => {
        reset();
        onCloseModal?.()
      }
    },);
    // console.log(data)
  }

  function onError(errors) {
    console.log(errors)
  }

  return (

    <Form onSubmit={handleSubmit(onSubmit, onError)} type={onCloseModal ? 'modal' : 'regular'}>
      <FormRow label="Select guest" error={errors?.guestId?.message}>
        <StyledSelect
          disabled={isCreating}
          id="guestId"
          {...register('guestId', { required: 'This field is required' })}
        >
          {guestsList.map((guest) => (
            <option key={guest.id} value={guest.id}>
              {guest.fullName}
            </option>
          ))}
        </StyledSelect>
      </FormRow>

      <FormRow label=" ">
        <span>If guest is not registered, add new guest first in the <strong><a href="/guests"><u>Guests Tab</u></a></strong></span>
      </FormRow>

      <FormRow label="Select cabin" error={errors?.cabinId?.message}>
        <StyledSelect
          disabled={isCreating}
          id="cabinId"
          {...register('cabinId', { required: 'This field is required' })}
        >
          {cabins.map((cabin) => (
            <option key={cabin.id} value={cabin.id}>
              {`${cabin.name}, max ${cabin.maxCapacity} guests`}
            </option>
          ))}
        </StyledSelect>
      </FormRow>

      <FormRow label='Number of guests' error={errors?.numGuests?.message}>
        <Input
          type="number"
          id="numGuests"
          disabled={isCreating}
          defaultValue={1}
          {...register('numGuests', {
            required: 'This field is required',
            min: {
              value: 1,
              message: 'Minimum number of guests must be 1',
            },
            max: {
              value: settings.maxGuestsPerBooking,
              message: `Max number of guests must be ${settings.maxGuestsPerBooking}`,
            },
          })}
        />
      </FormRow>

      <FormRow
        label='Start date'
        error={errors?.startDate?.message}
      >
        <Input
          type="date"
          id="startDate"
          min={new Date().toISOString().split('T')[0]}
          disabled={isCreating}
          {...register('startDate', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow
        label='End date'
        error={errors?.endDate?.message}
      >
        <Input
          type="date"
          id="endDate"
          min={new Date().toISOString().split('T')[0]}
          disabled={isCreating}
          {...register('endDate', { required: 'This field is required' })}
        />
      </FormRow>

      <FormRow
        label="Breakfast"
        error={errors?.hasBreakfast?.message}
      >
        <Checkbox
          checked={addBreakfast}
          id="hasBreakfast"
          onChange={() => setAddBreakfast(addBreakfast => !addBreakfast)}
          disabled={isCreating}
        >
          Include breakfast
        </Checkbox>
      </FormRow >

      <FormRow
        label="Payment"
        error={errors?.isPaid?.message}
      >
        <Checkbox
          checked={isPaid}
          id="isPaid"
          onChange={() => setIsPaid(paid => !paid)}
          disabled={isCreating}
        >
          Confirm payment
        </Checkbox>
      </FormRow>

      <FormRow
        label="Observations"
        error={errors?.observations?.message}
      >
        <Textarea
          type="text"
          id="observations"
          disabled={isCreating}
          {...register("observations")}
        />
      </FormRow>

      <FormRow>
        <Button variation="secondary" type="reset" onClick={() => onCloseModal?.()}>
          Cancel
        </Button>
        <Button disabled={isCreating}>Create new booking</Button>
      </FormRow>

    </Form >
  )
}

export default CreateBookingForm;
